import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TextStats } from './TextStats'

describe('TextStats', () => {
  it('displays character and word count', () => {
    render(<TextStats text="Hello world" />)
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Words')).toBeInTheDocument()
    expect(screen.getByText('Characters')).toBeInTheDocument()
  })

  it('displays zero counts for empty text', () => {
    render(<TextStats text="" />)
    expect(screen.getAllByText('0')).toHaveLength(2)
  })

  it('displays correct counts for CJK text', () => {
    render(<TextStats text="你好世界" />)
    expect(screen.getAllByText('4')).toHaveLength(2)
  })

  it('displays correct counts for mixed text', () => {
    render(<TextStats text="Hello 世界" />)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
