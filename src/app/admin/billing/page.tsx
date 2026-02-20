import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BillingClient from "./billing-client";

export default async function BillingPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.organizationId) {
        redirect("/login");
    }

    const organization = await prisma.organization.findUnique({
        where: { id: session.user.organizationId },
    });

    if (!organization) {
        redirect("/login");
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
                <p className="text-muted-foreground">
                    Manage your organization's subscription and billing details.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <h3 className="font-semibold text-xl">Current Plan</h3>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold">
                                {organization.subscriptionStatus === "ACTIVE" ? "Pro" : "Free Trial"}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {organization.subscriptionStatus === "ACTIVE"
                                ? "You are on the Pro plan with unlimited properties."
                                : "You are currently on the Free Trial, limited to 5 properties."}
                        </p>
                    </div>
                </div>

                <BillingClient
                    organization={organization}
                    userEmail={session.user.email!}
                    paystackPublicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""}
                    proPlanCode={process.env.PAYSTACK_PRO_PLAN_CODE || ""}
                />
            </div>
        </div>
    );
}
