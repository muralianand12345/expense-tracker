import UserMenu from '@/components/UserMenu';
import ThemeToggle from '@/components/ThemeToggle';
import HeaderCurrencySelector from '@/components/HeaderCurrencySelector';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Link from 'next/link';

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CurrencyProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <nav className="bg-indigo-600 dark:bg-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Link href="/app" className="text-white text-xl font-bold flex items-center">
                                        <span>💰 Expense Tracker</span>
                                    </Link>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        <Link
                                            href="/app"
                                            className="text-white hover:bg-indigo-700 dark:hover:bg-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/app/settings"
                                            className="text-white hover:bg-indigo-700 dark:hover:bg-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Settings
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <HeaderCurrencySelector />
                                <ThemeToggle />
                                <UserMenu />
                            </div>
                        </div>
                    </div>
                </nav>

                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                <footer className="bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} Personal Expense Tracker
                        </p>
                    </div>
                </footer>
            </div>
        </CurrencyProvider>
    );
}