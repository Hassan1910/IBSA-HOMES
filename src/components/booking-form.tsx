'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBooking } from '@/actions/bookings'

export default function BookingForm({ propertyId, userId, purpose = 'RENT' }: { propertyId: string, userId?: string, purpose?: string }) {
    const router = useRouter()
    const [date, setDate] = useState('')
    const [visitorName, setVisitorName] = useState('')
    const [visitorContact, setVisitorContact] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (!date) {
            setMessage({ type: 'error', text: 'Please select a date' })
            setLoading(false)
            return
        }

        try {
            const result = await createBooking({
                propertyId,
                userId,
                visitorName: userId ? undefined : visitorName,
                visitorContact: userId ? undefined : visitorContact,
                date: new Date(date),
            })

            if (result.success) {
                setMessage({ type: 'success', text: 'Booking request sent successfully!' })
                setDate('')
                setVisitorName('')
                setVisitorContact('')
                router.refresh()
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to create booking' })
            }
        } catch (error) {
            console.error(error)
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md border border-border">
            <h3 className="text-xl font-semibold mb-4">{purpose === 'SALE' ? 'Inquire to Buy' : 'Book a Viewing'}</h3>
            {message && (
                <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                        id="date"
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {!userId && (
                    <>
                        <div>
                            <Label htmlFor="visitorName">Your Name</Label>
                            <Input
                                id="visitorName"
                                type="text"
                                required
                                value={visitorName}
                                onChange={(e) => setVisitorName(e.target.value)}
                                placeholder="Liban philips"
                            />
                        </div>
                        <div>
                            <Label htmlFor="visitorContact">Contact Info</Label>
                            <Input
                                id="visitorContact"
                                type="text"
                                required
                                value={visitorContact}
                                onChange={(e) => setVisitorContact(e.target.value)}
                                placeholder="Email or Phone"
                            />
                        </div>
                    </>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Submitting...' : (purpose === 'SALE' ? 'Send Inquiry' : 'Request Booking')}
                </Button>
            </form>
        </div>
    )
}
