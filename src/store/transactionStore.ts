import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, TransactionFilters } from '../types'
import * as api from '../api/mockApi'

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
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>
  addTransactions: (txs: Omit<Transaction, 'id' | 'createdAt'>[]) => Promise<void>
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  setFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void
  resetFilters: () => void
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      filters: defaultFilters,
      loading: false,
      initialized: false,

      initialize: async () => {
        // Skip if already has data from localStorage
        if (get().initialized || get().transactions.length > 0) {
          set({ initialized: true })
          return
        }
        set({ loading: true })
        const transactions = await api.fetchTransactions()
        set({ transactions, loading: false, initialized: true })
      },

      addTransaction: async (tx) => {
        const created = await api.createTransaction(tx)
        set((state) => ({
          transactions: [created, ...state.transactions],
        }))
      },

      addTransactions: async (txs) => {
        const created = await api.createTransactionsBatch(txs)
        set((state) => ({
          transactions: [...created, ...state.transactions],
        }))
      },

      updateTransaction: async (id, updates) => {
        await api.updateTransaction(id, updates)
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        }))
      },

      deleteTransaction: async (id) => {
        await api.deleteTransaction(id)
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }))
      },

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
