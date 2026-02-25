import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { getSupportTickets } from '@/app/actions/support';
import UserSupportClient from './UserSupportClient';

export default async function TenantSupportPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TENANT') {
        redirect('/login');
    }

    const tickets = await getSupportTickets();
    const formattedTickets = tickets.map(ticket => ({
        ...ticket,
        reporter: {
            name: session.user.name || null,
            email: session.user.email || '',
            role: session.user.role
        }
    }));

    return <UserSupportClient initialTickets={formattedTickets} />;
}
