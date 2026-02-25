import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Users, Activity, ExternalLink, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AgentDashboard() {
    const session = await getServerSession(authOptions);

    const properties = await prisma.property.findMany({
        where: {
            agentId: session?.user?.id,
        },
        include: {
            tenants: true,
            maintenance: {
                where: {
                    status: {
                        in: ['OPEN', 'IN_PROGRESS'] // only active requests
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const totalProperties = properties.length;
    // Calculate total tenants across all assigned properties
    const totalTenants = properties.reduce((acc, prop) => acc + prop.tenants.length, 0);

    // Calculate total active maintenance requests
    const activeMaintenance = properties.reduce((acc, prop) => acc + prop.maintenance.length, 0);

    // Basic stats for available vs rented
    const availableProperties = properties.filter(p => p.status === 'AVAILABLE').length;
    const rentedProperties = properties.filter(p => p.status === 'RENTED').length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Welcome back. Here's an overview of your assigned properties and tenants.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/agent/properties">
                            <Home className="mr-2 h-4 w-4" />
                            Manage Properties
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Assigned Properties</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalProperties}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                            <span className="text-green-600 flex items-center mr-1">
                                {availableProperties} <span className="text-slate-500 ml-1">Available</span>
                            </span>
                            <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-blue-600 flex items-center">
                                {rentedProperties} <span className="text-slate-500 ml-1">Rented</span>
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tenants</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalTenants}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Active tenants in your properties
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Maintenance</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{activeMaintenance}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center font-medium">
                            <Link href="/agent/maintenance" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex flex-row items-center">
                                View Requests <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 lg:col-span-1 xl:grid-cols-3">
                {/* Recent Properties List */}
                <Card className="md:col-span-1 lg:col-span-2 xl:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Recent Assigned Properties</CardTitle>
                            <CardDescription>The latest properties assigned to you for management.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                            <Link href="/agent/properties">
                                <ExternalLink className="h-4 w-4 text-slate-500" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        {properties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                    <Building className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No properties assigned yet</h3>
                                <p className="text-sm text-slate-500 mt-1">You haven't been assigned any properties to manage yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {properties.slice(0, 5).map((property) => (
                                    <div key={property.id} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0">
                                            {property.images && property.images.length > 0 ? (
                                                <img
                                                    src={property.images[0]}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <Building className="w-5 h-5 text-slate-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm text-slate-900 dark:text-slate-50 truncate">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5 max-w-full">
                                                <p className="text-xs text-slate-500 truncate max-w-[120px] sm:max-w-none">
                                                    {property.address}
                                                </p>
                                                <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                                                    KES {Number(property.price).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium transition-colors ${property.status === 'AVAILABLE'
                                                ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30' :
                                                property.status === 'RENTED'
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30' :
                                                    'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/30'
                                                }`}>
                                                {property.status}
                                            </span>
                                            <Button size="icon" variant="ghost" asChild className="hidden sm:flex">
                                                <Link href={`/agent/properties/${property.id}/edit`}>
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 px-4 sm:px-0">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/agent/properties">View All Properties</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
