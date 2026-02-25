import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditUserForm from './EditUserForm';

export const dynamic = 'force-dynamic';

export default async function EditUserPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const { id } = await Promise.resolve(params);

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        redirect('/admin/users');
    }

    const tenantProfile = await prisma.tenantProfile.findUnique({
        where: { userId: id }
    });

    const properties = await prisma.property.findMany({
        where: { organizationId: session.user.organizationId },
        select: { id: true, title: true }
    });

    const agents = await prisma.user.findMany({
        where: { organizationId: session.user.organizationId, role: 'AGENT' },
        select: { id: true, name: true }
    });

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit User</h1>
            <EditUserForm user={user} properties={properties} tenantProfile={tenantProfile} agents={agents} />
        </div>
    );
}
