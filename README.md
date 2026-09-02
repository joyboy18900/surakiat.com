# surakiat.com

My personal website - a bilingual (Thai/English) blog and portfolio built
with [VitePress](https://vitepress.dev) and a fully custom theme.

## Develop

```bash
pnpm install
pnpm dev       # http://localhost:5173
```

## Build

```bash
pnpm build     # -> .vitepress/dist ; fails on any dead link
pnpm preview   # serve the production build locally
```

## Writing a post

Thai posts go in `posts/<year>/<slug>.md`. If you want to translate a
specific post, add a companion file next to it -
`posts/<year>/<slug>.en.md` (same folder, `.en` suffix) - and a 🇹🇭/🇬🇧
toggle appears on that post automatically. Optional; most posts won't have
one. Frontmatter for the Thai file:

```yaml
---
title: Post title
date: "2026-07-01"      # must be quoted, or YAML parses it as a Date and it displays wrong
category: tech          # any string - the blog filter picks up new categories automatically
description: Short description shown in the post list
cover: /covers/x.jpg     # optional - omit if there's no cover image
layout: post
---
```

The `.en.md` companion only needs a `title:` - everything else (date,
category, cover) comes from the Thai file.

Reading time and the "latest posts" list are computed automatically at
build time - no need to author them.

See `CLAUDE.md` for the full architecture rundown.
