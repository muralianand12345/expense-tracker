import { create } from 'zustand';
import { Expense, ExpenseCreateInput, ExpenseFilters, ExpenseSummary, ExpenseUpdateInput } from '@/types';
import * as expenseApi from '@/lib/api/expenses';

interface ExpenseState {
    // Data
    expenses: Expense[];
    summary: ExpenseSummary | null;

    // UI States
    isLoading: boolean;
    error: string | null;
    activeExpenseId: string | null;

    // Actions
    fetchExpenses: (filters?: ExpenseFilters) => Promise<void>;
    fetchSummary: (month?: number, year?: number) => Promise<void>;
    addExpense: (expense: ExpenseCreateInput) => Promise<boolean>;
    updateExpense: (id: string, expense: ExpenseUpdateInput) => Promise<boolean>;
    deleteExpense: (id: string) => Promise<boolean>;
    setActiveExpense: (id: string | null) => void;
    clearError: () => void;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
    // Initial state
    expenses: [],
    summary: null,
    isLoading: false,
    error: null,
    activeExpenseId: null,

    // Set active expense for editing or viewing details
    setActiveExpense: (id) => set({ activeExpenseId: id }),

    // Clear error message
    clearError: () => set({ error: null }),

    // Fetch expenses with optional filters
    fetchExpenses: async (filters) => {
        set({ isLoading: true, error: null });

        const response = await expenseApi.fetchExpenses(filters);

        if (response.success) {
            set({ expenses: response.data, isLoading: false });
            return;
        }

        set({ error: response.error, isLoading: false });
    },

    // Fetch monthly summary
    fetchSummary: async (month, year) => {
        set({ isLoading: true, error: null });

        const response = await expenseApi.fetchExpenseSummary(month, year);

        if (response.success) {
            set({ summary: response.data, isLoading: false });
            return;
        }

        set({ error: response.error, isLoading: false });
    },

    // Add new expense
    addExpense: async (expense) => {
        set({ isLoading: true, error: null });

        const response = await expenseApi.createExpense(expense);

        if (response.success) {
            // Refetch expenses to get the updated list with the new expense
            await get().fetchExpenses();
            set({ isLoading: false });
            return true;
        }

        set({ error: response.error, isLoading: false });
        return false;
    },

    // Update existing expense
    updateExpense: async (id, expense) => {
        set({ isLoading: true, error: null });

        const response = await expenseApi.updateExpense(id, expense);

        if (response.success) {
            // Update the expense in the local state
            set(state => ({
                expenses: state.expenses.map(e =>
                    e.id === id ? { ...e, ...expense } : e
                ),
                isLoading: false
            }));
            return true;
        }

        set({ error: response.error, isLoading: false });
        return false;
    },

    // Delete expense
    deleteExpense: async (id) => {
        set({ isLoading: true, error: null });

        const response = await expenseApi.deleteExpense(id);

        if (response.success) {
            // Remove the expense from the local state
            set(state => ({
                expenses: state.expenses.filter(expense => expense.id !== id),
                isLoading: false
            }));
            return true;
        }

        set({ error: response.error, isLoading: false });
        return false;
    }
}));