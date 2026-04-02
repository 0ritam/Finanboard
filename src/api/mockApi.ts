/**
 * Mock API Layer
 *
 * Simulates async network calls with realistic delays.
 * In production, swap these functions with real fetch() calls
 * without changing any store or component code.
 */

import { mockTransactions } from '../data/mockTransactions'
import type { Transaction, BudgetGoal, Category } from '../types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Simulated latency range (ms)
const API_DELAY = { min: 300, max: 600 }

function randomDelay() {
  const ms = API_DELAY.min + Math.random() * (API_DELAY.max - API_DELAY.min)
  return delay(ms)
}

// ─── Transactions ──────────────────────────────────────────

export async function fetchTransactions(): Promise<Transaction[]> {
  await randomDelay()
  return structuredClone(mockTransactions)
}

export async function createTransaction(
  tx: Omit<Transaction, 'id' | 'createdAt'>
): Promise<Transaction> {
  await randomDelay()
  return {
    ...tx,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
}

export async function createTransactionsBatch(
  txs: Omit<Transaction, 'id' | 'createdAt'>[]
): Promise<Transaction[]> {
  await randomDelay()
  return txs.map((tx) => ({
    ...tx,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }))
}

export async function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Promise<{ id: string; updates: Partial<Transaction> }> {
  await randomDelay()
  return { id, updates }
}

export async function deleteTransaction(id: string): Promise<{ id: string }> {
  await randomDelay()
  return { id }
}

// ─── Budgets ───────────────────────────────────────────────

const defaultBudgets: BudgetGoal[] = [
  { category: 'dining', limit: 400 },
  { category: 'groceries', limit: 500 },
  { category: 'entertainment', limit: 200 },
  { category: 'transport', limit: 200 },
  { category: 'shopping', limit: 300 },
]

export async function fetchBudgets(): Promise<BudgetGoal[]> {
  await randomDelay()
  return structuredClone(defaultBudgets)
}

export async function saveBudget(
  category: Category,
  limit: number
): Promise<BudgetGoal> {
  await randomDelay()
  return { category, limit }
}

export async function removeBudget(
  category: Category
): Promise<{ category: Category }> {
  await randomDelay()
  return { category }
}
