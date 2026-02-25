import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { getSupportTickets } from '@/app/actions/support';
import AgentSupportClient from './AgentSupportClient';

export default async function AgentSupportPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'AGENT') {
        redirect('/login');
    }

    const tickets = await getSupportTickets();

    return (
        <AgentSupportClient initialTickets={tickets} />
    );
}
