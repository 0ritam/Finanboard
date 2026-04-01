import { motion } from 'motion/react'
import { Card } from '../ui/Card'
import type { ReactNode } from 'react'

interface InsightCardProps {
  title: string
  value: string
  subtitle?: string
  icon: ReactNode
  iconBg: string
  delay?: number
}

export function InsightCard({ title, value, subtitle, icon, iconBg, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card hover>
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2.5 ${iconBg}`}>
            {icon}
          </div>
          <div>
            <p className="text-xs text-text-muted">{title}</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{value}</p>
            {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
