import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import AgentMaintenanceList from "@/components/agent/maintenance-list";
import { Wrench } from "lucide-react";
import { AgentMaintenanceReadTrigger } from "@/components/agent/maintenance-read-trigger";

export default async function AgentMaintenancePage() {
    const session = await getServerSession(authOptions);
    const agentId = session?.user?.id;

    if (!agentId) return null;

    // Fetch maintenance requests for all properties managed by this agent
    const properties = await prisma.property.findMany({
        where: { agentId: agentId },
        select: { id: true }
    });

    const propertyIds = properties.map(p => p.id);

    const requests = await prisma.maintenanceRequest.findMany({
        where: {
            propertyId: { in: propertyIds }
        },
        include: {
            property: true,
            reporter: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // We mount a Client Component to handle marking as read since revalidation is forbidden during server render
    const unreadPropertyIds = Array.from(
        new Set(
            requests
                .filter(r => !r.isReadByAgent)
                .map(r => r.propertyId)
        )
    );

    // Serialize Decimal objects to string to pass to Client Component safely
    const serializedRequests = requests.map(r => ({
        ...r,
        cost: r.cost ? r.cost.toString() : null,
        property: {
            ...r.property,
            price: r.property.price.toString()
        }
    }));

    // Separate active and resolved for display if needed, or pass all to list
    const activeRequests = serializedRequests.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS');
    const resolvedRequests = serializedRequests.filter(r => r.status === 'RESOLVED');

    return (
        <div className="space-y-6">
            <AgentMaintenanceReadTrigger propertyIds={unreadPropertyIds} />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Wrench className="h-8 w-8 text-blue-600" />
                        Maintenance Requests
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage and track maintenance tasks for your assigned properties.
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Active Requests ({activeRequests.length})</h2>
                    <AgentMaintenanceList initialRequests={activeRequests} />
                </div>

                {resolvedRequests.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">Resolved Requests</h2>
                        <AgentMaintenanceList initialRequests={resolvedRequests} />
                    </div>
                )}
            </div>
        </div>
    );
}
