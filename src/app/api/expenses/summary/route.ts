import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth/auth';

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

        // Get month and year from query params or default to current month
        const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
        const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

        // Calculate start and end date of the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of the month

        // Get all expenses for the month for this user
        const expenses = await prisma.expense.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        // Calculate total amount spent
        const totalAmount: number = expenses.reduce((acc: number, expense: any): number => acc + expense.amount, 0);

        // Group expenses by category
        const categoryBreakdown: Record<string, number> = {};

        expenses.forEach((expense: any) => {
            const { category, amount } = expense;
            categoryBreakdown[category] = (categoryBreakdown[category] || 0) + amount;
        });

        // Format category breakdown for chart
        const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
            name,
            value,
        }));

        return NextResponse.json({
            totalAmount,
            categoryBreakdown: categoryData,
            expenseCount: expenses.length,
        });
    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
        );
    }
}