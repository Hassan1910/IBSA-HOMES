'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { createInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/app/actions/inventory';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type InventoryItem = {
    id: string;
    name: string;
    description: string | null;
    category: string;
    quantity: number;
    unitCost: any; // Decimal
    lowStockThreshold: number;
};

export default function InventoryClient({ initialItems }: { initialItems: InventoryItem[] }) {
    const [items, setItems] = useState<InventoryItem[]>(initialItems);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    async function handleAdd(formData: FormData) {
        setIsLoading(true);
        try {
            const newItem = await createInventoryItem({
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                quantity: parseInt(formData.get('quantity') as string),
                unitCost: formData.get('unitCost') ? parseFloat(formData.get('unitCost') as string) : undefined,
                description: formData.get('description') as string,
                lowStockThreshold: parseInt(formData.get('lowStockThreshold') as string) || 5,
            });
            setItems([...items, newItem as unknown as InventoryItem]);
            setIsAddOpen(false);
            toast({ title: "Success", description: "Item added successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to add item.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleEdit(formData: FormData) {
        if (!currentItem) return;
        setIsLoading(true);
        try {
            const updatedItem = await updateInventoryItem(currentItem.id, {
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                quantity: parseInt(formData.get('quantity') as string),
                unitCost: formData.get('unitCost') ? parseFloat(formData.get('unitCost') as string) : undefined,
                description: formData.get('description') as string,
                lowStockThreshold: parseInt(formData.get('lowStockThreshold') as string) || 5,
            });
            setItems(items.map(item => item.id === currentItem.id ? updatedItem as unknown as InventoryItem : item));
            setIsEditOpen(false);
            toast({ title: "Success", description: "Item updated successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update item.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteInventoryItem(id);
            setItems(items.filter(item => item.id !== id));
            toast({ title: "Success", description: "Item deleted successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground">Manage office and maintenance supplies.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form action={handleAdd}>
                            <DialogHeader>
                                <DialogTitle>Add New Item</DialogTitle>
                                <DialogDescription>Add a new supply to your inventory.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" required defaultValue="OFFICE_SUPPLIES">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OFFICE_SUPPLIES">Office Supplies</SelectItem>
                                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                            <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input id="quantity" name="quantity" type="number" min="0" required defaultValue="0" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="unitCost">Unit Cost (KES)</Label>
                                        <Input id="unitCost" name="unitCost" type="number" step="0.01" min="0" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                                    <Input id="lowStockThreshold" name="lowStockThreshold" type="number" min="0" defaultValue="5" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input id="description" name="description" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>Save</Button>
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
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>In Stock</TableHead>
                                <TableHead>Unit Cost</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No inventory items found. Add your first item.
                                    </TableCell>
                                </TableRow>
                            ) : items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.name}</div>
                                        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                                    </TableCell>
                                    <TableCell>{item.category.replace('_', ' ')}</TableCell>
                                    <TableCell>
                                        <div className={`font-semibold ${item.quantity <= item.lowStockThreshold ? 'text-red-500' : ''}`}>
                                            {item.quantity}
                                        </div>
                                        {item.quantity <= item.lowStockThreshold && (
                                            <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Low Stock</div>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.unitCost ? `KES ${Number(item.unitCost).toFixed(2)}` : '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" onClick={() => {
                                                setCurrentItem(item);
                                                setIsEditOpen(true);
                                            }}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <form action={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                        </DialogHeader>
                        {currentItem && (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input id="edit-name" name="name" required defaultValue={currentItem.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select name="category" required defaultValue={currentItem.category}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OFFICE_SUPPLIES">Office Supplies</SelectItem>
                                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                            <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-quantity">Quantity</Label>
                                        <Input id="edit-quantity" name="quantity" type="number" min="0" required defaultValue={currentItem.quantity} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-unitCost">Unit Cost (KES)</Label>
                                        <Input id="edit-unitCost" name="unitCost" type="number" step="0.01" min="0" defaultValue={currentItem.unitCost ? Number(currentItem.unitCost) : ''} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-lowStockThreshold">Low Stock Alert Threshold</Label>
                                    <Input id="edit-lowStockThreshold" name="lowStockThreshold" type="number" min="0" defaultValue={currentItem.lowStockThreshold} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Input id="edit-description" name="description" defaultValue={currentItem.description || ''} />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
