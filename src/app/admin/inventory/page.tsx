import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getInventoryItems } from '@/app/actions/inventory';
import InventoryClient from './InventoryClient';

export default async function InventoryPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const items = await getInventoryItems();

    return (
        <InventoryClient initialItems={items} />
    );
}
