import { DollarSign, Receipt, Repeat } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { FinancialHealthScore } from '../components/insights/FinancialHealthScore'
import { BudgetGoals } from '../components/insights/BudgetGoals'
import { AnomalySummary } from '../components/insights/AnomalySummary'
import { HighestSpending } from '../components/insights/HighestSpending'
import { MonthlyComparison } from '../components/insights/MonthlyComparison'
import { SpendingTrends } from '../components/insights/SpendingTrends'
import { InsightCard } from '../components/insights/InsightCard'
import { useTopInsights } from '../hooks/useInsights'
import { formatCurrency } from '../utils/formatters'

export default function InsightsPage() {
  const { avgDaily, biggestExpense, mostFrequent } = useTopInsights()

  return (
    <>
      <Header title="Insights" subtitle="Understand your spending patterns" />
      <div className="p-6 space-y-6">
        {/* Health Score */}
        <FinancialHealthScore />

        {/* Budget + Anomalies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetGoals />
          <AnomalySummary />
        </div>

        {/* Charts */}
        <MonthlyComparison />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HighestSpending />
          <SpendingTrends />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InsightCard
            title="Avg Daily Expense"
            value={formatCurrency(avgDaily)}
            icon={<DollarSign size={18} className="text-primary" />}
            iconBg="bg-primary-light"
            delay={0.4}
          />
          <InsightCard
            title="Biggest Expense"
            value={biggestExpense ? formatCurrency(biggestExpense.amount) : '$0'}
            subtitle={biggestExpense?.description}
            icon={<Receipt size={18} className="text-expense" />}
            iconBg="bg-expense-light"
            delay={0.5}
          />
          <InsightCard
            title="Most Frequent"
            value={mostFrequent?.label || 'N/A'}
            subtitle={mostFrequent ? `${mostFrequent.count} transactions` : undefined}
            icon={<Repeat size={18} className="text-income" />}
            iconBg="bg-income-light"
            delay={0.6}
          />
        </div>
      </div>
    </>
  )
}
