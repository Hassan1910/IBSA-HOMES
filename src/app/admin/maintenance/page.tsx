import { getMaintenanceRequests } from '@/actions/maintenance'
import AdminMaintenanceList from '@/components/admin/maintenance-list'

export default async function AdminMaintenancePage() {
    const { requests, error } = await getMaintenanceRequests()

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-5">Maintenance Requests</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Maintenance Requests</h1>
            <AdminMaintenanceList initialRequests={requests || []} />
        </div>
    )
}
