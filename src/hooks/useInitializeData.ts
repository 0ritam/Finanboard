import { useEffect } from 'react'
import { useTransactionStore } from '../store/transactionStore'
import { useBudgetStore } from '../store/budgetStore'

export function useInitializeData() {
  const initTransactions = useTransactionStore((s) => s.initialize)
  const initBudgets = useBudgetStore((s) => s.initialize)
  const loading = useTransactionStore((s) => s.loading)

  useEffect(() => {
    initTransactions()
    initBudgets()
  }, [initTransactions, initBudgets])

  return { loading }
}
