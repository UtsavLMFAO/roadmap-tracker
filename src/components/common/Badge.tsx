import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'completed' | 'overdue' | 'accent' | 'warning' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  const variantClasses = {
    default: 'bg-bg-subtle text-text-secondary border border-border-subtle',
    completed: 'bg-accent-subtle text-accent border border-accent/20 font-medium',
    overdue: 'bg-overdue/10 text-overdue border border-overdue/20 font-medium',
    accent: 'bg-accent text-white font-medium',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
    neutral: 'bg-bg-subtle text-text-primary'
  }[variant]

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium tracking-wide uppercase ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  )
}
