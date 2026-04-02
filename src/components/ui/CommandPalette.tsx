import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Search, LayoutDashboard, ArrowLeftRight, Lightbulb, ArrowUpRight, ArrowDownRight, Zap, Plus } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useTransactionStore } from '../../store/transactionStore'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import { useRoleStore } from '../../store/roleStore'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency } from '../../utils/formatters'
import { useToast } from './Toast'
import { cn } from '../../utils/cn'
import type { Category, TransactionType } from '../../types'

interface SearchResult {
  id: string
  type: 'page' | 'transaction' | 'quick-add'
  title: string
  subtitle?: string
  icon: React.ReactNode
  action: () => void
}

interface ParsedTransaction {
  description: string
  amount: number
  category: Category
  txType: TransactionType
  categoryLabel: string
}

function parseQuickAdd(input: string): ParsedTransaction | null {
  const q = input.trim()
  if (!q) return null

  // Extract amount: find a number (integer or decimal)
  const amountMatch = q.match(/\b(\d+(?:\.\d{1,2})?)\b/)
  if (!amountMatch) return null

  const amount = parseFloat(amountMatch[1])
  if (amount <= 0 || isNaN(amount)) return null

  // Remove the amount from the string to parse the rest
  const remaining = q.replace(amountMatch[0], '').trim()
  const words = remaining.toLowerCase().split(/\s+/).filter(Boolean)

  // Try to match a category from the words
  let matchedCategory: Category | null = null
  let matchedLabel = ''
  let categoryWordIdx = -1

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    for (const [key, config] of Object.entries(CATEGORIES)) {
      if (
        key.startsWith(word) ||
        config.label.toLowerCase().startsWith(word)
      ) {
        matchedCategory = key as Category
        matchedLabel = config.label
        categoryWordIdx = i
        break
      }
    }
    if (matchedCategory) break
  }

  // Default category
  if (!matchedCategory) {
    matchedCategory = 'other'
    matchedLabel = 'Other'
  }

  // Description = remaining words excluding the category word
  const descriptionWords = words.filter((_, i) => i !== categoryWordIdx)
  const description = descriptionWords.length > 0
    ? descriptionWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : matchedLabel

  // Determine type: check category first, then fall back to keyword detection
  const INCOME_KEYWORDS = [
    'salary', 'bonus', 'refund', 'cashback', 'dividend', 'payout',
    'freelance', 'income', 'payment', 'commission', 'tip', 'reward',
    'interest', 'reimbursement', 'deposit', 'wages', 'earnings',
    'profit', 'revenue', 'royalty', 'stipend', 'grant', 'pension',
    'allowance', 'settlement', 'rebate', 'return', 'prize', 'gift',
    'received', 'credited', 'earned', 'sold', 'won', 'inheritance',
    'rental', 'consulting', 'contract', 'gig', 'side-hustle',
  ]
  const catConfig = CATEGORIES[matchedCategory]
  let txType: TransactionType
  if (catConfig.type === 'income') {
    txType = 'income'
  } else if (catConfig.type === 'expense') {
    txType = 'expense'
  } else {
    const allWords = q.toLowerCase().split(/\s+/)
    const hasIncomeKeyword = allWords.some((w) => INCOME_KEYWORDS.some((kw) => kw.startsWith(w) || w.startsWith(kw)))
    txType = hasIncomeKeyword ? 'income' : 'expense'
  }

  return { description, amount, category: matchedCategory, txType, categoryLabel: matchedLabel }
}

const pages: SearchResult[] = [
  {
    id: 'page-dashboard',
    type: 'page',
    title: 'Dashboard',
    subtitle: 'Financial overview',
    icon: <LayoutDashboard size={16} />,
    action: () => {},
  },
  {
    id: 'page-transactions',
    type: 'page',
    title: 'Transactions',
    subtitle: 'Manage transactions',
    icon: <ArrowLeftRight size={16} />,
    action: () => {},
  },
  {
    id: 'page-insights',
    type: 'page',
    title: 'Insights',
    subtitle: 'Spending analysis',
    icon: <Lightbulb size={16} />,
    action: () => {},
  },
]

const pageRoutes: Record<string, string> = {
  'page-dashboard': '/',
  'page-transactions': '/transactions',
  'page-insights': '/insights',
}

