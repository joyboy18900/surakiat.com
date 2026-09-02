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

// Optional per-post English companion files (posts/<year>/<slug>.en.md).
// These are srcExcluded from routing (see config.ts) - they never become
// their own page. `render: true` gives the compiled HTML body so Post.vue
// can show it as an in-place toggle on the Thai post's own page.
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
