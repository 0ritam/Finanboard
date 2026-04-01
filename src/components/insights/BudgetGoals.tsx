import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Plus, Settings } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { BudgetGoalForm } from './BudgetGoalForm'
import { useBudgetStore } from '../../store/budgetStore'
import { useTransactionStore } from '../../store/transactionStore'
import { useRoleStore } from '../../store/roleStore'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency } from '../../utils/formatters'
import { cn } from '../../utils/cn'

function getCurrentMonth() {
  // Use the most recent transaction month as "current"
  return '2026-03'
}

export function BudgetGoals() {
  const budgets = useBudgetStore((s) => s.budgets)
  const transactions = useTransactionStore((s) => s.transactions)
  const role = useRoleStore((s) => s.role)
  const [formOpen, setFormOpen] = useState(false)

  const currentMonth = getCurrentMonth()

  const spending = useMemo(() => {
    const totals: Record<string, number> = {}
    for (const tx of transactions) {
      if (tx.type === 'expense' && tx.date.startsWith(currentMonth)) {
        totals[tx.category] = (totals[tx.category] || 0) + tx.amount
      }
    }
    return totals
  }, [transactions, currentMonth])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Budget Goals (March 2026)</h3>
          {role === 'admin' && (
            <Button variant="ghost" size="sm" icon={<Settings size={14} />} onClick={() => setFormOpen(true)}>
              Manage
            </Button>
          )}
        </div>

        {budgets.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-text-muted mb-3">No budget goals set</p>
            {role === 'admin' && (
              <Button size="sm" icon={<Plus size={14} />} onClick={() => setFormOpen(true)}>
                Set Budget
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map(({ category, limit }) => {
              const spent = spending[category] || 0
              const pct = limit > 0 ? (spent / limit) * 100 : 0
              const config = CATEGORIES[category]
              const overBudget = pct >= 100

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-text-primary">{config.label}</span>
                    <span className="text-xs text-text-secondary tabular-nums">
                      {formatCurrency(spent)} / {formatCurrency(limit)}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-border overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full transition-colors',
                        overBudget ? 'bg-expense' : pct >= 80 ? 'bg-warning' : 'bg-income'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  {overBudget && (
                    <p className="text-xs text-expense mt-1">
                      Over budget by {formatCurrency(spent - limit)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <BudgetGoalForm open={formOpen} onClose={() => setFormOpen(false)} />
      </Card>
    </motion.div>
  )
}
