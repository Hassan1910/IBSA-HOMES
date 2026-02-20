import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-paystack-signature");
        const secret = process.env.PAYSTACK_SECRET_KEY;

        if (!secret) {
            console.error("Missing PAYSTACK_SECRET_KEY");
            return new NextResponse("Server configuration error", { status: 500 });
        }

        if (!signature) {
            return new NextResponse("Missing signature", { status: 400 });
        }

        const hash = crypto
            .createHmac("sha512", secret)
            .update(body)
            .digest("hex");

        if (hash !== signature) {
            return new NextResponse("Invalid signature", { status: 400 });
        }

        const event = JSON.parse(body);

        console.log("Paystack Webhook received:", event.event);

        switch (event.event) {
            case "subscription.create":
            case "charge.success": {
                // Determine user tracking logic. 
                // We passed organizationId in metadata or reference.
                let organizationId = event.data.metadata?.custom_fields?.find(
                    (f: any) => f.variable_name === "organization_id"
                )?.value;

                // Fallback: Check if reference contains organizationId
                if (!organizationId && event.data.reference?.includes("sub_")) {
                    const parts = event.data.reference.split("_");
                    if (parts.length >= 3) {
                        organizationId = parts[parts.length - 1]; // e.g. sub_1234_orgID
                    }
                }

                if (!organizationId) {
                    console.error("Webhook payload missing organization identifier.");
                    break;
                }

                // Update the organization to ACTIVE and record customer code
                const customerCode = event.data.customer?.customer_code;

                await prisma.organization.update({
                    where: { id: organizationId },
                    data: {
                        subscriptionStatus: "ACTIVE",
                        ...(customerCode && { paystackCustomerCode: customerCode }),
                    },
                });

                console.log(`Updated organization ${organizationId} to ACTIVE.`);
                break;
            }
            case "subscription.disable":
            case "subscription.not_renew": {
                // Subscription cancelled or failed to renew
                const customerCode = event.data.customer?.customer_code;
                if (!customerCode) break;

                await prisma.organization.updateMany({
                    where: { paystackCustomerCode: customerCode },
                    data: { subscriptionStatus: "CANCELED" },
                });
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.event}`);
        }

        return new NextResponse("Webhook processed successfully", { status: 200 });
    } catch (error) {
        console.error("Paystack webhook error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
