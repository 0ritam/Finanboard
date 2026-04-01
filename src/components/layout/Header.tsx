import { Search, Menu } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useRoleStore } from '../../store/roleStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { Badge } from '../ui/Badge'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const role = useRoleStore((s) => s.role)
  const isMobile = useIsMobile()

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button onClick={toggleSidebar} className="text-text-secondary hover:text-text-primary">
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={role === 'admin' ? 'primary' : 'default'}>
          {role === 'admin' ? 'Admin' : 'Viewer'}
        </Badge>
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface-hover px-3 py-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border px-1.5 text-[10px] font-medium text-text-muted">
            Ctrl+K
          </kbd>
        </button>
      </div>
    </header>
  )
}