'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { debugLog } from '@/lib/debug';

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
    const { currency, isLoading } = useCurrency();

    debugLog('CurrencySelector rendering with currency:', currency);

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value;
        debugLog('Currency selected by user:', newCurrency);
        onCurrencyChange(newCurrency);
    };

    return (
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
    );
}