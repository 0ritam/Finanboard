import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { AlertTriangle } from 'lucide-react'
import { useTransactionStore } from '../../store/transactionStore'
import { useToast } from '../ui/Toast'
import type { Transaction } from '../../types'

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  transaction: Transaction | null
}

export function DeleteConfirmDialog({ open, onClose, transaction }: DeleteConfirmDialogProps) {
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const { toast } = useToast()

  const handleDelete = () => {
    if (transaction) {
      deleteTransaction(transaction.id)
      toast('Transaction deleted', 'success')
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-expense-light p-3 mb-4">
          <AlertTriangle size={24} className="text-expense" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">Delete Transaction</h3>
        <p className="mt-2 text-sm text-text-secondary max-w-xs">
          Are you sure you want to delete &ldquo;{transaction?.description}&rdquo;? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </Modal>
  )
}
