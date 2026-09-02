import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'th',
  title: 'surakiat',
  description: 'Whole Stack Software Engineer',
  cleanUrls: true,
  // README/DESIGN/CLAUDE/RECIPES docs, and per-post English companion files,
  // are never routed as their own pages. Companions are only ever read via
  // postTranslations.data.ts and shown as an in-place toggle on the Thai post.
  // _drafts/ holds parked posts kept out of the build; the posts.data.ts glob
  // (posts/*/*.md) never sees them, and this keeps them from being routed too.
  srcExclude: ['README.md', 'DESIGN.md', 'CLAUDE.md', 'RECIPES.md', 'posts/**/*.en.md', '_drafts/**'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    // Blocking (non-module, non-deferred) script so the saved theme applies
    // before first paint - avoids a flash of the wrong theme on load.
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
})
