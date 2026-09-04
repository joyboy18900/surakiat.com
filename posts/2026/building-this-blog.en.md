---
title: My first blog
date: "2026-09-02"
categories: [tech, lifestyle]
description: A note that I have started blogging for real, after complaining on social media for a long time, plus a short note on how this site works.
layout: post
---

I often share things on Facebook and LinkedIn. Code, technical stuff, memes that feel too real, or things I read from people I follow. But after I post, it slowly gets lost in the feed. I don't come back to read most of it again. So for a while I thought about building a small SaaS to save my favorite posts and turn them into a weekly summary for myself. Or maybe some other way. In the end I thought, never mind. I also wanted to write a blog. So I just made a blog instead. I also want some distance from social media. So today I finally built my own blog. A place where what I write actually stays. When I want to share something, I can paste the link on my social media later... But I admit I still like reading what other people, and people I like, post on social media. Haha.

<p class="section-note">Since I have come this far, let me write down what this site is built with. It may be a bit too geeky. Think of it as a stamp on my first blog post. XD</p>

## The stack I chose

- VitePress for the build. I wrote the whole theme myself. I don't use the Default Theme that comes with the docs, so there is no sidebar and no ready-made search bar. (<u>Look at me doing it all myself. Really, I used a Harness plus Open Design to help.</u>)
- Vue for components like the home page and the post page.
- Every post is a Markdown file, because that is easy for me to write and manage. (<u>At first I thought for a while about building a backend plus a rich text editor, storing the data, and having a back office. But... this is where it ended.</u>)
- I deploy on Netlify too. It is convenient. (Free.)

## Design

I wanted the design to be plain. A dark background, one monospace font, one accent color, no shadows, no gradients. Many people I like use this style, and it is easy on the eyes.

For that design, I use [Open Design](https://open-design.ai/), which is open source ([nexu-io/open-design](https://github.com/nexu-io/open-design)). You can connect a Harness to it - Claude Code, Qwen Code, Codex, or whatever you like. Then you give Open Design a prompt that describes the look you want. I kept pushing it hard for a while, and...

For the result - the colors, the fonts, the spacing - I asked it to write these rules (including what to avoid, like AI slop) in both `DESIGN.md` and `brand.json`. You can go and look if you want.

> I made it public at [github.com/joyboy18900/surakiat.com](https://github.com/joyboy18900/surakiat.com)

## I want bilingual posts without keeping two parallel copies

VitePress has a built-in i18n mode. It adds a language prefix to the URL, like `/en/`. But I don't use it. It treats each language as a separate site. You have to keep two parallel post lists. Every Thai post always needs an English one next to it. If not, the post count shown goes wrong.

So I do this instead. Each post is one Thai file at `posts/year/name.md`. That is the only real page. If a post needs a translation, I add a `name.en.md` file in the same folder. That file does not become its own page. Instead it shows up as a Thai/English toggle on the same page. The switch happens on the client, with no page reload. No translation file means no toggle.

The result: there is only one post list. There is nothing to sync. For me that feels much better.

## How do I calculate reading time from the character count?

I looked into this for a while (well, Claude looked it up for me... XD). The common reading-time formula counts the number of words and divides by a reading speed per minute. It does not work for Thai. Thai does not put spaces between words. A program that counts words by looking for spaces will count a whole paragraph as one word. So the reading time comes out much lower than the truth.

> So this blog counts the number of characters in the Thai content instead. The English translation, if there is one, still counts words as usual.

```ts
// remove code blocks from the post first, don't count them as content
function stripCodeFences(src: string): string {
  return src.replace(/```[\s\S]*?```/g, '')
}

const THAI_CHARS_PER_MINUTE = 500

export function estimateThaiReadingTime(src: string): number {
  const text = stripCodeFences(src)
  return Math.max(1, Math.round(text.length / THAI_CHARS_PER_MINUTE))
}
```

## A search that does not rely on a tokenized index

For this feature I thought for a long time about whether to use [Algolia](https://www.algolia.com/). I really just wanted a box that opens with Cmd+K or Ctrl+K to search posts. The official VitePress site uses Algolia too. So it was the first option I thought of.

But when I really thought about it, Algolia is too much for a blog with only a few posts. You have to connect an outside service, set up an index, and keep it in sync. (<u>Honestly I would rather build it myself. I am too lazy to pull in a library.</u>) The free local search built into VitePress uses MiniSearch behind the scenes. It splits words by spaces. With Thai, which has no spaces, it falls apart. Same reason as the reading-time problem.

> In the end I built it myself. I match on the substring directly and set my own weights. A match in the title matters more than a match in the category. A match in the category matters more than a match in the description.

```ts
// build the index once on load, lowercase it right away
const searchIndex = posts.map((p) => ({
  post: p,
  title: p.title.toLowerCase(),
  category: p.category.toLowerCase(),
  description: p.description.toLowerCase(),
}))

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return searchIndex
    .map((p) => ({
      post: p.post,
      score:
        (p.title.includes(q) ? 3 : 0) +       // match in title
        (p.category.includes(q) ? 2 : 0) +    // match in category
        (p.description.includes(q) ? 1 : 0),  // match in description
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .map((r) => r.post)
})
```

My way is dumb and simple. One small typo and it finds nothing. It has no clever guessing like Google (no fuzzy match, no typo tolerance at all). And it only searches the title, the category, and the short description. It does not read through the whole post.

But I think it is enough. There are only a few dozen posts. Even if it grows to a hundred, running `.includes` one by one on every keystroke is still fast. When I weigh the trade-off, the difference is small. What I really give up is fuzzy match. In return, I do not build an index myself and I do not pull in anyone's library. It is twenty lines of my own code. It also works for both Thai and English, because it never needs to cut sentences into words in the first place. And Thai is hard to cut anyway.

## DefaultTheme used to handle all of this

I did not build on top of VitePress's DefaultTheme. So the small things it used to give me, I had to do myself. For example, the colors in code blocks: Shiki adds the colors, but the CSS that turns them into real colors lives in DefaultTheme. Without it loaded, the colors look flat. A few lines of my own fixed it. For dark and light mode, I wrote the toggle myself. It saves the choice in localStorage. A small script in the `<head>` sets the theme before the page finishes rendering. If not, the screen flashes dark for a moment on every reload.

> There are still many parts I want to talk about. But I will stop here for now. If you are interested, go and look in the repo.

<hr class="section-divider" />

## What's next

This blog is my own space. I do not plan it to be only a tech blog. I will write about work, things I read, and daily life notes, all mixed together. I split them with tags. If you only want to read tech, just filter.

That is all for the start. The rest, we will see later. Byeee.
