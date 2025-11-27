import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renders with correct progress value', () => {
    const { container } = render(<ProgressBar progress={50} />)
    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toBeInTheDocument()
  })

  it('renders 0% progress', () => {
    render(<ProgressBar progress={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders 100% progress', () => {
    render(<ProgressBar progress={100} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<ProgressBar progress={75} label="Downloading" />)
    expect(screen.getByText('Downloading')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('clamps progress above 100', () => {
    const { container } = render(<ProgressBar progress={150} />)
    expect(screen.getByText('150%')).toBeInTheDocument()
    const fill = container.querySelector('[style*="width"]')
    expect(fill).toHaveStyle({ width: '100%' })
  })

  it('handles negative progress', () => {
    render(<ProgressBar progress={-10} />)
    expect(screen.getByText('-10%')).toBeInTheDocument()
  })
})
