import { createContentLoader } from 'vitepress'
import { estimateEnglishReadingTime } from './readingTime'
import type { PostData } from './posts.th.data'

declare const data: PostData[]
export { data }

export default createContentLoader('en/posts/*/*.md', {
  includeSrc: true,
  transform(raw): PostData[] {
    return raw
      .map((page): PostData => ({
        url: page.url,
        title: page.frontmatter.title,
        date: page.frontmatter.date,
        category: page.frontmatter.category,
        description: page.frontmatter.description,
        cover: page.frontmatter.cover,
        readingTime: estimateEnglishReadingTime(page.src ?? ''),
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },
})
