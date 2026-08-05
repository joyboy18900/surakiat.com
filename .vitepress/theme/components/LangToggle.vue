<!--
  Single button showing the CURRENT language's flag (🇹🇭/🇬🇧), linking to the
  translated counterpart page. VitePress's i18n has no automatic fallback
  between locales, so for individual posts this checks whether a translated
  counterpart actually exists (via the two posts.*.data loaders) and falls
  back to the other locale's home if it doesn't — avoiding a dead link on
  Thai-only posts.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useLocale } from '../i18n'
import { thPosts, enPosts } from '../loaders/useLocalePosts'

const route = useRoute()
const { isEn, t } = useLocale()

function normalize(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

// Strips the /en prefix so a Thai and English URL for the "same" page compare equal.
function localeAgnosticKey(path: string): string {
  return normalize(path).replace(/^\/en/, '') || '/'
}

const targetHref = computed(() => {
  const otherPrefix = isEn.value ? '' : '/en'
  const key = localeAgnosticKey(route.path)

  if (key === '/' || key === '/about' || key === '/posts') {
    return `${otherPrefix}${key === '/' ? '/' : key}`
  }

  // Individual post — only link straight there if a translated counterpart exists.
  const otherList = isEn.value ? thPosts : enPosts
  const match = otherList.find((p) => localeAgnosticKey(p.url) === key)
  return match ? match.url : `${otherPrefix}/`
})
</script>

<template>
  <a
    class="icon-link lang-toggle"
    :href="targetHref"
    :aria-label="isEn ? t('switchToThai') : t('switchToEnglish')"
  >{{ isEn ? '🇬🇧' : '🇹🇭' }}</a>
</template>
