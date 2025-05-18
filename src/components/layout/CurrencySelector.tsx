'use client';

import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CURRENCIES } from '@/types';
import { cn } from '@/lib/utils/tailwind';
import { Button } from '@/components/ui/Button';

export function CurrencySelector() {
    const { currency, setCurrency, isLoading } = useCurrency();

    const handleCurrencyChange = async (code: string) => {
        await setCurrency(code as any);
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                as={Button}
                variant="ghost"
                disabled={isLoading}
                className="text-white"
            >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <div className="flex items-center">
                        <span className="font-medium">{currency}</span>
                        <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                            Select Currency
                        </div>
                        {CURRENCIES.map((curr) => (
                            <Menu.Item key={curr.code}>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleCurrencyChange(curr.code)}
                                        className={cn(
                                            'flex items-center px-4 py-2 text-sm w-full text-left',
                                            currency === curr.code
                                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                                : active
                                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                                                    : 'text-gray-700 dark:text-gray-300'
                                        )}
                                    >
                                        <span className="w-6 mr-2 text-center">{curr.symbol}</span>
                                        <span>{curr.code}</span>
                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({curr.name})</span>
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}