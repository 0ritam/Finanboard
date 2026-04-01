import { useMemo } from 'react'
import { motion } from 'motion/react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from '../ui/Card'
import { useTransactionStore } from '../../store/transactionStore'
import { getSpendingByCategory } from '../../utils/chartHelpers'
import { CATEGORIES } from '../../data/categories'
import { CHART_COLORS } from '../../data/constants'
import { formatCurrency } from '../../utils/formatters'

export function SpendingBreakdown() {
  const transactions = useTransactionStore((s) => s.transactions)
  const data = useMemo(() => getSpendingByCategory(transactions).slice(0, 7), [transactions])

  const total = data.reduce((s, d) => s + d.amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Spending Breakdown</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="amount"
                  nameKey="category"
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                  formatter={(value) => [formatCurrency(Number(value))]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2 w-full">
            {data.map((item, i) => {
              const config = CATEGORIES[item.category as keyof typeof CATEGORIES]
              const pct = total > 0 ? ((item.amount / total) * 100).toFixed(1) : '0'
              return (
                <div key={item.category} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-sm text-text-secondary flex-1 truncate">
                    {config?.label || item.category}
                  </span>
                  <span className="text-sm font-medium text-text-primary tabular-nums">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-xs text-text-muted w-10 text-right tabular-nums">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
