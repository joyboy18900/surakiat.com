<script setup lang="ts">
import { useData, Content } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import Post from './components/Post.vue'
import BlogIndex from './components/BlogIndex.vue'
import Home from './components/Home.vue'

// `layout:` frontmatter dispatches to a bespoke page component; anything
// else (About, future plain pages) falls back to rendering the markdown
// content directly.
const { frontmatter } = useData()
</script>

<template>
  <SiteHeader />
  <main class="container">
    <Post v-if="frontmatter.layout === 'post'" />
    <BlogIndex v-else-if="frontmatter.layout === 'blog'" />
    <Home v-else-if="frontmatter.layout === 'home'" />
    <Content v-else />
  </main>
  <SiteFooter />
</template>
