import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from 'next/navigation';
import PropertyForm from '@/components/admin/property-form';
import { prisma } from '@/lib/prisma';

interface EditAgentPropertyPageProps {
    params: {
        id: string;
    };
}

export default async function EditAgentPropertyPage({ params }: EditAgentPropertyPageProps) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'AGENT' && session.user.role !== 'ADMIN')) {
        redirect('/');
    }

    // Fix: Await params in newer Next.js versions if needed, or stick to current standard
    // Just in case, await it if it's a promise (Next.js 15+ compat), but standard 14 is fine.
    const { id } = await params;

    const property = await prisma.property.findFirst({
        where: {
            id,
            organizationId: session.user.organizationId
        },
    });

    if (!property) {
        notFound();
    }

    // Authorization check: Ensure agent owns this property (unless admin)
    if (session.user.role === 'AGENT' && property.agentId !== session.user.id) {
        redirect('/agent/properties');
    }

    // Passing empty array for agents as it's hidden for agents
    const agents: any[] = [];

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

    // Transform Decimal to number for form
    const formattedProperty = {
        ...property,
        price: Number(property.price),
        area: property.area ? Number(property.area) : undefined,
        description: property.description ?? undefined,
        agentId: property.agentId ?? undefined,
        ownerId: property.ownerId ?? undefined,
        status: property.status as "AVAILABLE" | "RENTED" | "MAINTENANCE",
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Update property details.
                </p>
            </div>

            <PropertyForm
                agents={agents}
                landlords={landlords}
                initialData={formattedProperty}
                isAgent={true}
                currentUserId={session.user.id}
                redirectPath="/agent/properties"
            />
        </div>
    );
}
