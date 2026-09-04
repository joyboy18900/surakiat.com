<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'
import { data as posts } from '../loaders/posts.data'
import { formatDate } from '../formatDate'

const router = useRouter()

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const kbdLabel = ref('Ctrl K')

const triggerEl = ref<HTMLButtonElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const overlayEl = ref<HTMLDivElement | null>(null)

const searchIndex = posts.map((p) => ({
  post: p,
  title: p.title.toLowerCase(),
  category: p.categories.join(' ').toLowerCase(),
  description: p.description.toLowerCase(),
}))

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return searchIndex
    .map((p) => ({
      post: p.post,
      score:
        (p.title.includes(q) ? 3 : 0) +
        (p.category.includes(q) ? 2 : 0) +
        (p.description.includes(q) ? 1 : 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .map((r) => r.post)
})

function scrollActiveIntoView() {
  const el = overlayEl.value?.querySelectorAll<HTMLAnchorElement>('.search-result')[activeIndex.value]
  el?.scrollIntoView({ block: 'nearest' })
}

function move(delta: number) {
  const list = results.value
  if (!list.length) return
  activeIndex.value = (activeIndex.value + delta + list.length) % list.length
  scrollActiveIntoView()
}

watch(results, (list) => {
  activeIndex.value = list.length ? 0 : -1
})

function open() {
  isOpen.value = true
  query.value = ''
  document.body.style.overflow = 'hidden'
  nextTick(() => inputEl.value?.focus())
}

function close() {
  isOpen.value = false
  document.body.style.overflow = ''
  triggerEl.value?.focus()
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

function go(url: string) {
  close()
  router.go(url)
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === overlayEl.value) close()
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    move(-1)
  } else if (e.key === 'Enter') {
    const active = results.value[activeIndex.value]
    if (active) go(active.url)
  }
}

function onGlobalKeydown(e: KeyboardEvent) {
  const isK = e.key === 'k' || e.key === 'K'
  if (isK && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    toggle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  if (/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '')) {
    kbdLabel.value = '⌘K'
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <button
    ref="triggerEl"
    type="button"
    class="icon-link search-trigger"
    aria-haspopup="dialog"
    :aria-label="`Search posts (${kbdLabel})`"
    @click="open"
  >
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
    <kbd class="trigger-kbd" aria-hidden="true">{{ kbdLabel }}</kbd>
    <span class="toggle-label">Search</span>
  </button>

  <Teleport to="body">
    <div v-if="isOpen" ref="overlayEl" class="search-overlay" @click="onOverlayClick" @keydown.esc="close">
      <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search posts">
        <div class="search-modal-header">
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          <input
            ref="inputEl"
            v-model="query"
            type="text"
            class="search-modal-input"
            placeholder="Search posts…"
            autocomplete="off"
            aria-label="Search posts"
            @keydown="onInputKeydown"
          />
          <button type="button" class="search-modal-close" aria-label="Close search (Esc)" @click="close">
            <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>

        <div class="search-modal-results">
          <p v-if="!query.trim()" class="search-modal-empty">Start typing to search…</p>
          <p v-else-if="results.length === 0" class="search-modal-empty">No posts found.</p>
          <a
            v-for="(post, i) in results"
            :key="post.url"
            class="search-result"
            :class="{ active: i === activeIndex }"
            :href="post.url"
            @mouseenter="activeIndex = i"
            @click="close"
          >
            <div class="search-result-meta">
              <time :datetime="post.date">{{ formatDate(post.date) }}</time>
              <span v-for="c in post.categories" :key="c" class="row-tag">{{ c }}</span>
            </div>
            <div class="search-result-title">{{ post.title }}</div>
            <p class="search-result-desc">{{ post.description }}</p>
          </a>
        </div>

        <div class="search-modal-hints" aria-hidden="true">
          <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> to navigate</span>
          <span><kbd>&crarr;</kbd> to select</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.search-trigger {
  gap: 6px;
}

kbd {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--muted);
  background: var(--surface);
  border: var(--border-weight) solid var(--border);
  padding: 1px 5px;
  line-height: 1.4;
}

.search-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: calc(var(--space-unit) * 10) var(--space-unit) var(--space-unit);
  z-index: 1000;
}

.search-modal {
  width: 100%;
  max-width: 560px;
  max-height: 70vh;
  background: var(--bg);
  border: var(--border-weight) solid var(--border);
  display: flex;
  flex-direction: column;
}

.search-modal-header {
  display: flex;
  align-items: center;
  gap: calc(var(--space-unit) * 1.5);
  padding: calc(var(--space-unit) * 2);
  border-bottom: var(--border-weight) solid var(--border);
}
.search-modal-header > svg {
  flex: none;
  fill: var(--muted);
}
.search-modal-input {
  flex: 1;
  min-width: 0;
  background: none;
  border: 0;
  outline: none;
  color: var(--fg);
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.95rem;
}
.search-modal-input::placeholder {
  color: var(--muted);
}
.search-modal-close {
  display: inline-flex;
  flex: none;
  color: var(--muted);
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.search-modal-close:hover {
  color: var(--accent);
}
.search-modal-close svg {
  display: block;
  fill: currentColor;
}

.search-modal-results {
  overflow-y: auto;
  padding: calc(var(--space-unit) * 1);
}
.search-modal-empty {
  padding: calc(var(--space-unit) * 4) calc(var(--space-unit) * 2);
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  text-align: center;
}
.search-result {
  display: block;
  padding: calc(var(--space-unit) * 1.5);
  color: inherit;
  text-decoration: none;
}
.search-result:hover,
.search-result.active {
  background: var(--surface);
}
.search-result-meta {
  display: flex;
  gap: calc(var(--space-unit) * 1.5);
  color: var(--muted);
  font-size: 0.75rem;
  margin-bottom: 2px;
}
.search-result-meta .row-tag {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.search-result-title {
  font-weight: 700;
  color: var(--fg);
}
.search-result:hover .search-result-title,
.search-result.active .search-result-title {
  color: var(--accent);
}
.search-result-desc {
  font-size: 0.85rem;
  color: var(--muted);
  margin: 2px 0 0;
}

.search-modal-hints {
  display: flex;
  gap: calc(var(--space-unit) * 2.5);
  padding: calc(var(--space-unit) * 1.5) calc(var(--space-unit) * 2);
  border-top: var(--border-weight) solid var(--border);
  color: var(--muted);
  font-size: 0.75rem;
}
.search-modal-hints kbd {
  margin-right: 3px;
}

@media (max-width: 640px) {
  .search-overlay {
    padding: calc(var(--space-unit) * 4) var(--space-unit);
  }
}

@media (max-width: 768px) {
  .trigger-kbd {
    display: none;
  }
}
</style>
