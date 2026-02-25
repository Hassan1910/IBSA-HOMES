import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BookingForm from "@/components/booking-form";

interface PropertyDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = 'force-dynamic';

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const defaultOrg = await prisma.organization.findFirst({ where: { name: 'Default Agency' } });

    const property = await prisma.property.findFirst({
        where: {
            id,
            organizationId: defaultOrg?.id
        },
        include: {
            agent: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!property) {
        notFound();
    }

    const formatPrice = (price: any) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            maximumFractionDigits: 0,
        }).format(Number(price));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card text-card-foreground shadow overflow-hidden sm:rounded-lg">
                        <div className="relative h-96 w-full">
                            <Image
                                src={property.images[0] || '/placeholder-house.jpg'}
                                alt={property.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-bold rounded uppercase shadow-md">
                                {property.status}
                            </div>
                        </div>

                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
                                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{property.address}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-primary">{formatPrice(property.price)}<span className="text-muted-foreground text-lg font-normal">/mo</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border px-4 py-5 sm:px-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-muted-foreground">Bedrooms</dt>
                                    <dd className="mt-1 text-lg text-foreground">{property.bedrooms}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-muted-foreground">Bathrooms</dt>
                                    <dd className="mt-1 text-lg text-foreground">{property.bathrooms}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-muted-foreground">Area</dt>
                                    <dd className="mt-1 text-lg text-foreground">{property.area ? `${property.area} sqft` : 'N/A'}</dd>
                                </div>
                                <div className="sm:col-span-3">
                                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                                    <dd className="mt-1 text-sm text-foreground whitespace-pre-wrap">{property.description || 'No description available.'}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Image Gallery */}
                        {property.images.length > 1 && (
                            <div className="px-4 py-5 sm:px-6 border-t border-border">
                                <h3 className="text-lg font-medium text-foreground mb-4">Gallery</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {property.images.slice(1).map((img, index) => (
                                        <div key={index} className="relative h-48 w-full rounded-lg overflow-hidden">
                                            <Image
                                                src={img}
                                                alt={`${property.title} - Image ${index + 2}`}
                                                fill
                                                className="object-cover hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Booking Form */}
                    <BookingForm propertyId={property.id} userId={session?.user?.id} />

                    {/* Agent Section */}
                    {property.agent ? (
                        <div className="bg-card text-card-foreground shadow sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Agent Information</h3>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xl">
                                    {property.agent.name?.[0] || 'A'}
                                </div>
                                <div>
                                    <p className="font-medium">{property.agent.name || 'Unknown Agent'}</p>
                                    <p className="text-sm text-muted-foreground">{property.agent.email}</p>
                                </div>
                            </div>
                            <a
                                href={`mailto:${property.agent.email}?subject=Inquiry about ${property.title}`}
                                className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90"
                            >
                                Contact Agent
                            </a>
                        </div>
                    ) : (
                        <div className="bg-card shadow sm:rounded-lg p-6 text-center text-muted-foreground italic">
                            No agent assigned to this property.
                        </div>
                    )}

                    <div className="text-center">
                        <Link
                            href="/properties"
                            className="text-primary hover:text-primary/80 font-medium"
                        >
                            &larr; Back to Properties
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
