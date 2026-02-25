'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { initializePayment, verifyPayment } from "@/actions/payments"
import dynamic from 'next/dynamic'

const PaystackCheckout = dynamic(() => import('@/components/paystack-checkout'), { ssr: false })
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Removed inline PaystackCheckout components

export default function MakePaymentButton() {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [type, setType] = useState("RENT")
    const [loading, setLoading] = useState(false)
    const [paymentConfig, setPaymentConfig] = useState<any>(null)

    const handleInitialize = async () => {
        if (!amount || Number(amount) <= 0) return alert("Please enter a valid amount")

        setLoading(true)
        try {
            const res = await initializePayment({ amount: Number(amount), type })
            if (res.success && res.payment) {
                setPaymentConfig({
                    reference: res.payment.reference,
                    email: res.email,
                    amount: Math.round(Number(amount) * 100), // kobo
                    currency: "KES",
                    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
                });
                setOpen(false);
            } else {
                alert(res.error || "Failed to initialize payment")
                setLoading(false)
            }
        } catch (err) {
            console.error(err)
            alert("An error occurred")
            setLoading(false)
        }
    }

    const handleSuccess = async (reference: any) => {
        try {
            await verifyPayment(reference.reference || reference);
            setAmount("");
            setPaymentConfig(null);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const handleClose = () => {
        setPaymentConfig(null)
        setLoading(false)
    }

    // Reset when modal closes
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            setAmount("")
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Make Payment
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Make a Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (KES)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Payment Type</Label>
                            <Select value={type} onValueChange={setType} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="RENT">Rent</SelectItem>
                                    <SelectItem value="DEPOSIT">Security Deposit</SelectItem>
                                    <SelectItem value="FEE">Late Fee / Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleInitialize}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Continue to Paystack'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {paymentConfig && (
                <PaystackCheckout
                    config={paymentConfig}
                    onSuccess={handleSuccess}
                    onClose={handleClose}
                />
            )}
        </>
    )
}
