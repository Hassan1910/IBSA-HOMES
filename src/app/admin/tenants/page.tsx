import { getTenants } from '@/actions/tenants';
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

export default async function AdminTenantsPage() {
    const { tenants, error } = await getTenants();

    if (error) {
        return <div className="p-8 text-red-500">Error loading tenants: {error}</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tenants Management</h1>
                <Link href="/admin/tenants/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tenant
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Lease Start</TableHead>
                            <TableHead>Lease End</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!tenants || tenants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No tenants found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tenants.map((tenant: any) => (
                                <TableRow key={tenant.id}>
                                    <TableCell className="font-medium">{tenant.name || 'N/A'}</TableCell>
                                    <TableCell>{tenant.email}</TableCell>
                                    <TableCell>
                                        {tenant.tenantProfile?.property ? (
                                            <Link href={`/admin/properties/${tenant.tenantProfile.property.id}/edit`} className="text-blue-600 hover:underline">
                                                {tenant.tenantProfile.property.title}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400">Not Assigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {tenant.tenantProfile?.leaseStartDate
                                            ? new Date(tenant.tenantProfile.leaseStartDate).toLocaleDateString()
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {tenant.tenantProfile?.leaseEndDate
                                            ? new Date(tenant.tenantProfile.leaseEndDate).toLocaleDateString()
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TenantActions id={tenant.id} />
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
