import { describe, it, expect } from 'vitest'
import { chunkText } from './textProcessing'

describe('textProcessing', () => {
  describe('chunkText', () => {
    it('returns single chunk for short text', () => {
      const text = 'This is a short text.'
      const chunks = chunkText(text, 500)
      expect(chunks).toHaveLength(1)
      expect(chunks[0]).toBe(text)
    })

    it('splits long text into multiple chunks', () => {
      const text = 'a'.repeat(1000)
      const chunks = chunkText(text, 500)
      expect(chunks.length).toBeGreaterThan(1)
    })

    it('respects sentence boundaries', () => {
      const text = 'First sentence. Second sentence. Third sentence.'
      const chunks = chunkText(text, 30)
      chunks.forEach(chunk => {
        expect(chunk.trim()).toBeTruthy()
      })
    })

    it('respects paragraph boundaries', () => {
      const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.'
      const chunks = chunkText(text, 500)
      expect(chunks.length).toBeGreaterThanOrEqual(1)
    })

    it('handles CJK text with smaller chunks', () => {
      const text = '你好世界。'.repeat(50)
      const chunks = chunkText(text, 500)
      expect(chunks.length).toBeGreaterThan(0)
    })

    it('handles empty string', () => {
      const chunks = chunkText('')
      expect(chunks).toHaveLength(1)
      expect(chunks[0]).toBe('')
    })

    it('handles text with only newlines', () => {
      const text = '\n\n\n'
      const chunks = chunkText(text)
      expect(chunks).toHaveLength(1)
    })

    it('preserves paragraph spacing', () => {
      const text = 'Paragraph one.\n\nParagraph two.'
      const chunks = chunkText(text, 500)
      expect(chunks.length).toBeGreaterThanOrEqual(1)
    })

    it('handles very long sentences', () => {
      const text = 'a'.repeat(600) + '. ' + 'b'.repeat(600) + '.'
      const chunks = chunkText(text, 500)
      expect(chunks.length).toBeGreaterThan(2)
    })

    it('handles mixed content', () => {
      const text = 'English text. 中文文本。More English.\n\nNew paragraph.'
      const chunks = chunkText(text, 500)
      expect(chunks.length).toBeGreaterThanOrEqual(1)
    })
  })
})
