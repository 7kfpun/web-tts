import { TEXT_PROCESSING } from '../config/constants'

const CJK_CHAR_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/gu

function getEffectiveChunkSize(text, baseSize) {
  if (!text) return baseSize
  const matches = text.match(CJK_CHAR_REGEX)
  if (!matches || matches.length === 0) return baseSize

  const ratio = matches.length / text.length
  if (ratio >= TEXT_PROCESSING.cjkThreshold) {
    return Math.min(baseSize, TEXT_PROCESSING.cjkMaxChunkSize)
  }

  return baseSize
}

function splitIntoSentences(text) {
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [text]
  return sentences.map(s => s.trim()).filter(s => s.length > 0)
}

function splitIntoParagraphs(text) {
  return text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0)
}

export function chunkText(text, maxChars = TEXT_PROCESSING.maxChunkSize) {
  const chunkLimit = getEffectiveChunkSize(text, maxChars)
  const paragraphs = splitIntoParagraphs(text)
  const chunks = []
  let currentChunk = ''

  const pushChunk = () => {
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = ''
    }
  }

  const pushLongSegment = (segment) => {
    for (let start = 0; start < segment.length; start += chunkLimit) {
      const piece = segment.slice(start, start + chunkLimit).trim()
      if (piece.length > 0) {
        chunks.push(piece)
      }
    }
  }

  for (const paragraph of paragraphs) {
    if (paragraph.length > chunkLimit) {
      pushChunk()

      const sentences = splitIntoSentences(paragraph)
      for (const sentence of sentences) {
        if (sentence.length > chunkLimit) {
          pushChunk()
          pushLongSegment(sentence)
        } else if ((currentChunk + ' ' + sentence).length > chunkLimit && currentChunk.length > 0) {
          pushChunk()
          currentChunk = sentence
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence
        }
      }
    } else {
      if ((currentChunk + '\n\n' + paragraph).length > chunkLimit && currentChunk.length > 0) {
        pushChunk()
        currentChunk = paragraph
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph
      }
    }
  }

  pushChunk()

  return chunks.length > 0 ? chunks : [text]
}
