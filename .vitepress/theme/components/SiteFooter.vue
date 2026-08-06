<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'
import { GITHUB_REPO_URL } from '../constants'
</script>

<template>
  <footer class="site-footer">
    <div class="footer-row">
      <a :href="GITHUB_REPO_URL" target="_blank" rel="noopener noreferrer">surakiat.me</a>
      <SocialLinks />
    </div>
  </footer>
</template>
