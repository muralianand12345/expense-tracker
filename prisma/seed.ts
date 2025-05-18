import { PrismaClient } from '@prisma/client';
import { EXPENSE_CATEGORIES } from '../src/types';

const prisma = new PrismaClient();

async function main() {
    // Create a test user if one doesn't exist
    const testUser = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            name: 'Test User',
            email: 'test@example.com',
            currency: 'USD',
        },
    });

    console.log(`Created test user with id: ${testUser.id}`);

    // Clear existing data for test user
    await prisma.expense.deleteMany({
        where: { userId: testUser.id }
    });

    // Sample data
    const sampleExpenses = [
        {
            amount: 42.99,
            description: 'Grocery shopping',
            date: new Date('2023-12-15'),
            category: 'FOOD',
            userId: testUser.id,
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
        // Add more recent expenses (current month)
        {
            amount: 45.50,
            description: 'Restaurant dinner',
            date: new Date(), // Today
            category: 'FOOD',
            userId: testUser.id,
        },
        {
            amount: 29.99,
            description: 'Subscription service',
            date: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
            category: 'ENTERTAINMENT',
            userId: testUser.id,
        },
        {
            amount: 120.00,
            description: 'Phone bill',
            date: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 days ago
            category: 'UTILITIES',
            userId: testUser.id,
        },
    ];

    // Insert sample expenses
    await prisma.expense.createMany({
        data: sampleExpenses,
    });

    console.log(`Added ${sampleExpenses.length} sample expenses for test user`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });