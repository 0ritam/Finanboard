import type { HealthScoreBreakdown, Transaction } from '../types'
import { HEALTH_SCORE_WEIGHTS } from '../data/constants'

export function computeHealthScore(transactions: Transaction[]): HealthScoreBreakdown {
  if (transactions.length === 0) {
    return { total: 0, savingsRate: 0, consistency: 0, diversity: 0, trend: 0 }
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  // 1. Savings Rate Score (0-100)
  // Target: saving 20%+ of income = 100 score
  const savingsRatio = totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0
  const savingsRate = Math.min(100, Math.max(0, (savingsRatio / 0.2) * 100))

  // 2. Spending Consistency Score (0-100)
  // Lower variance in monthly spending = higher score
  const monthlyExpenses = getMonthlyTotals(transactions, 'expense')
  const values = Object.values(monthlyExpenses)
  let consistency = 100
  if (values.length > 1) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0
    consistency = Math.min(100, Math.max(0, (1 - cv) * 100))
  }

  // 3. Diversity Score (0-100)
  // Not spending too much in any one category = higher score
  const categoryTotals: Record<string, number> = {}
  for (const tx of transactions.filter((t) => t.type === 'expense')) {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
  }
  const catValues = Object.values(categoryTotals)
  let diversity = 100
  if (catValues.length > 0 && totalExpense > 0) {
    const maxCatRatio = Math.max(...catValues) / totalExpense
    // If single category > 50% of spending, low diversity
    diversity = Math.min(100, Math.max(0, (1 - maxCatRatio) * 150))
  }

  // 4. Trend Score (0-100)
  // Spending trending down or stable = good
  const monthlyIncome = getMonthlyTotals(transactions, 'income')
  const months = [...new Set([...Object.keys(monthlyExpenses), ...Object.keys(monthlyIncome)])].sort()
  let trend = 70 // neutral default
  if (months.length >= 2) {
    const recentMonth = months[months.length - 1]
    const prevMonth = months[months.length - 2]
    const recentSavings = (monthlyIncome[recentMonth] || 0) - (monthlyExpenses[recentMonth] || 0)
    const prevSavings = (monthlyIncome[prevMonth] || 0) - (monthlyExpenses[prevMonth] || 0)
    if (recentSavings > prevSavings) {
      trend = Math.min(100, 70 + ((recentSavings - prevSavings) / (prevSavings || 1)) * 30)
    } else if (recentSavings < prevSavings) {
      trend = Math.max(0, 70 - ((prevSavings - recentSavings) / (prevSavings || 1)) * 30)
    }
  }

  const total = Math.round(
    savingsRate * HEALTH_SCORE_WEIGHTS.savingsRate +
    consistency * HEALTH_SCORE_WEIGHTS.consistency +
    diversity * HEALTH_SCORE_WEIGHTS.diversity +
    trend * HEALTH_SCORE_WEIGHTS.trend
  )

  return {
    total: Math.min(100, Math.max(0, total)),
    savingsRate: Math.round(savingsRate),
    consistency: Math.round(consistency),
    diversity: Math.round(diversity),
    trend: Math.round(trend),
  }
}

function getMonthlyTotals(transactions: Transaction[], type: 'income' | 'expense') {
  const totals: Record<string, number> = {}
  for (const tx of transactions.filter((t) => t.type === type)) {
    const month = tx.date.slice(0, 7) // "2026-03"
    totals[month] = (totals[month] || 0) + tx.amount
  }
  return totals
}