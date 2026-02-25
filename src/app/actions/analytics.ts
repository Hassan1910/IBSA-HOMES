'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function getDashboardMetrics() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
        throw new Error('Unauthorized');
    }

    const organizationId = session.user.organizationId;

    const properties = await prisma.property.findMany({
        where: { organizationId },
        select: { status: true, price: true, tenants: true }
    });

    const mrr = properties
        .filter(p => p.status === 'RENTED' || p.tenants.length > 0)
        .reduce((sum, p) => sum + Number(p.price), 0);

    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
        where: {
            organizationId,
            status: 'RESOLVED',
            cost: { not: null }
        },
        select: { cost: true }
    });

    const totalMaintenanceExpenses = maintenanceRequests.reduce(
        (sum, req) => sum + Number(req.cost),
        0
    );

    return {
        mrr,
        totalMaintenanceExpenses,
    };
}

export async function getRevenueChartData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
        throw new Error('Unauthorized');
    }

    const organizationId = session.user.organizationId;

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const payments = await prisma.payment.findMany({
        where: {
            organizationId,
            status: 'COMPLETED',
            date: {
                gte: twelveMonthsAgo
            }
        },
        select: {
            amount: true,
            date: true,
            type: true
        }
    });

    // Initialize the last 12 months with 0 revenue
    const monthlyData: Record<string, number> = {};
    for (let i = 0; i < 12; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString('default', { month: 'short' });
        monthlyData[monthName] = 0;
    }

    // Populate data
    payments.forEach(payment => {
        const monthName = payment.date.toLocaleString('default', { month: 'short' });
        if (monthlyData[monthName] !== undefined) {
            monthlyData[monthName] += Number(payment.amount);
        }
    });

    // Formatting for Recharts
    const chartData = Object.entries(monthlyData).map(([name, revenue]) => ({
        name,
        revenue
    })).reverse(); // Oldest to newest

    return chartData;
}
