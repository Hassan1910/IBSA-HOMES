'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSupportTickets() {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error('Unauthorized');
    }

    // Admins and Agents see all tickets for the org
    if (session.user.role === 'ADMIN' || session.user.role === 'AGENT') {
        return await prisma.supportTicket.findMany({
            where: { organizationId: session.user.organizationId },
            include: { reporter: { select: { name: true, email: true, role: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Regular users see their own tickets
    return await prisma.supportTicket.findMany({
        where: {
            organizationId: session.user.organizationId,
            reporterId: session.user.id
        },
        include: { reporter: { select: { name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createSupportTicket(data: {
    subject: string;
    category: string;
    description: string;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error('Unauthorized');
    }

    const ticket = await prisma.supportTicket.create({
        data: {
            ...data,
            organizationId: session.user.organizationId,
            reporterId: session.user.id
        },
    });

    revalidatePath('/admin/support');
    revalidatePath(`/${session.user.role.toLowerCase()}/support`);
    return ticket;
}

export async function updateSupportTicketStatus(id: string, status: string) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT')) {
        throw new Error('Unauthorized');
    }

    const ticket = await prisma.supportTicket.update({
        where: {
            id,
            organizationId: session.user.organizationId
        },
        data: { status },
    });

    revalidatePath('/admin/support');
    revalidatePath('/agent/support');
    return ticket;
}

export async function getAgentUnreadSupportCount() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId || session.user.role !== 'AGENT') {
            return { success: false, error: 'Unauthorized', count: 0 };
        }

        const count = await prisma.supportTicket.count({
            where: {
                organizationId: session.user.organizationId,
                isReadByAgent: false
            }
        });

        return { success: true, count };
    } catch (error) {
        console.error('Failed to get unread support count:', error);
        return { success: false, error: 'Failed to get unread support count', count: 0 };
    }
}

export async function markAgentSupportAsRead() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId || session.user.role !== 'AGENT') {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.supportTicket.updateMany({
            where: {
                organizationId: session.user.organizationId,
                isReadByAgent: false
            },
            data: { isReadByAgent: true }
        });

        revalidatePath('/agent/support');
        revalidatePath('/agent', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to mark support as read:', error);
        return { success: false, error: 'Failed to mark support as read' };
    }
}
