import React from 'react'
import { CheckSquare, Route, BarChart2, BookOpen, LucideIcon } from 'lucide-react'
import { useApp, AppScreen } from '../../context/AppContext'

interface NavItem {
  id: AppScreen
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { id: 'today', label: 'Today', icon: CheckSquare },
  { id: 'roadmap', label: 'Roadmap', icon: Route },
  { id: 'progress', label: 'Progress', icon: BarChart2 },
  { id: 'journal', label: 'Journal', icon: BookOpen }
]

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-card/95 backdrop-blur-md border-t border-border px-2 pb-[calc(var(--safe-bottom)+4px)] pt-1"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = currentScreen === item.id

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-150 min-h-[48px] select-none ${
                isActive
                  ? 'text-accent font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-accent-subtle text-accent' : 'text-text-secondary'
                }`}
              >
                <Icon size={20} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
