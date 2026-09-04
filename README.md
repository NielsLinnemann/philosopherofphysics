# philosopherofphysics.com — Static Site

## File structure

```
index.html          ← About page (home)
research.html       ← Research themes + publications + talks
teaching.html       ← Teaching
outreach.html       ← Outreach

style.css           ← All styles (single file, CSS variables for easy theming)
nav.js              ← Injects the nav bar and footer into every page
bib-loader.js       ← Parses publications.bib and renders the publications list
talks-loader.js     ← Parses talks.json and renders the talks list

publications.bib    ← ★ Edit this to add/update publications
talks.json          ← ★ Edit this to add/update talks
```

## How to update publications

Open `publications.bib` in any text editor and add a new entry:

```bibtex
@article{yourkey2025,
  author   = {Last, First and Last2, First2},
  title    = {Your paper title},
  journal  = {Journal Name},
  year     = {2025},
  pubtype  = {Journal Article},
  preprint = {https://arxiv.org/abs/...},
  paperurl = {https://doi.org/...}
}
```

Supported entry types: `@book`, `@article`, `@incollection`, `@misc`

Custom fields:
- `pubtype` — displayed as a tag and used for filtering (e.g., "Journal Article", "Book", "Book Chapter")
- `preprint` — URL to preprint (shows "Preprint" button)
- `paperurl` — URL to published paper (shows "Paper" button)

## How to update talks

Open `talks.json` and add an entry to the array:

```json
{
  "date": "03/2026",
  "title": "Your talk title",
  "event": "Conference or event name",
  "location": "City, Country",
  "type": "academic"
}
```

## Hosting

This is a **fully static** site. You can host it on:
- **GitHub Pages** (free): push the folder to a repo, enable Pages
- **Netlify** (free): drag the folder to netlify.com/drop
- **Any web host**: upload all files via FTP/SFTP

> ⚠️ The BibTeX/JSON loading uses `fetch()`, which requires files to be served over HTTP(S).
> Opening `index.html` directly from your filesystem will NOT load publications/talks.
> Use a local server for testing: `python3 -m http.server 8000` in the site folder.

## Customising the design

All design tokens are in `style.css` under `:root { ... }`. Change:
- `--cream` / `--cream-dark` for the background family
- `--rust` for the accent colour
- `--teal` for link colours
- Font families at the top (currently Lora + DM Sans from Google Fonts)
