'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { updateMaintenanceStatus } from '@/actions/maintenance'
import { useRouter } from 'next/navigation'

type MaintenanceRequest = {
    id: string
    description: string
    status: string
    createdAt: Date
    property: { title: string }
    reporter: { name: string | null; email: string }
}

export default function AgentMaintenanceList({ initialRequests }: { initialRequests: any[] }) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleStatusUpdate = async (id: string, status: string) => {
        setLoadingId(id)
        try {
            await updateMaintenanceStatus(id, status)
            router.refresh()
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="rounded-md border bg-white dark:bg-slate-950">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialRequests.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{request.property.title}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{request.reporter.name || 'User'}</span>
                                    <span className="text-xs text-muted-foreground">{request.reporter.email}</span>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate" title={request.description}>
                                {request.description}
                            </TableCell>
                            <TableCell>
                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${request.status === 'RESOLVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                    request.status === 'OPEN' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    {request.status}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {request.status === 'OPEN' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(request.id, 'IN_PROGRESS')}
                                            disabled={loadingId === request.id}
                                        >
                                            Start
                                        </Button>
                                    )}
                                    {request.status === 'IN_PROGRESS' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(request.id, 'RESOLVED')}
                                            disabled={loadingId === request.id}
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                        >
                                            Resolve
                                        </Button>
                                    )}
                                    {request.status === 'RESOLVED' && (
                                        <span className="text-xs text-muted-foreground">Completed</span>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {initialRequests.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No maintenance requests found for your properties.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
