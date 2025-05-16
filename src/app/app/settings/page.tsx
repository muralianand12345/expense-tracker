'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import CurrencySelector from '@/components/CurrencySelector';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function SettingsPage() {
    const { data: session } = useSession();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { setCurrency } = useCurrency();

    const handleCurrencyChange = (currency: string) => {
        setCurrency(currency);
        setSuccessMessage('Currency updated successfully!');

        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Account Settings
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        Manage your account preferences
                    </p>
                </div>

                {successMessage && (
                    <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 p-4 mb-4 mx-6 mt-4">
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

                {errorMessage && (
                    <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4 mb-4 mx-6 mt-4">
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

                <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-md leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                        User Information
                    </h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <div className="relative flex items-stretch flex-grow">
                                    <input
                                        type="text"
                                        value={session?.user?.name || ''}
                                        readOnly
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <div className="relative flex items-stretch flex-grow">
                                    <input
                                        type="email"
                                        value={session?.user?.email || ''}
                                        readOnly
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-md leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Currency Preferences
                    </h4>
                    <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Default Currency
                        </label>
                        <CurrencySelector onCurrencyChange={handleCurrencyChange} />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            This currency will be used for displaying all expense amounts across the application.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}