import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { useBudgetStore } from '../../store/budgetStore'
import { useToast } from '../ui/Toast'
import { EXPENSE_CATEGORIES, CATEGORIES } from '../../data/categories'
import { formatCurrency } from '../../utils/formatters'
import { Trash2 } from 'lucide-react'
import type { Category } from '../../types'

interface BudgetGoalFormProps {
  open: boolean
  onClose: () => void
}

export function BudgetGoalForm({ open, onClose }: BudgetGoalFormProps) {
  const budgets = useBudgetStore((s) => s.budgets)
  const setBudget = useBudgetStore((s) => s.setBudget)
  const removeBudget = useBudgetStore((s) => s.removeBudget)
  const { toast } = useToast()

  const [category, setCategory] = useState<Category>(EXPENSE_CATEGORIES[0])
  const [limit, setLimit] = useState('')

  const handleAdd = () => {
    const amount = Number(limit)
    if (amount > 0) {
      setBudget(category, amount)
      setLimit('')
      toast(`Budget set for ${CATEGORIES[category].label}`, 'success')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage Budget Goals">
      {/* Existing budgets */}
      {budgets.length > 0 && (
        <div className="space-y-2 mb-4">
          {budgets.map((b) => (
            <div key={b.category} className="flex items-center justify-between rounded-lg bg-surface-hover p-3">
              <div>
                <span className="text-sm font-medium text-text-primary">
                  {CATEGORIES[b.category].label}
                </span>
                <span className="text-sm text-text-muted ml-2">{formatCurrency(b.limit)}/mo</span>
              </div>
              <button
                onClick={() => {
                  removeBudget(b.category)
                  toast('Budget removed', 'success')
                }}
                className="text-text-muted hover:text-expense transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new */}
      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium text-text-secondary mb-3">Add Budget Goal</p>
        <div className="flex gap-3">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            options={EXPENSE_CATEGORIES.map((cat) => ({
              value: cat,
              label: CATEGORIES[cat].label,
            }))}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-28"
          />
          <Button onClick={handleAdd} size="md">
            Add
          </Button>
        </div>
      </div>
    </Modal>
  )
}
