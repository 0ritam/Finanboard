import { useState } from 'react'
import { Plus, Download, Upload } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import { TransactionList } from '../components/transactions/TransactionList'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { DeleteConfirmDialog } from '../components/transactions/DeleteConfirmDialog'
import { CsvImport } from '../components/transactions/CsvImport'
import { useRoleStore } from '../store/roleStore'
import { useFilteredTransactions } from '../hooks/useTransactions'
import { exportToCSV } from '../utils/exportUtils'
import type { Transaction } from '../types'

export default function TransactionsPage() {
  const role = useRoleStore((s) => s.role)
  const filteredTransactions = useFilteredTransactions()

  const [formOpen, setFormOpen] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [deleteTx, setDeleteTx] = useState<Transaction | null>(null)
  const [importOpen, setImportOpen] = useState(false)

  const handleEdit = (tx: Transaction) => {
    setEditTx(tx)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditTx(null)
  }

  return (
    <>
      <Header title="Transactions" subtitle="Manage your transactions" />
      <div className="p-6 space-y-6">
        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3">
          {role === 'admin' && (
            <>
              <Button icon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
                Add Transaction
              </Button>
              <Button variant="secondary" icon={<Upload size={16} />} onClick={() => setImportOpen(true)}>
                Import CSV
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={() => exportToCSV(filteredTransactions)}
          >
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <TransactionFilters />
        </Card>

        {/* List */}
        <Card className="p-0 sm:p-0">
          <div className="p-4 sm:p-6">
            <TransactionList onEdit={handleEdit} onDelete={setDeleteTx} />
          </div>
        </Card>
      </div>

      <TransactionForm open={formOpen} onClose={handleCloseForm} editTransaction={editTx} />
      <DeleteConfirmDialog open={!!deleteTx} onClose={() => setDeleteTx(null)} transaction={deleteTx} />
      <CsvImport open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  )
}
