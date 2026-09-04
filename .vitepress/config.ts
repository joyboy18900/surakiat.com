import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'th',
  title: 'surakiat',
  description: 'Whole Stack Software Engineer',
  cleanUrls: true,
  srcExclude: ['README.md', 'DESIGN.md', 'CLAUDE.md', 'RECIPES.md', 'posts/**/*.en.md', '_drafts/**'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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
})
