import Link from "next/link";
import { Search, MapPin, Home as HomeIcon, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyCard from "@/components/PropertyCard";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  const defaultOrg = await prisma.organization.findFirst({ where: { name: 'Default Agency' } });

  const featuredProperties = await prisma.property.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      status: 'AVAILABLE',
      organizationId: defaultOrg?.id,
    },
  });
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-slate-50 to-slate-50 dark:from-zinc-900 dark:via-slate-950 dark:to-slate-950 opacity-80 z-0" />
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center gap-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Find Your Perfect <span className="text-zinc-500 dark:text-zinc-400">Space</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover your next home or office with IBSA Homes.
              Premium property management services tailored for you.
            </p>
          </div>

          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800 flex flex-col sm:flex-row gap-2 transition-all hover:shadow-xl dark:shadow-none">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search by location, price, or property type..."
                className="pl-10 h-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base placeholder:text-zinc-400 dark:text-zinc-100"
              />
            </div>
            <Button size="lg" className="h-12 px-8 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 font-semibold rounded-lg shadow-sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span>Popular:</span>
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Apartments</Link>
            <span>•</span>
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Houses</Link>
            <span>•</span>
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Offices</Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Featured Properties</h2>
              <p className="text-slate-600 dark:text-slate-400">Handpicked selection of our best properties</p>
            </div>
            <Link href="/properties">
              <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                View All Properties &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Why Choose IBSA Homes?</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We provide a seamless and professional experience for both tenants and property owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                <HomeIcon className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Wide Selection</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                From cozy studios to luxury family homes, we have properties to suit every lifestyle and budget.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                <Shield className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Trusted Service</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                We pride ourselves on transparency, integrity, and verified listings you can trust.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                <Clock className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">24/7 Support</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Our dedicated support team is always available to assist with any questions or maintenance needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-950 dark:bg-zinc-950 border-t border-zinc-800 text-zinc-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 via-zinc-950 to-zinc-950 opacity-50 z-0" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Ready to Find Your New Home?</h2>
          <p className="text-zinc-400 mb-10 max-w-2xl mx-auto text-lg">
            Browse our latest listings and find the perfect property for you and your family today.
          </p>
          <Link href="/properties">
            <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300 font-bold px-8 h-12 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95">
              Start Browsing
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
