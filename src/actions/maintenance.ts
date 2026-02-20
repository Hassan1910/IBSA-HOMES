'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function createMaintenanceRequest(data: {
    description: string
    propertyId: string
    reporterId: string
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const request = await prisma.maintenanceRequest.create({
            data: {
                description: data.description,
                propertyId: data.propertyId,
                reporterId: data.reporterId,
                status: 'OPEN',
                organizationId: session.user.organizationId,
            },
        })
        revalidatePath('/tenant/maintenance')
        revalidatePath('/admin/maintenance')
        return { success: true, request }
    } catch (error) {
        console.error('Failed to create maintenance request:', error)
        return { success: false, error: 'Failed to submit maintenance request' }
    }
}

export async function getMaintenanceRequests(filters?: { status?: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const where: any = { organizationId: session.user.organizationId }
        if (filters?.status && filters.status !== 'ALL') where.status = filters.status

        const requests = await prisma.maintenanceRequest.findMany({
            where,
            include: {
                property: true,
                reporter: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return { success: true, requests }
    } catch (error) {
        console.error('Failed to get maintenance requests:', error)
        return { success: false, error: 'Failed to get maintenance requests' }
    }
}

export async function updateMaintenanceStatus(id: string, status: string) {
    try {
        const request = await prisma.maintenanceRequest.update({
            where: { id },
            data: { status },
        })
        revalidatePath('/tenant/maintenance')
        revalidatePath('/admin/maintenance')
        return { success: true, request }
    } catch (error) {
        console.error('Failed to update maintenance request:', error)
        return { success: false, error: 'Failed to update maintenance request' }
    }
}
