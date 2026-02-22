import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';
import MaintenanceRequestForm from "@/components/maintenance-request-form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function TenantMaintenancePage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return null;

    const tenant = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            tenantProfile: {
                include: {
                    property: true,
                }
            },
            maintenance: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!tenant?.tenantProfile?.property) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold mb-4">Maintenance</h1>
                <p className="text-gray-600">You must be assigned to a property to submit maintenance requests.</p>
            </div>
        );
    }

    const { maintenance } = tenant;
    const { property } = tenant.tenantProfile;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Submit a Request</h2>
                    <MaintenanceRequestForm propertyId={property.id} reporterId={userId} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Request History</h2>
                    <div className="space-y-4">
                        {maintenance.length === 0 ? (
                            <p className="text-gray-500">No maintenance requests found.</p>
                        ) : (
                            maintenance.map((request) => (
                                <Card key={request.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base font-medium">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </CardTitle>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${request.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                request.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-700">{request.description}</p>
                                        {request.cost && (
                                            <p className="mt-2 text-xs text-gray-500">Cost: KES {Number(request.cost).toFixed(2)}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
