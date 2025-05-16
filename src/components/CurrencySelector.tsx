'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CurrencySelectorProps {
    onCurrencyChange: (currency: string) => void;
}

// Common currencies
const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export default function CurrencySelector({ onCurrencyChange }: CurrencySelectorProps) {
    const { data: session } = useSession();
    const [selectedCurrency, setSelectedCurrency] = useState(session?.user?.currency || 'USD');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.currency) {
            setSelectedCurrency(session.user.currency);
        }
    }, [session]);

    const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const currency = e.target.value;
        setSelectedCurrency(currency);
        setIsLoading(true);

        try {
            const response = await fetch('/api/user/currency', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currency }),
            });

            if (!response.ok) {
                throw new Error('Failed to update currency');
            }

            // Call the parent component's handler
            onCurrencyChange(currency);
        } catch (error) {
            console.error('Error updating currency:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute right-10 top-3">
                    <div className="w-4 h-4 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                </div>
            )}
            <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                aria-label="Select currency"
            >
                {CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                        {currency.symbol} - {currency.code} ({currency.name})
                    </option>
                ))}
            </select>
        </div>
    );
}