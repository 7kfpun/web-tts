export async function concatenateAudioChunks(audioUrls) {
  if (audioUrls.length === 0) {
    throw new Error('No audio chunks to concatenate')
  }

  if (audioUrls.length === 1) {
    return audioUrls[0]
  }

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const audioBuffers = []

    for (const url of audioUrls) {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      audioBuffers.push(audioBuffer)
    }

    const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0)
    const numberOfChannels = audioBuffers[0].numberOfChannels
    const sampleRate = audioBuffers[0].sampleRate

    const concatenatedBuffer = audioContext.createBuffer(
      numberOfChannels,
      totalLength,
      sampleRate
    )

    let offset = 0
    for (const buffer of audioBuffers) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        concatenatedBuffer.getChannelData(channel).set(
          buffer.getChannelData(channel),
          offset
        )
      }
      offset += buffer.length
    }

    const wavBlob = await audioBufferToWavBlob(concatenatedBuffer)
    return URL.createObjectURL(wavBlob)
  } catch (error) {
    console.error('Audio concatenation failed:', error)
    throw new Error('Failed to concatenate audio chunks')
  }
}

function audioBufferToWavBlob(audioBuffer) {
  const numberOfChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const format = 1
  const bitDepth = 16

  const bytesPerSample = bitDepth / 8
  const blockAlign = numberOfChannels * bytesPerSample

  const data = []
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = audioBuffer.getChannelData(channel)[i]
      const intSample = Math.max(-1, Math.min(1, sample))
      data.push(intSample < 0 ? intSample * 0x8000 : intSample * 0x7FFF)
    }
  }

  const dataSize = data.length * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  let offset = 44
  for (const sample of data) {
    view.setInt16(offset, sample, true)
    offset += 2
  }

  return new Blob([buffer], { type: 'audio/wav' })
}
