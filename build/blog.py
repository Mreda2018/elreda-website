#!/usr/bin/env python3
"""
Builds the Arabic blog: blog.html + blog-<slug>.html at the site root.

Usage (from the repo root):   python3 build/blog.py
Content lives in build/posts/<slug>.html (body only). Metadata is in POSTS below.
The header/footer/scripts are copied from about.html so the blog always matches
the rest of the site. Re-run after editing any post, then refresh the ?v= hash
of style.css on every page if build/blog.css changed (the script does both).

Why the blog pages sit at the root and not in /blog/: every relative link in the
shared header, footer and chatbot answers ("services.html", "assets/...") keeps
working without rewriting.
"""
import re, json, hashlib, glob, html, os, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://elreda-ads.vercel.app'
ORG_ID = SITE + '/#organization'
WA = 'https://wa.me/201050020785'

POSTS = [
    dict(slug='uae-e-invoicing',
         title='الفوترة الإلكترونية في الإمارات: المواعيد والمتطلبات وكيف تستعد',
         seo='الفوترة الإلكترونية في الإمارات 2027: المواعيد ومزوّد الخدمة وPINT AE | الرضا',
         desc='دليل الفوترة الإلكترونية الإلزامية في الإمارات: مواعيد التطبيق لكل فئة، ومزوّد الخدمة المعتمد ASP، ونموذج الأركان الخمسة ومعيار PINT AE، وخطوات الاستعداد، والفرق بينها وبين المنظومة المصرية.',
         cat='الأنظمة المحاسبية والضريبية', service='services.html#accounting',
         cta_h='جهّز شركتك للفوترة الإلكترونية في الإمارات',
         cta_p='نركّب لك نظام «فكترة» بمعيار PINT AE، وننظّف بياناتك، ونساعدك تربطه بمزوّد الخدمة المعتمد، وندرّب فريقك قبل موعدك.',
         keywords='الفوترة الإلكترونية الإمارات, e-invoicing UAE, PINT AE, مزود خدمة معتمد ASP, الهيئة الاتحادية للضرائب, وزارة المالية, 5-Corner, فكترة',
         published='2026-10-30', modified='2026-10-30', og_line='المواعيد · مزوّد الخدمة · PINT AE', og_tag='E-INVOICING · UAE', og_title='الفوترة الإلكترونية في الإمارات',
         rel=['e-invoice-egypt','software-solutions','online-store-egypt']),
    dict(slug='online-store-egypt',
         title='إنشاء متجر إلكتروني في مصر: المنصة وطرق الدفع والشحن خطوة بخطوة',
         seo='إنشاء متجر إلكتروني في مصر: المنصة وبوابات الدفع والشحن | الرضا',
         desc='كيف تبني متجرًا إلكترونيًا يبيع فعلًا في مصر: الاختيار بين Shopify وWooCommerce والمتجر المبرمج، وطرق الدفع (الكروت وميزة وفوري والمحافظ والدفع عند الاستلام)، والشحن والمرتجعات، وقائمة تجهيز قبل الإطلاق.',
         cat='المواقع والمتاجر الإلكترونية', service='services.html#web',
         cta_h='عاوز متجر إلكتروني يبيع من أول يوم؟',
         cta_p='نبني متجرك بتصميم سريع على الموبايل، ونربطه ببوابات الدفع والشحن، ونجهّز صفحات المنتجات لمحركات البحث، ونربطه بنظامك المحاسبي لو احتجت.',
         keywords='متجر إلكتروني, إنشاء متجر إلكتروني مصر, بوابات الدفع مصر, Paymob, فوري, ميزة, الدفع عند الاستلام, Shopify, WooCommerce, تصميم متجر إلكتروني',
         published='2026-10-30', modified='2026-10-30', og_line='المنصة · الدفع · الشحن', og_tag='E-COMMERCE · EGYPT', og_title='إنشاء متجر إلكتروني في مصر',
         rel=['software-solutions','e-invoice-egypt','logo-mistakes']),
    dict(slug='software-solutions',
         title='حلول برمجية للشركات: متى تحتاج أتمتة أو نظامًا مخصّصًا، وأين يفيد الذكاء الاصطناعي؟',
         seo='حلول برمجية وأتمتة وذكاء اصطناعي للشركات: متى تحتاجها وكيف تبدأ | الرضا',
         desc='علامات تقول إن شركتك تحتاج حلًا برمجيًا، والفرق بين البرنامج الجاهز والأتمتة والنظام المخصّص، وأمثلة على مهام تُؤتمت، وأين يفيد الذكاء الاصطناعي فعلًا، وكيف تبدأ مشروعًا بدون أن يخرج عن السيطرة.',
         cat='حلول برمجية وذكاء اصطناعي', service='services.html#ai',
         cta_h='مش عارف تبدأ منين؟',
         cta_p='جلسة مجانية نفهم فيها طريقة شغلك ونحدد إيه اللي يستاهل يتأتمت، وبعدها عرض مكتوب بالنطاق والمدة والتكلفة.',
         keywords='حلول برمجية للشركات, أتمتة الأعمال, ذكاء اصطناعي للشركات, شات بوت واتساب, نظام مخصص, ربط الأنظمة API, برمجة أنظمة مصر',
         published='2026-10-30', modified='2026-10-30', og_line='أتمتة · أنظمة مخصّصة · AI', og_tag='SOFTWARE · AI', og_title='حلول برمجية للشركات',
         rel=['online-store-egypt','uae-e-invoicing','e-invoice-egypt']),
    dict(slug='e-invoice-egypt',
         title='ربط الفاتورة الإلكترونية في مصر: الخطوات والمتطلبات خطوة بخطوة',
         seo='ربط الفاتورة الإلكترونية في مصر 2026: الخطوات والمتطلبات | الرضا',
         desc='دليل عملي لربط الفاتورة الإلكترونية بمنظومة مصلحة الضرائب المصرية: من الملزم، والأوراق المطلوبة، والتوقيع الإلكتروني، وتكويد الأصناف EGS وGS1، والربط بنظام محاسبي، وأشهر أسباب رفض الفواتير.',
         cat='الأنظمة المحاسبية والضريبية', service='services.html#accounting',
         cta_h='تحتاج مساعدة في ربط الفاتورة الإلكترونية؟',
         cta_p='نجهّز لك التسجيل وتكويد الأصناف، ونربط فواتيرك بالمنظومة من خلال نظام محاسبي متكامل، ونتابع معك حتى أول فاتورة صالحة.',
         keywords='الفاتورة الإلكترونية, ربط الفاتورة الإلكترونية, منظومة الفاتورة الإلكترونية, مصلحة الضرائب المصرية, التوقيع الإلكتروني, أكواد EGS, GS1, الإيصال الإلكتروني',
         published='2026-10-30', modified='2026-10-30', og_line='دليل عملي خطوة بخطوة', og_tag='E-INVOICE · EGYPT', og_title='ربط الفاتورة الإلكترونية في مصر',
         rel=['uae-e-invoicing','software-solutions','online-store-egypt']),
    dict(slug='logo-mistakes',
         title='5 أخطاء شائعة في تصميم الشعار تُضعف علامتك التجارية (وكيف تتجنبها)',
         seo='5 أخطاء في تصميم الشعار تُضعف علامتك وكيف تتجنبها | الرضا',
         desc='أكثر 5 أخطاء تُضعف الشعار: التفاصيل الزائدة والألوان الكثيرة والخط صعب القراءة والنسخة الواحدة وملف JPG فقط، مع اختبارات بسيطة وقائمة تدقيق قبل اعتماد شعارك والملفات التي يجب أن تستلمها.',
         cat='التصميم والهوية البصرية', service='services.html#design',
         cta_h='عاوز شعار وهوية معمولة صح من أول مرة؟',
         cta_p='نصمم شعارك بكل نسخه (أساسية ومعكوسة وأحادية اللون) وبملفات Vector جاهزة للطباعة والسوشيال والموقع، مع دليل استخدام بسيط.',
         keywords='تصميم شعار, تصميم لوجو, أخطاء تصميم الشعار, هوية بصرية, ملفات الشعار, Vector, تصميم لوجو كفر الشيخ',
         published='2026-10-30', modified='2026-10-30', og_line='وقائمة تدقيق قبل الاعتماد', og_tag='LOGO DESIGN', og_title='5 أخطاء في تصميم الشعار تُضعف علامتك',
         rel=['print-file-checklist','online-store-egypt','software-solutions']),
    dict(slug='print-file-checklist',
         title='قبل إرسال ملفك للمطبعة: قائمة تدقيق من 6 نقاط لطباعة بدون مفاجآت',
         seo='تجهيز ملف للطباعة: 6 نقاط قبل الإرسال للمطبعة (CMYK وBleed) | الرضا',
         desc='كيف تجهّز ملف التصميم للطباعة: نظام ألوان CMYK، ودقة 300 DPI، وزيادة القص 3 مم، وهامش الأمان، وتضمين الخطوط، والبروفة، مع جدول المقاسات الشائعة وأوزان الورق والتشطيبات.',
         cat='الطباعة', service='services.html#print',
         cta_h='مش فاضي تراجع كل ده؟',
         cta_p='ابعتلنا ملفك، نراجعه ونجهّزه للطباعة ونطبعه لك بالورق والتشطيب المناسب، مع بروفة قبل الكمية.',
         keywords='تجهيز ملف للطباعة, CMYK, Bleed, 300 DPI, مقاس الكارت الشخصي, أوزان الورق, سلفنة, Spot UV, مطبعة كفر الشيخ',
         published='2026-10-30', modified='2026-10-30', og_line='6 نقاط: CMYK · 300 DPI · Bleed', og_tag='PRINT CHECKLIST', og_title='قبل إرسال ملفك للمطبعة',
         rel=['logo-mistakes','online-store-egypt','e-invoice-egypt']),
]

MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
def ar_date(iso):
    d = datetime.date.fromisoformat(iso); return f'{d.day} {MONTHS[d.month-1]} {d.year}'

def read(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def write(p, s): open(os.path.join(ROOT, p), 'w', encoding='utf-8').write(s)
def text_of(h): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()

BLOG_LINK = '<a href="blog.html">المدونة</a>'

def add_blog_link(block):
    """Insert the blog link before the contact link inside a nav/drawer/footer block (idempotent)."""
    if 'href="blog.html"' in block: return block
    return re.sub(r'(\s*)(<a href="contact\.html"(?: aria-current="page")?>تواصل معنا</a>)', r'\1' + BLOG_LINK + r'\1\2', block, count=1)

def patch_site_nav():
    """Add the blog to the nav, drawer and footer of every Arabic page, and a footer link on English pages."""
    for p in ['index.html','about.html','services.html','portfolio.html','contact.html']:
        s = read(p); o = s
        s = re.sub(r'<nav class="nav".*?</nav>', lambda m: add_blog_link(m.group(0)), s, count=1, flags=re.S)
        s = re.sub(r'<div class="drawer".*?</div>', lambda m: add_blog_link(m.group(0)), s, count=1, flags=re.S)
        s = re.sub(r'(<h2 class="ft-h">روابط سريعة</h2>\s*<div class="footer__links">)(.*?)(</div>)', lambda m: m.group(1)+add_blog_link(m.group(2))+m.group(3), s, count=1, flags=re.S)
        if s != o: write(p, s)
    for p in glob.glob(os.path.join(ROOT, 'en', '*.html')):
        rel = os.path.relpath(p, ROOT)
        if rel.endswith('404.html'): continue
        s = read(rel)
        if '../blog.html' in s: continue
        s2 = re.sub(r'(<div class="footer__links">)(.*?)(<a href="contact\.html">)', r'\1\2<a href="../blog.html" hreflang="ar" lang="ar">المدونة (Arabic blog)</a>\n        \3', s, count=1, flags=re.S)
        if s2 != s: write(rel, s2)

def template():
    s = read('about.html')
    head_end = s.index('</head>')
    css_link = re.search(r'<link rel="stylesheet" href="assets/css/style\.css\?v=[0-9a-f]+">', s).group(0)
    body_start = s.index('<a class="skip-link"')
    top = s[body_start:s.index('<main id="main">')]
    top = top.replace(' aria-current="page"', '')
    top = top.replace('<a class="lang-btn" href="en/about.html" hreflang="en" lang="en" rel="alternate">', '<a class="lang-btn" href="en/index.html" hreflang="en" lang="en">')
    cta = re.search(r'<section class="section section--tight" aria-labelledby="cta-h">.*?</section>', s, re.S).group(0)
    foot = s[s.index('</main>'):s.index('<script type="application/ld+json">')]
    scripts = s[s.index('</script>', s.index('<script type="application/ld+json">')) + len('</script>'):]
    return css_link, top, cta, foot, scripts

def nav_current(top, href):
    return top.replace(f'<a href="{href}">', f'<a href="{href}" aria-current="page">', 1)

def head(title, desc, url, keywords, og_img, og_type, css_link, extra=''):
    e = html.escape
    return f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#08080A">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="keywords" content="{e(keywords)}">
<meta name="author" content="الرضا للدعاية والإعلان">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="ar" href="{url}">
<link rel="alternate" type="application/rss+xml" title="مدونة الرضا للدعاية والإعلان" href="{SITE}/blog.xml">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="الرضا للدعاية والإعلان">
<meta property="og:locale" content="ar_EG">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og_img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
{extra}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)}">
<meta name="twitter:description" content="{e(desc)}">
<meta name="twitter:image" content="{og_img}">
<link rel="icon" href="assets/img/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="assets/img/logo-dark.png">
{css_link}
</head>
'''

ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'
ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
ICON_TAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>'
ARROW = '<svg class="ico-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'

def card(p, tag='h3'):
    return f'''<a class="post-card" href="blog-{p['slug']}.html">
  <img src="assets/img/blog/{p['slug']}.jpg" alt="{html.escape(p['title'])}" width="1200" height="630" loading="lazy" decoding="async">
  <div class="post-card__body">
    <span class="post-card__cat">{p['cat']}</span>
    <{tag}>{p['title']}</{tag}>
    <p>{p['desc']}</p>
    <span class="post-card__meta">{ar_date(p['published'])} · {p['mins']} دقائق قراءة</span>
  </div>
