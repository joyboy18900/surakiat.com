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

---

The CSS for both lives in `.vitepress/theme/styles/base.css`.
