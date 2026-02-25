"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import * as z from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password.")
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
});

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const validatedData = profileSchema.parse(data);

        // Check if email is already taken by another user
        if (validatedData.email !== session.user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: validatedData.email }
            });
            if (existingUser) {
                return { error: "Email is already in use by another account." };
            }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: validatedData.name,
                email: validatedData.email,
            }
        });

        // Revalidate all potential profile paths
        revalidatePath("/admin/profile");
        revalidatePath("/agent/profile");
        revalidatePath("/landlord/profile");
        revalidatePath("/tenant/profile");
        revalidatePath("/booking-officer/profile");

        return { success: "Profile updated successfully." };
    } catch (error) {
        console.error("Profile update error:", error);
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }
        return { error: "Failed to update profile." };
    }
}

export async function updatePassword(data: z.infer<typeof passwordSchema>) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const validatedData = passwordSchema.parse(data);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return { error: "User not found." };
        }

        const isValidPassword = await bcrypt.compare(validatedData.currentPassword, user.password);
        if (!isValidPassword) {
            return { error: "Invalid current password." };
        }

        const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        });

        return { success: "Password updated successfully." };
    } catch (error) {
        console.error("Password update error:", error);
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }
        return { error: "Failed to update password." };
    }
}