</a>'''

def build():
    patch_site_nav()
    # css
    css_p = 'assets/css/style.css'; css = read(css_p); block = read('build/blog.css')
    if '/* ---------- Blog ---------- */' in css:
        css = css[:css.index('\n/* ---------- Blog ---------- */')]
    css = css.rstrip('\n') + '\n' + block
    write(css_p, css)
    h = hashlib.md5(css.encode()).hexdigest()[:8]
    for f in glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'en', '*.html')):
        s = open(f, encoding='utf-8').read(); u = re.sub(r'style\.css\?v=[0-9a-f]+', 'style.css?v=' + h, s)
        if u != s: open(f, 'w', encoding='utf-8').write(u)

    css_link, top, cta, foot, scripts = template()
    org = {"@type": "Organization", "@id": ORG_ID, "name": "الرضا للدعاية والإعلان", "alternateName": "Elreda Advertising",
           "url": SITE + '/', "logo": SITE + '/assets/img/logo-mark.png', "telephone": "+201050020785",
           "sameAs": ["https://www.instagram.com/elreda.ads/"]}

    for p in POSTS:
        body = read(f"build/posts/{p['slug']}.html")
        words = len(text_of(body).split()); p['words'] = words; p['mins'] = max(3, round(words / 180))
    for p in POSTS:
        body = read(f"build/posts/{p['slug']}.html")
        url = f"{SITE}/blog-{p['slug']}.html"; img = f"{SITE}/assets/img/blog/{p['slug']}.jpg"
        toc = ''.join(f'<li><a href="#{i}">{text_of(t)}</a></li>' for i, t in re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body))
        faqs = [(text_of(q), text_of(a)) for q, a in re.findall(r'<summary>(.*?)</summary>\s*<p>(.*?)</p>', body, re.S)]
        by = {q['slug']: q for q in POSTS}
        related = ''.join(card(by[r]) for r in p.get('rel', []) if r in by)
        graph = [org,
            {"@type": "BlogPosting", "@id": url + '#article', "headline": p['title'], "description": p['desc'],
             "image": {"@type": "ImageObject", "url": img, "width": 1200, "height": 630},
             "datePublished": p['published'], "dateModified": p['modified'], "inLanguage": "ar-EG",
             "author": {"@id": ORG_ID}, "publisher": {"@id": ORG_ID},
             "mainEntityOfPage": {"@type": "WebPage", "@id": url}, "isPartOf": {"@id": SITE + '/blog.html#blog'},
             "articleSection": p['cat'], "keywords": p['keywords'], "wordCount": p['words']},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": SITE + '/'},
                {"@type": "ListItem", "position": 2, "name": "المدونة", "item": SITE + '/blog.html'},
                {"@type": "ListItem", "position": 3, "name": p['title'], "item": url}]}]
        if faqs:
            graph.append({"@type": "FAQPage", "@id": url + '#faq', "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]})
        ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)
        extra = (f'<meta property="article:published_time" content="{p["published"]}">\n'
                 f'<meta property="article:modified_time" content="{p["modified"]}">\n'
                 f'<meta property="article:section" content="{html.escape(p["cat"])}">\n')
        page = head(p['seo'], p['desc'], url, p['keywords'], img, 'article', css_link, extra)
        page += f'<body data-page="blog" class="is-locked">\n\n' + nav_current(top, 'blog.html') + f'''<main id="main">

<section class="phero">
  <div class="container">
    <p class="eyebrow eyebrow--center">{p['cat']}</p>
    <h1 class="h-lg" data-reveal="up" style="max-width:24ch;margin-inline:auto">{p['title']}</h1>
    <p class="lead center" style="margin-inline:auto" data-reveal="up" data-delay="120">{p['desc']}</p>
    <div class="post-meta" data-reveal="fade" data-delay="160">
      <span>{ICON_CAL}<time datetime="{p['modified']}">آخر تحديث: {ar_date(p['modified'])}</time></span>
      <span>{ICON_CLOCK}{p['mins']} دقائق قراءة</span>
      <span>{ICON_TAG}فريق الرضا للدعاية والإعلان</span>
    </div>
    <nav class="crumbs" aria-label="breadcrumb" data-reveal="fade" data-delay="200">
      <a href="index.html">الرئيسية</a><i></i><a href="blog.html">المدونة</a><i></i><span>{p['cat']}</span>
    </nav>
  </div>
</section>

<section class="section section--tight">
  <div class="container post-wrap">
    <article class="prose">
      <figure><img src="assets/img/blog/{p['slug']}.jpg" alt="{html.escape(p['title'])}" width="1200" height="630" decoding="async" fetchpriority="high"></figure>
{body}
      <div class="post-cta">
        <h2>{p['cta_h']}</h2>
        <p>{p['cta_p']}</p>
        <div class="btn-row">
          <a class="btn btn--light" href="{WA}" target="_blank" rel="noopener">كلّمنا على واتساب</a>
          <a class="btn btn--ghost" style="border-color:rgba(255,255,255,.5)" href="{p['service']}">تفاصيل الخدمة{ARROW}</a>
        </div>
      </div>
      <div class="related">
        <h2>مقالات أخرى قد تفيدك</h2>
        <div class="related-grid">{related}</div>
      </div>
    </article>
    <aside class="toc" aria-label="محتويات المقال">
      <h2>محتويات المقال</h2>
      <ol>{toc}</ol>
    </aside>
  </div>
