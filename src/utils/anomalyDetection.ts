import type { AnomalyFlag, Transaction } from '../types'
import { ANOMALY_THRESHOLD } from '../data/constants'

export function detectAnomalies(transactions: Transaction[]): AnomalyFlag[] {
  const categoryAmounts: Record<string, number[]> = {}

  for (const tx of transactions) {
    if (tx.type === 'expense') {
      if (!categoryAmounts[tx.category]) {
        categoryAmounts[tx.category] = []
      }
      categoryAmounts[tx.category].push(tx.amount)
    }
  }

  const categoryAvgs: Record<string, number> = {}
  for (const [cat, amounts] of Object.entries(categoryAmounts)) {
    categoryAvgs[cat] = amounts.reduce((a, b) => a + b, 0) / amounts.length
  }

  const anomalies: AnomalyFlag[] = []

  for (const tx of transactions) {
    if (tx.type === 'expense' && categoryAvgs[tx.category]) {
      const avg = categoryAvgs[tx.category]
      const multiplier = tx.amount / avg
      if (multiplier >= ANOMALY_THRESHOLD) {
        anomalies.push({
          transactionId: tx.id,
          multiplier: Math.round(multiplier * 10) / 10,
          categoryAvg: Math.round(avg),
        })
      }
    }
  }

  return anomalies
}