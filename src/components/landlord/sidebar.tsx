"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Home,
    LogOut,
    MessageSquare,
    Settings,
    HeartHandshake,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function LandlordSidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/landlord",
            active: pathname === "/landlord",
        },
        {
            label: "My Properties",
            icon: Home,
            href: "/landlord/properties",
            active: pathname.startsWith("/landlord/properties"),
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/landlord/settings",
            active: pathname === "/landlord/settings",
        },
        {
            label: "Support",
            icon: HeartHandshake,
            href: "/landlord/support",
            active: pathname === "/landlord/support",
        },
    ];

    return (
        <div className={cn("pb-12 h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-6 py-2">
                    <h2 className="mb-2 px-2 text-xl font-bold tracking-tight text-blue-600">
                        Landlord Portal
                    </h2>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="px-3 py-2 mt-auto absolute bottom-0 w-full mb-6">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => signOut({ callbackUrl: '/' })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
