import { CurrencyCode, CURRENCIES } from '@/types';

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return dateObj.toLocaleDateString('en-US', options || defaultOptions);
}

/**
 * Get month name from month number (0-11)
 */
export function getMonthName(month: number): string {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString('en-US', { month: 'long' });
}

/**
 * Get a currency format object
 */
export function getCurrencyFormat(currencyCode: CurrencyCode): {
    symbol: string;
    position: 'before' | 'after';
    space: boolean;
} {
    const currency = CURRENCIES.find(c => c.code === currencyCode);

    // Default formatting rules
    const defaultFormat = {
        symbol: currency?.symbol || '$',
        position: 'before' as const,
        space: false
    };

    // Custom rules for specific currencies
    const currencyFormats: Record<string, typeof defaultFormat> = {
        USD: { symbol: '$', position: 'before', space: false },
        EUR: { symbol: '€', position: 'after', space: true },
        GBP: { symbol: '£', position: 'before', space: false },
        INR: { symbol: '₹', position: 'before', space: false },
        JPY: { symbol: '¥', position: 'before', space: false },
        CNY: { symbol: '¥', position: 'before', space: false },
        CAD: { symbol: 'C$', position: 'before', space: false },
        AUD: { symbol: 'A$', position: 'before', space: false },
    };

    return currencyFormats[currencyCode] || defaultFormat;
}

/**
 * Format a number as currency with the given currency code
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode): string {
    const format = getCurrencyFormat(currencyCode);

    // Format the number with 2 decimal places
    const formattedNumber = amount.toFixed(2);

    if (format.position === 'before') {
        return `${format.symbol}${format.space ? ' ' : ''}${formattedNumber}`;
    } else {
        return `${formattedNumber}${format.space ? ' ' : ''}${format.symbol}`;
    }
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
    return `${value.toFixed(decimalPlaces)}%`;
}

/**
 * Generate a color palette for charts
 */
export function generateChartColors(count: number): string[] {
    const baseColors = [
        '#3B82F6', // blue-500
        '#10B981', // emerald-500
        '#F59E0B', // amber-500
        '#EF4444', // red-500
        '#8B5CF6', // violet-500
        '#EC4899', // pink-500
        '#6366F1', // indigo-500
        '#14B8A6', // teal-500
        '#F97316', // orange-500
        '#84CC16', // lime-500
    ];

    // If we need more colors than are predefined, generate them
    if (count > baseColors.length) {
        // Add more colors by slightly altering the hue of existing colors
        const extraColors = [];
        for (let i = 0; i < count - baseColors.length; i++) {
            const baseColor = baseColors[i % baseColors.length];
            const r = parseInt(baseColor.slice(1, 3), 16);
            const g = parseInt(baseColor.slice(3, 5), 16);
            const b = parseInt(baseColor.slice(5, 7), 16);

            // Adjust colors slightly to create variation
            const newR = Math.min(255, Math.max(0, r + Math.floor(Math.random() * 40) - 20));
            const newG = Math.min(255, Math.max(0, g + Math.floor(Math.random() * 40) - 20));
            const newB = Math.min(255, Math.max(0, b + Math.floor(Math.random() * 40) - 20));

            // Convert back to hex
            const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
            extraColors.push(newColor);
        }

        return [...baseColors, ...extraColors];
    }

    return baseColors.slice(0, count);
}