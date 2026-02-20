'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function createTenant(data: {
    name: string
    email: string
    password?: string // Optional, default generated if not provided
    phone?: string
    propertyId?: string
    leaseStartDate?: Date
    leaseEndDate?: Date
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            return { success: false, error: 'User with this email already exists' }
        }

        const hashedPassword = await bcrypt.hash(data.password || 'password123', 10)

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: 'TENANT',
                organizationId: session.user.organizationId,
                tenantProfile: {
                    create: {
                        phone: data.phone,
                        propertyId: data.propertyId || null,
                        leaseStartDate: data.leaseStartDate,
                        leaseEndDate: data.leaseEndDate,
                        organizationId: session.user.organizationId,
                    }
                }
            }
        })

        revalidatePath('/admin/tenants')
        return { success: true, tenant: user }
    } catch (error) {
        console.error('Failed to create tenant:', error)
        return { success: false, error: 'Failed to create tenant' }
    }
}

export async function updateTenant(id: string, data: {
    name?: string
    email?: string
    phone?: string
    propertyId?: string | null
    leaseStartDate?: Date | null
    leaseEndDate?: Date | null
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' }

        // Update User info
        await prisma.user.update({
            where: {
                id,
                organizationId: session.user.organizationId
            },
            data: {
                name: data.name,
                email: data.email,
            }
        })

        // Update TenantProfile info
        // We use upsert to ensure profile exists even if it was missing 
        await prisma.tenantProfile.upsert({
            where: { userId: id },
            create: {
                userId: id,
                phone: data.phone,
                propertyId: data.propertyId,
                leaseStartDate: data.leaseStartDate,
                leaseEndDate: data.leaseEndDate,
                organizationId: session.user.organizationId,
            },
            update: {
                phone: data.phone,
                propertyId: data.propertyId,
                leaseStartDate: data.leaseStartDate,
                leaseEndDate: data.leaseEndDate,
            }
        })

        revalidatePath('/admin/tenants')
        revalidatePath(`/admin/tenants/${id}/edit`)
        return { success: true }
    } catch (error) {
        console.error('Failed to update tenant:', error)
        return { success: false, error: 'Failed to update tenant' }
    }
}

export async function deleteTenant(id: string) {
    try {
        // Due to cascade in schema (if set) or manual cleanup
        // In this schema, relations might restrict deletion if not handled.
        // Prisma usually handles cascade if defined in schema or we delete related records first.
        // The schema doesn't explicitly show OnDelete Cascade for TenantProfile->User, but usually User deletion cascades to profile if configured.
        // Let's assume standard behavior or explicit cleanup.

        // However, Prisma requires explicit deletion of related records if no Cascade is set in DB.
        // Let's check schema again mentally... User -> TenantProfile (relation).

        // Deleting the user should be enough if the relation is set up right, but let's be safe and delete profile first if it exists

        const tenantProfile = await prisma.tenantProfile.findUnique({ where: { userId: id } })
        if (tenantProfile) {
            await prisma.tenantProfile.delete({ where: { userId: id } })
        }

        await prisma.user.delete({
            where: { id }
        })

        revalidatePath('/admin/tenants')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete tenant:', error)
        return { success: false, error: 'Failed to delete tenant' }
    }
}

export async function getTenants() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const tenants = await prisma.user.findMany({
            where: {
                role: 'TENANT',
                organizationId: session.user.organizationId,
            },
            include: {
                tenantProfile: {
                    include: {
                        property: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { success: true, tenants }
    } catch (error) {
        console.error('Failed to get tenants:', error)
        return { success: false, error: 'Failed to get tenants' }
    }
}

export async function getTenant(id: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const tenant = await prisma.user.findFirst({
            where: {
                id,
                organizationId: session.user.organizationId
            },
            include: {
                tenantProfile: true
            }
        })

        if (!tenant) return { success: false, error: 'Tenant not found' }

        return { success: true, tenant }
    } catch (error) {
        console.error('Failed to get tenant:', error)
        return { success: false, error: 'Failed to get tenant' }
    }
}
