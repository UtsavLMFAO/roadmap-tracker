import React from 'react'
import {
  CheckSquare,
  Route,
  BarChart2,
  BookOpen,
  FolderGit2,
  Bookmark,
  Code2,
  Briefcase,
  CalendarCheck,
  Settings,
  Database,
  LucideIcon
} from 'lucide-react'
import { useApp, AppScreen } from '../../context/AppContext'

interface SidebarItem {
  id: AppScreen
  label: string
  icon: LucideIcon
}

const primaryItems: SidebarItem[] = [
  { id: 'today', label: 'Today', icon: CheckSquare },
  { id: 'roadmap', label: 'Roadmap', icon: Route },
  { id: 'progress', label: 'Progress', icon: BarChart2 },
  { id: 'journal', label: 'Journal', icon: BookOpen }
]

const secondaryItems: SidebarItem[] = [
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'resources', label: 'Resources', icon: Bookmark },
  { id: 'algorithms', label: 'Algorithm Tracker', icon: Code2 },
  { id: 'applications', label: 'Applications', icon: Briefcase },
  { id: 'weekly-review', label: 'Weekly Review', icon: CalendarCheck },
  { id: 'settings', label: 'Settings & Backup', icon: Settings }
]

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-bg-card border-r border-border min-h-screen sticky top-0 h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm">
          RT
        </div>
        <div>
          <span className="font-semibold text-text-primary text-sm tracking-tight block">
            Roadmap Tracker
          </span>
          <span className="text-[11px] text-text-secondary block">
            2026 – 2028 Plan
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="p-3 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-text-secondary px-3 py-1 tracking-wider">
          Workspace
        </div>
        {primaryItems.map(item => {
          const Icon = item.icon
          const isActive = currentScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
      </div>

      {/* Secondary Nav */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] uppercase font-semibold text-text-secondary px-3 py-1 tracking-wider">
          Secondary
        </div>
        {secondaryItems.map(item => {
          const Icon = item.icon
          const isActive = currentScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
      </div>

      {/* Local-first Footer */}
      <div className="p-4 border-t border-border text-[11px] text-text-secondary flex items-center gap-2">
        <Database size={13} className="shrink-0 text-accent" />
        <span>Local-first · No account</span>
      </div>
    </aside>
  )
}
