import { create } from 'zustand'
import { getRandomDefaultText } from '../config/constants'
import {
  fetchVoices,
  extractLanguages,
  getDefaultLanguage,
  getDefaultVoice,
  getVoicesForLanguage
} from '../services/voiceService'
import { downloadModel, isModelCached } from '../services/modelService'
import { loadDownloadedModels, addDownloadedModel } from '../utils/storage'
import { generateSpeech } from '../services/ttsService'
import { trackEvent } from '../utils/analytics'

const initialDownloadedModels = loadDownloadedModels()

export const useAppStore = create((set, get) => ({
  text: getRandomDefaultText(),
  voices: {},
  languages: [],
  selectedLanguage: '',
  selectedVoice: '',
  availableVoices: [],
  voiceLoading: true,
  voiceError: null,
  downloadedModels: initialDownloadedModels,
  downloading: false,
  downloadProgress: 0,
  downloadError: null,
  generating: false,
  generateProgress: 0,
  currentChunk: 0,
  totalChunks: 0,
  audioResult: null,
  ttsError: null,
  playbackRate: 1,

  initVoices: async () => {
    set({ voiceLoading: true, voiceError: null })
    try {
      const voicesData = await fetchVoices()
      const languages = extractLanguages(voicesData)
      const defaultLanguage = getDefaultLanguage(languages)
      const languageCode = defaultLanguage?.code || ''
      const voicesForLanguage = languageCode ? getVoicesForLanguage(voicesData, languageCode) : []
      const defaultVoice = getDefaultVoice(voicesForLanguage)

      set({
        voices: voicesData,
        languages,
        selectedLanguage: languageCode,
        availableVoices: voicesForLanguage,
        selectedVoice: defaultVoice?.key || '',
        voiceLoading: false
      })
      trackEvent('voices_loaded', {
        language: languageCode,
        voice: defaultVoice?.key
      })
    } catch (error) {
      console.error('Failed to load voices', error)
      set({
        voiceLoading: false,
        voiceError: 'Unable to load voices. Please check your connection and refresh.'
      })
    }
  },

  setText: (text) => set({ text }),

  changeLanguage: (languageCode) => {
    const voicesData = get().voices
    if (!languageCode || !voicesData) {
      set({ selectedLanguage: languageCode, availableVoices: [], selectedVoice: '' })
      return
    }
    const voicesForLanguage = getVoicesForLanguage(voicesData, languageCode)
    const defaultVoice = getDefaultVoice(voicesForLanguage)
    set({
      selectedLanguage: languageCode,
      availableVoices: voicesForLanguage,
      selectedVoice: defaultVoice?.key || ''
    })
    trackEvent('language_change', { language: languageCode })
  },

  changeVoice: (voiceKey) => {
    set({ selectedVoice: voiceKey })
    trackEvent('voice_change', { voice: voiceKey })
  },

  verifyModelCache: async (voiceId) => {
    if (!voiceId) return
    const voice = get().voices[voiceId]
    if (!voice) return
    try {
      const cached = await isModelCached(voice)
      const current = get().downloadedModels
      if (cached && !current.has(voiceId)) {
        set({ downloadedModels: addDownloadedModel(current, voiceId) })
      }
    } catch (err) {
      console.warn('Failed to verify cache', err)
    }
  },

  downloadSelectedVoice: async () => {
    const { selectedVoice, voices, downloading } = get()
    if (!selectedVoice || downloading) return false
    const voice = voices[selectedVoice]
    if (!voice) return false

    set({ downloading: true, downloadProgress: 0, downloadError: null })
    trackEvent('voice_download_start', { voice: selectedVoice })
    try {
      await downloadModel(voice, (progress) => set({ downloadProgress: progress }))
      set((state) => ({
        downloadedModels: addDownloadedModel(state.downloadedModels, selectedVoice),
        downloading: false,
        downloadProgress: 100
      }))
      trackEvent('voice_download_success', { voice: selectedVoice })
      return true
    } catch (error) {
      console.error('Download failed', error)
      set({
        downloadError: error.message || 'Unable to download voice model.',
        downloading: false
      })
      trackEvent('voice_download_error', { voice: selectedVoice, message: error.message })
      return false
    }
  },

  generateAudio: async () => {
    const { text, selectedVoice, voices, generating } = get()
    if (!text.trim() || !selectedVoice || generating) return
    const voice = voices[selectedVoice]
    if (!voice) return

    trackEvent('tts_generate_start', { voice: selectedVoice, textLength: text.length })

    set({
      generating: true,
      generateProgress: 0,
      currentChunk: 0,
      totalChunks: 0,
      ttsError: null,
      audioResult: null
    })

    try {
      const result = await generateSpeech(
        text,
        voice,
        (progress) => set({ generateProgress: progress }),
        (current, total) => set({ currentChunk: current, totalChunks: total })
      )
      set({ audioResult: result, generateProgress: 100 })
      trackEvent('tts_generate_success', {
        voice: selectedVoice,
        chunks: result?.chunks?.length || get().totalChunks || 1
      })
    } catch (error) {
      console.error('TTS generation failed', error)
      set({
        ttsError: error.message || 'Failed to generate speech. Please try again.'
      })
      trackEvent('tts_generate_error', { voice: selectedVoice, message: error.message })
    } finally {
      set({
        generating: false,
        currentChunk: 0,
        totalChunks: 0
      })
    }
  },

  clearErrors: () => set({ downloadError: null, ttsError: null, voiceError: null }),

  setPlaybackRate: (rate) => {
    set({ playbackRate: rate })
    trackEvent('playback_rate_change', { rate })
  }
}))
