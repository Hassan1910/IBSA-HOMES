'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createBooking(data: {
    propertyId: string
    userId?: string
    visitorName?: string
    visitorContact?: string
    date: Date
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const booking = await prisma.booking.create({
            data: {
                propertyId: data.propertyId,
                userId: data.userId,
                visitorName: data.visitorName,
                visitorContact: data.visitorContact,
                date: data.date,
                status: 'PENDING',
                organizationId: session.user.organizationId,
            },
        })
        revalidatePath('/admin/bookings')
        revalidatePath('/booking-officer/bookings')
        revalidatePath(`/properties/${data.propertyId}`)
        return { success: true, booking }
    } catch (error) {
        console.error('Failed to create booking:', error)
        return { success: false, error: 'Failed to create booking' }
    }
}

export async function getBookings(filters?: {
    propertyId?: string
    status?: string
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const where: any = { organizationId: session.user.organizationId }
        if (filters?.propertyId) where.propertyId = filters.propertyId
        if (filters?.status && filters.status !== 'ALL') where.status = filters.status

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                property: true,
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return { success: true, bookings }
    } catch (error) {
        console.error('Failed to get bookings:', error)
        return { success: false, error: 'Failed to get bookings' }
    }
}

export async function updateBookingStatus(id: string, status: string) {
    try {
        const booking = await prisma.booking.update({
            where: { id },
            data: { status },
        })
        revalidatePath('/admin/bookings')
        revalidatePath('/booking-officer/bookings')
        return { success: true, booking }
    } catch (error) {
        console.error('Failed to update booking status:', error)
        return { success: false, error: 'Failed to update booking status' }
    }
}

export async function deleteBooking(id: string) {
    try {
        await prisma.booking.delete({
            where: { id },
        })
        revalidatePath('/admin/bookings')
        revalidatePath('/booking-officer/bookings')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete booking:', error)
        return { success: false, error: 'Failed to delete booking' }
    }
}
