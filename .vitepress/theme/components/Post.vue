<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, Content } from 'vitepress'
import { useLocale } from '../i18n'
import { useLocalePosts } from '../loaders/useLocalePosts'

const { frontmatter } = useData()
const route = useRoute()
const { prefix, t } = useLocale()
const posts = useLocalePosts()

// Reading time lives on the content-loader entry (computed at build time),
// not in frontmatter — look this page up by URL to display it.
const current = computed(() => posts.value.find((p) => p.url === route.path))

const cover = computed(() => frontmatter.value.cover || '/covers/default.svg')
const blogLink = computed(() => `${prefix.value}/posts/`)
</script>

<template>
  <a class="back-link" :href="blogLink">{{ t('backToPosts') }}</a>

  <img class="post-cover-img" :src="cover" :alt="frontmatter.title" />

  <article class="post-article">
    <header>
      <h1>{{ frontmatter.title }}</h1>
      <div class="post-meta">
        <time :datetime="frontmatter.date">{{ frontmatter.date }}</time>
        <span class="row-tag">{{ frontmatter.category }}</span>
        <span v-if="current">{{ current.readingTime }} {{ t('minRead') }}</span>
      </div>
    </header>

    <Content />

    <footer>
      <a :href="blogLink">{{ t('backToPosts') }}</a>
    </footer>
  </article>
</template>
