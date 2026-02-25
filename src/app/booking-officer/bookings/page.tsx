import { getBookings } from '@/actions/bookings'
import BookingList from '@/components/admin/booking-list'
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

export default async function BookingOfficerBookingsPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'BOOKING_OFFICER' && session.user.role !== 'ADMIN')) {
        redirect('/login');
    }

    const { bookings, error } = await getBookings({ status: 'ALL' })

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-5">Bookings Management</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Bookings Management</h1>
            <BookingList initialBookings={bookings || []} />
        </div>
    )
}
