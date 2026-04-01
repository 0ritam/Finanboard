import type { Transaction } from '../types'
import { format, parseISO, eachMonthOfInterval, startOfMonth } from 'date-fns'

export function getBalanceTrendData(transactions: Transaction[]) {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  if (sorted.length === 0) return []

  const start = parseISO(sorted[0].date)
  const end = parseISO(sorted[sorted.length - 1].date)
  const months = eachMonthOfInterval({ start: startOfMonth(start), end: startOfMonth(end) })

  let balance = 0
  const monthlyData: Record<string, { income: number; expense: number }> = {}

  for (const tx of sorted) {
    const month = tx.date.slice(0, 7)
    if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 }
    if (tx.type === 'income') monthlyData[month].income += tx.amount
    else monthlyData[month].expense += tx.amount
  }

  return months.map((m) => {
    const key = format(m, 'yyyy-MM')
    const data = monthlyData[key] || { income: 0, expense: 0 }
    balance += data.income - data.expense
    return {
      month: format(m, 'MMM'),
      fullMonth: format(m, 'MMM yyyy'),
      balance,
      income: data.income,
      expense: data.expense,
    }
  })
}

export function getSpendingByCategory(transactions: Transaction[]) {
  const totals: Record<string, number> = {}

  for (const tx of transactions.filter((t) => t.type === 'expense')) {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount
  }

  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function getMonthlyComparisonData(transactions: Transaction[]) {
  const monthlyData: Record<string, { income: number; expense: number }> = {}

  for (const tx of transactions) {
    const month = tx.date.slice(0, 7)
    if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 }
    if (tx.type === 'income') monthlyData[month].income += tx.amount
    else monthlyData[month].expense += tx.amount
  }

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: format(parseISO(`${month}-01`), 'MMM'),
      fullMonth: format(parseISO(`${month}-01`), 'MMM yyyy'),
      income: data.income,
      expense: data.expense,
      savings: data.income - data.expense,
    }))
}

export function getSparklineData(transactions: Transaction[], type?: 'income' | 'expense') {
  const filtered = type ? transactions.filter((t) => t.type === type) : transactions
  const monthlyData: Record<string, number> = {}

  for (const tx of filtered) {
    const month = tx.date.slice(0, 7)
    monthlyData[month] = (monthlyData[month] || 0) + (tx.type === 'income' ? tx.amount : -tx.amount)
  }

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => ({ value }))
}

export function getCategoryTrendData(transactions: Transaction[]) {
  const topCategories = getSpendingByCategory(transactions).slice(0, 5).map((c) => c.category)
  const monthlyData: Record<string, Record<string, number>> = {}

  for (const tx of transactions.filter((t) => t.type === 'expense' && topCategories.includes(t.category))) {
    const month = tx.date.slice(0, 7)
    if (!monthlyData[month]) monthlyData[month] = {}
    monthlyData[month][tx.category] = (monthlyData[month][tx.category] || 0) + tx.amount
  }

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, cats]) => ({
      month: format(parseISO(`${month}-01`), 'MMM'),
      ...cats,
    }))
}