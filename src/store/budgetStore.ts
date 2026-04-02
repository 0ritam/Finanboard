import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BudgetGoal, Category } from '../types'
import * as api from '../api/mockApi'

interface BudgetState {
  budgets: BudgetGoal[]
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  setBudget: (category: Category, limit: number) => Promise<void>
  removeBudget: (category: Category) => Promise<void>
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],
      loading: false,
      initialized: false,

      initialize: async () => {
        if (get().initialized || get().budgets.length > 0) {
          set({ initialized: true })
          return
        }
        set({ loading: true })
        const budgets = await api.fetchBudgets()
        set({ budgets, loading: false, initialized: true })
      },

      setBudget: async (category, limit) => {
        await api.saveBudget(category, limit)
        set((state) => {
          const existing = state.budgets.findIndex((b) => b.category === category)
          if (existing >= 0) {
            const updated = [...state.budgets]
            updated[existing] = { category, limit }
            return { budgets: updated }
          }
          return { budgets: [...state.budgets, { category, limit }] }
        })
      },

      removeBudget: async (category) => {
        await api.removeBudget(category)
        set((state) => ({
          budgets: state.budgets.filter((b) => b.category !== category),
        }))
      },
    }),
    { name: 'budget-store' }
  )
)
