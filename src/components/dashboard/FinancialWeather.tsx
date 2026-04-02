import { motion } from 'motion/react'
import { Sun, CloudSun, Cloud, CloudLightning } from 'lucide-react'
import { Card } from '../ui/Card'
import { useHealthScore } from '../../hooks/useInsights'

const weatherConfig = [
  {
    min: 80,
    icon: Sun,
    label: 'Sunny',
    message: 'Your finances are shining bright!',
    color: '#f59e0b',
    bg: 'from-amber-400/20 to-orange-300/10',
    darkBg: 'dark:from-amber-500/10 dark:to-orange-400/5',
  },
  {
    min: 60,
    icon: CloudSun,
    label: 'Partly Cloudy',
    message: 'Looking good, a few areas to improve.',
    color: '#3b82f6',
    bg: 'from-blue-400/20 to-sky-300/10',
    darkBg: 'dark:from-blue-500/10 dark:to-sky-400/5',
  },
  {
    min: 40,
    icon: Cloud,
    label: 'Cloudy',
    message: 'Some clouds ahead — review your spending.',
    color: '#94a3b8',
    bg: 'from-slate-400/20 to-gray-300/10',
    darkBg: 'dark:from-slate-500/10 dark:to-gray-400/5',
  },
  {
    min: 0,
    icon: CloudLightning,
    label: 'Stormy',
    message: 'Financial storm brewing — take action!',
    color: '#f43f5e',
    bg: 'from-rose-400/20 to-red-300/10',
    darkBg: 'dark:from-rose-500/10 dark:to-red-400/5',
  },
]

function getWeather(score: number) {
  return weatherConfig.find((w) => score >= w.min) || weatherConfig[weatherConfig.length - 1]
}

export function FinancialWeather() {
  const { total } = useHealthScore()
  const weather = getWeather(total)
  const Icon = weather.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card className={`relative overflow-hidden bg-gradient-to-br ${weather.bg} ${weather.darkBg}`}>
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              rotate: weather.label === 'Sunny' ? [0, 10, -10, 0] : 0,
              y: weather.label === 'Stormy' ? [0, -3, 0] : 0,
            }}
            transition={{
              duration: weather.label === 'Sunny' ? 4 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon size={36} style={{ color: weather.color }} strokeWidth={1.5} />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">Financial Forecast</h3>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: weather.color,
                  backgroundColor: `${weather.color}18`,
                }}
              >
                {weather.label}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">{weather.message}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
