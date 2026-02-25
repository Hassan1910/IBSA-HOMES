'use client'

import { usePaystackPayment } from "react-paystack"
import { Button } from "@/components/ui/button"

interface PaystackButtonProps {
    config: any;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    text?: string;
    disabled?: boolean;
    className?: string;
}

export default function PaystackButton({ config, onSuccess, onClose, text, disabled, className }: PaystackButtonProps) {
    const initializePayment = usePaystackPayment(config);
    return (
        <Button
            className={className}
            disabled={disabled}
            onClick={() => initializePayment({ onSuccess, onClose })}
        >
            {text || "Pay Now"}
        </Button>
    )
}
