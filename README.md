# surakiat.com

My personal website — a bilingual (Thai/English) blog and portfolio built
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

Thai posts go in `posts/<year>/<slug>.md`, English posts in
`en/posts/<year>/<slug>.md` (optional — only add one if you're translating
that post). Frontmatter:

```yaml
---
title: Post title
date: 2026-07-01
category: tech          # any string — the blog filter picks up new categories automatically
description: Short description shown in the post list
cover: /covers/x.jpg     # optional — omit if there's no cover image
layout: post
---
```

Reading time and the "latest posts" list are computed automatically at
build time — no need to author them.

See `CLAUDE.md` for the full architecture rundown.
