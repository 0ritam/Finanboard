import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Search, LayoutDashboard, ArrowLeftRight, Lightbulb, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useTransactionStore } from '../../store/transactionStore'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency } from '../../utils/formatters'
import { cn } from '../../utils/cn'

interface SearchResult {
  id: string
  type: 'page' | 'transaction'
  title: string
  subtitle?: string
  icon: React.ReactNode
  action: () => void
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
  const navigate = useNavigate()

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

  const results = useMemo((): SearchResult[] => {
    const q = query.toLowerCase().trim()
    const items: SearchResult[] = []

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
  }, [query, transactions, navigate, setOpen])

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
                placeholder="Search pages, transactions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
              />
              <kbd className="hidden sm:flex h-5 items-center rounded border border-border px-1.5 text-[10px] font-medium text-text-muted">
                ESC
              </kbd>
            </div>

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
                      i === selectedIdx ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-surface-hover'
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
