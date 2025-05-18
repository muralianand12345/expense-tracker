/**
 * Converts data to CSV format and triggers a download
 * 
 * @param data Array of objects to convert to CSV
 * @param filename Name of the file to download
 */
export function downloadCSV(data: any[], filename: string): void {
    if (!data || !data.length) return;

    // Convert data to CSV format
    const headers = Object.keys(data[0]);
    const csvRows = [
        // Header row
        headers.join(','),
        // Data rows
        ...data.map(row =>
            headers.map(header => {
                let cell = row[header];

                // Handle dates
                if (cell instanceof Date) {
                    cell = cell.toISOString();
                }

                // Handle strings that need quotes (if they contain commas or quotes)
                if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
                    // Escape any quotes by doubling them and wrap in quotes
                    cell = `"${cell.replace(/"/g, '""')}"`;
                }

                return cell;
            }).join(',')
        )
    ];

    const csvString = csvRows.join('\n');

    // Create a blob and download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Prepares expense data for CSV export by formatting dates and amounts
 * 
 * @param expenses Array of expense objects
 * @param formatAmount Function to format currency amounts
 * @returns Formatted data ready for CSV export
 */
export function prepareExpenseDataForExport(
    expenses: any[],
    formatAmount: (amount: number) => string
): any[] {
    return expenses.map(expense => ({
        Date: new Date(expense.date).toLocaleDateString(),
        Description: expense.description,
        Category: expense.category,
        Amount: formatAmount(expense.amount).replace(/[^\d.-]/g, ''), // Remove currency symbols for CSV
        AmountFormatted: formatAmount(expense.amount), // Keep formatted version for reference
    }));
}