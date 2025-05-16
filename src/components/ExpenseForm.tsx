'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CATEGORIES, Expense } from '@/types';
import { useCurrency } from '@/contexts/CurrencyContext';
import { debugLog } from '@/lib/debug';

// Validation schema
const expenseFormSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required'),
    date: z.date({ required_error: 'Date is required' }),
    category: z.string().min(1, 'Category is required'),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
    initialData?: Partial<Expense>;
    onSubmit: (data: ExpenseFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export default function ExpenseForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting
}: ExpenseFormProps) {
    const { currency, formatAmount } = useCurrency();

    // Get currency symbol
    const getCurrencySymbol = () => {
        const currencyFormats: Record<string, string> = {
            USD: '$', EUR: '€', GBP: '£', INR: '₹',
            JPY: '¥', CNY: '¥', CAD: 'C$', AUD: 'A$'
        };
        return currencyFormats[currency] || '$';
    };

    useEffect(() => {
        debugLog('ExpenseForm - Rendering with currency:', currency);
    }, [currency]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            amount: initialData?.amount || 0,
            description: initialData?.description || '',
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            category: initialData?.category || '',
        },
    });

    // Force re-render when currency changes
    const [key, setKey] = useState(0);
    useEffect(() => {
        setKey(prev => prev + 1);
    }, [currency]);

    return (
        <form key={key} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{getCurrencySymbol()}</span>
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        id="amount"
                        {...register('amount', { valueAsNumber: true })}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-20 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3"
                        placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{currency}</span>
                    </div>
                </div>
                {errors.amount && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="description"
                        {...register('description')}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3"
                        placeholder="What did you spend on?"
                    />
                </div>
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                </label>
                <div className="mt-1">
                    <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                            <DatePicker
                                selected={field.value}
                                onChange={(date: Date) => field.onChange(date)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3"
                                dateFormat="MMMM d, yyyy"
                                placeholderText="Select a date"
                            />
                        )}
                    />
                </div>
                {errors.date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                </label>
                <div className="mt-1">
                    <select
                        id="category"
                        {...register('category')}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3"
                    >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category.charAt(0) + category.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.category && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </div>
                    ) : (
                        initialData?.id ? 'Update Expense' : 'Add Expense'
                    )}
                </button>
            </div>
        </form>
    );
}