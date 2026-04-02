import { useMemo } from 'react'
import { motion } from 'motion/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '../ui/Card'
import { useTransactionStore } from '../../store/transactionStore'
import { getMonthlyComparisonData } from '../../utils/chartHelpers'
import { formatCurrency } from '../../utils/formatters'

export function MonthlyComparison() {
  const transactions = useTransactionStore((s) => s.transactions)
  const data = useMemo(() => getMonthlyComparisonData(transactions), [transactions])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Monthly Income vs Expenses</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
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
                formatter={(value) => <span className="text-text-secondary">{value}</span>}
              />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expense" name="Expenses" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
