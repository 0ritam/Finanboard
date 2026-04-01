import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BudgetGoal, Category } from '../types'

interface BudgetState {
  budgets: BudgetGoal[]
  setBudget: (category: Category, limit: number) => void
  removeBudget: (category: Category) => void
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      budgets: [
        { category: 'dining', limit: 400 },
        { category: 'groceries', limit: 500 },
        { category: 'entertainment', limit: 200 },
        { category: 'transport', limit: 200 },
        { category: 'shopping', limit: 300 },
      ],

      setBudget: (category, limit) =>
        set((state) => {
          const existing = state.budgets.findIndex((b) => b.category === category)
          if (existing >= 0) {
            const updated = [...state.budgets]
            updated[existing] = { category, limit }
            return { budgets: updated }
          }
          return { budgets: [...state.budgets, { category, limit }] }
        }),

      removeBudget: (category) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.category !== category),
        })),
    }),
    { name: 'budget-store' }
  )
)