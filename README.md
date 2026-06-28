# Birchwood Homestays — website

A small static website: two property pages, home, about, and contact.
**All the content you'll actually want to change lives in two files in
`data/`, completely separate from the HTML/CSS/JS that displays it.**
You should never need to touch the code to update photos, prices, or text.

## Folder structure

```
homestay-site/
├── index.html        ← home page
├── property.html      ← ONE template used for both properties (via ?id=)
├── about.html
├── contact.html
├── css/style.css      ← all design/styling, in one file
├── js/shared.js        ← header/footer + page logic, rarely needs touching
├── data/
│   ├── site.json       ← business name, phone, email, about text, footer
│   └── properties.json ← both properties: photos, rooms, prices, reviews
└── images/              ← placeholder photos — replace these with real ones
```

## The #1 thing to know: adding photos

1. Drop your image file into the `images/` folder (e.g. `images/riverside-5.jpg`).
2. Open `data/properties.json`.
3. Find the property's `"images"` list and add the path as a new line:

```json
"images": [
  "images/riverside-1.svg",
  "images/riverside-2.svg",
  "images/riverside-5.jpg"      <-- just add a line like this
]
```

That's it — no HTML, no code. The gallery on that property's page picks it
up automatically. The same applies to `"heroImage"` (the photo shown on the
home page card).

**Tip:** keep photos under ~500KB each so pages load quickly. Any free
online compressor (e.g. squoosh.app) works before you upload.

## Editing text, prices, and rooms

Everything else also lives in `data/properties.json` and `data/site.json` —
both are plain text files you can open in any text editor (Notepad,
TextEdit, VS Code, or even GitHub's web editor). A few rules to avoid
breaking the file:

- Every piece of text goes inside `"double quotes"`.
- Every item except the last one in a list needs a comma `,` after it.
- If you're unsure after editing, paste the file's contents into
  [jsonlint.com](https://jsonlint.com) — it'll tell you exactly which
  line has a typo, if any.

To add a third property entirely: copy one of the two property blocks in
`properties.json` (from its opening `{` to closing `}`), paste it as a new
item, give it a new unique `"id"`, and fill in its details. It will
automatically appear on the home page and get its own page at
`property.html?id=your-new-id`.

## Previewing the site on your own computer

Because the pages load `data/*.json` via fetch, **double-clicking
index.html will not work** — browsers block that for local files. Instead,
run a tiny local server from inside the `homestay-site` folder:

```bash
# if you have Python installed
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

or, if you have Node.js:

```bash
npx serve .
```

You only need this for previewing on your own machine — once deployed
(below), it works normally.

## Deploying (free)

Any of these work with zero configuration since this is a plain static site:

- **Netlify**: drag the `homestay-site` folder onto [app.netlify.com/drop](https://app.netlify.com/drop)
- **Vercel**: `npx vercel` from inside the folder, or connect a GitHub repo at vercel.com
- **GitHub Pages**: push this folder to a GitHub repo, then in the repo's
  Settings → Pages, set the source to your main branch

Whenever you edit a file and want the live site updated, just re-upload
(Netlify drag-and-drop) or push the change (GitHub/Vercel) — no build step.

## Upgrading the contact form

Right now the contact form opens the visitor's email app with a pre-filled
message — works everywhere, costs nothing, but isn't "silent." If you want
it to submit without opening email, and you're on Netlify, add
`data-netlify="true"` and a hidden `form-name` input to the `<form>` tag in
`contact.html`, and Netlify will collect submissions in your dashboard
automatically — no other code changes needed. (Formspree.io is a similar
one-line option if you deploy elsewhere.)

## Why this won't break the way your last site did

- Content (text, photos, prices) and code (layout, logic) are in
  separate files. Editing content never touches code.
- Both property pages are generated from **one** template
  (`property.html`) reading `data/properties.json` — there's only one
  page's worth of code to ever go wrong, no matter how many properties
  you add.
- `data/*.json` files are simple lists and key/value pairs — there's no
  way to "break the layout" by editing them; at worst a missing comma
  stops that file from loading, which is easy to spot and fix (see
  jsonlint.com above).
