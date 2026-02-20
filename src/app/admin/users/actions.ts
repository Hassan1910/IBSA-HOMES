'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
