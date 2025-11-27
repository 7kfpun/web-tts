import { describe, it, expect } from 'vitest'
import { detectLanguage, findMatchingLanguageCode } from './languageDetection'

describe('languageDetection', () => {
  describe('detectLanguage', () => {
    it('detects English text', () => {
      const result = detectLanguage('Hello world, this is a test that is long enough to detect.')
      expect(result).toBe('en_US')
    })

    it('detects Chinese text', () => {
      const result = detectLanguage('你好世界，这是一个测试，需要足够长的文本。')
      expect(result).toBe('zh_CN')
    })

    it('returns null for empty string', () => {
      const result = detectLanguage('')
      expect(result).toBeNull()
    })

    it('returns null for very short text', () => {
      const result = detectLanguage('Hi')
      expect(result).toBeNull()
    })

    it('handles mixed language text', () => {
      const result = detectLanguage('Hello 世界 this is a longer test')
      expect(['en_US', 'zh_CN', null]).toContain(result)
    })
  })

  describe('findMatchingLanguageCode', () => {
    it('finds exact match', () => {
      const languages = [
        { code: 'en_US' },
        { code: 'zh_CN' }
      ]
      expect(findMatchingLanguageCode('en_US', languages)).toBe('en_US')
    })

    it('finds language family match', () => {
      const languages = [
        { code: 'en_GB' },
        { code: 'zh_CN' }
      ]
      expect(findMatchingLanguageCode('en_US', languages)).toBe('en_GB')
    })

    it('returns null for no match', () => {
      const languages = [
        { code: 'fr_FR' }
      ]
      expect(findMatchingLanguageCode('en_US', languages)).toBeNull()
    })

    it('returns null for null inputs', () => {
      expect(findMatchingLanguageCode(null, [])).toBeNull()
      expect(findMatchingLanguageCode('en', null)).toBeNull()
    })
  })
})
