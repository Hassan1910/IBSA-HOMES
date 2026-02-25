'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const PaystackButton = dynamic(() => import('@/components/paystack-button'), { ssr: false });

interface BillingClientProps {
    organization: {
        id: string;
        subscriptionStatus: string;
    };
    userEmail: string;
    paystackPublicKey: string;
    proPlanCode: string;
}

export default function BillingClient({ organization, userEmail, paystackPublicKey, proPlanCode }: BillingClientProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const config = {
        reference: `sub_${new Date().getTime()}_${organization.id}`,
        email: userEmail,
        amount: 5000000, // E.g. KES 50 or 50,000 NGN. Actually, the amount is overridden by the plan if standard, but required by SDK. Set to 50000 (KES 50)
        currency: "KES",
        publicKey: paystackPublicKey,
        plan: proPlanCode,
        metadata: {
            custom_fields: [
                {
                    display_name: 'Organization ID',
                    variable_name: 'organization_id',
                    value: organization.id,
                }
            ]
        }
    };



    const onSuccess = (reference: any) => {
        setIsLoading(false);
        // Ideally, we hit an internal API or just rely on the webhook.
        // For UX, we might want to refresh the page after a brief delay.
        setTimeout(() => {
            router.refresh();
        }, 2000);
    };

    const onClose = () => {
        setIsLoading(false);
    };

    const handleSubscribe = () => {
        if (!paystackPublicKey || !proPlanCode) {
            alert("Payment configuration is missing. Please contact support.");
            return;
        }
        setIsLoading(true);
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 space-y-4">
                <h3 className="font-semibold text-xl">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground">
                    Get unlimited properties, advanced analytics, and priority support.
                </p>
                <div className="text-3xl font-bold">
                    KES 50 <span className="text-sm text-muted-foreground font-normal">/ month</span>
                </div>

                {organization.subscriptionStatus === "ACTIVE" ? (
                    <Button variant="outline" className="w-full" disabled>
                        Already Subscribed
                    </Button>
                ) : (!paystackPublicKey || !proPlanCode) ? (
                    <Button
                        onClick={handleSubscribe}
                        className="w-full"
                    >
                        Subscribe Now
                    </Button>
                ) : (
                    <div onClick={() => setIsLoading(true)}>
                        <PaystackButton
                            config={config}
                            onSuccess={onSuccess}
                            onClose={onClose}
                            className="w-full"
                            disabled={isLoading}
                            text={isLoading ? "Processing..." : "Subscribe Now"}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
