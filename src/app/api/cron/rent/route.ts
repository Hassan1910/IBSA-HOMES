import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // Authenticate the cron request if CRON_SECRET is set
        const authHeader = request.headers.get('authorization');
        if (
            process.env.CRON_SECRET &&
            authHeader !== `Bearer ${process.env.CRON_SECRET}`
        ) {
            return new Response('Unauthorized', { status: 401 });
        }

        // 1. Get all active tenants with an assigned property
        const tenants = await prisma.tenantProfile.findMany({
            where: {
                propertyId: {
                    not: null
                }
            },
            include: {
                property: true
            }
        });

        // Calculate start and end of the current month
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);

        const currentMonthEnd = new Date(currentMonthStart);
        currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);

        const invoicesCreated = [];

        for (const tenant of tenants) {
            if (!tenant.property) continue;

            // 2. Check if a rent invoice already exists for this tenant in this month
            // We check for any RENT payment that covers the current month to prevent duplicates
            const existingInvoice = await prisma.payment.findFirst({
                where: {
                    tenantId: tenant.id,
                    type: 'RENT',
                    date: {
                        gte: currentMonthStart,
                        lt: currentMonthEnd,
                    }
                }
            });

            if (!existingInvoice) {
                // 3. Generate new pending invoice
                const referenceId = `RENT-${tenant.id.slice(0, 8)}-${currentMonthStart.getTime()}`;

                const newInvoice = await prisma.payment.create({
                    data: {
                        amount: tenant.property.price,
                        type: 'RENT',
                        status: 'PENDING',
                        reference: referenceId,
                        gateway: 'PAYSTACK', // Default gateway label
                        organizationId: tenant.organizationId,
                        tenantId: tenant.id,
                        // Date defaults to now()
                    }
                });
                invoicesCreated.push(newInvoice);
            }
        }

        // Return a JSON outcome for the cron job logs
        return NextResponse.json({
            success: true,
            message: `Created ${invoicesCreated.length} rent invoices for the current month.`,
            count: invoicesCreated.length,
            invoices: invoicesCreated.map(i => i.id)
        });

    } catch (error) {
        console.error('Error generating rent invoices:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
