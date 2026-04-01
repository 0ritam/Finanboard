import { NavLink } from 'react-router'
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useIsMobile } from '../../hooks/useMediaQuery'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
]

export function MobileNav() {
  const isMobile = useIsMobile()
  if (!isMobile) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-surface/95 backdrop-blur-sm">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-text-muted'
            )
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}