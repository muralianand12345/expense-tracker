import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
        const { searchParams } = new URL(request.url);

        // Filter by category if provided
        const category = searchParams.get('category');

        // Filter by date range if provided
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let whereClause: any = {};

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
        const body = await request.json();

        // Validate the expense data
        const validatedData = expenseSchema.parse(body);

        // Create the expense in the database
        const expense = await prisma.expense.create({
            data: validatedData,
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