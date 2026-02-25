import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building, ExternalLink, Activity } from 'lucide-react';

export default async function LandlordPropertiesPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'LANDLORD' && session.user.role !== 'ADMIN')) {
        redirect('/');
    }

    const properties = await prisma.property.findMany({
        where: {
            ownerId: session.user.id,
            organizationId: session.user.organizationId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        View and monitor your property portfolio.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild>
                        <Link href="/landlord/properties/new">
                            <Building className="w-4 h-4 mr-2" />
                            Add Property
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-0">
                    {properties.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-1">No properties yet</h3>
                            <p className="mb-6">You don't own any properties on the platform yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {properties.map((property) => (
                                <div key={property.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {property.images && property.images.length > 0 ? (
                                                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Building className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{property.title}</h3>
                                            <p className="text-sm text-slate-500 mb-2">{property.address}</p>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    KES {Number(property.price).toLocaleString()}/mo
                                                </span>
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    {property.bedrooms} Bed
                                                </span>
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    {property.bathrooms} Bath
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            property.status === 'RENTED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {property.status}
                                        </span>
                                        <div className="flex gap-2 ml-auto">
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/landlord/properties/${property.id}`}>
                                                    <Activity className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Link>
                                            </Button>
                                            <Button size="sm" variant="ghost" asChild>
                                                <Link href={`/properties/${property.id}`} target="_blank">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
