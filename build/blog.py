#!/usr/bin/env python3
"""
Builds the blog in Arabic (site root) and English (en/): blog.html + blog-<slug>.html,
linked to each other with hreflang.

Usage (from the repo root):   python3 build/blog.py
Content lives in build/posts/<slug>.html (Arabic) and build/posts/en/<slug>.html (English),
body only. Arabic metadata is in POSTS below, English metadata in build/blog_lib.py (EN).
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

import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blog_lib import EN, EN_MONTHS

MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']

def read(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def write(p, s): open(os.path.join(ROOT, p), 'w', encoding='utf-8').write(s)
def text_of(h): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()

# Per-language settings. 'out' is the folder the pages are written to; 'pfx' the path prefix back to the root.
LANGS = {
    'ar': dict(out='', pfx='', tmpl='about.html', posts='build/posts', html='<html lang="ar" dir="rtl">', locale='ar_EG',
               blog_name='مدونة الرضا للدعاية والإعلان', site_name='الرضا للدعاية والإعلان', author='الرضا للدعاية والإعلان',
               nav_blog='المدونة', contact='تواصل معنا', quick='روابط سريعة', home='الرئيسية', inlang='ar-EG', wpm=180,
               updated='آخر تحديث', read='دقائق قراءة', team='فريق الرضا للدعاية والإعلان', toc='محتويات المقال',
               related='مقالات أخرى قد تفيدك', wa='كلّمنا على واتساب', svc='تفاصيل الخدمة', crumb='breadcrumb',
               idx_title='المدونة — أدلة عملية لأصحاب المشاريع | الرضا للدعاية والإعلان',
               idx_desc='مدونة الرضا للدعاية والإعلان: أدلة عملية لأصحاب المشاريع في مصر والإمارات عن الفاتورة الإلكترونية، وتصميم الشعار والهوية البصرية، وتجهيز ملفات الطباعة، والمتاجر الإلكترونية، والحلول البرمجية والذكاء الاصطناعي.',
               idx_kw='مدونة, الفاتورة الإلكترونية, الفوترة الإلكترونية الإمارات, تصميم شعار, تجهيز ملف للطباعة, متجر إلكتروني, حلول برمجية, ذكاء اصطناعي للأعمال',
               idx_eyebrow='المدونة', idx_h1='أدلة عملية لأصحاب المشاريع',
               idx_lead='خبرتنا في التصميم والطباعة والمواقع والأنظمة المحاسبية والحلول البرمجية، مكتوبة بخطوات واضحة تقدر تطبّقها بنفسك.',
               posts_label='المقالات', toc_label='محتويات المقال'),
    'en': dict(out='en/', pfx='../', tmpl='en/about.html', posts='build/posts/en', html='<html lang="en" dir="ltr">', locale='en_US',
               blog_name='Elreda Advertising Blog', site_name='Elreda Advertising', author='Elreda Advertising',
               nav_blog='Blog', contact='Contact', quick='Quick Links', home='Home', inlang='en', wpm=220,
               updated='Last updated', read='min read', team='The Elreda Advertising team', toc='In this article',
               related='More guides you may find useful', wa='Chat with us on WhatsApp', svc='Service details', crumb='breadcrumb',
               idx_title='Blog — Practical Guides for Business Owners | Elreda Advertising',
               idx_desc='The Elreda Advertising blog: practical guides for businesses in Egypt and the UAE on e-invoicing, logo and visual identity design, print-ready files, online stores, and software and AI solutions.',
               idx_kw='blog, Egypt e-invoice, UAE e-invoicing, logo design, print-ready file, online store Egypt, business software, AI for business',
               idx_eyebrow='Blog', idx_h1='Practical guides for business owners',
               idx_lead='Our experience in design, print, websites, accounting systems and software, written as clear steps you can apply yourself.',
               posts_label='Articles', toc_label='In this article'),
}

def fmt_date(iso, lang):
    d = datetime.date.fromisoformat(iso)
    return f'{d.day} {(MONTHS if lang == "ar" else EN_MONTHS)[d.month-1]} {d.year}'

def meta(p, lang):
    """The post's fields in the given language."""
    if lang == 'ar': return p
    m = dict(p); m.update(EN[p['slug']]); return m

