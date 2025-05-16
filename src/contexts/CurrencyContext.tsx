'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { debugLog } from '@/lib/debug';
import { useSession } from 'next-auth/react';

type CurrencyContextType = {
    currency: string;
    setCurrency: (currency: string) => Promise<void>;
    formatAmount: (amount: number) => string;
    isLoading: boolean;
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
    const [currency, setCurrencyState] = useState<string>('USD');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Use this effect to update the currency from the database directly
    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/user/currency');
                if (response.ok) {
                    const data = await response.json();
                    debugLog('Fetched currency from API:', data.currency);
                    setCurrencyState(data.currency || 'USD');
                }
            } catch (error) {
                console.error('Error fetching currency:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user) {
            fetchCurrency();
        }
    }, [session]);

    // Add this effect to handle updates from the session
    useEffect(() => {
        if (session?.user?.currency) {
            debugLog('Currency from session:', session.user.currency);
            setCurrencyState(session.user.currency);
        }
    }, [session?.user?.currency]);

    // Function to update the currency
    const setCurrency = async (newCurrency: string) => {
        debugLog('Setting currency to:', newCurrency);

        if (newCurrency === currency) {
            debugLog('Currency already set to:', newCurrency);
            return;
        }

        setIsLoading(true);

        try {
            // Update local state immediately for better UX
            setCurrencyState(newCurrency);

            // Update on the server
            const response = await fetch('/api/user/currency', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currency: newCurrency }),
            });

            if (!response.ok) {
                throw new Error('Failed to update currency');
            }

            const data = await response.json();
            debugLog('Currency updated successfully:', data);

            // Force a reload to ensure everything gets updated
            window.location.reload();
        } catch (error) {
            console.error('Error updating currency:', error);
            // Revert to the previous currency if there was an error
            setCurrencyState(currency);
            alert('Failed to update currency. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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

    debugLog('CurrencyContext current state:', { currency, isLoading });

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency,
            formatAmount,
            isLoading
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}