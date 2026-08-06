<!--
  GitHub contribution chart embed — used in about.md. Registered as a
  global component (see theme/index.ts's enhanceApp) so it's usable
  directly inside plain Markdown as <GithubActivityChart />.
-->
<script setup lang="ts">
import { GITHUB_USERNAME, GITHUB_PROFILE_URL, ACCENT_COLOR } from '../constants'
</script>

<template>
  <a
    class="activity-chart-frame"
    :href="GITHUB_PROFILE_URL"
    aria-label="surakiat's GitHub profile"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      class="activity-chart"
      :src="`https://ghchart.rshah.org/${ACCENT_COLOR}/${GITHUB_USERNAME}`"
      alt="surakiat's GitHub Activity"
    />
  </a>
  <p class="activity-note">Live contribution activity, pulled from GitHub.</p>
</template>
