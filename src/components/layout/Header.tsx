import React from 'react'
import { Menu } from 'lucide-react'
import { useApp } from '../../context/AppContext'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, action }) => {
  const { setIsDrawerOpen } = useApp()

  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {action}
          
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 -mr-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}
