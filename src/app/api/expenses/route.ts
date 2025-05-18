// src/app/api/expenses/route.ts - Updated with better error handling

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
        console.log('GET expenses - Fetching auth session...');
        const session = await auth();

        console.log('GET expenses - Session received:',
            session ? `User: ${session.user?.email} (${session.user?.id})` : 'No session');

        if (!session?.user) {
            console.log('GET expenses - No authenticated user found');
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

        console.log('GET expenses - Querying database with where clause:', JSON.stringify(whereClause));

        // Check if the expenses table exists
        try {
            // Try a light query first to check if the table exists
            await prisma.$queryRaw`SELECT 1 FROM "expenses" LIMIT 1`;
            console.log('GET expenses - Expenses table exists');
        } catch (tableError) {
            console.error('GET expenses - Error checking expenses table:', tableError);
            return NextResponse.json(
                { error: 'Database table missing. Please run `npx prisma db push`' },
                { status: 500 }
            );
        }

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            orderBy: {
                date: 'desc',
            },
        });

        console.log(`GET expenses - Successfully fetched ${expenses.length} expenses`);

        return NextResponse.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);

        let errorMessage = 'Failed to fetch expenses';
        let statusCode = 500;

        if (error instanceof Error) {
            errorMessage = error.message;

            // Add more specific error handling based on error types
            if (error.message.includes('database')) {
                errorMessage = 'Database connection error. Please check your database configuration';
            } else if (error.message.includes('permission')) {
                errorMessage = 'Database permission error';
                statusCode = 403;
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}

// POST a new expense
export async function POST(request: NextRequest) {
    try {
        // Get authenticated user
        console.log('POST expense - Fetching auth session...');
        const session = await auth();

        console.log('POST expense - Session received:',
            session ? `User: ${session.user?.email} (${session.user?.id})` : 'No session');

        if (!session?.user?.id) {
            console.log('POST expense - No authenticated user found');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log('POST expense - Request body:', JSON.stringify(body));

        // Validate the expense data
        const validatedData = expenseSchema.parse(body);

        // Create the expense in the database with the user ID
        console.log('POST expense - Creating expense for user:', session.user.id);
        const expense = await prisma.expense.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
        });

        console.log('POST expense - Successfully created expense:', expense.id);
        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        console.error('Error creating expense:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        let errorMessage = 'Failed to create expense';
        let statusCode = 500;

        if (error instanceof Error) {
            // Add more specific error handling
            if (error.message.includes('foreignkey')) {
                errorMessage = 'User not found in database. Try signing out and back in.';
            } else if (error.message.includes('database')) {
                errorMessage = 'Database connection error. Please check your configuration.';
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}