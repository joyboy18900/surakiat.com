<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData, useRoute, Content } from 'vitepress'
import { data as posts } from '../loaders/posts.data'
import { data as translations } from '../loaders/postTranslations.data'
import { formatDate } from '../formatDate'

const { frontmatter } = useData()
const route = useRoute()

const current = computed(() => posts.find((p) => p.url === route.path))

const translation = computed(() =>
  translations.find((t) => t.url.replace(/\.en$/, '') === route.path),
)

const showEnglish = ref(false)

const cover = computed(() => frontmatter.value.cover || '/covers/default.svg')

const categories = computed<string[]>(() => frontmatter.value.categories ?? [])
</script>

<template>
  <a class="back-link" href="/posts/">← Back to posts</a>

  <img class="post-cover-img" :src="cover" :alt="frontmatter.title" />

  <article class="post-article">
    <header>
      <div v-if="translation" class="lang-switch">
        <button
          type="button"
          :class="{ active: !showEnglish }"
          :aria-pressed="!showEnglish"
          aria-label="อ่านภาษาไทย"
          @click="showEnglish = false"
        >🇹🇭</button>
        <button
          type="button"
          :class="{ active: showEnglish }"
          :aria-pressed="showEnglish"
          aria-label="Read in English"
          @click="showEnglish = true"
        >🇬🇧</button>
      </div>

      <h1>{{ showEnglish && translation ? translation.title : frontmatter.title }}</h1>
      <div class="post-meta">
        <time :datetime="frontmatter.date">{{ formatDate(frontmatter.date) }}</time>
        <span v-for="c in categories" :key="c" class="row-tag">{{ c }}</span>
        <span v-if="showEnglish && translation">{{ translation.readingTime }} min read</span>
        <span v-else-if="current">{{ current.readingTime }} นาทีในการอ่าน</span>
      </div>
    </header>

    <Content v-show="!showEnglish" />
    <div v-if="translation" v-show="showEnglish" v-html="translation.html"></div>

    <footer>
      <a href="/posts/">← Back to posts</a>
    </footer>
  </article>
</template>

<style scoped>
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--space-unit) * 1.25);
  margin-bottom: calc(var(--space-unit) * 2);
}
.lang-switch button {
  background: none;
  border: 0;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.4;
}
.lang-switch button:hover {
  opacity: 0.7;
}
.lang-switch button.active {
  opacity: 1;
}
</style>
