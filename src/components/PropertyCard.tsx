import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@prisma/client';

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const formatPrice = (price: any) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            maximumFractionDigits: 0,
        }).format(Number(price.toString()));
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="relative h-48 w-full">
                <Image
                    src={property.images[0] || '/placeholder-house.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 bg-zinc-900 dark:bg-zinc-800 text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wider backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                    {property.status}
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {property.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 truncate">
                            {property.address}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-zinc-900">
                        {formatPrice(property.price)}
                        <span className="text-gray-500 text-sm font-normal">/mo</span>
                    </span>
                </div>
                <div className="mt-4 flex items-center text-gray-500 text-sm space-x-4">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} Beds
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {property.bathrooms} Baths
                    </div>
                    {property.area && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            {property.area} sqft
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <Link
                        href={`/properties/${property.id}`}
                        className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded transition duration-150"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
