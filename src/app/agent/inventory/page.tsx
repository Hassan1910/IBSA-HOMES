import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getInventoryItems } from '@/app/actions/inventory';
import AgentInventoryClient from './AgentInventoryClient';

export default async function AgentInventoryPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'AGENT') {
        redirect('/login');
    }

    const items = await getInventoryItems();

    return (
        <AgentInventoryClient initialItems={items} />
    );
}
