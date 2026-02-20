import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const property = await prisma.property.findFirst({
        where: { title: 'Sleek Urban Loft' }
    });
    
    if (property) {
        console.log('Current images:', property.images);
        
        // Update images with completely new verified Unsplash images
        const updated = await prisma.property.update({
            where: { id: property.id },
            data: {
                images: [
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'
                ]
            }
        });
        console.log('Images updated to:', updated.images);
    } else {
        console.log('Property not found');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
