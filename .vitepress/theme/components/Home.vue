<script setup lang="ts">
import { computed } from 'vue'
import { useData, Content } from 'vitepress'
import { data as posts } from '../loaders/posts.data'
import SocialLinks from './SocialLinks.vue'

const { frontmatter } = useData()

const latest = computed(() => posts.slice(0, 3))
</script>

<template>
  <section class="bio">
    <h1>{{ frontmatter.name }}</h1>
    <p class="role">{{ frontmatter.role }}</p>
    <Content />
    <SocialLinks class="hero-social" />
  </section>

  <hr class="section-divider" />

  <section class="latest-posts">
    <div class="section-head">
      <h2>Latest Posts</h2>
      <a href="/posts/">All posts →</a>
    </div>
    <div v-for="post in latest" :key="post.url" class="row">
      <div class="row-meta">
        <time :datetime="post.date">{{ post.date }}</time>
        <span class="row-tag">{{ post.category }}</span>
      </div>
      <span class="row-title"><a :href="post.url">{{ post.title }}</a></span>
    </div>
  </section>
</template>

<style scoped>
.bio, .latest-posts {
  margin-bottom: calc(var(--space-unit) * 7);
}
.role {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0 0 calc(var(--space-unit) * 3);
}
.section-divider {
  border: 0;
  border-top: var(--border-weight) solid var(--border);
  margin: calc(var(--space-unit) * 3.5) 0;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-unit);
  margin-bottom: calc(var(--space-unit) * 2.5);
}
.section-head h2 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0;
}
.section-head a {
  font-size: 0.8rem;
  color: var(--muted);
  text-decoration: none;
}
.section-head a:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.row {
  margin-bottom: calc(var(--space-unit) * 2.5);
}
.row:last-child {
  margin-bottom: 0;
}
.row-title {
  font-weight: 700;
}
.row-title a {
  color: var(--fg);
  text-decoration: none;
}
.row-title a:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.row-meta {
  color: var(--muted);
  font-size: 0.8rem;
  margin: 0 0 2px;
  display: flex;
  gap: calc(var(--space-unit) * 1.5);
  flex-wrap: wrap;
}
.row-meta .row-tag {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
