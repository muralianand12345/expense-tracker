'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CATEGORIES, Expense } from '@/types';

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        id="amount"
                        {...register('amount', { valueAsNumber: true })}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="0.00"
                    />
                </div>
                {errors.amount && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="description"
                        {...register('description')}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                </div>
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                dateFormat="MMMM d, yyyy"
                            />
                        )}
                    />
                </div>
                {errors.date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                </label>
                <div className="mt-1">
                    <select
                        id="category"
                        {...register('category')}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : initialData?.id ? 'Update' : 'Add Expense'}
                </button>
            </div>
        </form>
    );
}