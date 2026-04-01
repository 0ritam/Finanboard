import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, TransactionFilters } from '../types'
import { mockTransactions } from '../data/mockTransactions'

const defaultFilters: TransactionFilters = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  sortField: 'date',
  sortDirection: 'desc',
}

interface TransactionState {
  transactions: Transaction[]
  filters: TransactionFilters
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void
  addTransactions: (txs: Omit<Transaction, 'id' | 'createdAt'>[]) => void
  updateTransaction: (id: string, tx: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void
  resetFilters: () => void
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      filters: defaultFilters,

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            {
              ...tx,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.transactions,
          ],
        })),

      addTransactions: (txs) =>
        set((state) => ({
          transactions: [
            ...txs.map((tx) => ({
              ...tx,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            })),
            ...state.transactions,
          ],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'transaction-store',
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
)