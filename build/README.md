# build — blog generator

The Arabic blog is generated, not hand-edited.

- `posts/<slug>.html` holds the article body only (the HTML inside `<article>`).
- `blog.py` holds every post's metadata in `POSTS` and builds `blog.html`,
  `blog-<slug>.html`, `blog.xml` (RSS), the blog entries in `sitemap.xml` and
  `llms.txt`, and the blog link in the nav of every page. It also appends
  `blog.css` to `assets/css/style.css` and refreshes the `?v=` hash on all pages.
- `og.js` renders the 1200×630 covers into `assets/img/blog/`.

## Add a post

1. Write `build/posts/<slug>.html`: a `.tldr` summary, `<h2 id="...">` sections
   (they become the table of contents), and a `.faq` block of
   `<details><summary>question</summary><p>answer</p></details>`
   (it becomes FAQPage structured data).
2. Add its entry to `POSTS` in `blog.py`.
3. From the repo root: `python3 build/blog.py`, then
   `python3 -m http.server 8899 &` and `node build/og.js`.
4. Covers are cached as immutable: if a cover changes, rename the slug's image.
