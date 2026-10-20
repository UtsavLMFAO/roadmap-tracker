import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { ProgressBar } from '../components/common/ProgressBar'

describe('UI Common Components', () => {
  it('renders Button with custom label and handles disabled state', () => {
    render(<Button disabled>Click Me</Button>)
    const btn = screen.getByRole('button', { name: /click me/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toBeDisabled()
  })

  it('renders Badge with text and variant', () => {
    render(<Badge variant="completed">Completed</Badge>)
    const badge = screen.getByText(/completed/i)
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('text-accent')
  })

  it('renders ProgressBar with aria values and clamped bounds', () => {
    render(<ProgressBar value={120} showLabel />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
