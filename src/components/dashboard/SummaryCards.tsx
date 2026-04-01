import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'
import { SummaryCard } from './SummaryCard'
import { useTransactionSummary } from '../../hooks/useTransactions'
import { useTransactionStore } from '../../store/transactionStore'
import { getSparklineData } from '../../utils/chartHelpers'
import { useMemo } from 'react'

export function SummaryCards() {
  const { balance, totalIncome, totalExpense, savingsRate } = useTransactionSummary()
  const transactions = useTransactionStore((s) => s.transactions)

  const balanceSparkline = useMemo(() => getSparklineData(transactions), [transactions])
  const incomeSparkline = useMemo(
    () => transactions.filter((t) => t.type === 'income')
      .reduce((acc, tx) => {
        const month = tx.date.slice(0, 7)
        const existing = acc.find((a) => a.month === month)
        if (existing) existing.value += tx.amount
        else acc.push({ month, value: tx.amount })
        return acc
      }, [] as Array<{ month: string; value: number }>)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(({ value }) => ({ value })),
    [transactions]
  )
  const expenseSparkline = useMemo(
    () => transactions.filter((t) => t.type === 'expense')
      .reduce((acc, tx) => {
        const month = tx.date.slice(0, 7)
        const existing = acc.find((a) => a.month === month)
        if (existing) existing.value += tx.amount
        else acc.push({ month, value: tx.amount })
        return acc
      }, [] as Array<{ month: string; value: number }>)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(({ value }) => ({ value })),
    [transactions]
  )

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Balance"
        value={balance}
        icon={<Wallet size={20} className="text-primary" />}
        iconBg="bg-primary-light"
        sparklineData={balanceSparkline}
        sparklineColor="#10b981"
        delay={0}
      />
      <SummaryCard
        title="Total Income"
        value={totalIncome}
        trend={8.2}
        icon={<TrendingUp size={20} className="text-income" />}
        iconBg="bg-income-light"
        sparklineData={incomeSparkline}
        sparklineColor="#14b8a6"
        delay={0.1}
      />
      <SummaryCard
        title="Total Expenses"
        value={totalExpense}
        trend={-3.5}
        icon={<TrendingDown size={20} className="text-expense" />}
        iconBg="bg-expense-light"
        sparklineData={expenseSparkline}
        sparklineColor="#f43f5e"
        delay={0.2}
      />
      <SummaryCard
        title="Savings Rate"
        value={Math.round(savingsRate)}
        prefix=""
        suffix="%"
        icon={<PiggyBank size={20} className="text-primary" />}
        iconBg="bg-primary-light"
        delay={0.3}
      />
    </div>
  )
}
