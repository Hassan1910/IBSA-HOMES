import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Calendar, DollarSign, Wrench, CreditCard, Settings } from "lucide-react";

import { Button } from '@/components/ui/button';
import { getDashboardMetrics, getRevenueChartData } from '@/app/actions/analytics';
import { RevenueChart } from '@/components/dashboard/RevenueChart';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const [userCount, propertyCount, bookingCount, paymentCount, organization, metrics, chartData] = await Promise.all([
        prisma.user.count({ where: { organizationId: session.user.organizationId } }),
        prisma.property.count({ where: { organizationId: session.user.organizationId } }),
        prisma.booking.count({ where: { organizationId: session.user.organizationId } }),
        prisma.payment.count({ where: { organizationId: session.user.organizationId } }),
        prisma.organization.findUnique({ where: { id: session.user.organizationId }, select: { subscriptionStatus: true } }),
        getDashboardMetrics(),
        getRevenueChartData()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>



            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">
                            <Link href="/admin/users" className="hover:underline">Manage users</Link>
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Payments
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{paymentCount}</div>
                        <p className="text-xs text-muted-foreground">
                            <Link href="/admin/payments" className="hover:underline">View recent payments</Link>
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            System Settings
                        </CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2 text-2xl font-bold">
                            <Button variant="outline" size="sm" asChild className="w-full">
                                <Link href="/admin/settings">Configure Settings</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Monthly Recurring Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KES {metrics.mrr.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Based on active leases
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Maintenance
                        </CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KES {metrics.totalMaintenanceExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Resolved maintenance costs
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Properties
                        </CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{propertyCount}</div>
                        <p className="text-xs text-muted-foreground">
                            <Link href="/admin/properties" className="hover:underline">View all properties</Link>
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bookings
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookingCount}</div>
                        <p className="text-xs text-muted-foreground">
                            <Link href="/admin/bookings" className="hover:underline">View all bookings</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview (Last 12 Months)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RevenueChart data={chartData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
