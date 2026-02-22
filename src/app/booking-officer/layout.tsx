import { BookingOfficerSidebar } from "@/components/booking-officer/sidebar";

export default function BookingOfficerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <BookingOfficerSidebar className="w-64 flex-shrink-0" />
            <main className="flex-1 p-8 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}
