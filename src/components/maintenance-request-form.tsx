'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea' // Assuming Textarea component exists, if not I'll use standard textarea or check ui components
import { Label } from '@/components/ui/label'
import { createMaintenanceRequest } from '@/actions/maintenance'

export default function MaintenanceRequestForm({ propertyId, reporterId }: { propertyId: string, reporterId: string }) {
    const router = useRouter()
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (!description.trim()) {
            setMessage({ type: 'error', text: 'Please provide a description' })
            setLoading(false)
            return
        }

        try {
            const result = await createMaintenanceRequest({
                description,
                propertyId,
                reporterId,
            })

            if (result.success) {
                setMessage({ type: 'success', text: 'Maintenance request submitted successfully!' })
                setDescription('')
                router.refresh()
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to submit request' })
            }
        } catch (error) {
            console.error(error)
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Submit New Request</h3>
            {message && (
                <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        required
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        placeholder="Describe the issue..."
                        rows={4}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </form>
        </div>
    )
}
