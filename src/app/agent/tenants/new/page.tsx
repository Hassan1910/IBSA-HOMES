import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TenantForm from '@/components/admin/tenant-form'

export default async function NewAgentTenantPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'AGENT') {
        redirect('/login')
    }

    const properties = await prisma.property.findMany({
        where: {
            organizationId: session.user.organizationId,
            agentId: session.user.id
        },
        select: { id: true, title: true },
        orderBy: { title: 'asc' }
    })

    return (
        <div className="container mx-auto py-10 max-w-3xl px-4 md:px-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6 mt-4">Add New Tenant</h1>
            <TenantForm properties={properties} basePath="/agent/tenants" requireProperty />
        </div>
    )
}
