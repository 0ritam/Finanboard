import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TransactionRow } from './TransactionRow'
import { EmptyState } from '../ui/EmptyState'
import { useFilteredTransactions } from '../../hooks/useTransactions'
import { useAnomalies } from '../../hooks/useInsights'
import type { Transaction } from '../../types'

interface TransactionListProps {
  onEdit: (tx: Transaction) => void
  onDelete: (tx: Transaction) => void
}

const PAGE_SIZE = 15

export function TransactionList({ onEdit, onDelete }: TransactionListProps) {
  const transactions = useFilteredTransactions()
  const anomalies = useAnomalies()
  const anomalyMap = useMemo(
    () => new Map(anomalies.map((a) => [a.transactionId, a])),
    [anomalies]
  )

  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE)
  const paged = transactions.slice(0, page * PAGE_SIZE)

  if (transactions.length === 0) {
    return <EmptyState title="No transactions found" description="Try adjusting your filters or add a new transaction." />
  }

  return (
    <div>
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {paged.map((tx) => (
            <motion.div
              key={tx.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TransactionRow
                transaction={tx}
                anomaly={anomalyMap.get(tx.id)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
        <span>
          Showing {paged.length} of {transactions.length} transactions
        </span>
        {page < totalPages && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  )
}
