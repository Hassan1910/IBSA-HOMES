import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    let organization = await prisma.organization.findFirst({
        where: { name: 'Default Agency' }
    });

    if (!organization) {
        organization = await prisma.organization.create({
            data: { name: 'Default Agency' }
        });
        console.log('Organization created: Default Agency');
    }

    const adminEmail = 'admin@ibsahomes.com';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'System Admin',
                role: 'ADMIN',
                organizationId: organization.id,
            },
        });
        console.log('Admin user created: admin@ibsahomes.com');
    } else {
        console.log('Admin user already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
