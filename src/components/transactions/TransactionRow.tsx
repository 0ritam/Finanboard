import { Pencil, Trash2, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { AnomalyFlag, Transaction } from '../../types'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useRoleStore } from '../../store/roleStore'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

interface TransactionRowProps {
  transaction: Transaction
  anomaly?: AnomalyFlag
  onEdit: (tx: Transaction) => void
  onDelete: (tx: Transaction) => void
}

export function TransactionRow({ transaction: tx, anomaly, onEdit, onDelete }: TransactionRowProps) {
  const role = useRoleStore((s) => s.role)
  const config = CATEGORIES[tx.category]

  return (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-surface-hover',
        anomaly && 'ring-1 ring-warning/30'
      )}
    >
      <div className={cn('rounded-lg p-2 shrink-0', config.bgColor)}>
        {tx.type === 'income' ? (
          <ArrowUpRight size={18} className="text-income" />
        ) : (
          <ArrowDownRight size={18} className="text-expense" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary truncate">{tx.description}</p>
          {anomaly && (
            <Badge variant="warning" className="shrink-0">
              <AlertTriangle size={10} />
              {anomaly.multiplier}x avg
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant={tx.type === 'income' ? 'income' : 'expense'}>
            {config.label}
          </Badge>
          <span className="text-xs text-text-muted">{formatDate(tx.date)}</span>
        </div>
      </div>

      <span
        className={cn(
          'text-sm font-semibold tabular-nums shrink-0',
          tx.type === 'income' ? 'text-income' : 'text-expense'
        )}
      >
        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
      </span>

      {role === 'admin' && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(tx)}
            className="rounded-lg p-1.5 text-text-muted hover:bg-primary-light hover:text-primary transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(tx)}
            className="rounded-lg p-1.5 text-text-muted hover:bg-expense-light hover:text-expense transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
