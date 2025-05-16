// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // First, create a test user
    const testUser = await prisma.user.create({
        data: {
            name: 'Test User',
            email: 'test@example.com',
            currency: 'USD',
        },
    });

    // Clear existing data
    await prisma.expense.deleteMany({});

    // Create sample expenses
    await prisma.expense.createMany({
        data: [
            {
                amount: 42.99,
                description: 'Grocery shopping',
                date: new Date('2023-12-15'),
                category: 'FOOD',
                userId: testUser.id, // Add the user ID to each expense
            },
            {
                amount: 25.50,
                description: 'Gas station',
                date: new Date('2023-12-18'),
                category: 'TRANSPORTATION',
                userId: testUser.id,
            },
            {
                amount: 1200,
                description: 'Rent payment',
                date: new Date('2024-01-01'),
                category: 'HOUSING',
                userId: testUser.id,
            },
            {
                amount: 80.75,
                description: 'Electric bill',
                date: new Date('2024-01-05'),
                category: 'UTILITIES',
                userId: testUser.id,
            },
            {
                amount: 35.99,
                description: 'Movie tickets',
                date: new Date('2024-01-12'),
                category: 'ENTERTAINMENT',
                userId: testUser.id,
            },
            {
                amount: 150,
                description: 'Doctor visit',
                date: new Date('2024-01-15'),
                category: 'HEALTHCARE',
                userId: testUser.id,
            },
            {
                amount: 89.99,
                description: 'New shoes',
                date: new Date('2024-01-20'),
                category: 'SHOPPING',
                userId: testUser.id,
            },
            {
                amount: 199.99,
                description: 'Online course',
                date: new Date('2024-01-22'),
                category: 'EDUCATION',
                userId: testUser.id,
            },
            {
                amount: 25,
                description: 'Haircut',
                date: new Date('2024-01-25'),
                category: 'PERSONAL',
                userId: testUser.id,
            },
            {
                amount: 15.49,
                description: 'Car wash',
                date: new Date('2024-01-28'),
                category: 'OTHER',
                userId: testUser.id,
            },
        ],
    });

    console.log('Sample data seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });