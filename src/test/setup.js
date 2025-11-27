import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

afterEach(() => {
  cleanup()
})

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
}

global.caches = {
  open: async () => ({
    match: async () => null,
    put: async () => {},
    delete: async () => {}
  })
}

global.AudioContext = class AudioContext {
  createBuffer() {
    return {
      numberOfChannels: 1,
      sampleRate: 22050,
      length: 0,
      getChannelData: () => new Float32Array()
    }
  }
  decodeAudioData() {
    return Promise.resolve({
      numberOfChannels: 1,
      sampleRate: 22050,
      length: 0,
      getChannelData: () => new Float32Array()
    })
  }
}

global.URL.createObjectURL = () => 'blob:mock-url'
global.URL.revokeObjectURL = () => {}
