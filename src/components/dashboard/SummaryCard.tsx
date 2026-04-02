import { motion } from 'motion/react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '../ui/Card'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'

interface SummaryCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  trend?: number
  icon: ReactNode
  iconBg: string
  sparklineData?: Array<{ value: number }>
  sparklineColor?: string
  delay?: number
}

export function SummaryCard({
  title,
  value,
  prefix = '$',
  suffix,
  trend,
  icon,
  iconBg,
  sparklineData,
  sparklineColor = '#3b82f6',
  delay = 0,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card hover className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <AnimatedNumber
                value={value}
                prefix={prefix}
                suffix={suffix}
                className="text-2xl font-bold text-text-primary tabular-nums"
              />
            </div>
            {trend !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                {trend >= 0 ? (
                  <TrendingUp size={14} className="text-income" />
                ) : (
                  <TrendingDown size={14} className="text-expense" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend >= 0 ? 'text-income' : 'text-expense'
                  )}
                >
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                </span>
                <span className="text-xs text-text-muted">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn('rounded-xl p-2.5', iconBg)}>
            {icon}
          </div>
        </div>

        {sparklineData && sparklineData.length > 1 && (
          <div className="mt-3 h-10 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`sparkGrad-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sparklineColor}
                  strokeWidth={1.5}
                  fill={`url(#sparkGrad-${title})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
