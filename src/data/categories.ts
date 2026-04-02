import type { Category, CategoryConfig } from '../types'

export const CATEGORIES: Record<Category, CategoryConfig> = {
  salary: {
    label: 'Salary',
    icon: 'Briefcase',
    color: '#22c55e',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    type: 'income',
  },
  freelance: {
    label: 'Freelance',
    icon: 'Laptop',
    color: '#3b82f6',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    type: 'income',
  },
  investments: {
    label: 'Investments',
    icon: 'TrendingUp',
    color: '#8b5cf6',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    type: 'income',
  },
  groceries: {
    label: 'Groceries',
    icon: 'ShoppingCart',
    color: '#f59e0b',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    type: 'expense',
  },
  dining: {
    label: 'Dining',
    icon: 'UtensilsCrossed',
    color: '#ef4444',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    type: 'expense',
  },
  transport: {
    label: 'Transport',
    icon: 'Car',
    color: '#06b6d4',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    type: 'expense',
  },
  entertainment: {
    label: 'Entertainment',
    icon: 'Gamepad2',
    color: '#ec4899',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    type: 'expense',
  },
  utilities: {
    label: 'Utilities',
    icon: 'Zap',
    color: '#f97316',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    type: 'expense',
  },
  healthcare: {
    label: 'Healthcare',
    icon: 'Heart',
    color: '#14b8a6',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    type: 'expense',
  },
  shopping: {
    label: 'Shopping',
    icon: 'ShoppingBag',
    color: '#a855f7',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    type: 'expense',
  },
  education: {
    label: 'Education',
    icon: 'GraduationCap',
    color: '#3b82f6',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    type: 'expense',
  },
  rent: {
    label: 'Rent',
    icon: 'Home',
    color: '#64748b',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
    type: 'expense',
  },
  travel: {
    label: 'Travel',
    icon: 'Plane',
    color: '#0ea5e9',
    bgColor: 'bg-sky-100 dark:bg-sky-900/30',
    type: 'expense',
  },
  subscriptions: {
    label: 'Subscriptions',
    icon: 'CreditCard',
    color: '#d946ef',
    bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
    type: 'expense',
  },
  other: {
    label: 'Other',
    icon: 'MoreHorizontal',
    color: '#78716c',
    bgColor: 'bg-stone-100 dark:bg-stone-900/30',
    type: 'both',
  },
}

export const EXPENSE_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([, c]) => c.type === 'expense' || c.type === 'both')
  .map(([key]) => key as Category)

export const INCOME_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([, c]) => c.type === 'income' || c.type === 'both')
  .map(([key]) => key as Category)

export const ALL_CATEGORIES = Object.keys(CATEGORIES) as Category[]
