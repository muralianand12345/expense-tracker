// src/store/useExpenseStore.ts - Updated with better error handling and debugging

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

            console.log('Fetching expenses from:', url);

            const response = await fetch(url, {
                credentials: 'include' // Important: Include credentials
            });

            console.log('Expense fetch response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching expenses:', errorData);
                throw new Error(errorData.error || 'Failed to fetch expenses');
            }

            const data = await response.json();
            console.log(`Fetched ${data.length} expenses successfully`);
            set({ expenses: data, isLoading: false });
        } catch (error) {
            console.error('Error in fetchExpenses:', error);
            set({
                error: error instanceof Error ? error.message : 'Unknown error fetching expenses',
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

            console.log('Fetching summary from:', url);

            const response = await fetch(url, {
                credentials: 'include'
            });

            console.log('Summary fetch response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching summary:', errorData);
                throw new Error(errorData.error || 'Failed to fetch summary');
            }

            const data = await response.json();
            console.log('Summary fetched successfully:', data);
            set({ summary: data, isLoading: false });
        } catch (error) {
            console.error('Error in fetchSummary:', error);
            set({
                error: error instanceof Error ? error.message : 'Unknown error fetching summary',
                isLoading: false
            });
        }
    },

    // Add a new expense
    addExpense: async (expense) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Adding expense:', expense);

            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
                credentials: 'include'
            });

            console.log('Add expense response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error adding expense:', errorData);
                throw new Error(errorData.error || 'Failed to add expense');
            }

            // Refetch expenses to update the list
            await get().fetchExpenses();
            set({ isLoading: false });
        } catch (error) {
            console.error('Error in addExpense:', error);
            set({
                error: error instanceof Error ? error.message : 'Unknown error adding expense',
                isLoading: false
            });
        }
    },

    // Update an existing expense
    updateExpense: async (id, expense) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Updating expense:', id, expense);

            const response = await fetch(`/api/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
                credentials: 'include'
            });

            console.log('Update expense response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating expense:', errorData);
                throw new Error(errorData.error || 'Failed to update expense');
            }

            // Refetch expenses to update the list
            await get().fetchExpenses();
            set({ isLoading: false });
        } catch (error) {
            console.error('Error in updateExpense:', error);
            set({
                error: error instanceof Error ? error.message : 'Unknown error updating expense',
                isLoading: false
            });
        }
    },

    // Delete an expense
    deleteExpense: async (id) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Deleting expense:', id);

            const response = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            console.log('Delete expense response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error deleting expense:', errorData);
                throw new Error(errorData.error || 'Failed to delete expense');
            }

            // Update the local state by removing the deleted expense
            set(state => ({
                expenses: state.expenses.filter(expense => expense.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error in deleteExpense:', error);
            set({
                error: error instanceof Error ? error.message : 'Unknown error deleting expense',
                isLoading: false
            });
        }
    },
}));