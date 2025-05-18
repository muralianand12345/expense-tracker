'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/tailwind';

export function UserMenu() {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <Link
                href="/login"
                className="text-sm text-white hover:text-gray-200"
            >
                Sign In
            </Link>
        );
    }

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button className="flex rounded-full bg-indigo-700 dark:bg-indigo-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                    <span className="sr-only">Open user menu</span>
                    {session.user.image ? (
                        <Image
                            className="h-8 w-8 rounded-full"
                            src={session.user.image}
                            alt=""
                            width={32}
                            height={32}
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                            {(session.user.name || 'User')[0].toUpperCase()}
                        </div>
                    )}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                    </div>

                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href="/settings"
                                className={cn(
                                    active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                    'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                                )}
                            >
                                Settings
                            </Link>
                        )}
                    </Menu.Item>

                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className={cn(
                                    active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                    'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                                )}
                            >
                                Sign out
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}