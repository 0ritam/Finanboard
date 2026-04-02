export const CHART_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f97316',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#14b8a6',
  '#ef4444',
  '#a855f7',
]

export const ANOMALY_THRESHOLD = 2.0 // Flag transactions 2x+ category average

export const HEALTH_SCORE_WEIGHTS = {
  savingsRate: 0.4,
  consistency: 0.2,
  diversity: 0.2,
  trend: 0.2,
}
