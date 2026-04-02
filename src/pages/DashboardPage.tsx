import { Header } from '../components/layout/Header'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { HealthScoreGauge } from '../components/dashboard/HealthScoreGauge'
import { BalanceTrendChart } from '../components/dashboard/BalanceTrendChart'
import { SpendingBreakdown } from '../components/dashboard/SpendingBreakdown'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { QuickInsight } from '../components/dashboard/QuickInsight'
import { FinancialWeather } from '../components/dashboard/FinancialWeather'
import { QuickAddBar } from '../components/dashboard/QuickAddBar'

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Your financial overview" />
      <div className="p-6 space-y-6">
        <QuickAddBar />
        <SummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col">
            <BalanceTrendChart />
          </div>
          <div className="space-y-6">
            <FinancialWeather />
            <HealthScoreGauge />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingBreakdown />
          <RecentTransactions />
        </div>

        <QuickInsight />
      </div>
    </>
  )
}
