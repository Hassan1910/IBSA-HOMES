'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSupportTicket } from '@/app/actions/support';
import { Plus } from 'lucide-react';
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

export default function UserSupportClient({ initialTickets }: { initialTickets: Ticket[] }) {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    async function handleAdd(formData: FormData) {
        setIsLoading(true);
        try {
            const newTicket = await createSupportTicket({
                subject: formData.get('subject') as string,
                category: formData.get('category') as string,
                description: formData.get('description') as string,
            });
            setTickets([newTicket as unknown as Ticket, ...tickets]);
            setIsAddOpen(false);
            toast({ title: "Ticket Submitted", description: "Our support team will review your ticket shortly." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit ticket.", variant: "destructive" });
        } finally {
            setIsLoading(false);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                    <p className="text-muted-foreground">Submit inquiries, suggestions, or complaints.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> New Ticket</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form action={handleAdd}>
                            <DialogHeader>
                                <DialogTitle>Submit a Support Ticket</DialogTitle>
                                <DialogDescription>Describe the issue or inquiry you need help with.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" name="subject" required placeholder="Brief summary of your ticket" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" required defaultValue="INQUIRY">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INQUIRY">General Inquiry</SelectItem>
                                            <SelectItem value="COMPLAINT">Complaint</SelectItem>
                                            <SelectItem value="SUGGESTION">Suggestion</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Details</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        required
                                        placeholder="Please provide as much detail as possible..."
                                        className="min-h-[120px]"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>Submit Ticket</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        You haven't submitted any support tickets yet.
                                    </TableCell>
                                </TableRow>
                            ) : tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[300px] truncate">
                                        {ticket.subject}
                                    </TableCell>
                                    <TableCell>{ticket.category}</TableCell>
                                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
