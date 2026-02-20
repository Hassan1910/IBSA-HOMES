// src/app/landlord/properties/new/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import PropertyForm from '@/components/admin/property-form';

export const dynamic = 'force-dynamic';

export default async function NewLandlordPropertyPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'LANDLORD') {
        redirect('/login');
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Property</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Add a new property to your portfolio. It will be created under your ownership.
                </p>
            </div>

            <PropertyForm
                agents={[]}
                landlords={[]}
                isLandlord={true}
                currentUserId={session.user.id}
                redirectPath="/landlord/properties"
            />
        </div>
    );
}
