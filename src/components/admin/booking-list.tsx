'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { updateBookingStatus, deleteBooking } from '@/actions/bookings'

// Define a type for the booking structure based on what getBookings returns
type Booking = {
    id: string
    property: { title: string }
    user: { name: string | null; email: string } | null
    visitorName: string | null
    visitorContact: string | null
    date: Date
    status: string
    createdAt: Date
}

export default function BookingList({ initialBookings }: { initialBookings: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleStatusUpdate = async (id: string, status: string) => {
        setLoadingId(id)
        try {
            await updateBookingStatus(id, status)
        } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking?')) return
        setLoadingId(id)
        try {
            await deleteBooking(id)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>User / Visitor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialBookings.map((booking) => (
                        <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.property.title}</TableCell>
                            <TableCell>
                                {booking.user ? (
                                    <div className="flex flex-col">
                                        <span>{booking.user.name || 'User'}</span>
                                        <span className="text-xs text-muted-foreground">{booking.user.email}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <span>{booking.visitorName || 'Guest'}</span>
                                        <span className="text-xs text-muted-foreground">{booking.visitorContact}</span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                    {booking.status}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {booking.status === 'PENDING' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                                disabled={loadingId === booking.id}
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                                disabled={loadingId === booking.id}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {booking.status !== 'PENDING' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(booking.id)}
                                            disabled={loadingId === booking.id}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {initialBookings.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No bookings found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
