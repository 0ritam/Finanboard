import { useMemo } from 'react'
import { useTransactionStore } from '../store/transactionStore'

export function useFilteredTransactions() {
  const transactions = useTransactionStore((s) => s.transactions)
  const filters = useTransactionStore((s) => s.filters)

  return useMemo(() => {
    let filtered = [...transactions]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q)
      )
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter((tx) => tx.type === filters.type)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter((tx) => tx.category === filters.category)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((tx) => tx.date >= filters.dateFrom)
    }

    if (filters.dateTo) {
      filtered = filtered.filter((tx) => tx.date <= filters.dateTo)
    }

    filtered.sort((a, b) => {
      const dir = filters.sortDirection === 'asc' ? 1 : -1
      switch (filters.sortField) {
        case 'date':
          return a.date.localeCompare(b.date) * dir
        case 'amount':
          return (a.amount - b.amount) * dir
        case 'category':
          return a.category.localeCompare(b.category) * dir
        default:
          return 0
      }
    })

    return filtered
  }, [transactions, filters])
}

export function useTransactionSummary() {
  const transactions = useTransactionStore((s) => s.transactions)

  return useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0)

    const balance = totalIncome - totalExpense
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

    return { totalIncome, totalExpense, balance, savingsRate }
  }, [transactions])
}