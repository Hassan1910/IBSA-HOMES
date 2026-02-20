import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TenantForm from '@/components/admin/tenant-form'

export default async function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    // await params before using
    const { id } = await params

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    const tenant = await prisma.user.findUnique({
        where: { id },
        include: {
            tenantProfile: true
        }
    })

    if (!tenant) {
        notFound()
    }

    const properties = await prisma.property.findMany({
        where: { organizationId: session.user.organizationId },
        select: { id: true, title: true },
        orderBy: { title: 'asc' }
    })

    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Edit Tenant</h1>
            <TenantForm initialData={tenant} properties={properties} isEditing />
        </div>
    )
}
