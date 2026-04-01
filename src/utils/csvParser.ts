import type { Category, Transaction, TransactionType } from '../types'
import { ALL_CATEGORIES } from '../data/categories'

export interface ParsedRow {
  date: string
  description: string
  amount: number
  type: TransactionType
  category: Category
  valid: boolean
  errors: string[]
}

export function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const header = lines[0].toLowerCase().split(',').map((h) => h.trim().replace(/"/g, ''))
  const dateIdx = header.findIndex((h) => h === 'date')
  const descIdx = header.findIndex((h) => h === 'description' || h === 'desc')
  const amountIdx = header.findIndex((h) => h === 'amount')
  const typeIdx = header.findIndex((h) => h === 'type')
  const categoryIdx = header.findIndex((h) => h === 'category')

  return lines.slice(1).filter((l) => l.trim()).map((line) => {
    const cols = parseCsvLine(line)
    const errors: string[] = []

    const date = dateIdx >= 0 ? cols[dateIdx]?.trim() : ''
    const description = descIdx >= 0 ? cols[descIdx]?.trim() : ''
    const amountStr = amountIdx >= 0 ? cols[amountIdx]?.trim() : ''
    const typeStr = typeIdx >= 0 ? cols[typeIdx]?.trim().toLowerCase() : ''
    const categoryStr = categoryIdx >= 0 ? cols[categoryIdx]?.trim().toLowerCase() : ''

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('Invalid date')
    if (!description) errors.push('Missing description')

    const amount = Math.abs(parseFloat(amountStr))
    if (isNaN(amount) || amount === 0) errors.push('Invalid amount')

    const type: TransactionType = typeStr === 'income' ? 'income' : 'expense'
    if (typeStr && typeStr !== 'income' && typeStr !== 'expense') errors.push('Invalid type')

    const category = (ALL_CATEGORIES.includes(categoryStr as Category) ? categoryStr : 'other') as Category

    return {
      date: date || '',
      description: description || '',
      amount: isNaN(amount) ? 0 : amount,
      type,
      category,
      valid: errors.length === 0,
      errors,
    }
  })
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export function parsedRowsToTransactions(rows: ParsedRow[]): Omit<Transaction, 'id' | 'createdAt'>[] {
  return rows.filter((r) => r.valid).map((r) => ({
    date: r.date,
    description: r.description,
    amount: r.amount,
    type: r.type,
    category: r.category,
  }))
}
