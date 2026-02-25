'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

const PaystackCheckout = dynamic(() => import('@/components/paystack-checkout'), { ssr: false })
import { verifyPayment } from "@/actions/payments"

// Removed inline PaystackCheckout components

export default function PayInvoiceButton({
    amount,
    reference,
    email
}: {
    amount: number,
    reference: string,
    email: string
}) {
    const [loading, setLoading] = useState(false)
    const [paymentConfig, setPaymentConfig] = useState<any>(null)

    const handlePay = () => {
        setLoading(true)
        setPaymentConfig({
            reference,
            email,
            amount: Math.round(amount * 100), // convert to smallest unit
            currency: "KES",
            publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
        });
    }

    const handleSuccess = async (ref: any) => {
        try {
            await verifyPayment(ref.reference || ref);
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

    return (
        <div className="inline-flex flex-col items-start gap-2">
            {!paymentConfig ? (
                <Button size="sm" onClick={handlePay} disabled={loading} className="w-full sm:w-auto">
                    {loading ? 'Processing...' : 'Pay Now'}
                </Button>
            ) : (
                <PaystackCheckout
                    config={paymentConfig}
                    onSuccess={handleSuccess}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}
