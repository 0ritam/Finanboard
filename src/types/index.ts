export type TransactionType = 'income' | 'expense'

export type Category =
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'groceries'
  | 'dining'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'healthcare'
  | 'shopping'
  | 'education'
  | 'rent'
  | 'travel'
  | 'subscriptions'
  | 'other'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: Category
  date: string // ISO 8601: "2026-03-15"
  createdAt: string
}

export interface CategoryConfig {
  label: string
  icon: string
  color: string
  bgColor: string
  type: TransactionType | 'both'
}

export type Role = 'admin' | 'viewer'

export type SortField = 'date' | 'amount' | 'category'
export type SortDirection = 'asc' | 'desc'

export interface TransactionFilters {
  search: string
  type: TransactionType | 'all'
  category: Category | 'all'
  dateFrom: string
  dateTo: string
  sortField: SortField
  sortDirection: SortDirection
}

export interface BudgetGoal {
  category: Category
  limit: number
}

export interface AnomalyFlag {
  transactionId: string
  multiplier: number // e.g., 2.3 means 2.3x the average
  categoryAvg: number
}

export interface HealthScoreBreakdown {
  total: number
  savingsRate: number
  consistency: number
  diversity: number
  trend: number
}
