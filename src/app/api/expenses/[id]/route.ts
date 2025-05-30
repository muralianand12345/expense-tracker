import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@/auth/auth';

// Validation schema for updating expense
const updateExpenseSchema = z.object({
    amount: z.number().positive().optional(),
    description: z.string().min(1).optional(),
    date: z.string().transform(val => new Date(val)).optional(),
    category: z.string().min(1).optional(),
});

// GET a single expense by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get authenticated user
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const expense = await prisma.expense.findFirst({
            where: {
                id: params.id,
                userId: session.user.id
            },
        });

        if (!expense) {
            return NextResponse.json(
                { error: 'Expense not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(expense);
    } catch (error) {
        console.error('Error fetching expense:', error);
        return NextResponse.json(
            { error: 'Failed to fetch expense' },
            { status: 500 }
        );
    }
}

// PUT (update) an expense
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Validate the update data
        const validatedData = updateExpenseSchema.parse(body);

        // Check if expense exists and belongs to the user
        const existingExpense = await prisma.expense.findFirst({
            where: {
                id: params.id,
                userId: session.user.id
            },
        });

        if (!existingExpense) {
            return NextResponse.json(
                { error: 'Expense not found' },
                { status: 404 }
            );
        }

        // Update the expense
        const updatedExpense = await prisma.expense.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json(updatedExpense);
    } catch (error) {
        console.error('Error updating expense:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update expense' },
            { status: 500 }
        );
    }
}

// DELETE an expense
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get authenticated user
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if expense exists and belongs to the user
        const existingExpense = await prisma.expense.findFirst({
            where: {
                id: params.id,
                userId: session.user.id
            },
        });

        if (!existingExpense) {
            return NextResponse.json(
                { error: 'Expense not found' },
                { status: 404 }
            );
        }

        // Delete the expense
        await prisma.expense.delete({
            where: { id: params.id },
        });

        return NextResponse.json(
            { message: 'Expense deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting expense:', error);
        return NextResponse.json(
            { error: 'Failed to delete expense' },
            { status: 500 }
        );
    }
}