import { describe, it, expect } from 'vitest'
import {
  extractLanguages,
  getVoicesForLanguage,
  getDefaultLanguage,
  getDefaultVoice,
  getModelPaths
} from './voiceService'

describe('voiceService', () => {
  describe('extractLanguages', () => {
    it('extracts unique languages from voices', () => {
      const voices = {
        'en-1': {
          language: { code: 'en', name_english: 'English', family: 'en' }
        },
        'en-2': {
          language: { code: 'en', name_english: 'English', family: 'en' }
        },
        'zh-1': {
          language: { code: 'zh', name_english: 'Chinese', family: 'zh' }
        }
      }
      const languages = extractLanguages(voices)
      expect(languages).toHaveLength(2)
      expect(languages.map(l => l.code)).toContain('en')
      expect(languages.map(l => l.code)).toContain('zh')
    })

    it('sorts languages alphabetically by English name', () => {
      const voices = {
        'zh-1': {
          language: { code: 'zh', name_english: 'Chinese', family: 'zh' }
        },
        'en-1': {
          language: { code: 'en', name_english: 'English', family: 'en' }
        },
        'ar-1': {
          language: { code: 'ar', name_english: 'Arabic', family: 'ar' }
        }
      }
      const languages = extractLanguages(voices)
      expect(languages[0].name_english).toBe('Arabic')
      expect(languages[1].name_english).toBe('Chinese')
      expect(languages[2].name_english).toBe('English')
    })
  })

  describe('getVoicesForLanguage', () => {
    it('filters voices by language code', () => {
      const voices = {
        'en-1': {
          language: { code: 'en' },
          name: 'Voice 1',
          quality: 'medium'
        },
        'zh-1': {
          language: { code: 'zh' },
          name: 'Voice 2',
          quality: 'medium'
        }
      }
      const enVoices = getVoicesForLanguage(voices, 'en')
      expect(enVoices).toHaveLength(1)
      expect(enVoices[0].language.code).toBe('en')
    })

    it('sorts voices by quality then name', () => {
      const voices = {
        'v1': {
          language: { code: 'en' },
          name: 'Voice B',
          quality: 'low'
        },
        'v2': {
          language: { code: 'en' },
          name: 'Voice A',
          quality: 'low'
        },
        'v3': {
          language: { code: 'en' },
          name: 'Voice Z',
          quality: 'high'
        },
        'v4': {
          language: { code: 'en' },
          name: 'Voice Y',
          quality: 'medium'
        }
      }
      const enVoices = getVoicesForLanguage(voices, 'en')
      expect(enVoices).toHaveLength(4)
      expect(enVoices.filter(v => v.quality === 'low').map(v => v.name)).toEqual(['Voice A', 'Voice B'])
    })
  })

  describe('getDefaultLanguage', () => {
    it('returns English language if available', () => {
      const languages = [
        { code: 'zh', family: 'zh' },
        { code: 'en', family: 'en' },
        { code: 'es', family: 'es' }
      ]
      const defaultLang = getDefaultLanguage(languages)
      expect(defaultLang.code).toBe('en')
    })

    it('returns first language if English not available', () => {
      const languages = [
        { code: 'zh', family: 'zh' },
        { code: 'es', family: 'es' }
      ]
      const defaultLang = getDefaultLanguage(languages)
      expect(defaultLang.code).toBe('zh')
    })
  })

  describe('getDefaultVoice', () => {
    it('returns medium quality voice if available', () => {
      const voices = [
        { name: 'Voice 1', quality: 'low' },
        { name: 'Voice 2', quality: 'medium' },
        { name: 'Voice 3', quality: 'high' }
      ]
      const defaultVoice = getDefaultVoice(voices)
      expect(defaultVoice.quality).toBe('medium')
    })

    it('returns high quality voice if medium not available', () => {
      const voices = [
        { name: 'Voice 1', quality: 'low' },
        { name: 'Voice 2', quality: 'high' }
      ]
      const defaultVoice = getDefaultVoice(voices)
      expect(defaultVoice.quality).toBe('high')
    })

    it('returns first voice if no preferred quality available', () => {
      const voices = [
        { name: 'Voice 1', quality: 'low' }
      ]
      const defaultVoice = getDefaultVoice(voices)
      expect(defaultVoice.name).toBe('Voice 1')
    })
  })

  describe('getModelPaths', () => {
    it('returns model and config paths', () => {
      const voice = {
        files: {
          'model.onnx': {},
          'other.txt': {}
        }
      }
      const paths = getModelPaths(voice)
      expect(paths.modelPath).toBe('model.onnx')
      expect(paths.configPath).toBe('model.onnx.json')
    })

    it('throws error if no onnx files found', () => {
      const voice = {
        files: {
          'other.txt': {}
        }
      }
      expect(() => getModelPaths(voice)).toThrow('No model files found for voice')
    })

    it('returns first onnx file if multiple exist', () => {
      const voice = {
        files: {
          'model1.onnx': {},
          'model2.onnx': {}
        }
      }
      const paths = getModelPaths(voice)
      expect(paths.modelPath).toBe('model1.onnx')
    })
  })
})
