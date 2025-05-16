'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingPage() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">💰 Expense Tracker</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <Link
                                href="/app"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main>
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
                                    <Link
                                        href="/app"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Get Started
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

                {/* Testimonial Section */}
                <div className="py-12 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center mb-10">
                            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Testimonials</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                Users love our expense tracker
                            </p>
                        </div>

                        <div className="mt-10 grid gap-8 lg:grid-cols-2">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow">
                                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                                    "This expense tracker has completely changed how I manage my finances. The multi-currency feature is perfect for my international lifestyle."
                                </p>
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                        AK
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Kim</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Travel Blogger</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow">
                                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                                    "The data visualization tools have given me insights into my spending habits that I never would have noticed otherwise."
                                </p>
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                        SR
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Sarah Rodriguez</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Financial Analyst</p>
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
                                <Link
                                    href="/app"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                                >
                                    Sign Up Now
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap justify-center -mx-5 -my-2">
                        <div className="px-5 py-2">
                            <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                                About
                            </a>
                        </div>
                        <div className="px-5 py-2">
                            <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                                Privacy
                            </a>
                        </div>
                        <div className="px-5 py-2">
                            <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                                Terms
                            </a>
                        </div>
                        <div className="px-5 py-2">
                            <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                                Contact
                            </a>
                        </div>
                    </nav>
                    <div className="mt-8 flex justify-center space-x-6">
                        <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <span className="sr-only">GitHub</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                    </div>
                    <p className="mt-8 text-center text-base text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Personal Expense Tracker. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}