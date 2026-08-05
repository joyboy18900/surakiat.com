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
Markdown blog posts and a few hand-built pages, bilingual (Thai/English).

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

### i18n: Thai is root, English is `/en/`

VitePress's i18n requires one **root locale** (unprefixed) and every other
locale as a **fully separate, mirrored folder tree**. There is **no
automatic fallback** between locales — a page that doesn't exist under a
locale's folder simply 404s there. This repo has Thai as root:

```
index.md, about.md, posts/<year>/<slug>.md      → Thai (root, unprefixed)
en/index.md, en/about.md, en/posts/<year>/<slug>.md → English (/en/ prefix)
```

Consequences baked into the code, not just convention:
- `en/index.md` and `en/about.md` must always exist (nav is always visible),
  but individual blog posts are free to be Thai-only — there's no
  requirement to translate every post.
- `LangToggle.vue` doesn't naively swap `/en/` in and out of the URL — for
  post pages it checks both locales' content-loader data
  (`useLocalePosts.ts` / `thPosts` / `enPosts`) to see if a translated
  counterpart actually exists, and falls back to that locale's home if not.
  If you change post URL structure, this matching logic
  (`localeAgnosticKey` in `LangToggle.vue`) needs to stay in sync.
- UI chrome strings (nav labels, "Latest Posts", empty-state text, toggle
  `aria-label`s, etc.) live in `.vitepress/theme/i18n.ts` as a small hand-rolled
  `{ th: {...}, en: {...} }` dictionary read via `useLocale()` — not a full
  i18n library, and not VitePress DefaultTheme's built-in translation keys
  (irrelevant here since the theme is fully custom).

### Content loaders (`.vitepress/theme/loaders/`)

Post data is read at **build time** via `createContentLoader`, one loader
per locale (`posts.th.data.ts` globs `posts/*/*.md`, `posts.en.data.ts`
globs `en/posts/*/*.md` — the one-level-deep glob naturally excludes each
locale's own `posts/index.md`, no manual filtering needed). `useLocalePosts.ts`
picks the right loader's data based on the current locale. Both `Home.vue`
(latest 3) and `BlogIndex.vue` (full list) consume this same data — don't
duplicate the loading logic per component.

Two fields are **computed in the loader, not authored in frontmatter**:
- **`readingTime`**: character-count based for Thai (`readingTime.ts` —
  Thai script doesn't reliably space-delimit words, so word-count would
  undercount it badly), word-count based for English. If you add a third
  locale, decide which formula it needs.
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
