'use client'

import { useEffect, useRef } from "react"
import { usePaystackPayment } from "react-paystack"

export default function PaystackCheckout({ config, onSuccess, onClose, text }: any) {
    const initializePaystack = usePaystackPayment(config);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            // usePaystackPayment returns a function that takes an options object
            initializePaystack({ onSuccess, onClose });
        }
    }, [initializePaystack, onSuccess, onClose]);

    return <p className="text-sm text-center text-muted-foreground mt-4">{text || "Opening gateway..."}</p>;
}
