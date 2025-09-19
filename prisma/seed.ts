import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1) Ensure an organization exists (reuse if already there)
    const orgName = 'Acme Inc.';
    let organization = await prisma.organization.findFirst({ where: { name: orgName } });
    if (!organization) {
        organization = await prisma.organization.create({
            data: { name: orgName },
        });
    }
    console.log('Organization id:', organization.id);

    // 2) Seed categories (in this org)
    const catData = [
        { name: 'Electronics', description: 'Devices & accessories', organizationId: organization.id },
        { name: 'Home Office', description: 'Desks, chairs, & more', organizationId: organization.id },
    ];

    for (const c of catData) {
        const exists = await prisma.category.findFirst({
            where: { name: c.name, organizationId: organization.id },
        });
        if (!exists) {
            await prisma.category.create({ data: c });
        }
    }

    const categories = await prisma.category.findMany({
        where: { organizationId: organization.id },
        orderBy: { id: 'asc' },
    });

    // pick two categories for products
    const cat1 = categories[0];
    const cat2 = categories[1] ?? categories[0];

    // 3) Seed products (in this org, tied to categories)
    const prodData = [
        {
            name: 'Wireless Headphones',
            price: 99.99,
            stock: 50,
            categoryId: cat1.id,
            organizationId: organization.id,
        },
        {
            name: 'Ergonomic Desk Chair',
            price: 179.0,
            stock: 25,
            categoryId: cat2.id,
            organizationId: organization.id,
        },
    ];

    for (const p of prodData) {
        const exists = await prisma.product.findFirst({
            where: { name: p.name, organizationId: organization.id },
        });
        if (!exists) {
            await prisma.product.create({ data: p });
        }
    }

    console.log('Seed complete ✅');
}

main()
    .catch((e) => {
        console.error('Seed failed ❌', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
