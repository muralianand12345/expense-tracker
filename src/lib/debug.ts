export const debugLog = (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] ${message}`, data || '');
    }
};