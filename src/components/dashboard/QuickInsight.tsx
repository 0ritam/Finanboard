import { motion } from 'motion/react'
import { Lightbulb } from 'lucide-react'
import { Card } from '../ui/Card'
import { useTopInsights } from '../../hooks/useInsights'
import { useTransactionSummary } from '../../hooks/useTransactions'
import { formatCurrency } from '../../utils/formatters'

export function QuickInsight() {
  const { topCategory, monthChange } = useTopInsights()
  const { savingsRate } = useTransactionSummary()

  const insights: string[] = []

  if (topCategory) {
    insights.push(
      `Your highest spending category is ${topCategory.label} at ${formatCurrency(topCategory.amount)} (${topCategory.percentage.toFixed(0)}% of expenses).`
    )
  }

  if (monthChange !== 0) {
    const direction = monthChange > 0 ? 'increased' : 'decreased'
    insights.push(
      `Your spending ${direction} by ${Math.abs(monthChange)}% compared to last month.`
    )
  }

  if (savingsRate > 0) {
    insights.push(
      `You're saving ${savingsRate.toFixed(0)}% of your income. ${savingsRate >= 20 ? 'Great job!' : 'Try to aim for 20%.'}`
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <Card className="bg-primary-light border-primary/20">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Lightbulb size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">Quick Insights</h3>
            <ul className="space-y-1.5">
              {insights.map((insight, i) => (
                <li key={i} className="text-sm text-text-secondary leading-relaxed">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
