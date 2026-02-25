'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getAgentUnreadMaintenanceCount } from '@/actions/maintenance'
import { getAgentUnreadSupportCount } from '@/app/actions/support'
import { usePathname, useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

export function AgentNotificationBell() {
    const [unreadMaintenance, setUnreadMaintenance] = useState(0)
    const [unreadSupport, setUnreadSupport] = useState(0)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const fetchCounts = async () => {
            const [maintenanceRes, supportRes] = await Promise.all([
                getAgentUnreadMaintenanceCount(),
                getAgentUnreadSupportCount()
            ])

            if (maintenanceRes.success && maintenanceRes.count !== undefined) {
                setUnreadMaintenance(maintenanceRes.count)
            }
            if (supportRes.success && supportRes.count !== undefined) {
                setUnreadSupport(supportRes.count)
            }
        }

        fetchCounts()

        // Poll every 30 seconds
        const interval = setInterval(fetchCounts, 30000)
        return () => clearInterval(interval)
    }, [pathname]) // Re-fetch when pathname changes

    const totalUnread = unreadMaintenance + unreadSupport

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Bell className="h-5 w-5" />
                    {totalUnread > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
                            {totalUnread > 9 ? '9+' : totalUnread}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer justify-between">
                    <Link href="/agent/maintenance" title="Maintenance Requests">
                        Maintenance
                        {unreadMaintenance > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600 dark:bg-red-900 dark:text-red-100">
                                {unreadMaintenance}
                            </span>
                        )}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer justify-between">
                    <Link href="/agent/support" title="Support Tickets">
                        Support
                        {unreadSupport > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600 dark:bg-red-900 dark:text-red-100">
                                {unreadSupport}
                            </span>
                        )}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
