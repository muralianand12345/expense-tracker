import { create } from 'zustand';
import { Expense, ExpenseSummary } from '@/types';

interface ExpenseState {
    expenses: Expense[];
    summary: ExpenseSummary | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchExpenses: (category?: string, startDate?: string, endDate?: string) => Promise<void>;
    fetchSummary: (month?: number, year?: number) => Promise<void>;
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
    expenses: [],
    summary: null,
    isLoading: false,
    error: null,

    // Fetch all expenses with optional filters
    fetchExpenses: async (category, startDate, endDate) => {
        set({ isLoading: true, error: null });
        try {
            let url = '/api/expenses';
            const params = new URLSearchParams();

            if (category) params.append('category', category);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }

            const data = await response.json();
            set({ expenses: data, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false
            });
        }
    },

    // Fetch monthly summary
    fetchSummary: async (month, year) => {
        set({ isLoading: true, error: null });
        try {
            let url = '/api/expenses/summary';
            const params = new URLSearchParams();

            if (month) params.append('month', month.toString());
            if (year) params.append('year', year.toString());

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch summary');
            }

            const data = await response.json();
            set({ summary: data, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false
            });
        }
    },

    // Add a new expense
    addExpense: async (expense) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add expense');
            }

            // Refetch expenses to update the list
            await get().fetchExpenses();
            set({ isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false
            });
        }
    },

    // Update an existing expense
    updateExpense: async (id, expense) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update expense');
            }

            // Refetch expenses to update the list
            await get().fetchExpenses();
            set({ isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false
            });
        }
    },

    // Delete an expense
    deleteExpense: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete expense');
            }

            // Update the local state by removing the deleted expense
            set(state => ({
                expenses: state.expenses.filter(expense => expense.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false
            });
        }
    },
}));