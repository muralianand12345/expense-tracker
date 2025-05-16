'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

type CurrencyContextType = {
    currency: string;
    setCurrency: (currency: string) => void;
    formatAmount: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Currency symbols and formatting
const currencyFormats: Record<string, { symbol: string, position: 'before' | 'after', space: boolean }> = {
    USD: { symbol: '$', position: 'before', space: false },
    EUR: { symbol: '€', position: 'after', space: true },
    GBP: { symbol: '£', position: 'before', space: false },
    INR: { symbol: '₹', position: 'before', space: false },
    JPY: { symbol: '¥', position: 'before', space: false },
    CNY: { symbol: '¥', position: 'before', space: false },
    CAD: { symbol: 'C$', position: 'before', space: false },
    AUD: { symbol: 'A$', position: 'before', space: false },
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [currency, setCurrency] = useState<string>(session?.user?.currency || 'USD');

    useEffect(() => {
        if (session?.user?.currency) {
            setCurrency(session.user.currency);
        }
    }, [session]);

    // Function to format an amount according to the selected currency
    const formatAmount = (amount: number): string => {
        const format = currencyFormats[currency] || currencyFormats.USD;
        const formattedNumber = amount.toFixed(2);

        if (format.position === 'before') {
            return `${format.symbol}${format.space ? ' ' : ''}${formattedNumber}`;
        } else {
            return `${formattedNumber}${format.space ? ' ' : ''}${format.symbol}`;
        }
    };

    const value = {
        currency,
        setCurrency,
        formatAmount,
    };

    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}