</section>

{cta}

''' + foot + f'<script type="application/ld+json">\n{ld}\n</script>' + scripts
        write(f"blog-{p['slug']}.html", page)

    # index
    url = SITE + '/blog.html'
    desc = 'مدونة الرضا للدعاية والإعلان: أدلة عملية لأصحاب المشاريع في مصر عن الفاتورة الإلكترونية، وتصميم الشعار والهوية البصرية، وتجهيز ملفات الطباعة، والمواقع والذكاء الاصطناعي للأعمال.'
    graph = [org, {"@type": "Blog", "@id": url + '#blog', "name": "مدونة الرضا للدعاية والإعلان", "url": url, "description": desc,
                   "inLanguage": "ar-EG", "publisher": {"@id": ORG_ID},
                   "blogPost": [{"@type": "BlogPosting", "headline": p['title'], "url": f"{SITE}/blog-{p['slug']}.html",
                                 "datePublished": p['published'], "image": f"{SITE}/assets/img/blog/{p['slug']}.jpg"} for p in POSTS]},
             {"@type": "BreadcrumbList", "itemListElement": [
                 {"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": SITE + '/'},
                 {"@type": "ListItem", "position": 2, "name": "المدونة", "item": url}]}]
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)
    page = head('المدونة — أدلة عملية لأصحاب المشاريع | الرضا للدعاية والإعلان', desc, url,
                'مدونة, الفاتورة الإلكترونية, تصميم شعار, تجهيز ملف للطباعة, تصميم مواقع, ذكاء اصطناعي للأعمال, كفر الشيخ',
                f"{SITE}/assets/img/blog/{POSTS[0]['slug']}.jpg", 'website', css_link)
    page += '<body data-page="blog" class="is-locked">\n\n' + nav_current(top, 'blog.html') + f'''<main id="main">

