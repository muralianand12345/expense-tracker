'use client';

import { Fragment, useRef, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Expense } from '@/types';
import ExpenseForm from './ExpenseForm';
import { useCurrency } from '@/contexts/CurrencyContext';
import { debugLog } from '@/lib/debug';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense?: Expense;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    title: string;
}

export default function ExpenseModal({
    isOpen,
    onClose,
    expense,
    onSubmit,
    isSubmitting,
    title,
}: ExpenseModalProps) {
    const cancelButtonRef = useRef(null);
    const { currency } = useCurrency();

    // Use a key to force re-render when currency changes
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        debugLog('ExpenseModal - Currency changed, updating key:', currency);
        setModalKey(prev => prev + 1);
    }, [currency]);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={onClose}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div key={modalKey} className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <ExpenseForm
                                            initialData={expense}
                                            onSubmit={onSubmit}
                                            onCancel={onClose}
                                            isSubmitting={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}