'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteTenant } from '@/actions/tenants'
import { Pencil, Trash2 } from 'lucide-react'

export default function TenantActions({ id }: { id: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) return

        setLoading(true)
        try {
            const result = await deleteTenant(id)
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error || 'Failed to delete tenant')
            }
        } catch (error) {
            console.error(error)
            alert('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-end gap-2">
            <Link href={`/admin/tenants/${id}/edit`}>
                <Button variant="ghost" size="icon" title="Edit Tenant">
                    <Pencil className="h-4 w-4" />
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Delete Tenant"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
