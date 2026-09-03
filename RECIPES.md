# Text styles

Drop one of these into a post as raw HTML, with a blank line above and
below it. Swap in your own text.

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

## Highlight

An accent rule down the left with a filled background, the line in bold.
Text keeps the normal colour, so it follows the theme; only the left rule
is the accent. Use it for one standalone statement - a key line or a
lead-in above a section. It needs the class, so it is raw HTML on a single
line.

```text
┃  ONE KEY LINE, SET APART IN BOLD
```

```html
<blockquote class="highlight">One line, set apart in bold</blockquote>
```

Markdown is not processed inside raw HTML - if you need a code term in
there, write `<code>`, not backticks.

---

The CSS for these lives in `.vitepress/theme/styles/base.css`.
