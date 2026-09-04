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
</template>
