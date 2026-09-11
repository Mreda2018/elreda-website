/* ============================================================
   الرضا للدعاية والإعلان — main.js
   ============================================================ */
(function () {
  'use strict';

  var WA_NUMBER = '201050020785';
  var STORE_KEY = 'elreda-lang';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 1. Language ----------------
     Each language has its own static HTML (Arabic at /, English at /en/),
     so search engines and AI crawlers read real text without running JS.
     The button in the header is a normal link between the two versions.
     Here we only read the current language for the runtime strings.      */
  var lang = (document.documentElement.getAttribute('lang') === 'en') ? 'en' : 'ar';
  var dict = (window.I18N && window.I18N[lang]) || {};
  function t(key) { return (key in dict) ? dict[key] : key; }

  /* remember the visitor's choice, but never auto-redirect (bad for SEO) */
  try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}

  /* ---------------- 2. Preloader ---------------- */
  var pre = document.getElementById('preloader');
  if (pre) {
    var bar = pre.querySelector('.pre-bar span');
    var p = 0;
    var tick = setInterval(function () {
      p = Math.min(100, p + Math.random() * 18 + 6);
      if (bar) bar.style.width = p + '%';
      if (p >= 100) clearInterval(tick);
    }, 130);
    var hide = function () {
      if (bar) bar.style.width = '100%';
      setTimeout(function () {
        pre.classList.add('done');
        document.body.classList.remove('is-locked');
        document.body.classList.add('loaded');
      }, 350);
    };
    window.addEventListener('load', hide);
    setTimeout(hide, 3200); // safety
  }

  /* ---------------- 3. Header + nav ---------------- */
  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var drawer = document.querySelector('.drawer');
  var progress = document.getElementById('progress');
  var fabTop = document.querySelector('.fab-top');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (fabTop) fabTop.classList.toggle('show', y > 500);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    document.body.classList.remove('is-locked');
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDrawer(); closeLightbox(); }
  });

  /* active nav link */
  (function () {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a, .drawer a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0];
      if (href && href === path) a.classList.add('active');
    });
  })();

  /* smooth anchor scroll with header offset */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeDrawer();
    var off = (header ? header.offsetHeight : 70) + 14;
    var top = target.getBoundingClientRect().top + window.scrollY - off;
    window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
  });

  var topBtn = document.querySelector('.fab-top');
  if (topBtn) topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------------- 4. Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('in'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* stagger children automatically */
  document.querySelectorAll('[data-stagger]').forEach(function (parent) {
    var step = parseInt(parent.getAttribute('data-stagger') || '90', 10);
    Array.prototype.forEach.call(parent.children, function (child, i) {
      if (child.hasAttribute('data-reveal') && !child.hasAttribute('data-delay')) {
        child.setAttribute('data-delay', i * step);
      }
    });
  });

  /* ---------------- 5. Counters ---------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600, start = null;
    if (reduced) { el.textContent = target + suffix; return; }
    function step(ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      var val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------------- 6. Card spotlight ---------------- */
  if (!reduced && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------------- 7. Custom cursor ---------------- */
  if (!reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var ring = document.createElement('div'); ring.className = 'cursor';
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    document.body.appendChild(ring); document.body.appendChild(dot);
    var mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a,button,.work,.card,input,textarea,select')) ring.classList.add('grow');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a,button,.work,.card,input,textarea,select')) ring.classList.remove('grow');
    });
  }

  /* ---------------- 8. Accordion ---------------- */
  document.querySelectorAll('.acc').forEach(function (acc) {
    acc.addEventListener('click', function (e) {
      var q = e.target.closest('.acc__q');
      if (!q) return;
      var item = q.closest('.acc__item');
      var body = item.querySelector('.acc__a');
      var isOpen = item.classList.contains('open');
      acc.querySelectorAll('.acc__item').forEach(function (it) {
        it.classList.remove('open');
        var b = it.querySelector('.acc__a'); if (b) b.style.maxHeight = null;
        var bq = it.querySelector('.acc__q'); if (bq) bq.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.acc__item.open .acc__a').forEach(function (b) {
      b.style.maxHeight = b.scrollHeight + 'px';
    });
  });

  /* ---------------- 9. Portfolio filters ---------------- */
  var filterBar = document.querySelector('.filters');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button'); if (!btn) return;
      filterBar.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      document.querySelectorAll('.work').forEach(function (w) {
        var cat = w.getAttribute('data-cat') || '';
        var show = (f === 'all' || cat === f);
        w.classList.toggle('hide', !show);
        if (show) { w.classList.remove('in'); void w.offsetWidth; w.classList.add('in'); }
      });
    });
  }

  /* ---------------- 10. Lightbox ---------------- */
  var lb = document.getElementById('lightbox');
  var lbImg = lb ? lb.querySelector('img') : null;
  var gallery = [], gIndex = 0;

  function buildGallery() {
    gallery = Array.prototype.slice.call(document.querySelectorAll('.work:not(.hide)'));
  }
  /* use WebP for the full-size view when the browser supports it */
  var supportsWebp = (function () {
    try {
      var c = document.createElement('canvas');
      return c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) { return false; }
  })();

  function openLightbox(i) {
    if (!lb || !gallery.length) return;
    gIndex = (i + gallery.length) % gallery.length;
    var el = gallery[gIndex];
    var src = (supportsWebp && el.getAttribute('data-full-webp')) || el.getAttribute('data-full');
    if (src && lbImg) lbImg.src = src;
    lb.classList.add('open');
    document.body.classList.add('is-locked');
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('open');
    document.body.classList.remove('is-locked');
  }
  document.addEventListener('click', function (e) {
    var w = e.target.closest('.work');
    if (w) { buildGallery(); openLightbox(gallery.indexOf(w)); return; }
    if (e.target.closest('.lb-close')) return closeLightbox();
    if (e.target.closest('.lb-next')) return openLightbox(gIndex + 1);
    if (e.target.closest('.lb-prev')) return openLightbox(gIndex - 1);
    if (lb && e.target === lb) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowRight') openLightbox(gIndex + 1);
    if (e.key === 'ArrowLeft') openLightbox(gIndex - 1);
  });

  /* ---------------- 11. Contact form → WhatsApp ---------------- */
  var form = document.getElementById('order-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var fields = [
        { id: 'f-name', err: 'ct.err.name', test: function (v) { return v.trim().length >= 2; } },
        { id: 'f-phone', err: 'ct.err.phone', test: function (v) { return /^[+\d][\d\s\-()]{7,}$/.test(v.trim()); } },
        { id: 'f-service', err: 'ct.err.service', test: function (v) { return !!v; } },
        { id: 'f-msg', err: 'ct.err.msg', test: function (v) { return v.trim().length >= 5; } }
      ];
      var vals = {};
      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (!el) return;
        var wrap = el.closest('.field');
        var good = f.test(el.value);
        vals[f.id] = el.value;
        if (wrap) {
          wrap.classList.toggle('invalid', !good);
          el.setAttribute('aria-invalid', good ? 'false' : 'true');
        }
        if (!good && ok) { el.focus(); ok = false; }
        else if (!good) ok = false;
      });
      if (!ok) return;

      var emailEl = document.getElementById('f-email');
      var svcEl = document.getElementById('f-service');
      var svcTxt = svcEl ? svcEl.options[svcEl.selectedIndex].textContent.trim() : '';

      var L = (lang === 'ar');
      var lines = [
        L ? '*طلب خدمة جديد من موقع الرضا*' : '*New service request from Elreda website*',
        '',
        (L ? '👤 الاسم: ' : '👤 Name: ') + vals['f-name'],
        (L ? '📞 الهاتف: ' : '📞 Phone: ') + vals['f-phone']
      ];
      if (emailEl && emailEl.value.trim()) lines.push((L ? '✉️ البريد: ' : '✉️ Email: ') + emailEl.value.trim());
      lines.push((L ? '🧩 الخدمة: ' : '🧩 Service: ') + svcTxt);
      lines.push('');
      lines.push((L ? '📝 التفاصيل:' : '📝 Details:'));
      lines.push(vals['f-msg']);

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var old = btn.innerHTML;
        btn.innerHTML = L ? '✅ تم فتح واتساب' : '✅ WhatsApp opened';
        setTimeout(function () { btn.innerHTML = old; }, 2600);
      }
      form.reset();
    });
    form.addEventListener('input', function (e) {
      var w = e.target.closest('.field'); if (w) w.classList.remove('invalid');
    });
  }

  /* arriving from a service card or a package button: preselect it,
     and for a package, open the message with a line naming it */
  (function () {
    var wanted = new URLSearchParams(location.search).get('service');
    var sel = document.getElementById('f-service');
    if (!wanted || !sel) return;

    var picked = null;
    Array.prototype.forEach.call(sel.options, function (o) {
      if (o.value === wanted) { sel.value = wanted; picked = o; }
    });
    if (!picked) return;

    var msg = document.getElementById('f-msg');
    var packName = picked.getAttribute('data-pack');
    if (msg && packName && !msg.value.trim()) {
      var tpl = msg.getAttribute('data-pack-template') || '';
      if (tpl) msg.value = tpl.replace('{pack}', packName);
    }

    /* bring the form into view so it is obvious the choice carried over */
    if (!reduced) {
      requestAnimationFrame(function () {
        var form = document.getElementById('order-form');
        if (!form) return;
        var off = (header ? header.offsetHeight : 70) + 20;
        window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
      });
    }
  })();

  /* ---------------- 12. Hero particle canvas ---------------- */
  var canvas = document.querySelector('.hero__canvas');
  if (canvas && !reduced) {
    var ctx = canvas.getContext('2d');
    var pts = [], W = 0, H = 0, raf;
    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width * (window.devicePixelRatio > 1 ? 1.5 : 1);
      H = canvas.height = r.height * (window.devicePixelRatio > 1 ? 1.5 : 1);
      canvas.style.width = r.width + 'px'; canvas.style.height = r.height + 'px';
      var count = Math.min(70, Math.round((r.width * r.height) / 16000));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.7 + 0.6
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,32,39,.55)';
        ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 20000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(212,32,39,' + (0.16 * (1 - d2 / 20000)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(raf);
      else { cancelAnimationFrame(raf); draw(); }
    });
  }

  /* ---------------- 13. Parallax on hero visual ---------------- */
  if (!reduced) {
    var pxEls = document.querySelectorAll('[data-parallax]');
    if (pxEls.length) {
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        pxEls.forEach(function (el) {
          var s = parseFloat(el.getAttribute('data-parallax')) || 0.1;
          el.style.transform = 'translate3d(0,' + (y * s) + 'px,0)';
        });
      }, { passive: true });
    }
  }

  /* ---------------- 14. Year ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();
