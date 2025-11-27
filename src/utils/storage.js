import { STORAGE_KEY } from '../config/constants'

export function loadDownloadedModels() {
  try {
    if (typeof window === 'undefined') return new Set()
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch (err) {
    console.error('Failed to load downloaded models from storage:', err)
    return new Set()
  }
}

function saveDownloadedModels(models) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...models]))
  } catch (err) {
    console.error('Failed to save downloaded models to storage:', err)
  }
}

export function addDownloadedModel(models, modelKey) {
  const newModels = new Set([...models, modelKey])
  saveDownloadedModels(newModels)
  return newModels
}
