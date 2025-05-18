// Expense Categories
export const EXPENSE_CATEGORIES = [
    'FOOD',
    'TRANSPORTATION',
    'HOUSING',
    'UTILITIES',
    'ENTERTAINMENT',
    'HEALTHCARE',
    'SHOPPING',
    'EDUCATION',
    'PERSONAL',
    'OTHER',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// Basic expense type
export interface Expense {
    id: string;
    amount: number;
    description: string;
    date: string; // ISO date string
    category: ExpenseCategory;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

// Type for creating a new expense
export type ExpenseCreateInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

// Type for updating an expense
export type ExpenseUpdateInput = Partial<ExpenseCreateInput>;

// Summary data for expense visualization
export interface ExpenseSummary {
    totalAmount: number;
    categoryBreakdown: CategoryBreakdown[];
    expenseCount: number;
    averageAmount?: number;
}

export interface CategoryBreakdown {
    name: ExpenseCategory;
    value: number;
    percentage?: number;
}

// Filter parameters for expenses
export interface ExpenseFilters {
    category?: ExpenseCategory;
    startDate?: string;
    endDate?: string;
}

// Currency type
export const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]['code'];

// User settings
export interface UserSettings {
    id: string;
    currency: CurrencyCode;
    theme?: 'light' | 'dark' | 'system';
}

// API Response types
export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };