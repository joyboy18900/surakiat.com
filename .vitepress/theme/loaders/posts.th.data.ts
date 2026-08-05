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

export default createContentLoader('posts/*/*.md', {
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
        readingTime: estimateThaiReadingTime(page.src ?? ''),
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },
})
