# Text styles

Drop one of these into a post, with a blank line above and below it.
Section note and drop cap are raw HTML; the callout is a plain markdown
quote. Swap in your own text.

## Section note

A small line with a short rule on each side. Opens a section.

```text
──  In case you got this far, a note on what this runs on  ──
```

```html
<p class="section-note">In case you got this far, a note on what this runs on</p>
```

## Drop cap

A large first letter that the first lines wrap around. English text only.

```text
┌───┐ the first lines of the paragraph run
│ T │ beside the big letter for about two
└───┘ lines, then go back to full width.
```

```html
<p class="dropcap">The first paragraph of the post goes here</p>
```

## Callout

An accent rule down the left with a filled background. Text keeps the
normal colour, so it follows the theme; only the left rule is the accent.
Use it for a lead-in above a section, or any passage you want set apart.
It is a plain markdown quote, so `**bold**` and `` `code` `` work inside
it - bold a whole line to make it read as a key statement.

```text
┃  a set-apart passage sits here, with the accent
┃  rule running down the left edge.
```

```md
> A passage you want set apart goes here. Bold a whole line
> with **double asterisks** for a key statement.
```

---

The CSS for these lives in `.vitepress/theme/styles/base.css`.
