import { AgentSidebar } from "@/components/agent/sidebar";
import { MobileSidebar } from "@/components/agent/mobile-sidebar";
import { UserNav } from "@/components/admin/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AgentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Double check role here just in case (middleware should handle it though)
    if (session.user.role !== "AGENT" && session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Desktop */}
            <AgentSidebar className="hidden w-64 md:block flex-shrink-0" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 items-center justify-between border-b bg-background px-6">
                    <div className="md:hidden">
                        <MobileSidebar />
                    </div>

                    {/* Brand for mobile/when sidebar is hidden */}
                    <div className="md:hidden flex items-center gap-2 font-bold text-xl text-blue-600">
                        <Home className="w-5 h-5" />
                        <span>IBSA</span>
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
