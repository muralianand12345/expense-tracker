import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenseStore } from '@/store/useExpenseStore';
import { generateChartColors } from '@/lib/utils/formatting';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getMonthName } from '@/lib/utils/formatting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CategoryBadge } from './CategoryBadge';

export function MonthlySummary() {
    const { summary, fetchSummary, isLoading } = useExpenseStore();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { formatAmount } = useCurrency();

    // Available months for the dropdown
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Available years for the dropdown (current year and 3 years back)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

    useEffect(() => {
        fetchSummary(selectedMonth, selectedYear);
    }, [fetchSummary, selectedMonth, selectedYear]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(e.target.value));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(e.target.value));
    };

    // Generate colors for the chart
    const COLORS = generateChartColors(summary?.categoryBreakdown?.length || 0);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Monthly Summary</CardTitle>
                <div className="flex space-x-2">
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100"
                    >
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {getMonthName(month - 1)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : !summary || summary.expenseCount === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No expenses found for this month.
                    </div>
                ) : (
                    <div>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Total Expenses</p>
                                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                    {formatAmount(summary.totalAmount)}
                                </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <p className="text-sm text-green-700 dark:text-green-300 mb-1">Number of Expenses</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{summary.expenseCount}</p>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                                <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">Average Expense</p>
                                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                    {formatAmount(summary.totalAmount / summary.expenseCount)}
                                </p>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Expenses by Category</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={summary.categoryBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {summary.categoryBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => formatAmount(value)}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Category Breakdown Table */}
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Category Breakdown</h3>
                            <div className="overflow-hidden ring-1 ring-black ring-opacity-5 dark:ring-gray-600 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                                            >
                                                Category
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-100"
                                            >
                                                Amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-100"
                                            >
                                                Percentage
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                                        {summary.categoryBreakdown.map((category, index) => (
                                            <tr key={category.name}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-3 h-3 rounded-full mr-2"
                                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                        ></div>
                                                        <CategoryBadge category={category.name} />
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 text-right">
                                                    {formatAmount(category.value)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 text-right">
                                                    {((category.value / summary.totalAmount) * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}