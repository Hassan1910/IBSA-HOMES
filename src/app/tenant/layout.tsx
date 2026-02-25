import { TenantSidebar } from "@/components/tenant/sidebar";
import { MobileSidebar } from "@/components/tenant/mobile-sidebar";
import { UserNav } from "@/components/admin/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "TENANT" && session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Desktop */}
            <TenantSidebar className="hidden w-64 md:block flex-shrink-0" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 items-center justify-between border-b bg-background px-6">
                    <div className="md:hidden">
                        <MobileSidebar />
                    </div>
                    <div className="flex items-center ml-auto space-x-4">
                        <ModeToggle />
                        <UserNav user={session.user} />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
