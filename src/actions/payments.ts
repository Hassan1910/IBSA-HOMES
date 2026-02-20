'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import crypto from 'crypto'

export async function initializePayment(data: { amount: number, type: string }) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        if (!userId) return { success: false, error: 'Unauthorized' }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { tenantProfile: true }
        })

        if (!user?.tenantProfile) {
            return { success: false, error: 'Tenant profile not found' }
        }

        const reference = `PAY_${crypto.randomBytes(8).toString('hex').toUpperCase()}`

        const payment = await prisma.payment.create({
            data: {
                amount: data.amount,
                type: data.type,
                status: 'PENDING',
                reference,
                gateway: 'PAYSTACK',
                organizationId: user.organizationId,
                tenantId: user.tenantProfile.id
            }
        })

        return { success: true, payment, email: user.email }
    } catch (error) {
        console.error('Failed to initialize payment:', error)
        return { success: false, error: 'Failed to initialize payment' }
    }
}

export async function verifyPayment(reference: string) {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) return { success: false, error: "Gateway configuration error" }

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${secret}`
            }
        });

        const data = await response.json();

        if (data.status && data.data?.status === 'success') {
            await prisma.payment.updateMany({
                where: { reference },
                data: { status: 'COMPLETED' }
            });
            revalidatePath('/tenant/payments')
            return { success: true }
        } else {
            if (data.data?.status === 'failed') {
                await prisma.payment.updateMany({
                    where: { reference },
                    data: { status: 'FAILED' }
                });
                revalidatePath('/tenant/payments')
            }
            return { success: false, error: 'Payment verification failed' }
        }
    } catch (error) {
        console.error('Failed to verify payment:', error)
        return { success: false, error: 'Failed to verify payment' }
    }
}
