'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">💰 Expense Tracker</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                <Button>
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button>
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="py-12 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Personal Finance</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Take Control of Your Expenses
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                            Track, analyze, and manage your personal finances with our easy-to-use expense tracker.
                        </p>

                        <div className="mt-8 flex justify-center">
                            {isAuthenticated ? (
                                <Link href="/dashboard">
                                    <Button size="lg">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Button size="lg">
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-10">
                        <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Everything you need to manage your finances
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="mt-5">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Track Expenses</h3>
                                        <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                                            Easily record and categorize your expenses in one place.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    <div className="mt-5">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Visualize Data</h3>
                                        <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                                            View your spending patterns with interactive charts and graphs.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-5">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Multiple Currencies</h3>
                                        <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                                            Support for multiple currencies to track expenses worldwide.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-700 dark:bg-indigo-800">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to take control of your finances?</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-indigo-200">
                        Start tracking your expenses today and gain insights into your spending habits.
                    </p>
                    <div className="mt-8 flex justify-center">
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                <Button variant="secondary" size="lg">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="secondary" size="lg">
                                    Sign Up Now
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                    <p className="mt-8 text-center text-base text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Personal Expense Tracker. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}