/**
 * Checks if a file is an image by examining its first few bytes (magic numbers)
 * This is useful when MIME types are unreliable or not available
 */
export async function isImageFile(file: File): Promise<boolean> {
    // Common image format signatures (magic numbers)
    const signatures: { [key: string]: number[] } = {
        jpeg: [0xFF, 0xD8, 0xFF],
        png: [0x89, 0x50, 0x4E, 0x47],
        gif: [0x47, 0x49, 0x46, 0x38],
        bmp: [0x42, 0x4D],
        webp: [0x52, 0x49, 0x46, 0x46], // RIFF signature (WebP starts with RIFF)
    };

    try {
        // First try MIME type check
        if (file.type && file.type.startsWith('image/')) {
            return true;
        }

        // Then check file extension
        if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name)) {
            return true;
        }

        // Finally, try to read the file header
        // Read the file header (first 12 bytes)
        const fileHeader = await readFileHeader(file, 12);

        // Check against known signatures
        for (const format in signatures) {
            const signature = signatures[format];
            let matches = true;

            for (let i = 0; i < signature.length; i++) {
                if (fileHeader[i] !== signature[i]) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                return true;
            }
        }

        // Special case for WEBP (needs additional check)
        if (fileHeader[0] === 0x52 && fileHeader[1] === 0x49 && fileHeader[2] === 0x46 && fileHeader[3] === 0x46) {
            // Check for "WEBP" string at position 8
            if (fileHeader[8] === 0x57 && fileHeader[9] === 0x45 && fileHeader[10] === 0x42 && fileHeader[11] === 0x50) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error checking file type:', error);
        // If we can't check the file header, fall back to checking the filename extension
        return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name);
    }
}

/**
 * Reads the first n bytes of a file
 */
async function readFileHeader(file: File, bytesToRead: number): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target || !e.target.result) {
                reject(new Error('Failed to read file header'));
                return;
            }

            const arrayBuffer = e.target.result as ArrayBuffer;
            const header = new Uint8Array(arrayBuffer);
            resolve(header);
        };

        reader.onerror = () => {
            reject(new Error('Error reading file header'));
        };

        // Read only the first n bytes
        const blob = file.slice(0, bytesToRead);
        reader.readAsArrayBuffer(blob);
    });
}

/**
 * Helper function to safely get file extension
 */
export function getFileExtension(filename?: string): string {
    if (!filename) return '';
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex < 0 ? '' : filename.slice(lastDotIndex + 1).toLowerCase();
}