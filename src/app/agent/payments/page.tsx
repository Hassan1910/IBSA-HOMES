import { getAgentPayments } from '@/actions/payments';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default async function AgentPaymentsPage() {
    const { payments, error } = await getAgentPayments();

    if (error) {
        return <div className="p-8 text-red-500">Error loading payments: {error}</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground mt-2">
                        Track payments for all properties you manage.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold">Tenant</TableHead>
                            <TableHead className="font-semibold">Property</TableHead>
                            <TableHead className="font-semibold">Amount</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!payments || payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No payment records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((payment: any) => (
                                <TableRow key={payment.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell>
                                        <div className="font-medium">{payment.tenant?.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{payment.tenant?.user?.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">
                                            {payment.tenant?.property?.title || 'Unknown Property'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {formatCurrency(Number(payment.amount))}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize bg-blue-50/50 text-blue-700 hover:bg-blue-100/50 border-blue-200">
                                            {payment.type.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                payment.status === 'COMPLETED' ? 'default' :
                                                    payment.status === 'PENDING' ? 'secondary' : 'destructive'
                                            }
                                            className={
                                                payment.status === 'COMPLETED' ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20 border-transparent' :
                                                    payment.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-transparent' : ''
                                            }
                                        >
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(payment.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
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
