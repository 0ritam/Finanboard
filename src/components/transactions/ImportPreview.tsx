import { CheckCircle, XCircle } from 'lucide-react'
import type { ParsedRow } from '../../utils/csvParser'
import { formatCurrency } from '../../utils/formatters'
import { cn } from '../../utils/cn'

interface ImportPreviewProps {
  rows: ParsedRow[]
}

export function ImportPreview({ rows }: ImportPreviewProps) {
  return (
    <div className="max-h-64 overflow-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface-hover sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Status</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Date</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Description</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Amount</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Type</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Category</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                'border-t border-border',
                !row.valid && 'bg-expense-light/50'
              )}
            >
              <td className="px-3 py-2">
                {row.valid ? (
                  <CheckCircle size={14} className="text-income" />
                ) : (
                  <span title={row.errors.join(', ')}><XCircle size={14} className="text-expense" /></span>
                )}
              </td>
              <td className="px-3 py-2 text-text-primary">{row.date}</td>
              <td className="px-3 py-2 text-text-primary truncate max-w-[150px]">{row.description}</td>
              <td className="px-3 py-2 text-text-primary tabular-nums">{formatCurrency(row.amount)}</td>
              <td className="px-3 py-2 capitalize text-text-secondary">{row.type}</td>
              <td className="px-3 py-2 capitalize text-text-secondary">{row.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
