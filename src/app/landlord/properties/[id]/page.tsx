import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Mail, ExternalLink, Users, Activity, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandlordPropertyDetailsPageProps {
    params: {
        id: string;
    };
}

// In Next.js 14 params is an object, but sometimes in 15 it's a promise depending on config.
// The NextAuth session block ensures safety as well.
export default async function LandlordPropertyDetailsPage({ params }: LandlordPropertyDetailsPageProps) {
    // Attempting to resolve params properly for compat
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'LANDLORD' && session.user.role !== 'ADMIN')) {
        redirect('/');
    }

    const property = await prisma.property.findFirst({
        where: {
            id,
            ownerId: session.user.role === 'LANDLORD' ? session.user.id : undefined,
            organizationId: session.user.organizationId
        },
        include: {
            agent: {
                select: {
                    name: true,
                    email: true,
                }
            },
            tenants: {
                include: {
                    user: true
                }
            },
            maintenance: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
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
            maximumFractionDigits: 0
        }).format(Number(price));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                            property.status === 'RENTED' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {property.status}
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1">{property.address}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/properties/${property.id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Public Page
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Media / Overview */}
                    <Card>
                        <CardContent className="p-0 overflow-hidden">
                            <div className="relative h-64 w-full bg-slate-100">
                                {property.images && property.images.length > 0 ? (
                                    <Image
                                        src={property.images[0]}
                                        alt={property.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x">
                                    <div>
                                        <p className="text-sm text-slate-500">Price/mo</p>
                                        <p className="text-lg font-semibold">{formatPrice(property.price)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Bedrooms</p>
                                        <p className="text-lg font-semibold">{property.bedrooms}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Bathrooms</p>
                                        <p className="text-lg font-semibold">{property.bathrooms}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Area</p>
                                        <p className="text-lg font-semibold">{property.area || 0} sqft</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                {property.description || 'No description provided.'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Maintenance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-slate-500" />
                                Recent Maintenance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {property.maintenance.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No maintenance requests logged.</p>
                            ) : (
                                <div className="space-y-4">
                                    {property.maintenance.map((request) => (
                                        <div key={request.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-medium text-sm">{request.description}</p>
                                                <p className="text-xs text-slate-500">{new Date(request.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-xs ${request.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Management Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-slate-500" />
                                Managing Agent
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {property.agent ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {property.agent.name?.[0] || property.agent.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{property.agent.name || 'Unnamed Agent'}</p>
                                            <p className="text-xs text-slate-500">Property Manager</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <a href={`mailto:${property.agent.email}`}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Email Agent
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No agent assigned.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tenants */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-slate-500" />
                                Current Tenants
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {property.tenants.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No active tenants.</p>
                            ) : (
                                <div className="space-y-4">
                                    {property.tenants.map((profile) => (
                                        <div key={profile.id} className="border p-3 rounded-lg">
                                            <p className="font-medium text-sm">{profile.user.name || profile.user.email}</p>
                                            {profile.phone && (
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                    <Phone className="w-3 h-3" />
                                                    {profile.phone}
                                                </div>
                                            )}
                                            {profile.leaseEndDate && (
                                                <p className="text-xs text-slate-500 mt-2 border-t pt-2">
                                                    Lease ends: {new Date(profile.leaseEndDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
