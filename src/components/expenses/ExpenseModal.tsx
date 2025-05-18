import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Expense } from '@/types';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense?: Expense;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    title: string;
}

export function ExpenseModal({
    isOpen,
    onClose,
    expense,
    onSubmit,
    isSubmitting,
    title,
}: ExpenseModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            maxWidth="lg"
        >
            <ExpenseForm
                initialData={expense}
                onSubmit={onSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
            />
        </Modal>
    );
}