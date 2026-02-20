import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function AdminPaymentsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const { user } = session;

    // Fetch all payments for this admin's organization
    const payments = await prisma.payment.findMany({
        where: {
            organizationId: user.organizationId,
        },
        include: {
            tenant: {
                include: {
                    user: true,
                    property: true,
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            </div>

            <div className="rounded-md border bg-white dark:bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((payment) => (
                                <TableRow key={payment.id} className={payment.status === 'PENDING' ? 'bg-muted/50' : ''}>
                                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">
                                        {payment.tenant.user.name || payment.tenant.user.email}
                                    </TableCell>
                                    <TableCell>
                                        {payment.tenant.property ? payment.tenant.property.title : <span className="text-muted-foreground">-</span>}
                                    </TableCell>
                                    <TableCell>{payment.type}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {payment.reference || '-'}
                                    </TableCell>
                                    <TableCell>${Number(payment.amount).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                            payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {payment.status}
                                        </span>
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
