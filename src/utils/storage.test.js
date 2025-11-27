import { describe, it, expect, beforeEach } from 'vitest'
import { loadDownloadedModels, addDownloadedModel } from './storage'

describe('storage', () => {
  beforeEach(() => {
    global.localStorage = {
      data: {},
      getItem(key) {
        return this.data[key] || null
      },
      setItem(key, value) {
        this.data[key] = value
      },
      removeItem(key) {
        delete this.data[key]
      },
      clear() {
        this.data = {}
      }
    }
  })

  describe('loadDownloadedModels', () => {
    it('returns empty Set when no data in localStorage', () => {
      const models = loadDownloadedModels()
      expect(models).toBeInstanceOf(Set)
      expect(models.size).toBe(0)
    })

    it('loads models from localStorage', () => {
      const key = 'downloaded-models'
      global.localStorage.setItem(key, JSON.stringify(['model1', 'model2']))
      const models = loadDownloadedModels()
      expect(models.size).toBe(2)
      expect(models.has('model1')).toBe(true)
      expect(models.has('model2')).toBe(true)
    })

    it('handles invalid JSON gracefully', () => {
      const key = 'downloaded-models'
      global.localStorage.setItem(key, 'invalid-json')
      const models = loadDownloadedModels()
      expect(models).toBeInstanceOf(Set)
      expect(models.size).toBe(0)
    })

    it('handles localStorage errors', () => {
      global.localStorage.getItem = () => {
        throw new Error('Storage error')
      }
      const models = loadDownloadedModels()
      expect(models).toBeInstanceOf(Set)
      expect(models.size).toBe(0)
    })
  })

  describe('addDownloadedModel', () => {
    it('adds new model to empty set', () => {
      const models = new Set()
      const newModels = addDownloadedModel(models, 'model1')
      expect(newModels.has('model1')).toBe(true)
      expect(newModels.size).toBe(1)
    })

    it('adds new model to existing set', () => {
      const models = new Set(['model1'])
      const newModels = addDownloadedModel(models, 'model2')
      expect(newModels.has('model1')).toBe(true)
      expect(newModels.has('model2')).toBe(true)
      expect(newModels.size).toBe(2)
    })

    it('does not duplicate existing models', () => {
      const models = new Set(['model1'])
      const newModels = addDownloadedModel(models, 'model1')
      expect(newModels.size).toBe(1)
    })

    it('persists to localStorage', () => {
      const models = new Set()
      addDownloadedModel(models, 'model1')
      const key = 'downloaded-models'
      const stored = JSON.parse(global.localStorage.getItem(key))
      expect(stored).toContain('model1')
    })
  })
})
