import type { Transaction } from '../types'
import { CATEGORIES } from '../data/categories'

export function exportToCSV(transactions: Transaction[], filename = 'transactions.csv') {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map((tx) => [
    tx.date,
    `"${tx.description}"`,
    CATEGORIES[tx.category].label,
    tx.type,
    tx.type === 'income' ? tx.amount : -tx.amount,
  ])

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  downloadFile(csv, filename, 'text/csv')
}

export function exportToJSON(transactions: Transaction[], filename = 'transactions.json') {
  const json = JSON.stringify(transactions, null, 2)
  downloadFile(json, filename, 'application/json')
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}