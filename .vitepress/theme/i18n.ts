import { computed } from 'vue'
import { useData } from 'vitepress'

// Thai is the root locale (unprefixed), English is secondary (/en/ prefix).
// This is a small hand-rolled dictionary rather than a full i18n library —
// the string count is tiny and it keeps the custom theme dependency-free.
export const messages = {
  th: {
    navHome: 'หน้าแรก',
    navBlog: 'Blog',
    navAbout: 'เกี่ยวกับ',
    latestPosts: 'บทความล่าสุด',
    allPosts: 'บทความทั้งหมด →',
    sort: 'เรียงตาม',
    sortNewest: 'ใหม่สุด',
    sortOldest: 'เก่าสุด',
    categoryAll: 'ทั้งหมด',
    emptyState: 'ยังไม่มีบทความในหมวดนี้',
    backToPosts: '← กลับไปหน้าบทความ',
    minRead: 'นาทีในการอ่าน',
    switchToLight: 'สลับเป็นธีมสว่าง',
    switchToDark: 'สลับเป็นธีมมืด',
    switchToEnglish: 'Switch to English',
    switchToThai: 'สลับเป็นภาษาไทย',
  },
  en: {
    navHome: 'Home',
    navBlog: 'Blog',
    navAbout: 'About',
    latestPosts: 'Latest Posts',
    allPosts: 'All posts →',
    sort: 'Sort',
    sortNewest: 'Newest',
    sortOldest: 'Oldest',
    categoryAll: 'All',
    emptyState: 'No posts in this category yet.',
    backToPosts: '← Back to posts',
    minRead: 'min read',
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
    switchToEnglish: 'Switch to English',
    switchToThai: 'Switch to Thai',
  },
} as const

export type MessageKey = keyof (typeof messages)['en']

/** Current locale, URL prefix ('' for Thai root, '/en' for English), and a translator. */
export function useLocale() {
  const { lang } = useData()
  const isEn = computed(() => lang.value.startsWith('en'))
  const prefix = computed(() => (isEn.value ? '/en' : ''))
  const t = (key: MessageKey) => messages[isEn.value ? 'en' : 'th'][key]
  return { isEn, prefix, t }
}
