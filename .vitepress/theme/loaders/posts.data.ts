import { createContentLoader } from 'vitepress'
import { estimateThaiReadingTime } from './readingTime'

export interface PostData {
  url: string
  title: string
  // Must be quoted in frontmatter (date: "2026-06-14"). Unquoted, YAML
  // parses it as a native Date, which JSON.stringify (used to serialize
  // this loader's data) turns into a full ISO timestamp instead of
  // YYYY-MM-DD — sorting still works either way, but display breaks.
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
// so they're filtered out here. Relies on cleanUrls: true (config.ts)
// stripping only the .md extension and leaving the .en suffix intact —
// if cleanUrls is ever turned off, this filter needs revisiting.
// See postTranslations.data.ts for how the companion's content actually
// gets used (an in-place toggle on the Thai post page).
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
