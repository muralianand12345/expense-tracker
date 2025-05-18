import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@/auth/auth';
import { EXPENSE_CATEGORIES } from '@/types';

// Validation schema for expense data
const expenseSchema = z.object({
    amount: z.number().positive(),
    description: z.string().min(1),
    date: z.string().transform(val => new Date(val)),
    category: z.enum(EXPENSE_CATEGORIES),
});

/**
 * GET handler for fetching expenses with optional filters
 */
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

        // Build where clause with filters
        let whereClause: any = {
            userId: session.user.id,
        };

        // Filter by category if provided
        const category = searchParams.get('category');
        if (category) {
            whereClause.category = category;
        }

        // Filter by date range if provided
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            whereClause.date = {
                gte: new Date(startDate),
            };
        } else if (endDate) {
            whereClause.date = {
                lte: new Date(endDate),
            };
        }

        // Query the database
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

/**
 * POST handler for creating a new expense
 */
export async function POST(request: NextRequest) {
    try {
        // Get authenticated user
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validatedData = expenseSchema.parse(body);

        // Create the expense in the database
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