# steventsvik.github.io

My personal portfolio — live at **https://steventsvik.github.io**

## How to update it

Everything visible on the site lives in **`index.html`**. Open it in any editor and look for these sections (marked with `<!-- ==== ... ==== -->` comments):

| What you want to change | Where |
|---|---|
| The rotating words in the hero (DATA / MARKETS / ...) | `main.js`, the `WORDS` list at the top |
| The intro paragraphs | `index.html`, the `about` section |
| The stat numbers (GPA, followers, etc.) | `index.html`, the `stats` block — edit `data-count` and the caption |
| Jobs / education timeline | `index.html`, the `history` section — copy an `<li class="entry">` block to add a new one (job title lives in the `<button>`, the click-to-expand text in `entry-note`; give the new `entry-detail` a unique `id` matching the button's `aria-controls`) |
| Skills in the scrolling strip | `index.html`, the `skills` section (each skill appears twice — the list is doubled so the loop is seamless; edit both copies) |
| Contact links | `index.html`, the `contact` section |
| Colors | `style.css`, the `:root` block at the top (`--accent` is the green) |

## Publishing changes

After editing, run these from this folder:

```bash
git add -A
git commit -m "Update site"
git push
```

GitHub Pages redeploys automatically — changes appear at the URL within a minute or two.
