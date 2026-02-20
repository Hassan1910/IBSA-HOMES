import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import PropertySearch from "@/components/PropertySearch";
import { Property } from "@prisma/client";

interface PropertiesPageProps {
    searchParams: {
        search?: string;
        status?: string;
        minPrice?: string;
        maxPrice?: string;
        bedrooms?: string;
    };
}

export default async function PropertiesPage({
    searchParams,
}: PropertiesPageProps) {
    // Await searchParams in Next.js 15+ if needed, but standard prop access works for now in 14.
    // Note: searchParams is a plain object in Next.js 14 Page props.

    const { search, status, minPrice, maxPrice, bedrooms } = await searchParams;

    const defaultOrg = await prisma.organization.findFirst({ where: { name: 'Default Agency' } });
    const where: any = {};

    if (defaultOrg) {
        where.organizationId = defaultOrg.id;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
        ];
    }

    if (status && status !== "ALL") {
        where.status = status;
    } else if (!status) {
        // Default to showing only available properties if no status is selected?
        // Or users might want to see all. Let's filter by AVAILABLE by default if no preference?
        // Actually, usually users looking for properties want available ones.
        // But let's stick to "ALL" implicitly means all if UI says "All Statuses".
        // If the UI default is "ALL", we show everything.
        // However, usually we prioritize AVAILABLE.
        // Let's rely on the UI sending "ALL" or specific status.
        // If nothing provided (initial load), maybe just show AVAILABLE?
        // Let's decide: Initial load -> Show all or Show Available?
        // Given it's a "Find your home" site, mostly Available.
        // But for now, let's allow seeing everything if no filter, or maybe Default to Available?
        // Let's default to no status filter (show all) to be neutral, or maybe just Available.
        // Let's stick to explicit filters.
    }

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (bedrooms && bedrooms !== "ALL") {
        where.bedrooms = { gte: Number(bedrooms) };
    }

    const properties = await prisma.property.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                        Browse Properties
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Find the perfect property that matches your criteria.
                    </p>
                </div>

                <PropertySearch />

                {properties.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl text-slate-600 dark:text-slate-400">
                            No properties found matching your criteria.
                        </h2>
                        <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
                        {/* Could add a button to clear filters here too */}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property: Property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
