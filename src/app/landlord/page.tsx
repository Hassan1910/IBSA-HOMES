import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Users, DollarSign, ExternalLink, TrendingUp, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

export default async function LandlordDashboard() {
    const session = await getServerSession(authOptions);

    const properties = await prisma.property.findMany({
        where: {
            ownerId: session?.user?.id,
        },
        include: {
            tenants: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const totalProperties = properties.length;
    // Calculate total tenants across all owned properties
    const totalTenants = properties.reduce((acc, prop) => acc + prop.tenants.length, 0);

    // Calculate total rent from rented properties
    const totalRent = properties
        .filter(p => p.status === 'RENTED')
        .reduce((acc, prop) => acc + Number(prop.price), 0);

    const availableProperties = properties.filter(p => p.status === 'AVAILABLE').length;
    const rentedProperties = properties.filter(p => p.status === 'RENTED').length;

    // Generate dummy data for the revenue chart if no actual historical data exists
    // In a real app, this would come from a query to payment history
    const revenueData = [
        { name: 'Jan', revenue: Math.floor(totalRent * 0.8) },
        { name: 'Feb', revenue: Math.floor(totalRent * 0.85) },
        { name: 'Mar', revenue: Math.floor(totalRent * 0.9) },
        { name: 'Apr', revenue: Math.floor(totalRent * 0.95) },
        { name: 'May', revenue: totalRent },
        { name: 'Jun', revenue: totalRent },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Welcome back. Here's what's happening with your properties today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/landlord/properties">
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
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Properties</CardTitle>
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
                            <span className="mx-2 text-slate-300">•</span>
                            <span className="text-blue-600 flex items-center">
                                {rentedProperties} <span className="text-slate-500 ml-1">Rented</span>
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Tenants</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalTenants}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Currently leasing your properties
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Revenue</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">${totalRent.toLocaleString()}</div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Based on currently rented units
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7 xl:grid-cols-3">
                {/* Revenue Chart */}
                <Card className="md:col-span-4 lg:col-span-4 xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Estimated potential revenue across your portfolio.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <RevenueChart data={revenueData} />
                    </CardContent>
                </Card>

                {/* Recent Properties List */}
                <Card className="md:col-span-3 lg:col-span-3 xl:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Recent Properties</CardTitle>
                            <CardDescription>Your latest portfolio additions.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                            <Link href="/landlord/properties">
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
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No properties</h3>
                                <p className="text-sm text-slate-500 mt-1">You don't own any properties yet. Add some to get started.</p>
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
                                                <p className="text-xs text-slate-500 truncate max-w-[120px]">
                                                    {property.address}
                                                </p>
                                                <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                                                    ${Number(property.price).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${property.status === 'AVAILABLE'
                                                    ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30' :
                                                    property.status === 'RENTED'
                                                        ? 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30' :
                                                        'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/30'
                                                }`}>
                                                {property.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 px-4 sm:px-0">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/landlord/properties">View All Properties</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
