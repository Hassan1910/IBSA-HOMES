"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    Home,
    Calendar,
    Settings,
    LogOut,
    Building,
    CreditCard,
    Receipt,
    Package,
    HeartHandshake,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AdminSidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            active: pathname === "/admin",
        },
        {
            label: "Properties",
            icon: Home,
            href: "/admin/properties",
            active: pathname.startsWith("/admin/properties"),
        },
        {
            label: "Bookings",
            icon: Calendar,
            href: "/admin/bookings",
            active: pathname.startsWith("/admin/bookings"),
        },
        {
            label: "Payments",
            icon: CreditCard,
            href: "/admin/payments",
            active: pathname.startsWith("/admin/payments"),
        },
        {
            label: "Users",
            icon: Users,
            href: "/admin/users",
            active: pathname.startsWith("/admin/users"),
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/admin/settings",
            active: pathname.startsWith("/admin/settings"),
        },
        {
            label: "Inventory",
            icon: Package,
            href: "/admin/inventory",
            active: pathname.startsWith("/admin/inventory"),
        },
        {
            label: "Support",
            icon: HeartHandshake,
            href: "/admin/support",
            active: pathname.startsWith("/admin/support"),
        },
        /* {
            label: "Billing",
            icon: Receipt,
            href: "/admin/billing",
            active: pathname.startsWith("/admin/billing"),
        },*/
    ];

    return (
        <div className={cn("pb-12 h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-6 py-2">
                    <h2 className="mb-2 px-2 text-xl font-bold tracking-tight">
                        IBSA Admin
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
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
