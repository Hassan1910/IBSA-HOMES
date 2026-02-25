'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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
        revalidatePath('/agent', 'layout')
        revalidatePath('/agent/maintenance')
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
        revalidatePath('/agent', 'layout')
        revalidatePath('/agent/maintenance')
        return { success: true, request }
    } catch (error) {
        console.error('Failed to update maintenance request:', error)
        return { success: false, error: 'Failed to update maintenance request' }
    }
}

export async function getAgentUnreadMaintenanceCount() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { success: false, error: 'Unauthorized', count: 0 };

        const agentId = session.user.id;

        const properties = await prisma.property.findMany({
            where: { agentId },
            select: { id: true }
        });
        const propertyIds = properties.map(p => p.id);

        if (propertyIds.length === 0) {
            return { success: true, count: 0 };
        }

        const count = await prisma.maintenanceRequest.count({
            where: {
                isReadByAgent: false,
                propertyId: { in: propertyIds }
            }
        });

        return { success: true, count };
    } catch (error) {
        console.error('Failed to get unread maintenance count:', error);
        return { success: false, error: 'Failed to get unread maintenance count', count: 0 };
    }
}

export async function markAgentMaintenanceAsRead(propertyIds?: string[]) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

        const agentId = session.user.id;

        let idsToUpdate = propertyIds;

        if (!idsToUpdate || idsToUpdate.length === 0) {
            const properties = await prisma.property.findMany({
                where: { agentId },
                select: { id: true }
            });
            idsToUpdate = properties.map(p => p.id);
        }

        if (idsToUpdate.length > 0) {
            await prisma.maintenanceRequest.updateMany({
                where: {
                    isReadByAgent: false,
                    propertyId: { in: idsToUpdate }
                },
                data: { isReadByAgent: true }
            });
        }

        revalidatePath('/agent/maintenance');
        revalidatePath('/agent', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to mark maintenance as read:', error);
        return { success: false, error: 'Failed to mark maintenance as read' };
    }
}