export function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen)
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const transactions = useTransactionStore((s) => s.transactions)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const role = useRoleStore((s) => s.role)
  const navigate = useNavigate()
  const { toast } = useToast()

  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)

  const toggle = useCallback(() => setOpen(!open), [open, setOpen])
  useKeyboardShortcut('k', toggle, { ctrl: true })

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
    }
  }, [open])

  const parsed = useMemo(() => parseQuickAdd(query), [query])

  const results = useMemo((): SearchResult[] => {
    const q = query.toLowerCase().trim()
    const items: SearchResult[] = []

    // Quick Add (only for admins, shown first when a valid transaction is parsed)
    if (parsed && role === 'admin') {
      items.push({
        id: 'quick-add',
        type: 'quick-add',
        title: `Add: "${parsed.description}" — ${formatCurrency(parsed.amount)}`,
        subtitle: `${parsed.categoryLabel} · ${parsed.txType === 'income' ? 'Income' : 'Expense'} · Today`,
        icon: <Plus size={16} className="text-primary" />,
        action: () => {
          addTransaction({
            description: parsed.description,
            amount: parsed.amount,
            category: parsed.category,
            type: parsed.txType,
            date: new Date().toISOString().split('T')[0],
          })
          toast(`Added "${parsed.description}" — ${formatCurrency(parsed.amount)}`, 'success')
          setOpen(false)
        },
      })
    }

    // Pages
    const matchedPages = pages.filter(
      (p) => !q || p.title.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q)
    )
    items.push(...matchedPages.map((p) => ({
      ...p,
      action: () => {
        navigate(pageRoutes[p.id])
        setOpen(false)
      },
    })))

    // Transactions
    if (q) {
      const matchedTxs = transactions
        .filter((tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q)
        )
        .slice(0, 5)

      items.push(...matchedTxs.map((tx) => ({
        id: tx.id,
        type: 'transaction' as const,
        title: tx.description,
        subtitle: `${CATEGORIES[tx.category].label} · ${formatCurrency(tx.amount)}`,
        icon: tx.type === 'income'
          ? <ArrowUpRight size={16} className="text-income" />
          : <ArrowDownRight size={16} className="text-expense" />,
        action: () => {
          navigate('/transactions')
          setOpen(false)
        },
      })))
    }

    return items
  }, [query, parsed, transactions, navigate, setOpen, role, addTransaction, toast])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIdx]) {
        e.preventDefault()
        results[selectedIdx].action()
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, results, selectedIdx, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', duration: 0.25 }}
            className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search size={18} className="text-text-muted shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search or quick-add: &quot;coffee 5.50 dining&quot;"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
              />
              <kbd className="hidden sm:flex h-5 items-center rounded border border-border px-1.5 text-[10px] font-medium text-text-muted">
                ESC
              </kbd>
            </div>

            {/* Quick-add hint */}
            {parsed && role === 'admin' && (
              <div className="px-4 py-1.5 bg-primary-light/50 border-b border-border flex items-center gap-2">
                <Zap size={12} className="text-primary" />
                <span className="text-[11px] text-primary font-medium">
                  Quick Add detected — press Enter to add transaction instantly
                </span>
              </div>
            )}

            {/* Results */}
            <div className="max-h-64 overflow-auto p-2">
              {results.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-6">No results found</p>
              ) : (
                results.map((result, i) => (
                  <button
                    key={result.id}
                    onClick={result.action}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                      result.type === 'quick-add' && i === selectedIdx
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                        : i === selectedIdx
                          ? 'bg-primary-light text-primary'
                          : 'text-text-secondary hover:bg-surface-hover'
                    )}
                  >
                    <div className="shrink-0">{result.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-text-muted truncate">{result.subtitle}</p>
                      )}
                    </div>
                    {result.type === 'page' && (
                      <span className="text-[10px] text-text-muted uppercase tracking-wider">Page</span>
                    )}
                    {result.type === 'quick-add' && (
                      <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">Quick Add</span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-text-muted">
              <span><kbd className="font-mono">&#8593;&#8595;</kbd> Navigate</span>
              <span><kbd className="font-mono">&#9166;</kbd> Select</span>
              <span><kbd className="font-mono">Esc</kbd> Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