<section class="phero">
  <div class="container">
    <p class="eyebrow eyebrow--center">المدونة</p>
    <h1 class="h-lg" data-reveal="up">أدلة عملية لأصحاب المشاريع</h1>
    <p class="lead center" style="margin-inline:auto" data-reveal="up" data-delay="120">خبرتنا في التصميم والطباعة والمواقع والأنظمة المحاسبية، مكتوبة بخطوات واضحة تقدر تطبّقها بنفسك.</p>
    <nav class="crumbs" aria-label="breadcrumb" data-reveal="fade" data-delay="200">
      <a href="index.html">الرئيسية</a><i></i><span>المدونة</span>
    </nav>
  </div>
</section>

<section class="section section--tight" aria-label="المقالات">
  <div class="container">
    <div class="post-grid">{''.join(card(p, 'h2') for p in POSTS)}</div>
  </div>
</section>

{cta}

''' + foot + f'<script type="application/ld+json">\n{ld}\n</script>' + scripts
    write('blog.html', page)

    # RSS
    items = ''.join(f'''  <item>
    <title>{html.escape(p['title'])}</title>
    <link>{SITE}/blog-{p['slug']}.html</link>
    <guid isPermaLink="true">{SITE}/blog-{p['slug']}.html</guid>
    <pubDate>{datetime.date.fromisoformat(p['published']).strftime('%a, %d %b %Y')} 09:00:00 +0200</pubDate>
    <category>{html.escape(p['cat'])}</category>
    <description>{html.escape(p['desc'])}</description>
  </item>
''' for p in POSTS)
    write('blog.xml', f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>مدونة الرضا للدعاية والإعلان</title>
  <link>{SITE}/blog.html</link>
  <description>{html.escape(desc)}</description>
  <language>ar-eg</language>
{items}</channel>
</rss>
''')

    # sitemap
    sm = read('sitemap.xml')
    sm = re.sub(r'\s*<url>\s*<loc>[^<]*/blog[^<]*</loc>.*?</url>', '', sm, flags=re.S)
    add = ''.join(f'''  <url>
    <loc>{u}</loc>
    <lastmod>{m}</lastmod>
    <changefreq>{c}</changefreq>
    <priority>{pr}</priority>
  </url>
''' for u, m, c, pr in [(url, max(p['modified'] for p in POSTS), 'weekly', '0.8')] +
        [(f"{SITE}/blog-{p['slug']}.html", p['modified'], 'monthly', '0.7') for p in POSTS])
    sm = sm.replace('</urlset>', add + '</urlset>')
    write('sitemap.xml', sm)

    # llms.txt
    ll = read('llms.txt')
    if '## المدونة / Blog' in ll:
        ll = ll[:ll.index('## المدونة / Blog')].rstrip() + '\n'
    ll += '\n## المدونة / Blog\n\nأدلة عملية بالعربية لأصحاب المشاريع في مصر / Practical Arabic guides for businesses in Egypt:\n\n'
    ll += ''.join(f"- [{p['title']}]({SITE}/blog-{p['slug']}.html): {p['desc']}\n" for p in POSTS)
    write('llms.txt', ll)
    write('build/og-data.json', json.dumps([dict(slug=p['slug'], title=p['og_title'], line=p['og_line'], tag=p['og_tag'], size=64 if len(p['og_title']) < 28 else 56) for p in POSTS], ensure_ascii=False, indent=1))
    print('built', len(POSTS), 'posts; css', h)

if __name__ == '__main__':
    build()
