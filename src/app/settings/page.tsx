'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CURRENCIES } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';

export default function SettingsPage() {
    const { data: session } = useSession();
    const { currency, setCurrency, isLoading } = useCurrency();

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCurrencyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            const newCurrency = event.target.value;
            await setCurrency(newCurrency as any);

            setSuccessMessage('Currency updated successfully!');
            setErrorMessage('');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setErrorMessage('Failed to update currency. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    Account Settings
                </h1>

                <div className="space-y-6">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700 dark:text-green-200">
                                        {successMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 dark:text-red-200">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>
                                Your account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            value={session?.user?.name || ''}
                                            readOnly
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            value={session?.user?.email || ''}
                                            readOnly
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Currency Preferences Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Currency Preferences</CardTitle>
                            <CardDescription>
                                Change your preferred currency for displaying amounts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Default Currency
                                </label>
                                <div className="relative">
                                    {isLoading && (
                                        <div className="absolute right-10 top-3">
                                            <div className="w-4 h-4 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    <select
                                        value={currency}
                                        onChange={handleCurrencyChange}
                                        disabled={isLoading}
                                        className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 disabled:opacity-70"
                                        aria-label="Select currency"
                                    >
                                        {CURRENCIES.map((curr) => (
                                            <option key={curr.code} value={curr.code}>
                                                {curr.symbol} - {curr.code} ({curr.name})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    This currency will be used for displaying all expense amounts across the application.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}