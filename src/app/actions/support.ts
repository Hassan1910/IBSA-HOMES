'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
