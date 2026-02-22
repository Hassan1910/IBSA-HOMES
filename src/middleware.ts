import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Admin routes protection
        if (path.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Agent routes protection
        if (path.startsWith("/agent") && token?.role !== "AGENT" && token?.role !== "ADMIN") {
            // Admins should probably have access to everything, or strictly agents?
            // Let's allow admins to access agent routes for now, or maybe not.
            // Re-reading requirements: Landlord/Agent Dashboard.
            // Safest is to restrict to AGENT.
            if (token?.role !== "ADMIN") { // Allow admins too?
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        // Tenant routes protection
        if (path.startsWith("/tenant") && token?.role !== "TENANT" && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Landlord routes protection
        if (path.startsWith("/landlord") && token?.role !== "LANDLORD" && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Booking Officer routes protection
        if (path.startsWith("/booking-officer") && token?.role !== "BOOKING_OFFICER" && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/agent/:path*", "/tenant/:path*", "/landlord/:path*", "/booking-officer/:path*"],
};
