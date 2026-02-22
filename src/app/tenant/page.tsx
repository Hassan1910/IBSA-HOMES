import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';
import { CreditCard, Home, PenTool, ExternalLink, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default async function TenantDashboard() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-slate-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Authentication Required</h1>
                <p className="text-slate-500 mt-2">Please log in to view your dashboard</p>
                <Button className="mt-6" asChild>
                    <Link href="/login">Go to Login</Link>
                </Button>
            </div>
        );
    }

    // Fetch tenant data
    const tenant = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            tenantProfile: {
                include: {
                    property: true,
                    payments: {
                        take: 5,
                        orderBy: { date: 'desc' }
                    }
                }
            },
            maintenance: {
                take: 5,
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!tenant?.tenantProfile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 max-w-md mx-auto">
                <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                    <Home className="h-8 w-8 text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Welcome, {session.user?.name}</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    You are not currently assigned to any property in our system. If you believe this is an error, please contact your landlord or property manager.
                </p>
            </div>
        );
    }

    const { property, payments } = tenant.tenantProfile;
    const openMaintenance = tenant.maintenance.filter(m => m.status === 'OPEN').length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tenant Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Welcome back, {session.user?.name}. Here's an overview of your rental account.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/tenant/payments">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Make a Payment
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Property</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {property ? (
                            <>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white truncate" title={property.title}>
                                    {property.title}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate" title={property.address}>
                                    {property.address}
                                </p>
                            </>
                        ) : (
                            <div className="text-sm text-slate-500 italic mt-2">No property assigned</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Outstanding Balance</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">KES 0.00</div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center">
                            All caught up!
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Maintenance Requests</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <PenTool className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{tenant.maintenance.length}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                            <span className={openMaintenance > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                                {openMaintenance} Open request{openMaintenance !== 1 ? 's' : ''}
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity / Payments List */}
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle>Recent Payments</CardTitle>
                            <CardDescription>Your latest transaction history.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/tenant/payments">
                                <ExternalLink className="h-4 w-4 text-slate-500" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 px-0 sm:px-6">
                        {payments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                    <CreditCard className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-medium text-slate-900 dark:text-white">No recent payments</h3>
                                <p className="text-xs text-slate-500 mt-1">Your payment history will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">Rent Payment</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(payment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                KES {Number(payment.amount).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Completed</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Shortcut to common tasks.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <Link href="/tenant/maintenance" className="group block">
                            <div className="flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all cursor-pointer">
                                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                    <PenTool className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">Route Maintenance Issue</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Submit a new repair or service request</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/tenant/payments" className="group block">
                            <div className="flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Make a Payment</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Pay your rent or outstanding balances</p>
                                </div>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
