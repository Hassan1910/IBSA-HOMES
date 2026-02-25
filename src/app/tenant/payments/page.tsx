import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import MakePaymentButton from "@/components/tenant/make-payment-button";
import PayInvoiceButton from "@/components/tenant/pay-invoice-button";

export default async function TenantPaymentsPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return null;

    const tenant = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            tenantProfile: {
                include: {
                    payments: {
                        orderBy: { date: 'desc' }
                    }
                }
            }
        }
    });

    if (!tenant?.tenantProfile) {
        return <div className="p-8">No tenant profile found.</div>;
    }

    const { payments } = tenant.tenantProfile;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Payments</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">View your payment history and pay pending invoices.</p>
                </div>
                <MakePaymentButton />
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((payment) => (
                                <TableRow key={payment.id} className={payment.status === 'PENDING' ? 'bg-slate-50 dark:bg-slate-800/50' : 'dark:border-slate-800'}>
                                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{payment.type}</TableCell>
                                    <TableCell>KES {Number(payment.amount).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {payment.status === 'PENDING' && payment.reference ? (
                                            <PayInvoiceButton
                                                amount={Number(payment.amount)}
                                                reference={payment.reference}
                                                email={tenant.email}
                                            />
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
