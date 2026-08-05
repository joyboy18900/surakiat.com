import { computed } from 'vue'
import { useLocale } from '../i18n'
import { data as thPosts } from './posts.th.data'
import { data as enPosts } from './posts.en.data'

/** Posts for the currently active locale (Thai root or English /en/). */
export function useLocalePosts() {
  const { isEn } = useLocale()
  return computed(() => (isEn.value ? enPosts : thPosts))
}

/** Both locales' posts — used by LangToggle to check if a translated counterpart exists. */
export { thPosts, enPosts }
