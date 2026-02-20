import { AdminSidebar } from "@/components/admin/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin/user-nav"; // We'll create this next
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { MobileSidebar } from "@/components/admin/mobile-sidebar"; // Create this too

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Desktop */}
            <AdminSidebar className="hidden w-64 md:block flex-shrink-0" />

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
                    {children}
                </main>
            </div>
        </div>
    );
}
