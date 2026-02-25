'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getInventoryItems() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT')) {
    throw new Error('Unauthorized');
  }

  const items = await prisma.inventoryItem.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { name: 'asc' },
  });

  return items;
}

export async function createInventoryItem(data: {
  name: string;
  category: string;
  quantity: number;
  unitCost?: number;
  description?: string;
  lowStockThreshold?: number;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT')) {
    throw new Error('Unauthorized');
  }

  const item = await prisma.inventoryItem.create({
    data: {
      ...data,
      organizationId: session.user.organizationId,
    },
  });

  revalidatePath('/admin/inventory');
  revalidatePath('/agent/inventory');
  return item;
}

export async function updateInventoryItem(
  id: string,
  data: {
    name?: string;
    category?: string;
    quantity?: number;
    unitCost?: number;
    description?: string;
    lowStockThreshold?: number;
  }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT')) {
    throw new Error('Unauthorized');
  }

  const item = await prisma.inventoryItem.update({
    where: {
      id,
      organizationId: session.user.organizationId
    },
    data,
  });

  revalidatePath('/admin/inventory');
  revalidatePath('/agent/inventory');
  return item;
}

export async function deleteInventoryItem(id: string) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT')) {
    throw new Error('Unauthorized');
  }

  await prisma.inventoryItem.delete({
    where: {
      id,
      organizationId: session.user.organizationId
    },
  });

  revalidatePath('/admin/inventory');
  revalidatePath('/agent/inventory');
}
