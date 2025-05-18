import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/Button';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types';
import { useCurrency } from '@/contexts/CurrencyContext';

// Define form validation schema
const expenseFormSchema = z.object({
    amount: z
        .number({
            required_error: 'Amount is required',
            invalid_type_error: 'Amount must be a number',
        })
        .positive('Amount must be positive'),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(100, 'Description is too long'),
    date: z
        .date({
            required_error: 'Date is required',
            invalid_type_error: 'Invalid date',
        }),
    category: z
        .enum(EXPENSE_CATEGORIES, {
            errorMap: () => ({ message: 'Please select a category' }),
        }),
});

// Infer the form data type from the schema
type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
    initialData?: Partial<Expense>;
    onSubmit: (data: ExpenseFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function ExpenseForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: ExpenseFormProps) {
    const { currency, currencySymbol } = useCurrency();

    // Initialize the form with react-hook-form
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
            category: (initialData?.category as ExpenseCategory) || undefined,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Field */}
            <div>
                <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{currencySymbol}</span>
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        id="amount"
                        {...register('amount', { valueAsNumber: true })}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3"
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

            {/* Description Field */}
            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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

            {/* Date Field */}
            <div>
                <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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

            {/* Category Field */}
            <div>
                <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Category
                </label>
                <div className="mt-1">
                    <select
                        id="category"
                        {...register('category')}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3"
                    >
                        <option value="">Select a category</option>
                        {EXPENSE_CATEGORIES.map((category) => (
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                >
                    {initialData?.id ? 'Update Expense' : 'Add Expense'}
                </Button>
            </div>
        </form>
    );
}