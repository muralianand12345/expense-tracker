export interface Expense {
    id: string;
    amount: number;
    description: string;
    date: Date | string;
    category: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ExpenseSummary {
    totalAmount: number;
    categoryBreakdown: {
        name: string;
        value: number;
    }[];
    expenseCount: number;
}

export const CATEGORIES = [
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

export type Category = typeof CATEGORIES[number];