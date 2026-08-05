// Reading-time estimates for post frontmatter. Thai script doesn't reliably
// space-delimit words, so a naive word-count formula (fine for English)
// would badly undercount Thai text — Thai posts use a character-count
// formula instead, English posts use word-count. Returns whole minutes;
// components append the localized "min read" label via i18n.ts.

function stripCodeFences(src: string): string {
  return src.replace(/```[\s\S]*?```/g, '')
}

const THAI_CHARS_PER_MINUTE = 500
const ENGLISH_WORDS_PER_MINUTE = 200

export function estimateThaiReadingTime(src: string): number {
  const text = stripCodeFences(src)
  return Math.max(1, Math.round(text.length / THAI_CHARS_PER_MINUTE))
}

export function estimateEnglishReadingTime(src: string): number {
  const text = stripCodeFences(src)
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / ENGLISH_WORDS_PER_MINUTE))
}
