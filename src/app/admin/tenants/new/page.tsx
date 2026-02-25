import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TenantForm from '@/components/admin/tenant-form'

export default async function NewTenantPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    const properties = await prisma.property.findMany({
        where: { organizationId: session.user.organizationId },
        select: { id: true, title: true },
        orderBy: { title: 'asc' }
    })

    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Add New Tenant</h1>
            <TenantForm properties={properties} />
        </div>
    )
}
