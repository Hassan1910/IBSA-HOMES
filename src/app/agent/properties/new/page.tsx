import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import PropertyForm from '@/components/admin/property-form';
import { prisma } from '@/lib/prisma';

export default async function NewAgentPropertyPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'AGENT' && session.user.role !== 'ADMIN')) {
        redirect('/');
    }

    // We don't need to fetch agents list for the dropdown because isAgent=true will hide it.
    // passing empty array for agents prop.
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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Create a new property listing.
                </p>
            </div>

            <PropertyForm
                agents={agents}
                landlords={landlords}
                isAgent={true}
                currentUserId={session.user.id}
                redirectPath="/agent/properties"
            />
        </div>
    );
}
