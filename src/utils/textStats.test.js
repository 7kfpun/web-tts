import { describe, it, expect } from 'vitest'
import { getWordCount, getCharCount } from './textStats'

describe('textStats', () => {
  describe('getWordCount', () => {
    it('returns 0 for empty string', () => {
      expect(getWordCount('')).toBe(0)
    })

    it('returns 0 for whitespace only', () => {
      expect(getWordCount('   ')).toBe(0)
    })

    it('counts English words correctly', () => {
      expect(getWordCount('Hello world')).toBe(2)
      expect(getWordCount('The quick brown fox')).toBe(4)
    })

    it('counts CJK characters individually', () => {
      expect(getWordCount('你好世界')).toBe(4)
    })

    it('counts mixed CJK and English text', () => {
      expect(getWordCount('Hello 世界')).toBe(3)
      expect(getWordCount('你好 world test')).toBe(4)
    })

    it('handles multiple spaces between words', () => {
      expect(getWordCount('Hello   world')).toBe(2)
    })

    it('handles null and undefined', () => {
      expect(getWordCount(null)).toBe(0)
      expect(getWordCount(undefined)).toBe(0)
    })
  })

  describe('getCharCount', () => {
    it('returns 0 for empty string', () => {
      expect(getCharCount('')).toBe(0)
    })

    it('returns 0 for null or undefined', () => {
      expect(getCharCount(null)).toBe(0)
      expect(getCharCount(undefined)).toBe(0)
    })

    it('counts all characters including spaces', () => {
      expect(getCharCount('Hello world')).toBe(11)
      expect(getCharCount('你好世界')).toBe(4)
    })

    it('counts special characters', () => {
      expect(getCharCount('Hello! @#$')).toBe(10)
    })

    it('counts newlines and tabs', () => {
      expect(getCharCount('Hello\nworld')).toBe(11)
      expect(getCharCount('Hello\tworld')).toBe(11)
    })
  })
})
