import { useMemo } from 'react'
import { motion } from 'motion/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '../ui/Card'
import { useTransactionStore } from '../../store/transactionStore'
import { getCategoryTrendData, getSpendingByCategory } from '../../utils/chartHelpers'
import { CATEGORIES } from '../../data/categories'
import { CHART_COLORS } from '../../data/constants'
import { formatCurrency } from '../../utils/formatters'

export function SpendingTrends() {
  const transactions = useTransactionStore((s) => s.transactions)
  const data = useMemo(() => getCategoryTrendData(transactions), [transactions])
  const topCategories = useMemo(
    () => getSpendingByCategory(transactions).slice(0, 5).map((c) => c.category),
    [transactions]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Spending Trends by Category</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                tickFormatter={(v) => `$${v}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                formatter={(value) => [formatCurrency(Number(value))]}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => {
                  const config = CATEGORIES[value as keyof typeof CATEGORIES]
                  return <span className="text-text-secondary">{config?.label || value}</span>
                }}
              />
              {topCategories.map((cat, i) => (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
