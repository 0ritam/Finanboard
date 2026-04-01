import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Card } from '../ui/Card'
import { useTransactionStore } from '../../store/transactionStore'
import { getSpendingByCategory } from '../../utils/chartHelpers'
import { CATEGORIES } from '../../data/categories'
import { CHART_COLORS } from '../../data/constants'
import { formatCurrency } from '../../utils/formatters'

export function HighestSpending() {
  const transactions = useTransactionStore((s) => s.transactions)
  const data = useMemo(() => getSpendingByCategory(transactions).slice(0, 5), [transactions])
  const maxAmount = data.length > 0 ? data[0].amount : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Top Spending Categories</h3>
        <div className="space-y-4">
          {data.map((item, i) => {
            const config = CATEGORIES[item.category as keyof typeof CATEGORIES]
            const pct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
            return (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-text-primary">{config?.label || item.category}</span>
                  <span className="text-sm font-semibold text-text-primary tabular-nums">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
