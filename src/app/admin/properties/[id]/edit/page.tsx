import { prisma } from '@/lib/prisma';
import PropertyForm from '@/components/admin/property-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect, notFound } from 'next/navigation';

interface EditPropertyPageProps {
    params: {
        id: string;
    };
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const { id } = params;

    const property = await prisma.property.findFirst({
        where: {
            id,
            organizationId: session.user.organizationId
        },
    });

    if (!property) {
        notFound();
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

    // Format property data to match form expectations
    // The form expects optional area, our DB has Float?
    // DB has Decimal for price, form expects number.

    const formattedProperty = {
        ...property,
        price: Number(property.price),
        area: property.area || 0,
        description: property.description || undefined,
        agentId: property.agentId || undefined,
        ownerId: property.ownerId || undefined,
        status: property.status as 'AVAILABLE' | 'RENTED' | 'MAINTENANCE',
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Property</h1>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Update the property details below.
                </p>
            </div>

            <PropertyForm agents={agents} landlords={landlords} initialData={formattedProperty} />
        </div>
    );
}
