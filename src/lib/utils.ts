/**
 * Format a date to a string
 */
export function formatDate(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
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
 * Generate chart colors
 */
export function generateChartColors(count: number): string[] {
    const colors = [
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
    if (count > colors.length) {
        // Add more colors by slightly altering the hue of existing colors
        for (let i = colors.length; i < count; i++) {
            const baseColor = colors[i % colors.length];
            // Slightly modify the color
            const r = parseInt(baseColor.slice(1, 3), 16);
            const g = parseInt(baseColor.slice(3, 5), 16);
            const b = parseInt(baseColor.slice(5, 7), 16);

            // Adjust the color values slightly
            const newR = Math.min(255, Math.max(0, r + Math.floor(Math.random() * 40) - 20));
            const newG = Math.min(255, Math.max(0, g + Math.floor(Math.random() * 40) - 20));
            const newB = Math.min(255, Math.max(0, b + Math.floor(Math.random() * 40) - 20));

            // Convert back to hex
            const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
            colors.push(newColor);
        }
    }

    return colors.slice(0, count);
}

/**
 * Download data as a CSV file
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