'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExpenseSummary } from '@/types';
import { useExpenseStore } from '@/store/useExpenseStore';
import { formatCurrency, generateChartColors, getMonthName } from '@/lib/utils';

export default function MonthlySummary() {
    const { summary, fetchSummary, isLoading } = useExpenseStore();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Monthly Summary</h2>
                <div className="flex space-x-2">
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : !summary || summary.expenseCount === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No expenses found for this month.
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <p className="text-sm text-indigo-700 mb-1">Total Expenses</p>
                            <p className="text-2xl font-bold text-indigo-900">
                                {formatCurrency(summary.totalAmount)}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-700 mb-1">Number of Expenses</p>
                            <p className="text-2xl font-bold text-green-900">{summary.expenseCount}</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg">
                            <p className="text-sm text-amber-700 mb-1">Average Expense</p>
                            <p className="text-2xl font-bold text-amber-900">
                                {formatCurrency(summary.totalAmount / summary.expenseCount)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h3>
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
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>
                        <div className="overflow-hidden ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                        >
                                            Category
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                                        >
                                            Percentage
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {summary.categoryBreakdown.map((category, index) => (
                                        <tr key={category.name}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                    ></div>
                                                    {category.name}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                                {formatCurrency(category.value)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
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
        </div>
    );
}