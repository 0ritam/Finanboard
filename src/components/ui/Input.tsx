import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary',
          'placeholder:text-text-muted',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          'transition-colors',
          error && 'border-expense focus:border-expense focus:ring-expense/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-expense">{error}</p>}
    </div>
  )
}