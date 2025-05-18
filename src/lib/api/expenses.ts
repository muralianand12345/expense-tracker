import { ApiResponse, Expense, ExpenseCreateInput, ExpenseFilters, ExpenseSummary, ExpenseUpdateInput } from '@/types';

/**
 * Fetches expenses with optional filters
 */
export async function fetchExpenses(filters?: ExpenseFilters): Promise<ApiResponse<Expense[]>> {
    try {
        const params = new URLSearchParams();

        if (filters?.category) params.append('category', filters.category);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);

        const url = `/api/expenses${params.toString() ? `?${params.toString()}` : ''}`;

        const response = await fetch(url, { credentials: 'include' });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Failed to fetch expenses' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error fetching expenses'
        };
    }
}

/**
 * Fetches a single expense by ID
 */
export async function fetchExpenseById(id: string): Promise<ApiResponse<Expense>> {
    try {
        const response = await fetch(`/api/expenses/${id}`, { credentials: 'include' });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Failed to fetch expense' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching expense:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error fetching expense'
        };
    }
}

/**
 * Creates a new expense
 */
export async function createExpense(expense: ExpenseCreateInput): Promise<ApiResponse<Expense>> {
    try {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Failed to create expense' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error creating expense:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error creating expense'
        };
    }
}

/**
 * Updates an existing expense
 */
export async function updateExpense(id: string, expense: ExpenseUpdateInput): Promise<ApiResponse<Expense>> {
    try {
        const response = await fetch(`/api/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Failed to update expense' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error updating expense:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error updating expense'
        };
    }
}

/**
 * Deletes an expense
 */
export async function deleteExpense(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
        const response = await fetch(`/api/expenses/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Failed to delete expense' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error deleting expense:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error deleting expense'
        };
    }
}

/**
 * Fetches expense summary for a given month and year
 */
export async function fetchExpenseSummary(month?: number, year?: number): Promise<ApiResponse<ExpenseSummary>> {
    try {
        const params = new URLSearchParams();

        if (month !== undefined) params.append('month', month.toString());
        if (year !== undefined) params.append('year', year.toString());

        const url = `/api/expenses/summary${params.toString() ? `?${params.toString()}` : ''}`;

        const response = await fetch(url, { credentials: 'include' });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Failed to fetch expense summary' };
        }

        const data = await response.json();

        // Calculate average if not provided by the API
        if (!data.averageAmount && data.expenseCount > 0) {
            data.averageAmount = data.totalAmount / data.expenseCount;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching expense summary:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error fetching expense summary'
        };
    }
}