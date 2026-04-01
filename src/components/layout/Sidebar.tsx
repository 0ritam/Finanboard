import { NavLink } from 'react-router'
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Shield, Eye, Sun, Moon, Monitor, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useRoleStore } from '../../store/roleStore'
import { useUIStore } from '../../store/uiStore'
import { useTheme } from '../../hooks/useTheme'
import { useIsMobile } from '../../hooks/useMediaQuery'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
]

const themeIcons = { light: Sun, dark: Moon, system: Monitor }

export function Sidebar() {
  const role = useRoleStore((s) => s.role)
  const setRole = useRoleStore((s) => s.setRole)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)
  const { theme, cycleTheme } = useTheme()
  const isMobile = useIsMobile()

  const ThemeIcon = themeIcons[theme]

  if (isMobile) return null

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-surface transition-all duration-300',
          sidebarOpen ? 'w-60' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
            F
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-text-primary whitespace-nowrap">FinDash</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-light text-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                )
              }
            >
              <Icon size={20} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="border-t border-border p-3 space-y-2">
          {/* Role Toggle */}
          <button
            onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              'hover:bg-surface-hover',
              role === 'admin' ? 'text-primary' : 'text-text-secondary'
            )}
            title={`Switch to ${role === 'admin' ? 'Viewer' : 'Admin'} mode`}
          >
            {role === 'admin' ? <Shield size={20} className="shrink-0" /> : <Eye size={20} className="shrink-0" />}
            {sidebarOpen && (
              <span className="capitalize">{role}</span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
            title={`Theme: ${theme}`}
          >
            <ThemeIcon size={20} className="shrink-0" />
            {sidebarOpen && <span className="capitalize">{theme}</span>}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={20} className="shrink-0" /> : <ChevronRight size={20} className="shrink-0" />}
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}