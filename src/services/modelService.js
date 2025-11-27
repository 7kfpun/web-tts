import { HF_BASE, CACHE_NAME } from '../config/constants'
import { getModelPaths } from './voiceService'

export async function downloadModel(voice, onProgress) {
  const { modelPath, configPath } = getModelPaths(voice)
  const modelUrl = HF_BASE + modelPath
  const configUrl = HF_BASE + configPath

  const cache = await caches.open(CACHE_NAME)

  onProgress?.(25)
  const modelResponse = await fetch(modelUrl)
  if (!modelResponse.ok) {
    throw new Error('Failed to download model file')
  }
  await cache.put(modelUrl, modelResponse.clone())

  onProgress?.(75)
  const configResponse = await fetch(configUrl)
  if (!configResponse.ok) {
    throw new Error('Failed to download config file')
  }
  await cache.put(configUrl, configResponse.clone())

  onProgress?.(100)
}

export async function isModelCached(voice) {
  try {
    const { modelPath, configPath } = getModelPaths(voice)
    const modelUrl = HF_BASE + modelPath
    const configUrl = HF_BASE + configPath

    const cache = await caches.open(CACHE_NAME)
    const modelCache = await cache.match(modelUrl)
    const configCache = await cache.match(configUrl)

    return !!(modelCache && configCache)
  } catch (err) {
    console.error('Failed to check model cache:', err)
    return false
  }
}
