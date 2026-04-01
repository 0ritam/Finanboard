import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'
import { useTransactionStore } from '../../store/transactionStore'
import { useAnomalies } from '../../hooks/useInsights'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency, formatDateShort } from '../../utils/formatters'
import { cn } from '../../utils/cn'

export function RecentTransactions() {
  const transactions = useTransactionStore((s) => s.transactions)
  const anomalies = useAnomalies()
  const anomalyIds = useMemo(() => new Set(anomalies.map((a) => a.transactionId)), [anomalies])

  const recent = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [transactions]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recent.map((tx) => {
            const config = CATEGORIES[tx.category]
            const isAnomaly = anomalyIds.has(tx.id)
            return (
              <div
                key={tx.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-surface-hover',
                  isAnomaly && 'ring-1 ring-warning/30'
                )}
              >
                <div className={cn('rounded-lg p-2', config.bgColor)}>
                  {tx.type === 'income' ? (
                    <ArrowUpRight size={16} className="text-income" />
                  ) : (
                    <ArrowDownRight size={16} className="text-expense" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-text-primary truncate">{tx.description}</p>
                    {isAnomaly && <AlertTriangle size={12} className="text-warning shrink-0" />}
                  </div>
                  <p className="text-xs text-text-muted">{formatDateShort(tx.date)}</p>
                </div>
                <span
                  className={cn(
                    'text-sm font-semibold tabular-nums',
                    tx.type === 'income' ? 'text-income' : 'text-expense'
                  )}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
