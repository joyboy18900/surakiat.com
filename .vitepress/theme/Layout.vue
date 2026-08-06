<script setup lang="ts">
import { useData, useRoute, Content } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import Post from './components/Post.vue'
import BlogIndex from './components/BlogIndex.vue'
import Home from './components/Home.vue'

// `layout:` frontmatter dispatches to a bespoke page component; anything
// else (About, future plain pages) falls back to rendering the markdown
// content directly.
const { frontmatter } = useData()
const route = useRoute()
</script>

<template>
  <SiteHeader />
  <main class="container">
    <!-- :key forces a fresh component instance per route. Without it, VitePress's
         client-side navigation reuses the same Post.vue instance across
         post->post links, leaking local state (e.g. the English-toggle
         `showEnglish` ref) into a post that has no translation. -->
    <Post v-if="frontmatter.layout === 'post'" :key="route.path" />
    <BlogIndex v-else-if="frontmatter.layout === 'blog'" />
    <Home v-else-if="frontmatter.layout === 'home'" />
    <Content v-else />
  </main>
  <SiteFooter />
</template>
