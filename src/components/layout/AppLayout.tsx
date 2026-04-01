import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { useUIStore } from '../../store/uiStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { cn } from '../../utils/cn'

export function AppLayout({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1519]">
      <Sidebar />
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          isMobile ? 'pb-16' : sidebarOpen ? 'ml-60' : 'ml-16'
        )}
      >
        {children}
      </main>
      <MobileNav />
    </div>
  )
}