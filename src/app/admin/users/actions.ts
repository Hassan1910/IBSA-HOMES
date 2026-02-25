'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { success: false, error: 'Failed to delete user' };
    }
}

export async function createUser(data: { name: string; email: string; password?: string; role: 'ADMIN' | 'AGENT' | 'TENANT' | 'LANDLORD' }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' };
        }

        if (!data.email || !data.role) {
            return { success: false, error: 'Missing required fields' };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return { success: false, error: 'Email already exists' };
        }

        const pwd = data.password || 'password123';
        const hashedPassword = await bcrypt.hash(pwd, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                organizationId: session.user.organizationId,
            }
        });

        if (data.role === 'TENANT') {
            await prisma.tenantProfile.create({
                data: {
                    userId: user.id,
                    organizationId: session.user.organizationId,
                }
            });
        }

        revalidatePath('/admin/users');
        return { success: true, userId: user.id };
    } catch (error) {
        console.error('Failed to create user:', error);
        return { success: false, error: 'Failed to create user' };
    }
}

export async function updateUser(userId: string, data: { name: string; email: string; role: 'ADMIN' | 'AGENT' | 'TENANT' | 'LANDLORD', propertyId?: string, agentId?: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' };
        }

        if (!data.email || !data.role) {
            return { success: false, error: 'Missing required fields' };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser && existingUser.id !== userId) {
            return { success: false, error: 'Email already exists' };
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
            }
        });

        if (data.role === 'TENANT') {
            const existingProfile = await prisma.tenantProfile.findUnique({
                where: { userId: user.id }
            });

            const propertyIdData = data.propertyId === 'none' ? null : data.propertyId;
            const agentIdData = data.agentId === 'none' ? null : data.agentId;

            if (!existingProfile) {
                await prisma.tenantProfile.create({
                    data: {
                        userId: user.id,
                        organizationId: session.user.organizationId,
                        ...(propertyIdData !== undefined ? { propertyId: propertyIdData } : {}),
                        ...(agentIdData !== undefined ? { agentId: agentIdData } : {})
                    }
                });
            } else if (data.propertyId !== undefined || data.agentId !== undefined) {
                const updateData: any = {};
                if (data.propertyId !== undefined) {
                    updateData.property = propertyIdData ? { connect: { id: propertyIdData } } : { disconnect: true };
                }
                if (data.agentId !== undefined) {
                    updateData.agent = agentIdData ? { connect: { id: agentIdData } } : { disconnect: true };
                }

                await prisma.tenantProfile.update({
                    where: { userId: user.id },
                    data: updateData
                });
            }
        }

        revalidatePath('/admin/users');
        return { success: true, userId: user.id };
    } catch (error) {
        console.error('Failed to update user:', error);
        return { success: false, error: 'Failed to update user' };
    }
}

