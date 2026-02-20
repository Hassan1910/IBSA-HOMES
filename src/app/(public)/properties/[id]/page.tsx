import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="relative h-96 w-full">
                            <Image
                                src={property.images[0] || '/placeholder-house.jpg'}
                                alt={property.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm font-bold rounded uppercase shadow-md">
                                {property.status}
                            </div>
                        </div>

                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{property.address}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}<span className="text-gray-500 text-lg font-normal">/mo</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Bedrooms</dt>
                                    <dd className="mt-1 text-lg text-gray-900">{property.bedrooms}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Bathrooms</dt>
                                    <dd className="mt-1 text-lg text-gray-900">{property.bathrooms}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Area</dt>
                                    <dd className="mt-1 text-lg text-gray-900">{property.area ? `${property.area} sqft` : 'N/A'}</dd>
                                </div>
                                <div className="sm:col-span-3">
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{property.description || 'No description available.'}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Image Gallery */}
                        {property.images.length > 1 && (
                            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Gallery</h3>
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
                        <div className="bg-white shadow sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Information</h3>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                                    {property.agent.name?.[0] || 'A'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{property.agent.name || 'Unknown Agent'}</p>
                                    <p className="text-sm text-gray-500">{property.agent.email}</p>
                                </div>
                            </div>
                            <a
                                href={`mailto:${property.agent.email}?subject=Inquiry about ${property.title}`}
                                className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Contact Agent
                            </a>
                        </div>
                    ) : (
                        <div className="bg-white shadow sm:rounded-lg p-6 text-center text-gray-500 italic">
                            No agent assigned to this property.
                        </div>
                    )}

                    <div className="text-center">
                        <Link
                            href="/properties"
                            className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                            &larr; Back to Properties
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
