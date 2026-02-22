import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getSupportTickets } from '@/app/actions/support';
import AdminSupportClient from './SupportClient';

export default async function AdminSupportPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const tickets = await getSupportTickets();

    return (
        <AdminSupportClient initialTickets={tickets} />
    );
}
