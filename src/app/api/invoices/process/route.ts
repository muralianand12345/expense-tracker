// src/app/api/invoices/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth/auth';
import { createWorker } from 'tesseract.js';
import { z } from 'zod';
import { zodTextFormat } from "openai/helpers/zod";
import OpenAI from "openai";
import { Convert } from "easy-currencies";
import { CATEGORIES } from '@/types';
import { getFileExtension, isImageFile } from '@/lib/file-utils';

// Define the schema for the invoice data
const InvoiceEvent = z.object({
    date: z.string().describe("Invoice Date in YYYY-MM-DD format"),
    type: z
        .string()
        .describe(
            "Type of invoice (FOOD, TRANSPORTATION, HOUSING, UTILITIES, ENTERTAINMENT, HEALTHCARE, SHOPPING, EDUCATION, PERSONAL, OTHER)",
        ),
    amount: z.number().describe("Total Amount"),
    currency: z.string().describe("Currency"),
    description: z.string().describe("Description of the invoice"),
});

// Helper function to call OpenAI API with structured output
async function parseInvoiceText(text: string) {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.responses.parse({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "system",
                    content: `Extract the invoice information. Valid categories are: ${CATEGORIES.join(', ')}. 
                   If you can't determine an exact category, map to the closest one.`
                },
                { role: "user", content: text },
            ],
            text: {
                format: zodTextFormat(InvoiceEvent, "event"),
            },
        });

        return response.output_parsed;
    } catch (error) {
        console.error('Error in parseInvoiceText:', error);
        throw error;
    }
}

// Extract text from image using Tesseract
async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
        const worker = await createWorker('eng');
        const { data } = await worker.recognize(imageBuffer);
        await worker.terminate();
        return data.text;
    } catch (error) {
        console.error('Error in OCR processing:', error);
        throw new Error('Failed to extract text from image');
    }
}

// Convert currency if needed using easy-currencies
async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<{ convertedAmount: number, conversionRate: number }> {
    if (fromCurrency === toCurrency) {
        return { convertedAmount: amount, conversionRate: 1 };
    }

    try {
        const result = await Convert(amount).from(fromCurrency).to(toCurrency);
        const rate = result / amount;

        return {
            convertedAmount: parseFloat(result.toFixed(2)),
            conversionRate: parseFloat(rate.toFixed(4))
        };
    } catch (error) {
        console.error('Currency conversion error:', error);
        return { convertedAmount: amount, conversionRate: 1 }; // Return original amount if conversion fails
    }
}

// Check buffer is an image using magic numbers
async function isImageBuffer(buffer: Buffer): Promise<boolean> {
    // Common image format signatures (magic numbers)
    const signatures: { [key: string]: number[] } = {
        jpeg: [0xFF, 0xD8, 0xFF],
        png: [0x89, 0x50, 0x4E, 0x47],
        gif: [0x47, 0x49, 0x46, 0x38],
        bmp: [0x42, 0x4D],
        webp: [0x52, 0x49, 0x46, 0x46], // RIFF signature (WebP starts with RIFF)
    };

    try {
        // Check against known signatures
        for (const format in signatures) {
            const signature = signatures[format];
            let matches = true;

            for (let i = 0; i < signature.length; i++) {
                if (i >= buffer.length || buffer[i] !== signature[i]) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                return true;
            }
        }

        // Special case for WEBP (needs additional check)
        if (buffer.length >= 12 &&
            buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
            buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking buffer type:', error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        // Authenticate the user
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Try to get formData
        let formData;
        try {
            formData = await request.formData();
        } catch (error) {
            console.error("Failed to parse form data:", error);
            return NextResponse.json(
                { error: 'Failed to parse form data' },
                { status: 400 }
            );
        }

        // Get target currency from request or use USD as default
        const targetCurrency = formData.get('targetCurrency')?.toString() || session.user.currency || 'USD';

        // Check if we have a file in the request
        const invoiceFile = formData.get('invoice');
        if (!invoiceFile || !(invoiceFile instanceof File)) {
            console.error("No invoice file or invalid file in request:", invoiceFile);
            return NextResponse.json(
                { error: 'No invoice file provided or invalid file' },
                { status: 400 }
            );
        }

        // Debug file information
        console.log("API received file:", {
            name: invoiceFile.name || 'unnamed file',
            type: invoiceFile.type || 'unknown type',
            extension: getFileExtension(invoiceFile.name || ''),
            size: invoiceFile.size + ' bytes'
        });

        // More permissive check for image files
        const isImageType = invoiceFile.type && invoiceFile.type.startsWith('image/');
        const hasImageExtension = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(invoiceFile.name);

        // Convert the file to a buffer
        let buffer: Buffer;
        try {
            const arrayBuffer = await invoiceFile.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
            console.log("Successfully created buffer from file, size:", buffer.length);
        } catch (error) {
            console.error("Failed to create buffer from file:", error);
            return NextResponse.json(
                { error: 'Failed to process uploaded file' },
                { status: 400 }
            );
        }

        // Additional verification by checking file headers - ONLY if other checks fail
        if (!isImageType && !hasImageExtension) {
            const isImage = await isImageBuffer(buffer);
            if (!isImage) {
                return NextResponse.json(
                    { error: 'The uploaded file is not a valid image' },
                    { status: 400 }
                );
            }
        }

        // Extract text from the image
        const extractedText = await extractTextFromImage(buffer);

        if (!extractedText.trim()) {
            return NextResponse.json(
                { error: 'No text could be extracted from the image' },
                { status: 400 }
            );
        }

        console.log("Extracted text:", extractedText);

        // Parse the extracted text with OpenAI
        const invoiceData = await parseInvoiceText(extractedText);

        if (!invoiceData) {
            return NextResponse.json(
                { error: 'Failed to parse invoice data' },
                { status: 400 }
            );
        }

        // Keep track of original values for currency conversion
        const originalAmount = invoiceData.amount;
        const originalCurrency = invoiceData.currency;

        // Convert currency if needed
        const { convertedAmount, conversionRate } = await convertCurrency(
            invoiceData.amount,
            invoiceData.currency,
            targetCurrency
        );

        // Return the processed invoice data
        return NextResponse.json({
            ...invoiceData,
            amount: convertedAmount,
            currency: targetCurrency,
            originalAmount: originalCurrency !== targetCurrency ? originalAmount : undefined,
            originalCurrency: originalCurrency !== targetCurrency ? originalCurrency : undefined,
            conversionRate: originalCurrency !== targetCurrency ? conversionRate : undefined
        });
    } catch (error) {
        console.error('Error processing invoice:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process invoice' },
            { status: 500 }
        );
    }
}