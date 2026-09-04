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
