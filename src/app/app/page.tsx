'use client';

import { useState, useEffect } from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Expense } from '@/types';
import ExpenseTable from '@/components/ExpenseTable';
import ExpenseModal from '@/components/ExpenseModal';
import ExpenseFilter from '@/components/ExpenseFilter';
import MonthlySummary from '@/components/MonthlySummary';
import { downloadCSV } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function Dashboard() {
    const {
        expenses,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        isLoading,
        error
    } = useExpenseStore();

    const { formatAmount } = useCurrency();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
    const [activeTab, setActiveTab] = useState<'list' | 'summary'>('list');

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // Handle adding a new expense
    const handleAddExpense = async (data: any) => {
        await addExpense(data);
        setIsAddModalOpen(false);
    };

    // Handle editing an expense
    const handleEditExpense = async (data: any) => {
        if (currentExpense) {
            await updateExpense(currentExpense.id, data);
            setIsEditModalOpen(false);
            setCurrentExpense(null);
        }
    };

    // Handle deleting an expense
    const handleDeleteExpense = async (id: string) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            await deleteExpense(id);
        }
    };

    // Handle opening the edit modal
    const handleEditClick = (expense: Expense) => {
        setCurrentExpense(expense);
        setIsEditModalOpen(true);
    };

    // Handle filtering expenses
    const handleFilter = (category: string, startDate: string | null, endDate: string | null) => {
        fetchExpenses(
            category,
            startDate === null ? undefined : startDate,
            endDate === null ? undefined : endDate
        );
    };

    // Handle clearing filters
    const handleClearFilter = () => {
        fetchExpenses();
    };

    // Handle exporting expenses as CSV
    const handleExportCSV = () => {
        if (expenses.length === 0) {
            alert('No expenses to export');
            return;
        }

        // Format expenses for CSV export
        const formattedExpenses = expenses.map(expense => ({
            Date: new Date(expense.date).toLocaleDateString(),
            Description: expense.description,
            Category: expense.category,
            Amount: expense.amount,
        }));

        downloadCSV(formattedExpenses, 'expenses.csv');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personal Expense Tracker</h1>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                    >
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Expense
                    </button>
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'list'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            Expense List
                        </button>
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'summary'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            Monthly Summary
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === 'list' ? (
                <>
                    <ExpenseFilter onFilter={handleFilter} onClearFilter={handleClearFilter} />

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <ExpenseTable
                                expenses={expenses}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteExpense}
                            />
                        </div>
                    )}
                </>
            ) : (
                <MonthlySummary />
            )}

            {/* Add Expense Modal */}
            <ExpenseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddExpense}
                isSubmitting={isLoading}
                title="Add New Expense"
            />

            {/* Edit Expense Modal */}
            <ExpenseModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setCurrentExpense(null);
                }}
                expense={currentExpense || undefined}
                onSubmit={handleEditExpense}
                isSubmitting={isLoading}
                title="Edit Expense"
            />
        </div>
    );
}