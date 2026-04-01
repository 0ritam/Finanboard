import { useMemo } from 'react'
import { useTransactionStore } from '../store/transactionStore'
import { detectAnomalies } from '../utils/anomalyDetection'
import { computeHealthScore } from '../utils/healthScore'
import { CATEGORIES } from '../data/categories'

export function useAnomalies() {
  const transactions = useTransactionStore((s) => s.transactions)
  return useMemo(() => detectAnomalies(transactions), [transactions])
}

export function useHealthScore() {
  const transactions = useTransactionStore((s) => s.transactions)
  return useMemo(() => computeHealthScore(transactions), [transactions])
}

export function useTopInsights() {
  const transactions = useTransactionStore((s) => s.transactions)

  return useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')

    // Highest spending category
    const categoryTotals: Record<string, number> = {}
    for (const tx of expenses) {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
    }
    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]

    // Average daily expense
    const dates = [...new Set(expenses.map((t) => t.date))]
    const avgDaily = dates.length > 0
      ? expenses.reduce((s, t) => s + t.amount, 0) / dates.length
      : 0

    // Biggest single transaction
    const biggestExpense = expenses.length > 0
      ? expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0])
      : null

    // Most frequent category
    const categoryCounts: Record<string, number> = {}
    for (const tx of expenses) {
      categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1
    }
    const mostFrequent = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]

    // Month-over-month expense change
    const monthlyExpenses: Record<string, number> = {}
    for (const tx of expenses) {
      const month = tx.date.slice(0, 7)
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + tx.amount
    }
    const months = Object.keys(monthlyExpenses).sort()
    let monthChange = 0
    if (months.length >= 2) {
      const current = monthlyExpenses[months[months.length - 1]]
      const prev = monthlyExpenses[months[months.length - 2]]
      monthChange = prev > 0 ? ((current - prev) / prev) * 100 : 0
    }

    return {
      topCategory: topCategory ? {
        category: topCategory[0],
        label: CATEGORIES[topCategory[0] as keyof typeof CATEGORIES]?.label || topCategory[0],
        amount: topCategory[1],
        percentage: expenses.reduce((s, t) => s + t.amount, 0) > 0
          ? (topCategory[1] / expenses.reduce((s, t) => s + t.amount, 0)) * 100
          : 0,
      } : null,
      avgDaily: Math.round(avgDaily),
      biggestExpense,
      mostFrequent: mostFrequent ? {
        category: mostFrequent[0],
        label: CATEGORIES[mostFrequent[0] as keyof typeof CATEGORIES]?.label || mostFrequent[0],
        count: mostFrequent[1],
      } : null,
      monthChange: Math.round(monthChange * 10) / 10,
    }
  }, [transactions])
}