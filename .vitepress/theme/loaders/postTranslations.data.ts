import { createContentLoader } from 'vitepress'
import { estimateEnglishReadingTime } from './readingTime'

export interface TranslationData {
  url: string
  title: string
  html: string
  readingTime: number
}

declare const data: TranslationData[]
export { data }

export default createContentLoader('posts/*/*.en.md', {
  includeSrc: true,
  render: true,
  transform(raw): TranslationData[] {
    return raw.map((page): TranslationData => ({
      url: page.url,
      title: page.frontmatter.title,
      html: page.html ?? '',
      readingTime: estimateEnglishReadingTime(page.src ?? ''),
    }))
  },
})
