'use client';

import { useState, useRef } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useExpenseStore } from '@/store/useExpenseStore';
import { ProcessedInvoice } from '@/types/invoice';
import { getCurrencySymbol, mapInvoiceCategory, formatInvoiceDate } from '@/lib/invoice-utils';

export default function InvoiceUploader() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [invoiceData, setInvoiceData] = useState<ProcessedInvoice | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { currency, formatAmount } = useCurrency();
    const { addExpense } = useExpenseStore();

    const resetState = () => {
        setInvoiceData(null);
        setPreviewImage(null);
        setError(null);
        setSuccessMessage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = event.target.files;
            if (!files || files.length === 0) return;

            resetState();
            const file = files[0];

            // Debug file information
            console.log("File info:", {
                name: file?.name || 'unknown',
                type: file?.type || 'unknown',
                size: (file?.size || 0) + ' bytes'
            });

            // Ensure the file exists
            if (!file) {
                setError('No file selected');
                return;
            }

            // Skip all checks and assume it's a valid image
            // Create a preview of the image
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setPreviewImage(e.target.result as string);
                    }
                };
                reader.readAsDataURL(file);
            }

            setIsUploading(true);
            setUploadProgress(10);
            setError(null);

            // Create a FormData object to send the file
            const formData = new FormData();
            formData.append('invoice', file, file.name || 'invoice.png');
            formData.append('targetCurrency', currency);

            setUploadProgress(30);

            // Send the file to the API endpoint
            const response = await fetch('/api/invoices/process', {
                method: 'POST',
                body: formData,
            });

            setUploadProgress(70);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to process invoice');
            }

            const responseData = await response.json();

            setUploadProgress(100);

            // Extract and map data
            const processed: ProcessedInvoice = {
                date: formatInvoiceDate(responseData.date),
                type: mapInvoiceCategory(responseData.type),
                amount: responseData.amount,
                currency: responseData.currency,
                description: responseData.description,
                // Store original values if conversion happened
                originalAmount: responseData.originalAmount,
                originalCurrency: responseData.originalCurrency,
                conversionRate: responseData.conversionRate
            };

            // Set the invoice data for preview
            setInvoiceData(processed);
            setIsUploading(false);
        } catch (err) {
            console.error('Error processing invoice:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleConfirmExpense = async () => {
        if (!invoiceData) return;

        setIsUploading(true);
        setUploadProgress(50);

        try {
            // Add the extracted expense to the store
            await addExpense({
                amount: invoiceData.amount,
                description: invoiceData.description,
                date: invoiceData.date,
                category: invoiceData.type,
            });

            setUploadProgress(100);
            setSuccessMessage('Expense added successfully!');

            // Reset after success
            setTimeout(() => {
                resetState();
                setIsUploading(false);
                setUploadProgress(0);
                setSuccessMessage(null);
            }, 2000);
        } catch (err) {
            console.error('Error adding expense:', err);
            setError(err instanceof Error ? err.message : 'Failed to add expense');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleCancel = () => {
        resetState();
    };

    return (
        <div className="mb-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Invoice Scanner
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Supported formats: JPG, PNG
                </div>
            </div>

            {/* Success message */}
            {successMessage && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/30 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side - Upload UI */}
                <div>
                    {!invoiceData ? (
                        <div className="mt-1">
                            <label
                                htmlFor="invoice-upload"
                                className={`flex justify-center w-full h-64 px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 ${isUploading ? 'bg-gray-100 dark:bg-gray-700 border-indigo-300 dark:border-indigo-600' : 'border-dashed'
                                    } rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800`}
                            >
                                <div className="space-y-1 text-center flex flex-col items-center justify-center">
                                    {isUploading ? (
                                        <div className="w-full">
                                            <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Processing invoice... {uploadProgress}%
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                <div
                                                    className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <span className="relative rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                    Upload an invoice image
                                                </span>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                We'll automatically extract the information
                                            </p>
                                        </>
                                    )}
                                </div>
                            </label>
                            <input
                                id="invoice-upload"
                                name="invoice-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="sr-only"
                                ref={fileInputRef}
                            />
                        </div>
                    ) : (
                        <div className="mt-1">
                            {/* Image preview */}
                            <div className="mb-4 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Invoice Preview"
                                        className="w-full h-64 object-contain bg-white"
                                    />
                                )}
                            </div>

                            <div className="flex justify-between space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Upload Different Image
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Upload an invoice image to automatically add the expense to your tracker.
                        The system will extract the date, amount, category, and description.
                    </p>
                </div>

                {/* Right side - Extracted data */}
                {invoiceData && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Extracted Information
                        </h4>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                            <dl className="grid grid-cols-1 gap-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date:</dt>
                                    <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">
                                        {new Date(invoiceData.date).toLocaleDateString()}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category:</dt>
                                    <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {invoiceData.type}
                                        </span>
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount:</dt>
                                    <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2 font-bold">
                                        {formatAmount(invoiceData.amount)}

                                        {/* Show original amount if currency conversion happened */}
                                        {invoiceData.originalAmount && invoiceData.originalCurrency && invoiceData.originalCurrency !== currency && (
                                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                (Original: {getCurrencySymbol(invoiceData.originalCurrency)}{invoiceData.originalAmount})
                                            </span>
                                        )}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description:</dt>
                                    <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">
                                        {invoiceData.description}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                Review the extracted information and click "Add Expense" to add it to your tracker.
                                You can edit any fields after adding if necessary.
                            </p>

                            <button
                                type="button"
                                onClick={handleConfirmExpense}
                                disabled={isUploading}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : 'Add Expense'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}