import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { useTransactionStore } from '../../store/transactionStore'
import { useToast } from '../ui/Toast'
import { ALL_CATEGORIES, CATEGORIES } from '../../data/categories'
import type { Category, Transaction, TransactionType } from '../../types'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  editTransaction?: Transaction | null
}

export function TransactionForm({ open, onClose, editTransaction }: TransactionFormProps) {
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const updateTransaction = useTransactionStore((s) => s.updateTransaction)
  const { toast } = useToast()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState<Category>('other')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editTransaction) {
      setDescription(editTransaction.description)
      setAmount(editTransaction.amount.toString())
      setType(editTransaction.type)
      setCategory(editTransaction.category)
      setDate(editTransaction.date)
    } else {
      setDescription('')
      setAmount('')
      setType('expense')
      setCategory('other')
      setDate(new Date().toISOString().split('T')[0])
    }
    setErrors({})
  }, [editTransaction, open])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!description.trim()) errs.description = 'Required'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = 'Enter a valid amount'
    if (!date) errs.date = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const txData = {
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      date,
    }

    if (editTransaction) {
      updateTransaction(editTransaction.id, txData)
      toast('Transaction updated', 'success')
    } else {
      addTransaction(txData)
      toast('Transaction added', 'success')
    }

    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editTransaction ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Grocery shopping"
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            error={errors.amount}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Type</label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  type === 'expense'
                    ? 'bg-expense text-white'
                    : 'bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  type === 'income'
                    ? 'bg-income text-white'
                    : 'bg-surface text-text-secondary hover:bg-surface-hover'
                }`}
              >
                Income
              </button>
            </div>
          </div>
        </div>

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          options={ALL_CATEGORIES.map((cat) => ({
            value: cat,
            label: CATEGORIES[cat].label,
          }))}
        />

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editTransaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </Modal>
  )
}
