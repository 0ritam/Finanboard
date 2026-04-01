import { useMemo } from 'react'
import { motion } from 'motion/react'
import { AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useAnomalies } from '../../hooks/useInsights'
import { useTransactionStore } from '../../store/transactionStore'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency, formatDateShort } from '../../utils/formatters'

export function AnomalySummary() {
  const anomalies = useAnomalies()
  const transactions = useTransactionStore((s) => s.transactions)

  const anomalyDetails = useMemo(() => {
    const txMap = new Map(transactions.map((t) => [t.id, t]))
    return anomalies.map((a) => ({
      ...a,
      transaction: txMap.get(a.transactionId),
    })).filter((a) => a.transaction)
  }, [anomalies, transactions])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-warning" />
          <h3 className="text-sm font-semibold text-text-primary">Unusual Transactions</h3>
          <Badge variant="warning">{anomalyDetails.length}</Badge>
        </div>

        {anomalyDetails.length === 0 ? (
          <p className="text-sm text-text-muted py-4 text-center">
            No unusual transactions detected. Your spending looks normal!
          </p>
        ) : (
          <div className="space-y-3">
            {anomalyDetails.slice(0, 5).map(({ transaction: tx, multiplier, categoryAvg }) => {
              if (!tx) return null
              const config = CATEGORIES[tx.category]
              return (
                <div key={tx.id} className="flex items-center gap-3 rounded-lg p-2 -mx-2 bg-warning-light/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{tx.description}</span>
                      <Badge variant="warning">{multiplier}x</Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatDateShort(tx.date)} &middot; {config.label} &middot;
                      Avg: {formatCurrency(categoryAvg)} &rarr; This: {formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
