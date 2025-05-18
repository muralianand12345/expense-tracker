import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode, CURRENCIES } from '@/types';
import { formatCurrency } from '@/lib/utils/formatting';
import { useSession } from 'next-auth/react';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => Promise<void>;
    formatAmount: (amount: number) => string;
    isLoading: boolean;
    currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
    children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
    const { data: session } = useSession();
    const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Get current currency symbol
    const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

    // Fetch user's currency preference from the API
    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/user/currency');

                if (response.ok) {
                    const data = await response.json();
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

    // Update currency when session changes
    useEffect(() => {
        if (session?.user?.currency) {
            setCurrencyState(session.user.currency as CurrencyCode);
        }
    }, [session?.user?.currency]);

    // Function to update currency preference
    const setCurrency = async (newCurrency: CurrencyCode): Promise<void> => {
        if (newCurrency === currency) {
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

            // Optional: Force a reload to ensure everything gets updated with new currency
            // window.location.reload();
        } catch (error) {
            console.error('Error updating currency:', error);
            // Revert to the previous currency if there was an error
            setCurrencyState(currency);
            alert('Failed to update currency. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Format an amount according to the selected currency
    const formatAmount = (amount: number): string => {
        return formatCurrency(amount, currency);
    };

    const value = {
        currency,
        setCurrency,
        formatAmount,
        isLoading,
        currencySymbol
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

// Custom hook to use the currency context
export function useCurrency() {
    const context = useContext(CurrencyContext);

    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }

    return context;
}