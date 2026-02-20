import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const mockProperties = [
    {
        title: "Modern Downtown Apartment",
        description: "A beautiful modern apartment in the heart of the city with amazing city views. Comes fully furnished with premium appliances.",
        address: "123 Main St, Cityville",
        price: 2500,
        status: "AVAILABLE",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=1200&q=80",
            "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80"
        ]
    },
    {
        title: "Luxury Hillside Villa",
        description: "Stunning luxury villa featuring a private pool, extensive garden, and panoramic views of the hills.",
        address: "456 Highland Drive, Beverly Hills",
        price: 8500,
        status: "AVAILABLE",
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687983-bc2a297a7ea6?w=1200&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"
        ]
    },
    {
        title: "Cozy Suburban Family Home",
        description: "Perfect family home in a quiet neighborhood. Features a large backyard and newly renovated kitchen.",
        address: "789 Maple Ave, Springfield",
        price: 3200,
        status: "AVAILABLE",
        bedrooms: 4,
        bathrooms: 2.5,
        area: 2800,
        images: [
            "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80",
            "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80",
            "https://images.unsplash.com/photo-1502005229762-cf1b2e1c6b46?w=1200&q=80"
        ]
    },
    {
        title: "Sleek Urban Loft",
        description: "Minimalist industrial loft with exposed brick walls, high ceilings, and huge windows letting in natural light.",
        address: "101 Industrial Way, Warehouse District",
        price: 2800,
        status: "AVAILABLE",
        bedrooms: 1,
        bathrooms: 1,
        area: 1100,
        images: [
            "https://images.unsplash.com/photo-1531835551805-16d8e4f4faa5?w=1200&q=80",
            "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80"
        ]
    },
    {
        title: "Sunny Beachfront Condo",
        description: "Wake up to the sound of waves in this beautiful beachfront condo. Direct access to the beach and a shared pool.",
        address: "220 Ocean Blvd, Seaside",
        price: 4500,
        status: "AVAILABLE",
        bedrooms: 3,
        bathrooms: 2,
        area: 1600,
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
            "https://images.unsplash.com/photo-1522771731478-44fb9fba11ac?w=1200&q=80"
        ]
    },
    {
        title: "Modern Tech Hub Studio",
        description: "Compact but brilliantly designed studio apartment right next to the major tech campuses.",
        address: "555 Silicon Way, Techville",
        price: 1800,
        status: "AVAILABLE",
        bedrooms: 1,
        bathrooms: 1,
        area: 600,
        images: [
            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
            "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80"
        ]
    }
];

async function main() {
    console.log('Starting property seeding...');

    // Find default organization to attach properties to
    let organization = await prisma.organization.findFirst({
        where: { name: 'Default Agency' }
    });

    if (!organization) {
        organization = await prisma.organization.create({
            data: { name: 'Default Agency' }
        });
        console.log('Created Default Agency organization');
    }

    // Try to find an admin to assign as the generic creator/owner if needed
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN', organizationId: organization.id }
    });

    let createdCount = 0;

    for (const propertyData of mockProperties) {
        // Check if property with similar title exists to avoid massive duplication on multiple runs
        const existing = await prisma.property.findFirst({
            where: { title: propertyData.title, organizationId: organization.id }
        });

        if (!existing) {
            await prisma.property.create({
                data: {
                    ...propertyData,
                    organizationId: organization.id,
                }
            });
            console.log(`Created property: ${propertyData.title}`);
            createdCount++;
        } else {
            console.log(`Skipped existing property: ${propertyData.title}`);
        }
    }

    console.log(`\nSeeded ${createdCount} new properties successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
