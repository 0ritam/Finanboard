import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Variant = 'default' | 'income' | 'expense' | 'warning' | 'primary'

interface BadgeProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

const variants: Record<Variant, string> = {
  default: 'bg-surface-hover text-text-secondary',
  income: 'bg-income-light text-income',
  expense: 'bg-expense-light text-expense',
  warning: 'bg-warning-light text-warning',
  primary: 'bg-primary-light text-primary',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}