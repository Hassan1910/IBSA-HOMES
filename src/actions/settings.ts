'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getSettings() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        // Find existing settings or create default for the organization
        let settings = await prisma.systemSettings.findFirst({
            where: { organizationId: session.user.organizationId }
        })

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    companyName: 'IBSA Homes',
                    currency: 'KES',
                    organizationId: session.user.organizationId
                }
            })
        }

        return { success: true, settings }
    } catch (error) {
        console.error('Failed to get settings:', error)
        return { success: false, error: 'Failed to get settings' }
    }
}

export async function updateSettings(id: string, data: {
    companyName: string
    supportEmail?: string
    supportPhone?: string
    currency: string
}) {
    try {
        const settings = await prisma.systemSettings.update({
            where: { id },
            data: {
                companyName: data.companyName,
                supportEmail: data.supportEmail || null,
                supportPhone: data.supportPhone || null,
                currency: data.currency
            }
        })
        revalidatePath('/admin/settings')
        return { success: true, settings }
    } catch (error) {
        console.error('Failed to update settings:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}
