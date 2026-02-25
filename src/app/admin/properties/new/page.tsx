import { prisma } from '@/lib/prisma';
import PropertyForm from '@/components/admin/property-form';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

export default async function NewPropertyPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const agents = await prisma.user.findMany({
        where: {
            role: 'AGENT',
            organizationId: session.user.organizationId,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    const landlords = await prisma.user.findMany({
        where: {
            role: 'LANDLORD',
            organizationId: session.user.organizationId,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Property</h1>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Create a new property listing. Fill in the details below.
                </p>
            </div>

            <PropertyForm agents={agents} landlords={landlords} />
        </div>
    );
}
