import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth/auth';
import { ExpenseCategory } from '@/types';

/**
 * GET handler for fetching expense summaries
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
        const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);

        // Group expenses by category
        const categoryBreakdown: { [key in ExpenseCategory]?: number } = {};

        expenses.forEach((expense) => {
            const { category, amount } = expense;
            categoryBreakdown[category as ExpenseCategory] = (categoryBreakdown[category as ExpenseCategory] || 0) + amount;
        });

        // Format category breakdown for chart
        const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
            name,
            value,
        }));

        // Calculate percentages
        const withPercentages = categoryData.map(item => ({
            ...item,
            percentage: totalAmount > 0 ? (item.value / totalAmount) * 100 : 0,
        }));

        // Sort by value (highest first)
        withPercentages.sort((a, b) => b.value - a.value);

        return NextResponse.json({
            totalAmount,
            categoryBreakdown: withPercentages,
            expenseCount: expenses.length,
            averageAmount: expenses.length > 0 ? totalAmount / expenses.length : 0,
        });
    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
        );
    }
}