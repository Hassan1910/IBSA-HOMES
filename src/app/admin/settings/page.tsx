import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/admin/settings-form'
import { getSettings } from '@/actions/settings'

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    const { settings, error } = await getSettings()

    if (error || !settings) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-red-500">Error loading settings: {error || 'Unknown error'}</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">System Settings</h1>
            <SettingsForm initialSettings={settings} />
        </div>
    )
}
