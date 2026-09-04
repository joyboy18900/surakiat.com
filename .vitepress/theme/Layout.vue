<script setup lang="ts">
import { useData, useRoute, Content } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import Post from './components/Post.vue'
import BlogIndex from './components/BlogIndex.vue'
import Home from './components/Home.vue'

const { frontmatter } = useData()
const route = useRoute()
</script>

<template>
  <SiteHeader />
  <main class="container">
    <Post v-if="frontmatter.layout === 'post'" :key="route.path" />
    <BlogIndex v-else-if="frontmatter.layout === 'blog'" />
    <Home v-else-if="frontmatter.layout === 'home'" />
    <Content v-else />
  </main>
  <SiteFooter />
</template>