def url_of(slug, lang):
    return f"{SITE}/{LANGS[lang]['out']}blog{'-' + slug if slug else ''}.html"

def img_of(slug, lang):
    return f"assets/img/blog/{'en-' if lang == 'en' else ''}{slug}.jpg"

def add_link(block, href, label, contact):
    """Insert a blog link before the Contact link of a nav/drawer/footer block (idempotent)."""
    if f'href="{href}"' in block: return block
    return re.sub(r'(\s*)(<a href="contact\.html"(?: aria-current="page")?>' + re.escape(contact) + '</a>)',
                  r'\1<a href="' + href + '">' + label + r'</a>\1\2', block, count=1)

def patch_site_nav():
    """Every page gets a blog link in its own language: nav, drawer and footer quick links."""
    for lang, L in LANGS.items():
        files = [L['out'] + f for f in ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']]
        for p in files:
            s = read(p); o = s
            s = s.replace('\n        <a href="../blog.html" hreflang="ar" lang="ar">المدونة (Arabic blog)</a>', '')
            s = re.sub(r'<nav class="nav".*?</nav>', lambda m: add_link(m.group(0), 'blog.html', L['nav_blog'], L['contact']), s, count=1, flags=re.S)
            s = re.sub(r'<div class="drawer".*?</div>', lambda m: add_link(m.group(0), 'blog.html', L['nav_blog'], L['contact']), s, count=1, flags=re.S)
            s = re.sub(r'(<h2 class="ft-h">' + re.escape(L['quick']) + r'</h2>\s*<div class="footer__links">)(.*?)(</div>)',
                       lambda m: m.group(1) + add_link(m.group(2), 'blog.html', L['nav_blog'], L['contact']) + m.group(3), s, count=1, flags=re.S)
            if s != o: write(p, s)

def template(lang):
    L = LANGS[lang]; s = read(L['tmpl'])
    css_link = re.search(r'<link rel="stylesheet" href="(?:\.\./)?assets/css/style\.css\?v=[0-9a-f]+">', s).group(0)
    top = s[s.index('<a class="skip-link"'):s.index('<main id="main">')].replace(' aria-current="page"', '')
    top = re.sub(r'<a class="lang-btn" href="[^"]*"', '<a class="lang-btn" href="__ALT__"', top, count=1)
    cta = re.search(r'<section class="section section--tight" aria-labelledby="cta-h">.*?</section>', s, re.S).group(0)
    foot = s[s.index('</main>'):s.index('<script type="application/ld+json">')]
    scripts = s[s.index('</script>', s.index('<script type="application/ld+json">')) + len('</script>'):]
    return css_link, top, cta, foot, scripts

def nav_current(top, href):
    return top.replace(f'<a href="{href}">', f'<a href="{href}" aria-current="page">', 1)

def head(lang, title, desc, url, alt_url, keywords, og_img, og_type, css_link, extra=''):
    L = LANGS[lang]; e = html.escape; P = L['pfx']
    ar_url, en_url = (url, alt_url) if lang == 'ar' else (alt_url, url)
    rss = f"{SITE}/{L['out']}blog.xml"
    return f'''<!DOCTYPE html>
{L['html']}
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#08080A">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="keywords" content="{e(keywords)}">
<meta name="author" content="{e(L['author'])}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="ar" href="{ar_url}">
<link rel="alternate" hreflang="en" href="{en_url}">
<link rel="alternate" hreflang="x-default" href="{ar_url}">
<link rel="alternate" type="application/rss+xml" title="{e(L['blog_name'])}" href="{rss}">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="{e(L['site_name'])}">
<meta property="og:locale" content="{L['locale']}">
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
<link rel="icon" href="{P}assets/img/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="{P}assets/img/favicon.png">
<link rel="apple-touch-icon" href="{P}assets/img/apple-touch-icon.png">
<link rel="manifest" href="{P}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="{P}assets/img/logo-dark.png">
{css_link}
</head>
'''

ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'
ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
ICON_TAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>'
ARROW = '<svg class="ico-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'

def card(p, lang, tag='h3'):
    m = meta(p, lang); L = LANGS[lang]
    return f'''<a class="post-card" href="blog-{p['slug']}.html">
  <img src="{L['pfx']}{img_of(p['slug'], lang)}" alt="{html.escape(m['title'])}" width="1200" height="630" loading="lazy" decoding="async">
  <div class="post-card__body">
    <span class="post-card__cat">{m['cat']}</span>
    <{tag}>{m['title']}</{tag}>
    <p>{m['desc']}</p>
    <span class="post-card__meta">{fmt_date(p['published'], lang)} · {p['mins'][lang]} {L['read']}</span>
  </div>
</a>'''

def org_node(lang):
    return {"@type": "Organization", "@id": ORG_ID, "name": "الرضا للدعاية والإعلان", "alternateName": "Elreda Advertising",
            "url": SITE + '/', "logo": SITE + '/assets/img/logo-mark.png', "telephone": "+201050020785",
            "sameAs": ["https://www.instagram.com/elreda.ads/"]}

def build_lang(lang):
    L = LANGS[lang]; P = L['pfx']; O = L['out']
    css_link, top, cta, foot, scripts = template(lang)
    by = {q['slug']: q for q in POSTS}
    for p in POSTS:
        m = meta(p, lang); body = read(f"{L['posts']}/{p['slug']}.html")
        url = url_of(p['slug'], lang); alt = url_of(p['slug'], 'en' if lang == 'ar' else 'ar')
        img = f"{SITE}/{img_of(p['slug'], lang)}"
        toc = ''.join(f'<li><a href="#{i}">{text_of(t)}</a></li>' for i, t in re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body))
        faqs = [(text_of(q), text_of(a)) for q, a in re.findall(r'<summary>(.*?)</summary>\s*<p>(.*?)</p>', body, re.S)]
        related = ''.join(card(by[r], lang) for r in p.get('rel', []) if r in by)
        home = SITE + '/' + O
        graph = [org_node(lang),
            {"@type": "BlogPosting", "@id": url + '#article', "headline": m['title'], "description": m['desc'],
             "image": {"@type": "ImageObject", "url": img, "width": 1200, "height": 630},
             "datePublished": p['published'], "dateModified": p['modified'], "inLanguage": L['inlang'],
             "author": {"@id": ORG_ID}, "publisher": {"@id": ORG_ID},
             "mainEntityOfPage": {"@type": "WebPage", "@id": url}, "isPartOf": {"@id": url_of('', lang) + '#blog'},
             "articleSection": m['cat'], "keywords": m['keywords'], "wordCount": p['words'][lang],
             "translationOfWork" if lang == 'en' else "workTranslation": {"@id": alt + '#article'}},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": L['home'], "item": home},
                {"@type": "ListItem", "position": 2, "name": L['nav_blog'], "item": url_of('', lang)},
                {"@type": "ListItem", "position": 3, "name": m['title'], "item": url}]}]
        if faqs:
            graph.append({"@type": "FAQPage", "@id": url + '#faq', "inLanguage": L['inlang'], "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]})
        ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)
        extra = (f'<meta property="article:published_time" content="{p["published"]}">\n'
                 f'<meta property="article:modified_time" content="{p["modified"]}">\n'
                 f'<meta property="article:section" content="{html.escape(m["cat"])}">\n')
        alt_rel = ('../' if lang == 'en' else 'en/') + f"blog-{p['slug']}.html"
        t = nav_current(top, 'blog.html').replace('__ALT__', alt_rel)
        page = head(lang, m['seo'], m['desc'], url, alt, m['keywords'], img, 'article', css_link, extra)
        page += f'<body data-page="blog" class="is-locked">\n\n' + t + f'''<main id="main">

<section class="phero">
  <div class="container">
    <p class="eyebrow eyebrow--center">{m['cat']}</p>
    <h1 class="h-lg" data-reveal="up" style="max-width:24ch;margin-inline:auto">{m['title']}</h1>
    <p class="lead center" style="margin-inline:auto" data-reveal="up" data-delay="120">{m['desc']}</p>
    <div class="post-meta" data-reveal="fade" data-delay="160">
      <span>{ICON_CAL}<time datetime="{p['modified']}">{L['updated']}: {fmt_date(p['modified'], lang)}</time></span>
      <span>{ICON_CLOCK}{p['mins'][lang]} {L['read']}</span>
      <span>{ICON_TAG}{L['team']}</span>
    </div>
    <nav class="crumbs" aria-label="{L['crumb']}" data-reveal="fade" data-delay="200">
      <a href="index.html">{L['home']}</a><i></i><a href="blog.html">{L['nav_blog']}</a><i></i><span>{m['cat']}</span>
    </nav>
  </div>
</section>

<section class="section section--tight">
  <div class="container post-wrap">
    <article class="prose">
      <figure><img src="{P}{img_of(p['slug'], lang)}" alt="{html.escape(m['title'])}" width="1200" height="630" decoding="async" fetchpriority="high"></figure>
{body}
      <div class="post-cta">
        <h2>{m['cta_h']}</h2>
        <p>{m['cta_p']}</p>
        <div class="btn-row">
          <a class="btn btn--light" href="{WA}" target="_blank" rel="noopener">{L['wa']}</a>
          <a class="btn btn--ghost" style="border-color:rgba(255,255,255,.5)" href="{p['service']}">{L['svc']}{ARROW}</a>
        </div>
      </div>
      <div class="related">
        <h2>{L['related']}</h2>
        <div class="related-grid">{related}</div>
      </div>
    </article>
    <aside class="toc" aria-label="{L['toc_label']}">
      <h2>{L['toc']}</h2>
      <ol>{toc}</ol>
    </aside>
  </div>
</section>

{cta}

''' + foot + f'<script type="application/ld+json">\n{ld}\n</script>' + scripts
        write(f"{O}blog-{p['slug']}.html", page)

    # index
    url = url_of('', lang); alt = url_of('', 'en' if lang == 'ar' else 'ar')
    graph = [org_node(lang), {"@type": "Blog", "@id": url + '#blog', "name": L['blog_name'], "url": url, "description": L['idx_desc'],
                   "inLanguage": L['inlang'], "publisher": {"@id": ORG_ID},
                   "blogPost": [{"@type": "BlogPosting", "headline": meta(p, lang)['title'], "url": url_of(p['slug'], lang),
                                 "datePublished": p['published'], "image": f"{SITE}/{img_of(p['slug'], lang)}"} for p in POSTS]},
             {"@type": "BreadcrumbList", "itemListElement": [
                 {"@type": "ListItem", "position": 1, "name": L['home'], "item": SITE + '/' + O},
                 {"@type": "ListItem", "position": 2, "name": L['nav_blog'], "item": url}]}]
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)
    t = nav_current(top, 'blog.html').replace('__ALT__', ('../' if lang == 'en' else 'en/') + 'blog.html')
    page = head(lang, L['idx_title'], L['idx_desc'], url, alt, L['idx_kw'], f"{SITE}/{img_of(POSTS[0]['slug'], lang)}", 'website', css_link)
    page += '<body data-page="blog" class="is-locked">\n\n' + t + f'''<main id="main">

<section class="phero">
  <div class="container">
    <p class="eyebrow eyebrow--center">{L['idx_eyebrow']}</p>
    <h1 class="h-lg" data-reveal="up">{L['idx_h1']}</h1>
    <p class="lead center" style="margin-inline:auto" data-reveal="up" data-delay="120">{L['idx_lead']}</p>
    <nav class="crumbs" aria-label="{L['crumb']}" data-reveal="fade" data-delay="200">
      <a href="index.html">{L['home']}</a><i></i><span>{L['nav_blog']}</span>
    </nav>
  </div>
</section>

<section class="section section--tight" aria-label="{L['posts_label']}">
  <div class="container">
    <div class="post-grid">{''.join(card(p, lang, 'h2') for p in POSTS)}</div>
  </div>
</section>

{cta}

''' + foot + f'<script type="application/ld+json">\n{ld}\n</script>' + scripts
    write(f"{O}blog.html", page)

    # RSS
    items = ''.join(f'''  <item>
    <title>{html.escape(meta(p, lang)['title'])}</title>
    <link>{url_of(p['slug'], lang)}</link>
    <guid isPermaLink="true">{url_of(p['slug'], lang)}</guid>
    <pubDate>{datetime.date.fromisoformat(p['published']).strftime('%a, %d %b %Y')} 09:00:00 +0200</pubDate>
    <category>{html.escape(meta(p, lang)['cat'])}</category>
    <description>{html.escape(meta(p, lang)['desc'])}</description>
  </item>
''' for p in POSTS)
    write(f"{O}blog.xml", f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>{html.escape(L['blog_name'])}</title>
  <link>{url}</link>
  <description>{html.escape(L['idx_desc'])}</description>
  <language>{'ar-eg' if lang == 'ar' else 'en'}</language>
{items}</channel>
</rss>
''')

def build():
    patch_site_nav()
    css_p = 'assets/css/style.css'; css = read(css_p); block = read('build/blog.css')
    if '/* ---------- Blog ---------- */' in css:
        css = css[:css.index('\n/* ---------- Blog ---------- */')]
    css = css.rstrip('\n') + '\n' + block
    write(css_p, css)
    h = hashlib.md5(css.encode()).hexdigest()[:8]
    for f in glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'en', '*.html')):
        s = open(f, encoding='utf-8').read(); u = re.sub(r'style\.css\?v=[0-9a-f]+', 'style.css?v=' + h, s)
        if u != s: open(f, 'w', encoding='utf-8').write(u)

    for p in POSTS:
        p['words'] = {}; p['mins'] = {}
        for lang, L in LANGS.items():
            w = len(text_of(read(f"{L['posts']}/{p['slug']}.html")).split())
            p['words'][lang] = w; p['mins'][lang] = max(3, round(w / L['wpm']))
    for lang in LANGS: build_lang(lang)

    # sitemap: one entry per language, each listing both versions
    sm = read('sitemap.xml')
    sm = re.sub(r'\s*<url>\s*<loc>[^<]*/blog[^<]*</loc>.*?</url>', '', sm, flags=re.S)
    def entry(slug, lang, lastmod, freq, prio):
        ar, en = url_of(slug, 'ar'), url_of(slug, 'en')
        return f'''  <url>
    <loc>{url_of(slug, lang)}</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="{ar}"/>
    <xhtml:link rel="alternate" hreflang="en" href="{en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="{ar}"/>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{prio}</priority>
  </url>
'''
    last = max(p['modified'] for p in POSTS)
    add = ''.join(entry('', l, last, 'weekly', '0.8') for l in LANGS)
    add += ''.join(entry(p['slug'], l, p['modified'], 'monthly', '0.7') for p in POSTS for l in LANGS)
    sm = sm.replace('</urlset>', add + '</urlset>')
    write('sitemap.xml', sm)

    # llms.txt
    ll = read('llms.txt')
    if '## المدونة / Blog' in ll:
        ll = ll[:ll.index('## المدونة / Blog')].rstrip() + '\n'
    ll += '\n## المدونة / Blog\n\nأدلة عملية لأصحاب المشاريع في مصر والإمارات، بالعربية والإنجليزية / Practical guides for businesses in Egypt and the UAE, in Arabic and English:\n\n'
    ll += ''.join(f"- [{p['title']}]({url_of(p['slug'], 'ar')}) · [English: {EN[p['slug']]['title']}]({url_of(p['slug'], 'en')}): {EN[p['slug']]['desc']}\n" for p in POSTS)
    write('llms.txt', ll)

    og = []
    for p in POSTS:
        og.append(dict(file=f"{p['slug']}.jpg", dir='rtl', title=p['og_title'], line=p['og_line'], tag=p['og_tag'],
                       size=64 if len(p['og_title']) < 28 else 56))
        e = EN[p['slug']]
        og.append(dict(file=f"en-{p['slug']}.jpg", dir='ltr', title=e['og_title'], line=e['og_line'], tag=p['og_tag'],
                       size=60 if len(e['og_title']) < 30 else 52))
    write('build/og-data.json', json.dumps(og, ensure_ascii=False, indent=1))
    print('built', len(POSTS), 'posts x', len(LANGS), 'languages; css', h)

if __name__ == '__main__':
    build()
