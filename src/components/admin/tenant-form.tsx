'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createTenant, updateTenant } from '@/actions/tenants'

type Property = {
    id: string
    title: string
}

type TenantFormProps = {
    initialData?: any
    properties: Property[]
    isEditing?: boolean
    basePath?: string
    requireProperty?: boolean
}

export default function TenantForm({ initialData, properties, isEditing = false, basePath = '/admin/tenants', requireProperty = false }: TenantFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        password: '',
        phone: initialData?.tenantProfile?.phone || '',
        propertyId: initialData?.tenantProfile?.propertyId || '',
        leaseStartDate: initialData?.tenantProfile?.leaseStartDate
            ? new Date(initialData.tenantProfile.leaseStartDate).toISOString().split('T')[0]
            : '',
        leaseEndDate: initialData?.tenantProfile?.leaseEndDate
            ? new Date(initialData.tenantProfile.leaseEndDate).toISOString().split('T')[0]
            : '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePropertyChange = (value: string) => {
        setFormData(prev => ({ ...prev, propertyId: value === 'none' ? null : value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (requireProperty && (!formData.propertyId || formData.propertyId === 'none')) {
            setError('Please assign a property to the tenant.')
            setLoading(false)
            return
        }

        try {
            const dataToSubmit = {
                ...formData,
                propertyId: formData.propertyId || undefined,
                leaseStartDate: formData.leaseStartDate ? new Date(formData.leaseStartDate) : undefined,
                leaseEndDate: formData.leaseEndDate ? new Date(formData.leaseEndDate) : undefined,
            }

            let result
            if (isEditing && initialData?.id) {
                result = await updateTenant(initialData.id, dataToSubmit)
            } else {
                result = await createTenant(dataToSubmit)
            }

            if (result.success) {
                router.push(basePath)
                router.refresh()
            } else {
                setError(result.error || 'Something went wrong')
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Liban philips"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="liban@example.com"
                    />
                </div>

                {!isEditing && (
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEditing}
                            placeholder="******"
                            minLength={6}
                        />
                        <p className="text-xs text-muted-foreground">Default is 'password123' if left blank</p>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="propertyId">
                        Assigned Property {requireProperty && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                        value={formData.propertyId || 'none'}
                        onValueChange={handlePropertyChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No Property</SelectItem>
                            {properties.map((property) => (
                                <SelectItem key={property.id} value={property.id}>
                                    {property.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="leaseStartDate">Lease Start Date</Label>
                    <Input
                        id="leaseStartDate"
                        name="leaseStartDate"
                        type="date"
                        value={formData.leaseStartDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="leaseEndDate">Lease End Date</Label>
                    <Input
                        id="leaseEndDate"
                        name="leaseEndDate"
                        type="date"
                        value={formData.leaseEndDate}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (isEditing ? 'Update Tenant' : 'Create Tenant')}
                </Button>
            </div>
        </form>
    )
}
