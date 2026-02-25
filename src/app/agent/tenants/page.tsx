import { getAgentTenants } from '@/actions/tenants';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from 'next/link';
import TenantActions from '@/components/admin/tenant-actions';

export default async function AgentTenantsPage() {
    const { tenants, error } = await getAgentTenants();

    if (error) {
        return <div className="p-8 text-red-500">Error loading tenants: {error}</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage tenants for the properties you oversee.
                    </p>
                </div>
                <Link href="/agent/tenants/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tenant
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Email</TableHead>
                            <TableHead className="font-semibold">Property</TableHead>
                            <TableHead className="font-semibold">Lease Start</TableHead>
                            <TableHead className="font-semibold">Lease End</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!tenants || tenants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No tenants found for your properties.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tenants.map((tenant: any) => (
                                <TableRow key={tenant.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">{tenant.name || 'N/A'}</TableCell>
                                    <TableCell className="text-muted-foreground">{tenant.email}</TableCell>
                                    <TableCell>
                                        {tenant.tenantProfile?.property ? (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {tenant.tenantProfile.property.title}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm italic">Not Assigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {tenant.tenantProfile?.leaseStartDate
                                            ? new Date(tenant.tenantProfile.leaseStartDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {tenant.tenantProfile?.leaseEndDate
                                            ? new Date(tenant.tenantProfile.leaseEndDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TenantActions id={tenant.id} basePath="/agent/tenants" />
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
