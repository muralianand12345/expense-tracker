import React, { ReactNode } from 'react';
import { UserMenu } from '@/components/layout/UserMenu';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { CurrencySelector } from '@/components/layout/CurrencySelector';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Link from 'next/link';

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <CurrencyProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <nav className="bg-indigo-600 dark:bg-indigo-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo and Navigation Links */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Link href="/dashboard" className="text-white text-xl font-bold flex items-center">
                                        <span>💰 Expense Tracker</span>
                                    </Link>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        <Link
                                            href="/dashboard"
                                            className="text-white hover:bg-indigo-700 dark:hover:bg-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="text-white hover:bg-indigo-700 dark:hover:bg-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Settings
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right side controls */}
                            <div className="flex items-center gap-4">
                                <CurrencySelector />
                                <ThemeToggle />
                                <UserMenu />
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                {/* Footer */}
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