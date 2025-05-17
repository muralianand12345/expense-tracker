import { Category, CATEGORIES } from '@/types';

/**
 * Maps the category from the invoice to the closest matching expense category
 */
export function mapInvoiceCategory(category: string): Category {
    // Normalize the category
    const normalized = category.trim().toUpperCase();

    // Check for exact match
    if (CATEGORIES.includes(normalized as Category)) {
        return normalized as Category;
    }

    // Map keywords to categories
    const categoryMappings: Record<string, string[]> = {
        'FOOD': ['GROCERY', 'RESTAURANT', 'CAFE', 'DINING', 'MEAL', 'LUNCH', 'DINNER', 'BREAKFAST', 'SNACK', 'DRINK'],
        'TRANSPORTATION': ['TAXI', 'UBER', 'LYFT', 'BUS', 'TRAIN', 'SUBWAY', 'METRO', 'GAS', 'FUEL', 'CAR', 'PARKING', 'TOLL', 'FLIGHT', 'AIRPLANE'],
        'HOUSING': ['RENT', 'MORTGAGE', 'LEASE', 'APARTMENT', 'HOUSE', 'HOME', 'PROPERTY'],
        'UTILITIES': ['ELECTRIC', 'ELECTRICITY', 'WATER', 'GAS', 'INTERNET', 'PHONE', 'MOBILE', 'CELL', 'UTILITY', 'BILL', 'CABLE', 'TV'],
        'ENTERTAINMENT': ['MOVIE', 'CONCERT', 'THEATRE', 'THEATER', 'SHOW', 'GAME', 'EVENT', 'STREAMING', 'NETFLIX', 'SPOTIFY', 'HULU', 'DISNEY'],
        'HEALTHCARE': ['DOCTOR', 'HOSPITAL', 'MEDICAL', 'MEDICINE', 'PHARMACY', 'DRUG', 'HEALTH', 'DENTAL', 'VISION', 'THERAPY'],
        'SHOPPING': ['CLOTHES', 'CLOTHING', 'SHOES', 'ACCESSORY', 'ACCESSORIES', 'RETAIL', 'STORE', 'MALL', 'ONLINE', 'AMAZON', 'DEPARTMENT', 'ELECTRONICS'],
        'EDUCATION': ['SCHOOL', 'COLLEGE', 'UNIVERSITY', 'COURSE', 'CLASS', 'TUITION', 'BOOK', 'TEXTBOOK', 'WORKSHOP', 'TRAINING'],
        'PERSONAL': ['SALON', 'HAIRCUT', 'BEAUTY', 'SPA', 'MASSAGE', 'GYM', 'FITNESS', 'GROOMING', 'HYGIENE', 'COSMETICS'],
    };

    // Check if any keyword in the invoice category matches our predefined keywords
    for (const [category, keywords] of Object.entries(categoryMappings)) {
        for (const keyword of keywords) {
            if (normalized.includes(keyword)) {
                return category as Category;
            }
        }
    }

    // If no match found, return 'OTHER'
    return 'OTHER';
}

/**
 * Validates and formats a date from an invoice
 */
export function formatInvoiceDate(date: string): string {
    try {
        // Try to parse the date
        const parsedDate = new Date(date);

        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
            // If invalid, return today's date
            return new Date().toISOString().split('T')[0];
        }

        // Return in YYYY-MM-DD format
        return parsedDate.toISOString().split('T')[0];
    } catch (error) {
        // If there's any error, return today's date
        return new Date().toISOString().split('T')[0];
    }
}

/**
 * Gets currency symbol from currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
    const currencySymbols: Record<string, string> = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'INR': '₹',
        'JPY': '¥',
        'CNY': '¥',
        'CAD': 'C$',
        'AUD': 'A$',
        'BRL': 'R$',
        'ZAR': 'R',
        'RUB': '₽',
        'NGN': '₦',
    };

    return currencySymbols[currencyCode] || currencyCode;
}

/**
 * Creates a readable summary of the invoice for user verification
 */
export function createInvoiceSummary(invoiceData: any): string {
    try {
        const { date, type, amount, currency, description } = invoiceData;
        const formattedDate = new Date(date).toLocaleDateString();
        const currencySymbol = getCurrencySymbol(currency);

        return `${formattedDate} | ${type} | ${currencySymbol}${amount} | ${description}`;
    } catch (error) {
        return 'Unable to create invoice summary';
    }
}