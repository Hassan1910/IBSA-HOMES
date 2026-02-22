'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSupportTicketStatus } from '@/app/actions/support';
import { useToast } from "@/hooks/use-toast";

type Ticket = {
    id: string;
    subject: string;
    category: string;
    description: string;
    status: string;
    createdAt: Date;
    reporter: {
        name: string | null;
        email: string;
        role: string;
    };
};

export default function AgentSupportClient({ initialTickets }: { initialTickets: Ticket[] }) {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const { toast } = useToast();

    async function handleStatusChange(id: string, newStatus: string) {
        try {
            const updated = await updateSupportTicketStatus(id, newStatus);
            setTickets(tickets.map(t => t.id === id ? { ...t, status: updated.status } : t));
            if (selectedTicket?.id === id) {
                setSelectedTicket({ ...selectedTicket, status: updated.status });
            }
            toast({ title: "Status Updated", description: "Ticket status has been updated." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    }

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            'OPEN': 'bg-yellow-100 text-yellow-800',
            'IN_PROGRESS': 'bg-blue-100 text-blue-800',
            'RESOLVED': 'bg-green-100 text-green-800',
            'CLOSED': 'bg-gray-100 text-gray-800',
        };
        return <Badge className={colors[status] || ''} variant="outline">{status.replace('_', ' ')}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                <p className="text-muted-foreground">Manage user complaints, inquiries, and feedback.</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No support tickets yet.
                                    </TableCell>
                                </TableRow>
                            ) : tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{ticket.reporter.name || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{ticket.reporter.email}</div>
                                        <Badge variant="secondary" className="text-[10px] mt-1 pr-2">{ticket.reporter.role}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[200px] truncate">
                                        {ticket.subject}
                                    </TableCell>
                                    <TableCell>{ticket.category}</TableCell>
                                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            setSelectedTicket(ticket);
                                            setIsViewOpen(true);
                                        }}>
                                            Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Ticket Details</DialogTitle>
                    </DialogHeader>
                    {selectedTicket && (
                        <div className="space-y-4 py-4">
                            <div>
                                <h3 className="text-lg font-semibold">{selectedTicket.subject}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary">{selectedTicket.category}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                        Submitted by {selectedTicket.reporter.name} ({selectedTicket.reporter.email})
                                    </span>
                                </div>
                            </div>

                            <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
                                {selectedTicket.description}
                            </div>

                            <div className="pt-4 border-t flex items-center justify-between">
                                <span className="font-medium">Update Status:</span>
                                <Select
                                    value={selectedTicket.status}
                                    onValueChange={(val) => handleStatusChange(selectedTicket.id, val)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OPEN">Open</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                                        <SelectItem value="CLOSED">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
