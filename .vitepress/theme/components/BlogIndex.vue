<script setup lang="ts">
import { ref, computed } from 'vue'
import { data as posts } from '../loaders/posts.data'

// Categories are derived from whatever posts actually exist — no hardcoded
// list — so a new category shows up the moment a post uses it.
const categories = computed(() => {
  const set = new Set(posts.map((p) => p.category))
  return Array.from(set).sort()
})

const activeCategory = ref('all')
const sortOrder = ref<'newest' | 'oldest'>('newest')

const filtered = computed(() => {
  const list = posts.filter(
    (p) => activeCategory.value === 'all' || p.category === activeCategory.value,
  )
  return [...list].sort((a, b) =>
    sortOrder.value === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date),
  )
})
</script>

<template>
  <h1>Blog</h1>

  <div class="controls">
    <nav class="category-filter" aria-label="Filter by category">
      <a href="#" :aria-current="activeCategory === 'all'" @click.prevent="activeCategory = 'all'">
        All
      </a>
      <a
        v-for="c in categories"
        :key="c"
        href="#"
        :aria-current="activeCategory === c"
        @click.prevent="activeCategory = c"
      >{{ c }}</a>
    </nav>
    <label class="sort-control">
      Sort
      <select v-model="sortOrder">
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </label>
  </div>

  <div class="post-list">
    <article v-for="post in filtered" :key="post.url" class="post-entry">
      <img class="post-cover" :src="post.cover || '/covers/default.svg'" :alt="post.title" />
      <div>
        <div class="post-meta">
          <time :datetime="post.date">{{ post.date }}</time>
          <span class="row-tag">{{ post.category }}</span>
          <span>{{ post.readingTime }} min read</span>
        </div>
        <div class="post-title"><a :href="post.url">{{ post.title }}</a></div>
        <p class="post-desc">{{ post.description }}</p>
      </div>
    </article>
  </div>

  <p v-if="filtered.length === 0" class="empty-state">No posts in this category yet.</p>
</template>

<style scoped>
h1 {
  margin: 0 0 calc(var(--space-unit) * 4);
}

.controls {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: calc(var(--space-unit) * 2);
  margin-bottom: calc(var(--space-unit) * 5);
  padding-bottom: calc(var(--space-unit) * 3);
  border-bottom: var(--border-weight) solid var(--border);
}
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--space-unit) * 1.5) calc(var(--space-unit) * 2);
  font-size: 0.85rem;
}
.category-filter a {
  color: var(--muted);
  text-decoration: none;
  cursor: pointer;
}
.category-filter a:hover {
  color: var(--accent);
}
.category-filter a[aria-current='true'] {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.sort-control {
  display: flex;
  align-items: center;
  gap: calc(var(--space-unit) * 1.25);
  font-size: 0.8rem;
  color: var(--muted);
}
.sort-control select {
  appearance: none;
  background: var(--bg);
  color: var(--fg);
  border: var(--border-weight) solid var(--border);
  font: inherit;
  font-family: var(--font-mono);
  padding: 4px 8px;
}
.sort-control select:hover {
  border-color: var(--muted);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space-unit) * 5);
}
.post-entry {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: calc(var(--space-unit) * 3);
}
.post-cover {
  aspect-ratio: 2 / 1;
  width: 100%;
  object-fit: cover;
  border: var(--border-weight) solid var(--border);
  background: var(--surface);
}
.post-meta {
  color: var(--muted);
  font-size: 0.8rem;
  display: flex;
  gap: calc(var(--space-unit) * 1.5);
  flex-wrap: wrap;
  margin-bottom: 4px;
}
.post-meta .row-tag {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.post-title {
  font-weight: 700;
  font-size: 1.05rem;
}
.post-title a {
  color: var(--fg);
  text-decoration: none;
}
.post-title a:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.post-desc {
  font-size: 0.9rem;
  margin: 6px 0 0;
  color: var(--muted);
}

.empty-state {
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 520px) {
  .post-entry {
    grid-template-columns: 1fr;
  }
  .post-cover {
    aspect-ratio: 16 / 9;
  }
}
</style>
