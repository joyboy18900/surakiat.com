# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install   # install deps
pnpm dev       # dev server (VitePress + HMR)
pnpm build     # production build -> .vitepress/dist ; fails on any dead link
               # (ignoreDeadLinks is left at its default false — treat a
               # build failure here as a real broken link, not a fluke)
pnpm preview   # serve the production build locally
```

There is no lint/test setup in this repo — don't invent one unprompted.

Dev-mode routes always return 200 regardless of whether content exists there
(VitePress's SPA fallback serves the shell for any path). To actually verify
a route/page exists, use `pnpm build` and check `.vitepress/dist/**/*.html`,
or `pnpm preview` (which 404s correctly like a real static host).

## Architecture

This is a **personal site + blog**: a fully custom VitePress theme
(`extends: undefined` — no DefaultTheme docs chrome) rendering both
Markdown blog posts and a few hand-built pages. The site itself (nav, Home,
About, footer) is Thai-only; individual post bodies can optionally have an
English translation toggle (see below).

### Layout dispatch (`.vitepress/theme/Layout.vue`)

There's no VitePress "docs" layout. `Layout.vue` reads frontmatter
`layout:` and switches between four bespoke components:

- `layout: home` → `components/Home.vue` (bio + latest posts)
- `layout: blog` → `components/BlogIndex.vue` (post list, filter, sort)
- `layout: post` → `components/Post.vue` (single post)
- anything else / absent → generic `<Content/>` (plain markdown — used by
  About and any future simple page)

To add a new *kind* of page (not a blog post), you either add a case here
or just let it fall through to plain `<Content/>`.

### Bilingual posts: one canonical list, optional per-post English toggle

There is **no VitePress locale/i18n config** in this repo (deliberately —
an earlier version used VitePress's native locale-prefix i18n, which treats
each language as a fully separate mirrored site with independent post
lists/counts; that's the wrong model here and was removed). Instead:

- Every post is a single Thai file: `posts/<year>/<slug>.md`. This is the
  **only** routed page for that post, and the **only** post list that
  exists anywhere (`posts.data.ts`) — there is no separate English list to
  keep in sync, by construction.
- A post *may* have an optional companion `posts/<year>/<slug>.en.md`
  (same folder, `.en` suffix). It's `srcExclude`d in `config.ts` so it
  never becomes its own routed page — it's only ever read via
  `postTranslations.data.ts` (`createContentLoader(..., { render: true })`,
  which compiles its markdown to HTML at build time).
- `Post.vue` looks up a translation by stripping the trailing `.en` off the
  loader's URL and comparing to the current route. If found, it renders a
  small ไทย/English toggle and both bodies (`<Content/>` for Thai,
  `v-html="translation.html"` for English) are baked into the *same* static
  page — the toggle is pure client-side `v-show`, no navigation, no
  fallback logic needed since there's nothing to fall back from. If no
  companion exists, no toggle renders — the post is just Thai, which is
  also always the default.
- Nav, Home, About, and the footer are plain hardcoded Thai text — no
  translation dictionary, no `useLocale()`. Bilingual support is
  intentionally scoped to post bodies only.

### Content loaders (`.vitepress/theme/loaders/`)

Post data is read at **build time** via `createContentLoader`.
`posts.data.ts` globs `posts/*/*.md` and filters out any matched `*.en.md`
companions (the glob catches them, but they must never appear as their own
list entries) — the one-level-deep glob naturally excludes `posts/index.md`
itself, no extra filtering needed there. `postTranslations.data.ts` globs
`posts/*/*.en.md` separately with `render: true` for the compiled HTML.
Both `Home.vue` (latest 3) and `BlogIndex.vue` (full list) consume the same
`posts.data.ts` — don't duplicate the loading logic per component.

Two fields are **computed in the loader, not authored in frontmatter**:
- **`readingTime`**: character-count based for the Thai body
  (`readingTime.ts` — Thai script doesn't reliably space-delimit words, so
  word-count would undercount it badly); the English companion (if any)
  gets its own word-count-based reading time via the same file.
- **Categories** shown in `BlogIndex.vue`'s filter are derived dynamically
  from whatever `category` values actually exist across posts — there is
  no hardcoded category list anywhere. A new category on a new post just
  shows up.

### Post frontmatter contract

```yaml
---
title: string          # required
date: YYYY-MM-DD        # required — drives sort order and "latest posts"
category: string        # required — feeds the dynamic filter, any string works
description: string     # required — shown in the list view
cover: /covers/x.jpg     # optional — omit entirely if there's no cover
layout: post             # required for individual posts
---
```

If `cover` is omitted, both `Post.vue` and `BlogIndex.vue` fall back to the
same shared placeholder image (`public/covers/default.svg`) rather than
hiding the cover slot — every post always shows *some* image. There is no
`draft` frontmatter/concept: every `.md` file under `posts/`/`en/posts/` is
live the moment it's pushed.

### CSS: scoped vs global split

`.vitepress/theme/styles/` holds global CSS (`vars.css` design tokens
including the `[data-theme="light"]` override block, `base.css` resets,
`header-footer.css`, `post.css`, `about.css`). Components that render
`<Content/>` (`Post.vue`, and the plain-markdown About page) **must** use
global CSS for anything targeting the rendered markdown body — Vue's
`scoped` styles can't reach content injected via `<Content/>`. Components
that don't render `<Content/>` (`Home.vue`, `BlogIndex.vue`) use `<style
scoped>` for their own page-specific CSS instead. Keep new components on
whichever side of this split matches whether they render `<Content/>`.

Fenced code blocks in markdown get wrapped by VitePress's own pipeline in a
`div[class*="language-"]` with a copy button + language label — DefaultTheme
decorations this project doesn't load CSS for, so `post.css` explicitly
hides `.copy`/`.lang` rather than leaving them unstyled.

### Design source of truth

`DESIGN.md` / `brand.json` document the design tokens/voice (dark-by-default,
single monospace font, one accent color, no gradients/cards/shadows/decorative
icons, ~65ch single-column reader layout) — both are `srcExclude`d in
`config.ts` so they don't get rendered as site pages, but they're the
reference if a new component's styling is unclear. `colors_and_type.css` no
longer exists in this repo (superseded by `.vitepress/theme/styles/vars.css`
+ `base.css`) — don't recreate it.
