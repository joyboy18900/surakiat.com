<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import SocialLinks from './SocialLinks.vue'
import Search from './Search.vue'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()

function normalize(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

const isHome = computed(() => normalize(route.path) === '')
const isBlog = computed(() => normalize(route.path).startsWith('/posts'))
const isAbout = computed(() => normalize(route.path) === '/about')

const isOpen = ref(false)
watch(() => route.path, () => {
  isOpen.value = false
})
</script>

<template>
  <header class="site-header" :class="{ 'nav-open': isOpen }">
    <div class="header-row">
      <a class="wordmark" href="/">surakiat</a>
      <button
        type="button"
        class="nav-toggle"
        :aria-expanded="isOpen"
        aria-controls="site-nav"
        aria-label="Menu"
        @click="isOpen = !isOpen"
      >
        <svg v-if="!isOpen" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="4" width="16" height="1.6"/><rect x="2" y="9.2" width="16" height="1.6"/><rect x="2" y="14.4" width="16" height="1.6"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      </button>
      <nav id="site-nav" class="site-nav" aria-label="Main" @click="isOpen = false">
        <a href="/" :aria-current="isHome ? 'page' : undefined">Home</a>
        <a href="/posts/" :aria-current="isBlog ? 'page' : undefined">Blog</a>
        <a href="/about" :aria-current="isAbout ? 'page' : undefined">About</a>
        <span class="nav-divider" aria-hidden="true"></span>
        <SocialLinks />
        <span class="nav-divider" aria-hidden="true"></span>
        <Search />
        <span class="nav-divider" aria-hidden="true"></span>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
