// Renders blog cover images (1200x630) to assets/img/blog/<file> — Arabic (rtl) and English (ltr).
// Existing covers are skipped (they are cached as immutable); pass --force to redraw them.
// Usage from repo root:  python3 -m http.server 8899 &   then   node build/og.js
// Needs Playwright with Chromium. Titles come from build/blog.py (POSTS) via build/og-data.json.
const {chromium} = require('playwright');
const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('build/og-data.json', 'utf8'));
const exe = fs.existsSync('/opt/pw-browsers/chromium') ? {executablePath: '/opt/pw-browsers/chromium'} : {};

const page = p => `<!doctype html><html lang="${p.dir==='rtl'?'ar':'en'}" dir="${p.dir}"><head><meta charset="utf-8"><style>
@font-face{font-family:T;src:url(/build/fonts/tajawal-arabic-500-normal.woff2);font-weight:500}
@font-face{font-family:T;src:url(/build/fonts/tajawal-arabic-800-normal.woff2);font-weight:800}
@font-face{font-family:T;src:url(/build/fonts/tajawal-arabic-900-normal.woff2);font-weight:900}
@font-face{font-family:M;src:url(/build/fonts/manrope-latin-800-normal.woff2);font-weight:800}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:T,M,sans-serif;color:#F5F5F5;
background:radial-gradient(700px 520px at 12% 0%,rgba(212,32,39,.38),transparent 62%),radial-gradient(600px 500px at 100% 100%,rgba(139,30,33,.3),transparent 62%),linear-gradient(160deg,#17171E,#0A0A0D)}
body::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:60px 60px;-webkit-mask:radial-gradient(circle at 70% 40%,#000,transparent 75%)}
.frame{position:absolute;inset:28px;border:1px solid rgba(255,255,255,.13);border-radius:24px}
[dir=ltr] .mark{left:auto;right:70px}[dir=ltr] .txt{right:auto;left:80px}[dir=ltr] .foot{right:auto;left:80px}[dir=ltr] h1{font-family:M,T;letter-spacing:-.5px}
.mark{position:absolute;left:70px;top:50%;transform:translateY(-50%);width:300px;filter:drop-shadow(0 20px 60px rgba(212,32,39,.55))}
.txt{position:absolute;right:80px;top:84px;bottom:84px;width:690px;display:flex;flex-direction:column;justify-content:center;gap:22px}
.tag{font:800 20px M,T;letter-spacing:.22em;color:#FF5A60}
h1{font-weight:900;font-size:${p.size}px;line-height:1.22}
.line{font-weight:500;font-size:27px;color:rgba(255,255,255,.72)}
.foot{position:absolute;right:80px;bottom:56px;display:flex;align-items:center;gap:14px;font:800 20px M;color:rgba(255,255,255,.6)}
.foot img{height:24px}
.rule{width:120px;height:4px;border-radius:4px;background:#D42027}
</style></head><body><div class="frame"></div>
<img class="mark" src="/assets/img/logo-mark.png">
<div class="txt"><span class="tag">${p.tag}</span><div class="rule"></div><h1>${p.title}</h1><p class="line">${p.line}</p></div>
<div class="foot"><img src="/assets/img/wordmark-dark.png"><span>· elreda-ads.vercel.app</span></div>
</body></html>`;

(async () => {
  const b = await chromium.launch(exe);
  const ctx = await b.newContext({viewport: {width: 1200, height: 630}, deviceScaleFactor: 1});
  const force = process.argv.includes('--force');
  for (const p of posts) {
    const out = `assets/img/blog/${p.file}`;
    if (!force && fs.existsSync(out)) { console.log('skip', p.file); continue; }
    const pg = await ctx.newPage();
    await pg.route('**/og-render', r => r.fulfill({contentType: 'text/html', body: page(p)}));
    await pg.goto('http://localhost:8899/og-render');
    await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
    await pg.screenshot({path: out, type: 'jpeg', quality: 86});
    console.log('og', p.file);
    await pg.close();
  }
  await b.close();
})();
