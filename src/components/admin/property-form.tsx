'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createProperty, updateProperty } from '@/app/admin/properties/actions';

const formSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().optional(),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']),
    bedrooms: z.coerce.number().min(0),
    bathrooms: z.coerce.number().min(0),
    area: z.coerce.number().min(0).optional(),
    agentId: z.string().optional(),
    ownerId: z.string().optional(),
    images: z.array(z.string().url('Must be a valid URL')).min(1, 'At least one image is required'),
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
    agents: { id: string; name: string | null; email: string }[];
    landlords?: { id: string; name: string | null; email: string }[];
    initialData?: PropertyFormValues & { id: string };
    isAgent?: boolean;
    isLandlord?: boolean;
    currentUserId?: string;
    redirectPath?: string;
}

export default function PropertyForm({
    agents,
    landlords = [],
    initialData,
    isAgent = false,
    isLandlord = false,
    currentUserId,
    redirectPath = '/admin/properties'
}: PropertyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageInput, setImageInput] = useState('');

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PropertyFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: initialData || {
            title: '',
            description: '',
            address: '',
            price: 0,
            status: 'AVAILABLE',
            bedrooms: 0,
            bathrooms: 0,
            area: 0,
            images: [],
            agentId: isAgent && currentUserId ? currentUserId : undefined,
            ownerId: isLandlord && currentUserId ? currentUserId : undefined,
        },
    });

    const onSubmit = async (data: PropertyFormValues) => {
        setLoading(true);
        try {
            // If it's an agent, ensure agentId is set to current user. If landlord, ensure ownerId is set to current user.
            const submissionData = {
                ...data,
                agentId: (isAgent && currentUserId) ? currentUserId : (!data.agentId || data.agentId === "unassigned" ? undefined : data.agentId),
                ownerId: (isLandlord && currentUserId) ? currentUserId : (!data.ownerId || data.ownerId === "unassigned" ? undefined : data.ownerId),
            };

            let result;
            if (initialData?.id) {
                result = await updateProperty(initialData.id, submissionData);
            } else {
                result = await createProperty(submissionData);
            }

            if (result.success) {
                router.push(redirectPath);
                router.refresh();
            } else {
                alert(result.error || 'Failed to save property');
            }
        } catch (error) {
            console.error('Submission error', error);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const addImage = () => {
        if (!imageInput) return;
        // Simple validation for URL
        try {
            new URL(imageInput);
        } catch {
            alert("Please enter a valid URL");
            return;
        }

        const currentImages = watch('images') || [];
        setValue('images', [...currentImages, imageInput]);
        setImageInput('');
    };

    const removeImage = (index: number) => {
        const currentImages = watch('images');
        setValue(
            'images',
            currentImages.filter((_: string, i: number) => i !== index)
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input id="title" placeholder="Luxury Apartment..." {...register('title')} />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St..." {...register('address')} />
                    {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price ($/month)</Label>
                    <Input id="price" type="number" {...register('price')} />
                    {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }: { field: any }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AVAILABLE">Available</SelectItem>
                                    <SelectItem value="RENTED">Rented</SelectItem>
                                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input id="bedrooms" type="number" {...register('bedrooms')} />
                    {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input id="bathrooms" type="number" {...register('bathrooms')} />
                    {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="area">Area (sqft)</Label>
                    <Input id="area" type="number" {...register('area')} />
                    {errors.area && <p className="text-sm text-red-500">{errors.area.message}</p>}
                </div>

                {!isAgent && !isLandlord && (
                    <div className="space-y-2">
                        <Label htmlFor="agentId">Assign Agent</Label>
                        <Controller
                            control={control}
                            name="agentId"
                            render={({ field }: { field: any }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">None</SelectItem>
                                        {agents.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id}>
                                                {agent.name || agent.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.agentId && <p className="text-sm text-red-500">{errors.agentId.message}</p>}
                    </div>
                )}

                {!isLandlord && (
                    <div className="space-y-2">
                        <Label htmlFor="ownerId">Assign Landlord (Owner)</Label>
                        <Controller
                            control={control}
                            name="ownerId"
                            render={({ field }: { field: any }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a landlord" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">None</SelectItem>
                                        {landlords.map((landlord) => (
                                            <SelectItem key={landlord.id} value={landlord.id}>
                                                {landlord.name || landlord.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.ownerId && <p className="text-sm text-red-500">{errors.ownerId.message}</p>}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Tell us about the property..."
                    className="resize-none h-32"
                    {...register('description')}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            {/* Image Handling */}
            <div className="space-y-4">
                <Label>Images (URLs)</Label>
                <div className="flex gap-2">
                    <Input
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" onClick={addImage} variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {watch('images')?.map((url: string, index: number) => (
                        <div key={index} className="relative group border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden aspect-video">
                            <img src={url} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
                {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}
                <p className="text-xs text-muted-foreground">Add at least one image URL.</p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Property
                </Button>
            </div>
        </form>
    );
}
