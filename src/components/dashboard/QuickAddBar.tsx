import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Zap, Plus, ArrowRight, Sparkles } from 'lucide-react'
import { useTransactionStore } from '../../store/transactionStore'
import { useRoleStore } from '../../store/roleStore'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency } from '../../utils/formatters'
import { useToast } from '../ui/Toast'
import { cn } from '../../utils/cn'
import type { Category, TransactionType } from '../../types'

interface ParsedTransaction {
  description: string
  amount: number
  category: Category
  txType: TransactionType
  categoryLabel: string
}

const EXAMPLES = [
  'coffee 5.50 dining',
  'salary 20000',
  'uber 15 transport',
  'netflix 12 subscriptions',
  'groceries 85',
  'freelance 500',
  'rent 1200',
]

const INCOME_KEYWORDS = [
  'salary', 'bonus', 'refund', 'cashback', 'dividend', 'payout',
  'freelance', 'income', 'payment', 'commission', 'tip', 'reward',
  'interest', 'reimbursement', 'deposit', 'wages', 'earnings',
  'profit', 'revenue', 'royalty', 'stipend', 'grant', 'pension',
  'allowance', 'settlement', 'rebate', 'return', 'prize', 'gift',
  'received', 'credited', 'earned', 'sold', 'won', 'inheritance',
  'rental', 'consulting', 'contract', 'gig', 'side-hustle',
]

function parseQuickAdd(input: string): ParsedTransaction | null {
  const q = input.trim()
  if (!q) return null

  const amountMatch = q.match(/\b(\d+(?:\.\d{1,2})?)\b/)
  if (!amountMatch) return null

  const amount = parseFloat(amountMatch[1])
  if (amount <= 0 || isNaN(amount)) return null

  const remaining = q.replace(amountMatch[0], '').trim()
  const words = remaining.toLowerCase().split(/\s+/).filter(Boolean)

  let matchedCategory: Category | null = null
  let matchedLabel = ''
  let categoryWordIdx = -1

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    for (const [key, config] of Object.entries(CATEGORIES)) {
      if (key.startsWith(word) || config.label.toLowerCase().startsWith(word)) {
        matchedCategory = key as Category
        matchedLabel = config.label
        categoryWordIdx = i
        break
      }
    }
    if (matchedCategory) break
  }

  if (!matchedCategory) {
    matchedCategory = 'other'
    matchedLabel = 'Other'
  }

  const descriptionWords = words.filter((_, i) => i !== categoryWordIdx)
  const description =
    descriptionWords.length > 0
      ? descriptionWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : matchedLabel

  // Determine type: check category first, then fall back to keyword detection
  const catConfig = CATEGORIES[matchedCategory]
  let txType: TransactionType
  if (catConfig.type === 'income') {
    txType = 'income'
  } else if (catConfig.type === 'expense') {
    txType = 'expense'
  } else {
    // Category is 'both' (e.g. "other") — detect from keywords in the input
    const allWords = q.toLowerCase().split(/\s+/)
    const hasIncomeKeyword = allWords.some((w) => INCOME_KEYWORDS.some((kw) => kw.startsWith(w) || w.startsWith(kw)))
    txType = hasIncomeKeyword ? 'income' : 'expense'
  }

  return { description, amount, category: matchedCategory, txType, categoryLabel: matchedLabel }
}

function AnimatedPlaceholder() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % EXAMPLES.length)
        setVisible(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="absolute left-0 top-0 h-full flex items-center pointer-events-none text-text-secondary select-none"
        >
          Try: "{EXAMPLES[index]}"
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function QuickAddBar() {
  const [input, setInput] = useState('')
  const [justAdded, setJustAdded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const role = useRoleStore((s) => s.role)
  const { toast } = useToast()

  const parsed = useMemo(() => parseQuickAdd(input), [input])

  if (role !== 'admin') return null

  const handleAdd = () => {
    if (!parsed) return
    addTransaction({
      description: parsed.description,
      amount: parsed.amount,
      category: parsed.category,
      type: parsed.txType,
      date: new Date().toISOString().split('T')[0],
    })
    toast(`Added "${parsed.description}" — ${formatCurrency(parsed.amount)}`, 'success')
    setInput('')
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && parsed) {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          <span className="text-xs font-semibold text-text-primary">Quick Add Transaction</span>
        </div>
        <span className="text-[11px] text-text-secondary">
          Type a description, amount &amp; category to instantly add a transaction
        </span>
      </div>
      <div
        className={cn(
          'relative rounded-2xl border bg-surface p-1 transition-all duration-300',
          parsed
            ? 'border-primary/40 shadow-[0_0_20px_-4px_var(--color-primary)]'
            : 'border-border'
        )}
      >
        {/* Main input row */}
        <div className="flex items-center gap-3 px-4 py-2">
          <motion.div
            animate={justAdded ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {justAdded ? (
              <Sparkles size={20} className="text-primary" />
            ) : (
              <Zap size={20} className="text-primary" />
            )}
          </motion.div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-text-primary outline-none relative z-10"
            />
            {!input && <AnimatedPlaceholder />}
          </div>

          <AnimatePresence>
            {parsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                onClick={handleAdd}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
              >
                <Plus size={14} />
                Add
              </motion.button>
            )}
          </AnimatePresence>

          {!parsed && (
            <span className="text-[10px] text-text-secondary hidden sm:block whitespace-nowrap">
              Type amount + category
            </span>
          )}
        </div>

        {/* Live preview */}
        <AnimatePresence>
          {parsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-2 mx-1 mb-1 rounded-xl bg-primary-light/50 text-xs">
                <ArrowRight size={12} className="text-primary shrink-0" />
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-text-primary">
                    {parsed.description}
                  </span>
                  <span className="tabular-nums font-bold" style={{ color: parsed.txType === 'income' ? 'var(--color-income)' : 'var(--color-expense)' }}>
                    {parsed.txType === 'income' ? '+' : '-'}{formatCurrency(parsed.amount)}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      color: CATEGORIES[parsed.category].color,
                      backgroundColor: `${CATEGORIES[parsed.category].color}18`,
                    }}
                  >
                    {parsed.categoryLabel}
                  </span>
                  <span className="text-text-muted">
                    {parsed.txType === 'income' ? 'Income' : 'Expense'} · Today
                  </span>
                </div>
                <kbd className="ml-auto hidden sm:flex h-5 items-center rounded border border-border bg-surface px-1.5 text-[10px] font-medium text-text-muted whitespace-nowrap">
                  Enter &#9166;
                </kbd>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
