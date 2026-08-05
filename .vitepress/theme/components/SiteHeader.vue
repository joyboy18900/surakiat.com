<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import SocialLinks from './SocialLinks.vue'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()

function normalize(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

const isHome = computed(() => normalize(route.path) === '')
const isBlog = computed(() => normalize(route.path).startsWith('/posts'))
const isAbout = computed(() => normalize(route.path) === '/about')
</script>

<template>
  <header class="site-header">
    <div class="header-row">
      <a class="wordmark" href="/">surakiat</a>
      <nav class="site-nav" aria-label="Main">
        <a href="/" :aria-current="isHome ? 'page' : undefined">หน้าแรก</a>
        <a href="/posts/" :aria-current="isBlog ? 'page' : undefined">Blog</a>
        <a href="/about" :aria-current="isAbout ? 'page' : undefined">เกี่ยวกับ</a>
        <span class="nav-divider" aria-hidden="true"></span>
        <SocialLinks />
        <span class="nav-divider" aria-hidden="true"></span>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
