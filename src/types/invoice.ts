import { Category } from './index';

/**
 * Interface representing raw data extracted from an invoice
 */
export interface InvoiceData {
    date: string;
    type: string;
    amount: number;
    currency: string;
    description: string;
}

/**
 * Interface representing a processed invoice with additional metadata
 */
export interface ProcessedInvoice extends InvoiceData {
    // Original currency information if conversion was performed
    originalAmount?: number;
    originalCurrency?: string;
    conversionRate?: number;
}

/**
 * Interface for the response from the invoice processing API
 */
export interface InvoiceApiResponse {
    date: string;
    type: Category;
    amount: number;
    currency: string;
    description: string;
    originalAmount?: number;
    originalCurrency?: string;
    conversionRate?: number;
    error?: string;
}