import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Test error message" />)
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('renders with alert icon', () => {
    const { container } = render(<ErrorMessage message="Test error" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('does not render when message is empty', () => {
    const { container } = render(<ErrorMessage message="" />)
    expect(container.firstChild).toBeNull()
  })

  it('does not render when message is null', () => {
    const { container } = render(<ErrorMessage message={null} />)
    expect(container.firstChild).toBeNull()
  })
})
