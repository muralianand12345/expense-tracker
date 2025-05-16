import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Personal Expense Tracker',
    description: 'Track and manage your expenses',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
                        <nav className="bg-indigo-600 dark:bg-indigo-800">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-16">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <span className="text-white text-xl font-bold">💰 Expense Tracker</span>
                                        </div>
                                    </div>
                                    <div>
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </nav>

                        <main>
                            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                {children}
                            </div>
                        </main>

                        <footer className="bg-white dark:bg-gray-800 transition-colors duration-200">
                            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                    &copy; {new Date().getFullYear()} Personal Expense Tracker
                                </p>
                            </div>
                        </footer>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}