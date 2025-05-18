import React from 'react';
import { ExpenseCategory } from '@/types';
import { cn } from '@/lib/utils/tailwind';

interface CategoryBadgeProps {
    category: ExpenseCategory;
    className?: string;
}

// Color mappings for different categories
const categoryColors: Record<ExpenseCategory, { bg: string; text: string; darkBg: string; darkText: string }> = {
    FOOD: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        darkBg: 'dark:bg-blue-900',
        darkText: 'dark:text-blue-200',
    },
    TRANSPORTATION: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        darkBg: 'dark:bg-green-900',
        darkText: 'dark:text-green-200',
    },
    HOUSING: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        darkBg: 'dark:bg-purple-900',
        darkText: 'dark:text-purple-200',
    },
    UTILITIES: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        darkBg: 'dark:bg-indigo-900',
        darkText: 'dark:text-indigo-200',
    },
    ENTERTAINMENT: {
        bg: 'bg-pink-100',
        text: 'text-pink-800',
        darkBg: 'dark:bg-pink-900',
        darkText: 'dark:text-pink-200',
    },
    HEALTHCARE: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        darkBg: 'dark:bg-red-900',
        darkText: 'dark:text-red-200',
    },
    SHOPPING: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        darkBg: 'dark:bg-orange-900',
        darkText: 'dark:text-orange-200',
    },
    EDUCATION: {
        bg: 'bg-teal-100',
        text: 'text-teal-800',
        darkBg: 'dark:bg-teal-900',
        darkText: 'dark:text-teal-200',
    },
    PERSONAL: {
        bg: 'bg-lime-100',
        text: 'text-lime-800',
        darkBg: 'dark:bg-lime-900',
        darkText: 'dark:text-lime-200',
    },
    OTHER: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        darkBg: 'dark:bg-gray-700',
        darkText: 'dark:text-gray-200',
    },
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
    const colorClasses = categoryColors[category];

    // Format category display (e.g., FOOD -> Food)
    const formattedCategory = category.charAt(0) + category.slice(1).toLowerCase();

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            colorClasses.bg,
            colorClasses.text,
            colorClasses.darkBg,
            colorClasses.darkText,
            className
        )}>
            {formattedCategory}
        </span>
    );
}