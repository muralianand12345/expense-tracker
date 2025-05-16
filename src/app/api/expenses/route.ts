import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@/auth/auth';

// Validation schema for expense data
const expenseSchema = z.object({
    amount: z.number().positive(),
    description: z.string().min(1),
    date: z.string().transform(val => new Date(val)),
    category: z.string().min(1),
});

// GET all expenses
export async function GET(request: NextRequest) {
    try {
        // Get authenticated user
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        // Filter by category if provided
        const category = searchParams.get('category');

        // Filter by date range if provided
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let whereClause: any = {
            userId: session.user.id,
        };

        if (category) {
            whereClause.category = category;
        }

        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch expenses' },
            { status: 500 }
        );
    }
}

// POST a new expense
export async function POST(request: NextRequest) {
    try {
        // Get authenticated user
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate the expense data
        const validatedData = expenseSchema.parse(body);

        // Create the expense in the database with the user ID
        const expense = await prisma.expense.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
        });

        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        console.error('Error creating expense:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create expense' },
            { status: 500 }
        );
    }
}