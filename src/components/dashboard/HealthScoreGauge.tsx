import { motion } from 'motion/react'
import { Card } from '../ui/Card'
import { useHealthScore } from '../../hooks/useInsights'
import { cn } from '../../utils/cn'

function getScoreColor(score: number) {
  if (score >= 80) return '#3b82f6'
  if (score >= 50) return '#f59e0b'
  return '#f43f5e'
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Attention'
}

export function HealthScoreGauge() {
  const score = useHealthScore()
  const color = getScoreColor(score.total)
  const circumference = 2 * Math.PI * 52
  const strokeDashoffset = circumference - (score.total / 100) * circumference

  const breakdownItems = [
    { label: 'Savings', value: score.savingsRate },
    { label: 'Consistency', value: score.consistency },
    { label: 'Diversity', value: score.diversity },
    { label: 'Trend', value: score.trend },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <Card className="flex flex-col items-center">
        <h3 className="text-sm font-semibold text-text-primary mb-4 self-start">Financial Health</h3>

        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold tabular-nums"
              style={{ color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score.total}
            </motion.span>
            <span className="text-xs text-text-muted">out of 100</span>
          </div>
        </div>

        <p className="mt-2 text-sm font-medium" style={{ color }}>
          {getScoreLabel(score.total)}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 w-full">
          {breakdownItems.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-xs text-text-muted">{label}</div>
              <div className="flex items-center gap-1.5 justify-center mt-1">
                <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden max-w-16">
                  <motion.div
                    className={cn('h-full rounded-full')}
                    style={{ backgroundColor: getScoreColor(value) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <span className="text-xs font-medium text-text-secondary tabular-nums">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
