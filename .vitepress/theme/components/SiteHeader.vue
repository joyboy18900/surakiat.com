<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useLocale } from '../i18n'
import SocialLinks from './SocialLinks.vue'
import ThemeToggle from './ThemeToggle.vue'
import LangToggle from './LangToggle.vue'

const route = useRoute()
const { prefix, t } = useLocale()

const homeLink = computed(() => `${prefix.value}/`)
const blogLink = computed(() => `${prefix.value}/posts/`)
const aboutLink = computed(() => `${prefix.value}/about`)

function normalize(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

const isHome = computed(() => normalize(route.path) === normalize(homeLink.value))
const isBlog = computed(() => normalize(route.path).startsWith(normalize(blogLink.value)))
const isAbout = computed(() => normalize(route.path) === normalize(aboutLink.value))
</script>

<template>
  <header class="site-header">
    <div class="header-row">
      <a class="wordmark" :href="homeLink">surakiat</a>
      <nav class="site-nav" aria-label="Main">
        <a :href="homeLink" :aria-current="isHome ? 'page' : undefined">{{ t('navHome') }}</a>
        <a :href="blogLink" :aria-current="isBlog ? 'page' : undefined">{{ t('navBlog') }}</a>
        <a :href="aboutLink" :aria-current="isAbout ? 'page' : undefined">{{ t('navAbout') }}</a>
        <span class="nav-divider" aria-hidden="true"></span>
        <SocialLinks />
        <span class="nav-divider" aria-hidden="true"></span>
        <LangToggle />
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
