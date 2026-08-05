import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'surakiat',
  description: 'Whole Stack Software Engineer',
  cleanUrls: true,
  srcExclude: ['README.md', 'DESIGN.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    // Blocking (non-module, non-deferred) script so the saved theme applies
    // before first paint — avoids a flash of the wrong theme on load.
    // Ported from the mockup's inline <script> in <head>.
    [
      'script',
      {},
      `(function () {
        try {
          if (localStorage.getItem('theme') === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
          }
        } catch (e) {}
      })();`,
    ],
  ],

  locales: {
    root: {
      label: 'ไทย',
      lang: 'th',
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'surakiat',
      description: 'Whole Stack Software Engineer',
    },
  },
})
