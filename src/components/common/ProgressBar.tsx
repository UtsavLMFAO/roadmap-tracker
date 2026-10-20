import React from 'react'

interface ProgressBarProps {
  value: number // 0 to 100
  height?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
  color?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 'md',
  showLabel = false,
  className = '',
  color
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)))

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  }[height]

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-text-secondary mb-1">
          <span>Progress</span>
          <span className="font-medium text-text-primary">{clampedValue}%</span>
        </div>
      )}
      <div
        className={`w-full bg-border/60 rounded-full overflow-hidden ${heightClasses}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            color || 'bg-accent'
          }`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
