'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';

const propertySchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    address: z.string().min(5),
    price: z.coerce.number().min(0),
    status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']),
    bedrooms: z.coerce.number().min(0),
    bathrooms: z.coerce.number().min(0),
    area: z.coerce.number().min(0).optional(),
    agentId: z.string().optional(),
    ownerId: z.string().optional(),
    images: z.array(z.string().url()).min(1),
});

export async function createProperty(data: z.infer<typeof propertySchema>) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const org = await prisma.organization.findUnique({
            where: { id: session.user.organizationId },
            include: { _count: { select: { properties: true } } }
        });

        const validatedjsData = propertySchema.parse(data);

        await prisma.property.create({
            data: {
                ...validatedjsData,
                organizationId: session.user.organizationId,
                agentId: validatedjsData.agentId || null,
                ownerId: validatedjsData.ownerId || null,
            },
        });

        revalidatePath('/admin/properties');
        revalidatePath('/properties');
        return { success: true };
    } catch (error) {
        console.error('Failed to create property:', error);
        return { success: false, error: 'Failed to create property' };
    }
}

export async function updateProperty(id: string, data: z.infer<typeof propertySchema>) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        const validatedData = propertySchema.parse(data);

        await prisma.property.update({
            where: {
                id,
                organizationId: session.user.organizationId
            },
            data: {
                ...validatedData,
                agentId: validatedData.agentId || null,
                ownerId: validatedData.ownerId || null,
            },
        });

        revalidatePath('/admin/properties');
        revalidatePath(`/admin/properties/${id}`);
        revalidatePath('/properties');
        return { success: true };
    } catch (error) {
        console.error('Failed to update property:', error);
        return { success: false, error: 'Failed to update property' };
    }
}

export async function deleteProperty(propertyId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

        await prisma.property.delete({
            where: {
                id: propertyId,
                organizationId: session.user.organizationId
            },
        });
        revalidatePath('/admin/properties');
        revalidatePath('/properties');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete property:', error);
        return { success: false, error: 'Failed to delete property' };
    }
}
