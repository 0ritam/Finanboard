import { motion } from 'motion/react'
import { Card } from '../ui/Card'
import { useHealthScore } from '../../hooks/useInsights'

function getScoreColor(score: number) {
  if (score >= 80) return '#10b981'
  if (score >= 50) return '#f59e0b'
  return '#f43f5e'
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Attention'
}

function getScoreAdvice(score: { savingsRate: number; consistency: number; diversity: number; trend: number }) {
  const worst = Object.entries(score).sort(([, a], [, b]) => a - b)[0]
  const advice: Record<string, string> = {
    savingsRate: 'Try to increase your savings rate. Aim for at least 20% of income.',
    consistency: 'Your spending varies a lot month-to-month. Try to keep expenses more predictable.',
    diversity: 'Your spending is concentrated in a few categories. Consider diversifying.',
    trend: 'Your recent spending trend is heading in the wrong direction. Review recent expenses.',
  }
  return advice[worst[0]] || 'Keep up the good work!'
}

export function FinancialHealthScore() {
  const score = useHealthScore()
  const color = getScoreColor(score.total)
  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (score.total / 100) * circumference

  const breakdownItems = [
    { label: 'Savings Rate', value: score.savingsRate, description: 'How much you save vs earn' },
    { label: 'Consistency', value: score.consistency, description: 'Monthly spending stability' },
    { label: 'Diversity', value: score.diversity, description: 'Spread across categories' },
    { label: 'Trend', value: score.trend, description: 'Recent direction of spending' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-6">Financial Health Score</h3>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Large gauge */}
          <div className="relative w-44 h-44 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="10"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-4xl font-bold tabular-nums"
                style={{ color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {score.total}
              </motion.span>
              <span className="text-sm text-text-muted">/ 100</span>
              <span className="text-xs font-medium mt-1" style={{ color }}>
                {getScoreLabel(score.total)}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-4 w-full">
            {breakdownItems.map(({ label, value, description }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-text-primary">{label}</span>
                    <span className="text-xs text-text-muted ml-2 hidden sm:inline">{description}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: getScoreColor(value) }}>
                    {value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getScoreColor(value) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}

            <p className="text-sm text-text-secondary mt-4 pt-3 border-t border-border">
              {getScoreAdvice(score)}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
