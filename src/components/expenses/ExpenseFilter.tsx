import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface FilterFormData {
    category: ExpenseCategory | '';
    startDate: Date | null;
    endDate: Date | null;
}

interface ExpenseFilterProps {
    onFilter: (category: string, startDate: string | null, endDate: string | null) => void;
    onClearFilter: () => void;
}

export function ExpenseFilter({ onFilter, onClearFilter }: ExpenseFilterProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { register, handleSubmit, control, reset } = useForm<FilterFormData>({
        defaultValues: {
            category: '',
            startDate: null,
            endDate: null,
        },
    });

    const onSubmit = (data: FilterFormData) => {
        onFilter(
            data.category,
            data.startDate ? data.startDate.toISOString() : null,
            data.endDate ? data.endDate.toISOString() : null
        );
    };

    const handleClear = () => {
        reset({
            category: '',
            startDate: null,
            endDate: null,
        });
        onClearFilter();
    };

    return (
        <Card className="mb-6">
            <CardHeader
                className="cursor-pointer flex flex-row justify-between items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <CardTitle>Filter Expenses</CardTitle>
                <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                    {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </CardHeader>

            {isExpanded && (
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    {...register('category')}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"
                                >
                                    <option value="">All Categories</option>
                                    {EXPENSE_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category.charAt(0) + category.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Date Filter */}
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Start Date
                                </label>
                                <Controller
                                    control={control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            selectsStart
                                            startDate={field.value}
                                            endDate={control._formValues.endDate}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"
                                            placeholderText="Select start date"
                                            isClearable
                                        />
                                    )}
                                />
                            </div>

                            {/* End Date Filter */}
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    End Date
                                </label>
                                <Controller
                                    control={control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            selectsEnd
                                            startDate={control._formValues.startDate}
                                            endDate={field.value}
                                            minDate={control._formValues.startDate}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"
                                            placeholderText="Select end date"
                                            isClearable
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClear}
                            >
                                Clear Filters
                            </Button>
                            <Button
                                type="submit"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </form>
                </CardContent>
            )}
        </Card>
    );
}