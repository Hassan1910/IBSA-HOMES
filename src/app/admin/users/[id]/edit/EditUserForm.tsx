'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUser } from '../../actions';

export default function EditUserForm({ user, properties, tenantProfile, agents }: { user: any, properties: any[], tenantProfile: any, agents: any[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState(user.role);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as 'ADMIN' | 'AGENT' | 'TENANT' | 'LANDLORD';
        const propertyId = formData.get('propertyId') as string;
        const agentId = formData.get('agentId') as string;

        try {
            const result = await updateUser(user.id, { name, email, role, propertyId, agentId });
            if (result.success) {
                router.push('/admin/users');
                router.refresh();
            } else {
                setError(result.error || 'Failed to update user');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
            {error && (
                <div className="p-4 rounded-md bg-red-50 text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required defaultValue={user.name || ''} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required defaultValue={user.email || ''} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={user.role} onValueChange={(val) => setSelectedRole(val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="AGENT">Agent</SelectItem>
                        <SelectItem value="LANDLORD">Landlord</SelectItem>
                        <SelectItem value="TENANT">Tenant</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selectedRole === 'TENANT' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="propertyId">Assigned Property</Label>
                        <Select name="propertyId" defaultValue={tenantProfile?.propertyId || 'none'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a property (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {properties.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="agentId">Assigned Agent</Label>
                        <Select name="agentId" defaultValue={tenantProfile?.agentId || 'none'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an agent (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {agents.map(a => (
                                    <SelectItem key={a.id} value={a.id}>{a.name || 'Unnamed Agent'}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            <div className="pt-4 flex gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
