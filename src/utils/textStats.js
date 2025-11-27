const CJK_CHAR_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/gu

export function getWordCount(text) {
  if (!text || !text.trim()) return 0

  const cjkMatches = text.match(CJK_CHAR_REGEX)
  const cjkCount = cjkMatches ? cjkMatches.length : 0

  const withoutCJK = text.replace(CJK_CHAR_REGEX, ' ')
  const otherWords = withoutCJK.trim() ? withoutCJK.trim().split(/\s+/).length : 0

  return cjkCount + otherWords
}

export function getCharCount(text) {
  if (!text) return 0
  return text.length
}
