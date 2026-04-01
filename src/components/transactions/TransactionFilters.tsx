import { Search, RotateCcw } from 'lucide-react'
import { useTransactionStore } from '../../store/transactionStore'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { ALL_CATEGORIES, CATEGORIES } from '../../data/categories'
import type { Category, SortDirection, SortField, TransactionType } from '../../types'

export function TransactionFilters() {
  const filters = useTransactionStore((s) => s.filters)
  const setFilter = useTransactionStore((s) => s.setFilter)
  const resetFilters = useTransactionStore((s) => s.resetFilters)

  const hasActiveFilters =
    filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        {/* Type filter */}
        <Select
          value={filters.type}
          onChange={(e) => setFilter('type', e.target.value as TransactionType | 'all')}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
        />

        {/* Category filter */}
        <Select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value as Category | 'all')}
          options={[
            { value: 'all', label: 'All Categories' },
            ...ALL_CATEGORIES.map((cat) => ({
              value: cat,
              label: CATEGORIES[cat].label,
            })),
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilter('dateFrom', e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          <span className="text-text-muted text-sm">to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilter('dateTo', e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        {/* Sort */}
        <Select
          value={filters.sortField}
          onChange={(e) => setFilter('sortField', e.target.value as SortField)}
          options={[
            { value: 'date', label: 'Sort by Date' },
            { value: 'amount', label: 'Sort by Amount' },
            { value: 'category', label: 'Sort by Category' },
          ]}
        />
        <Select
          value={filters.sortDirection}
          onChange={(e) => setFilter('sortDirection', e.target.value as SortDirection)}
          options={[
            { value: 'desc', label: 'Descending' },
            { value: 'asc', label: 'Ascending' },
          ]}
        />

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} icon={<RotateCcw size={14} />}>
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
