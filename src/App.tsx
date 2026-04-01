import { Routes, Route } from 'react-router'
import { AppLayout } from './components/layout/AppLayout'
import { ToastProvider } from './components/ui/Toast'
import { CommandPalette } from './components/ui/CommandPalette'
import { useTheme } from './hooks/useTheme'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import InsightsPage from './pages/InsightsPage'

export default function App() {
  useTheme()

  return (
    <ToastProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </AppLayout>
      <CommandPalette />
    </ToastProvider>
  )
}