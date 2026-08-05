<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData, useRoute, Content } from 'vitepress'
import { data as posts } from '../loaders/posts.data'
import { data as translations } from '../loaders/postTranslations.data'

const { frontmatter } = useData()
const route = useRoute()

// Reading time lives on the content-loader entry (computed at build time),
// not in frontmatter — look this page up by URL to display it.
const current = computed(() => posts.find((p) => p.url === route.path))

// Optional English companion (posts/<year>/<slug>.en.md) — matched by
// stripping the trailing ".en" the loader's URL carries. Not every post has
// one; when it doesn't, no toggle renders and the page is Thai-only.
const translation = computed(() =>
  translations.find((t) => t.url.replace(/\.en$/, '') === route.path),
)

const showEnglish = ref(false)

const cover = computed(() => frontmatter.value.cover || '/covers/default.svg')
</script>

<template>
  <a class="back-link" href="/posts/">← กลับไปหน้าบทความ</a>

  <img class="post-cover-img" :src="cover" :alt="frontmatter.title" />

  <article class="post-article">
    <header>
      <div v-if="translation" class="lang-switch">
        <button type="button" :class="{ active: !showEnglish }" @click="showEnglish = false">ไทย</button>
        <button type="button" :class="{ active: showEnglish }" @click="showEnglish = true">English</button>
      </div>

      <h1>{{ showEnglish && translation ? translation.title : frontmatter.title }}</h1>
      <div class="post-meta">
        <time :datetime="frontmatter.date">{{ frontmatter.date }}</time>
        <span class="row-tag">{{ frontmatter.category }}</span>
        <span v-if="showEnglish && translation">{{ translation.readingTime }} min read</span>
        <span v-else-if="current">{{ current.readingTime }} นาทีในการอ่าน</span>
      </div>
    </header>

    <Content v-show="!showEnglish" />
    <div v-if="translation" v-show="showEnglish" v-html="translation.html"></div>

    <footer>
      <a href="/posts/">← กลับไปหน้าบทความ</a>
    </footer>
  </article>
</template>

<style scoped>
.lang-switch {
  display: inline-flex;
  gap: calc(var(--space-unit) * 1.5);
  font-size: 0.8rem;
  margin-bottom: calc(var(--space-unit) * 1.5);
}
.lang-switch button {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  font-family: var(--font-mono);
  color: var(--muted);
  cursor: pointer;
}
.lang-switch button:hover {
  color: var(--accent);
}
.lang-switch button.active {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
