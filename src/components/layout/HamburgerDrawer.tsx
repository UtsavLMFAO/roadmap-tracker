import React, { useEffect } from 'react'
import {
  X,
  FolderGit2,
  Bookmark,
  CalendarCheck,
  Settings,
  Database,
  Code2,
  Briefcase,
  LucideIcon
} from 'lucide-react'
import { useApp, AppScreen } from '../../context/AppContext'

export const HamburgerDrawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen, setCurrentScreen, currentScreen } = useApp()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false)
      }
    }
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDrawerOpen, setIsDrawerOpen])

  if (!isDrawerOpen) return null

  const handleSelect = (screen: AppScreen) => {
    setCurrentScreen(screen)
    setIsDrawerOpen(false)
  }

  const drawerItems: { id: AppScreen; label: string; icon: LucideIcon }[] = [
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'resources', label: 'Resources', icon: Bookmark },
    { id: 'algorithms', label: 'Algorithm Tracker', icon: Code2 },
    { id: 'applications', label: 'Job Applications', icon: Briefcase },
    { id: 'weekly-review', label: 'Weekly Review', icon: CalendarCheck },
    { id: 'settings', label: 'Settings & Data Backup', icon: Settings },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={() => setIsDrawerOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Drawer"
    >
      <div
        className="w-72 max-w-[85vw] h-full bg-bg-card border-l border-border flex flex-col justify-between p-5 shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="font-semibold text-text-primary text-base">Menu</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-4 space-y-1">
            {drawerItems.map(item => {
              const Icon = item.icon
              const isActive = currentScreen === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-accent-subtle text-accent font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-text-secondary">
          <Database size={14} className="text-accent shrink-0" />
          <span>Local-first · No account required</span>
        </div>
      </div>
    </div>
  )
}
