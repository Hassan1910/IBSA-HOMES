import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Profile | Booking Officer Dashboard",
    description: "Manage your booking officer profile settings.",
};

export default async function BookingOfficerProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "BOOKING_OFFICER" && session.user.role !== "ADMIN")) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <ProfileForm
                        user={{
                            name: user.name || "",
                            email: user.email || "",
                            role: user.role,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
