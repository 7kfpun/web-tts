import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { downloadModel, isModelCached } from './modelService'
import * as voiceService from './voiceService'

describe('modelService', () => {
  let getModelPathsSpy

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.caches = {
      open: vi.fn().mockResolvedValue({
        match: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
      })
    }
    getModelPathsSpy = vi.spyOn(voiceService, 'getModelPaths')
  })

  afterEach(() => {
    getModelPathsSpy.mockRestore()
  })

  describe('downloadModel', () => {
    it('downloads model and config files', async () => {
      const voice = { name: 'test-voice' }
      const mockCache = {
        put: vi.fn().mockResolvedValue(undefined)
      }

      getModelPathsSpy.mockReturnValue({
        modelPath: 'test.onnx',
        configPath: 'test.onnx.json'
      })

      global.caches.open = vi.fn().mockResolvedValue(mockCache)
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        clone: () => ({ ok: true })
      })

      const onProgress = vi.fn()
      await downloadModel(voice, onProgress)

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(mockCache.put).toHaveBeenCalledTimes(2)
      expect(onProgress).toHaveBeenCalledWith(25)
      expect(onProgress).toHaveBeenCalledWith(75)
      expect(onProgress).toHaveBeenCalledWith(100)
    })

    it('throws error if model download fails', async () => {
      const voice = { name: 'test-voice' }

      getModelPathsSpy.mockReturnValue({
        modelPath: 'test.onnx',
        configPath: 'test.onnx.json'
      })

      global.fetch = vi.fn().mockResolvedValue({
        ok: false
      })

      await expect(downloadModel(voice)).rejects.toThrow('Failed to download model file')
    })

    it('throws error if config download fails', async () => {
      const voice = { name: 'test-voice' }
      const mockCache = {
        put: vi.fn().mockResolvedValue(undefined)
      }

      getModelPathsSpy.mockReturnValue({
        modelPath: 'test.onnx',
        configPath: 'test.onnx.json'
      })

      global.caches.open = vi.fn().mockResolvedValue(mockCache)
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          clone: () => ({ ok: true })
        })
        .mockResolvedValueOnce({
          ok: false
        })

      await expect(downloadModel(voice)).rejects.toThrow('Failed to download config file')
    })
  })

  describe('isModelCached', () => {
    it('returns true when both files are cached', async () => {
      const voice = { name: 'test-voice' }
      const mockCache = {
        match: vi.fn().mockResolvedValue({ ok: true })
      }

      getModelPathsSpy.mockReturnValue({
        modelPath: 'test.onnx',
        configPath: 'test.onnx.json'
      })

      global.caches.open = vi.fn().mockResolvedValue(mockCache)

      const result = await isModelCached(voice)
      expect(result).toBe(true)
    })

    it('returns false when model is not cached', async () => {
      const voice = { name: 'test-voice' }
      const mockCache = {
        match: vi.fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ ok: true })
      }

      getModelPathsSpy.mockReturnValue({
        modelPath: 'test.onnx',
        configPath: 'test.onnx.json'
      })

      global.caches.open = vi.fn().mockResolvedValue(mockCache)

      const result = await isModelCached(voice)
      expect(result).toBe(false)
    })

    it('returns false on error', async () => {
      const voice = { name: 'test-voice' }

      getModelPathsSpy.mockImplementation(() => {
        throw new Error('Test error')
      })

      const result = await isModelCached(voice)
      expect(result).toBe(false)
    })
  })
})
