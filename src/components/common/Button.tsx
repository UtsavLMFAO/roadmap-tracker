import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 select-none disabled:opacity-40 disabled:cursor-not-allowed'

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-3.5 py-2 min-h-[44px] gap-2',
    lg: 'text-base px-4 py-2.5 min-h-[48px] gap-2.5',
  }[size]

  const variantClasses = {
    primary:
      'bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent active:opacity-95',
    secondary:
      'bg-bg-card text-text-primary border border-border hover:bg-bg-subtle focus-visible:ring-text-secondary active:opacity-95',
    tertiary:
      'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-subtle focus-visible:ring-text-secondary',
    danger:
      'bg-overdue text-white hover:opacity-90 focus-visible:ring-overdue',
  }[variant]

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
