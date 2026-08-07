<!--
  Single dark/light toggle button — only one icon renders at a time
  (v-if/v-else), unlike the Open Design mockup where both icons were static
  markup and toggled via a `hidden` attribute the preview never executed.
  Actual persistence/no-flash-on-load is handled by the blocking inline
  script in config.ts's `head` (this component only handles the click).
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLight = ref(false)

onMounted(() => {
  isLight.value = document.documentElement.getAttribute('data-theme') === 'light'
})

function toggle() {
  isLight.value = !isLight.value
  if (isLight.value) {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  try {
    localStorage.setItem('theme', isLight.value ? 'light' : 'dark')
  } catch {
    // localStorage unavailable (private browsing, etc.) — theme just won't persist.
  }
}
</script>

<template>
  <button
    type="button"
    class="icon-link toggle-btn"
    :aria-label="isLight ? 'Switch to dark theme' : 'Switch to light theme'"
    @click="toggle"
  >
    <svg v-if="!isLight" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
    <svg v-else width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/></svg>
    <span class="toggle-label">Theme</span>
  </button>
</template>
