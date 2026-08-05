import { createContentLoader } from 'vitepress'
import { estimateThaiReadingTime } from './readingTime'

export interface PostData {
  url: string
  title: string
  date: string
  category: string
  description: string
  cover?: string
  readingTime: number
}

declare const data: PostData[]
export { data }

// Glob also matches each post's optional *.en.md companion file (they live
// in the same folder) — those must never appear as their own list entries,
// so they're filtered out here. See postTranslations.data.ts for how their
// content actually gets used (an in-place toggle on the Thai post page).
export default createContentLoader('posts/*/*.md', {
  includeSrc: true,
  transform(raw): PostData[] {
    return raw
      .filter((page) => !page.url.endsWith('.en'))
      .map((page): PostData => ({
        url: page.url,
        title: page.frontmatter.title,
        date: page.frontmatter.date,
        category: page.frontmatter.category,
        description: page.frontmatter.description,
        cover: page.frontmatter.cover,
        readingTime: estimateThaiReadingTime(page.src ?? ''),
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },
})
