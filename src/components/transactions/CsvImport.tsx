import { useState, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ImportPreview } from './ImportPreview'
import { parseCSV, parsedRowsToTransactions, type ParsedRow } from '../../utils/csvParser'
import { useTransactionStore } from '../../store/transactionStore'
import { useToast } from '../ui/Toast'
import { cn } from '../../utils/cn'

interface CsvImportProps {
  open: boolean
  onClose: () => void
}

export function CsvImport({ open, onClose }: CsvImportProps) {
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [dragging, setDragging] = useState(false)
  const addTransactions = useTransactionStore((s) => s.addTransactions)
  const { toast } = useToast()

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      setRows(parsed)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) {
      handleFile(file)
    }
  }, [handleFile])

  const handleImport = () => {
    const validTxs = parsedRowsToTransactions(rows)
    if (validTxs.length > 0) {
      addTransactions(validTxs)
      toast(`Imported ${validTxs.length} transactions`, 'success')
      setRows([])
      onClose()
    }
  }

  const handleClose = () => {
    setRows([])
    onClose()
  }

  const validCount = rows.filter((r) => r.valid).length

  return (
    <Modal open={open} onClose={handleClose} title="Import CSV" className="max-w-2xl">
      {rows.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors',
            dragging ? 'border-primary bg-primary-light' : 'border-border'
          )}
        >
          <Upload size={32} className="text-text-muted mb-3" />
          <p className="text-sm font-medium text-text-primary">
            Drag & drop a CSV file here
          </p>
          <p className="text-xs text-text-muted mt-1">
            Columns: date, description, amount, type, category
          </p>
          <label className="mt-4 cursor-pointer">
            <Button variant="secondary" size="sm" type="button" onClick={() => {}}>
              Browse Files
            </Button>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </label>
        </div>
      ) : (
        <>
          <ImportPreview rows={rows} />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-text-secondary">
              {validCount} of {rows.length} rows valid
            </span>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setRows([])}>
                Clear
              </Button>
              <Button onClick={handleImport} disabled={validCount === 0}>
                Import {validCount} Transactions
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
