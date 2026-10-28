# design-src

Source for the portfolio boards (`assets/img/work/pf-01..07`). Not linked from the site.

Render: serve the repo root (`python3 -m http.server 8899`), open
`/design-src/portfolio-boards.html`, screenshot each `#pf-0N` element at
deviceScaleFactor 2, then downscale to 991×1400 (full) and 700×990 (thumb),
JPG q84 + WebP q80.

`/assets/*` is cached immutable for a year: if a board changes, export it
under a NEW filename and update the references.
