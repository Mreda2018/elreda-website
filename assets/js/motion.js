/* ============================================================
   الرضا للدعاية والإعلان — motion.js
   Motion layer on top of main.js: Lenis smooth scroll + GSAP
   (ScrollTrigger, SplitText) + the reel video with sound.
   Effects inspired by React Bits (Magnet, ClickSpark, ShinyText,
   ScrollVelocity) and re-written here in plain JS for this site.
   Loads after the vendor files in assets/js/vendor/.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var rtl = document.documentElement.getAttribute('dir') === 'rtl';
  var lang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';

  /* ---------------- 1. Reel video: autoplay muted, sound after the first tap ----------------
     Browsers block autoplay with sound until the visitor interacts with the page (a tap,
     a click or a key — scrolling does not count). So the video starts muted when it is on
     screen, and the first interaction anywhere on the page turns the sound on.           */
  (function reel() {
    var box = document.querySelector('[data-reel]');
    if (!box) return;
    var v = box.querySelector('video');
    var btn = box.querySelector('.reel__sound');
    var hint = box.querySelector('.reel__hint');
    var playBtn = box.querySelector('.reel__play');
    var visible = false, userMuted = false, unlocked = false;
    var L = lang === 'en'
      ? { on: 'Mute sound', off: 'Turn sound on' }
      : { on: 'كتم الصوت', off: 'تشغيل الصوت' };

    function ui() {
      var on = !v.muted;
      box.classList.toggle('is-sound', on);
      if (btn) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? L.on : L.off); }
    }
    function fadeIn() {
      // iOS ignores volume (always 1); elsewhere ease it in so it does not jump at the visitor
      if (window.gsap && !reduced) { v.volume = 0; window.gsap.to(v, { volume: 1, duration: 1.2, ease: 'power2.out' }); }
    }
    function play() {
      var p = v.play();
      if (p && p.catch) p.catch(function () {
        // sound not allowed yet: fall back to muted playback
        if (!v.muted) { v.muted = true; ui(); v.play().catch(function () {}); }
      });
    }
    function soundOn() {
      v.muted = false; ui(); fadeIn();
      var p = v.play();
      if (p && p.then) p.then(function () { if (!visible) v.pause(); }).catch(function () { v.muted = true; ui(); });
    }
    function firstGesture(e) {
      if (unlocked) return;
      unlocked = true;
      ['pointerdown', 'keydown', 'touchend'].forEach(function (t) { document.removeEventListener(t, firstGesture, true); });
      if (btn && e && btn.contains(e.target)) return;             // the button handles itself
      if (!userMuted) soundOn();
      if (hint) hint.classList.add('hide');
    }

    if (!reduced) {
      ['pointerdown', 'keydown', 'touchend'].forEach(function (t) { document.addEventListener(t, firstGesture, true); });
    }
    if (btn) btn.addEventListener('click', function (e) {
      e.stopPropagation();
      unlocked = true; if (reduced) visible = true;
      if (v.muted) { userMuted = false; soundOn(); }
      else { userMuted = true; v.muted = true; ui(); }
      if (hint) hint.classList.add('hide');
    });
    if (playBtn) playBtn.addEventListener('click', function () { box.classList.add('is-playing'); unlocked = true; visible = true; soundOn(); });
    v.addEventListener('play', function () { box.classList.add('is-playing'); });

    if (reduced) { v.removeAttribute('autoplay'); v.pause(); box.classList.add('is-manual'); ui(); return; }

    // play only while on screen; pause when scrolled away or the tab is hidden
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible && !document.hidden) play(); else v.pause();
      }, { threshold: 0.35 }).observe(box);
    } else { visible = true; play(); }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) v.pause(); else if (visible) play();
    });
    ui();
  })();

  if (!window.gsap || reduced) return;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (ST) gsap.registerPlugin(ST);
  if (window.SplitText) gsap.registerPlugin(window.SplitText);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  /* ---------------- 2. Lenis smooth scroll ---------------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      smoothWheel: true,
      anchors: { offset: -90 },
      prevent: function (node) { return !!(node.closest && node.closest('.chatw, .drawer, .lightbox, .lb, [data-lenis-prevent]')); },
      autoRaf: false
    });
    window.lenis = lenis;
    if (ST) lenis.on('scroll', ST.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    // stop smooth scroll while the drawer / lightbox locks the page
    new MutationObserver(function () {
      if (document.body.classList.contains('is-locked')) lenis.stop(); else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    // back-to-top button: glide with Lenis instead of the native smooth scroll
    var top = document.querySelector('.fab-top');
    if (top) top.addEventListener('click', function (e) { e.stopImmediatePropagation(); lenis.scrollTo(0, { duration: 1.4 }); }, true);
  }

  /* run the intro once the preloader is gone */
  function afterLoad(fn) {
    var done = false, run = function () { if (done) return; done = true; mo.disconnect(); fn(); };
    var mo = new MutationObserver(function () { if (document.body.classList.contains('loaded')) run(); });
    if (document.body.classList.contains('loaded') || !document.getElementById('preloader')) return run();
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setTimeout(run, 3600);
  }
  // GSAP takes an element over from the CSS reveal. Transitions are switched off first: an element
  // with its own `transition` (e.g. .stat) would still be fading from 0 when gsap.from() reads its
  // "end" values, and would stay invisible.
  function takeOver(el) {
    el.style.transition = 'none';
    el.removeAttribute('data-reveal'); el.removeAttribute('data-delay'); el.classList.add('in');
    void el.offsetWidth;
  }
  // elements with a CSS transition on transform would fight GSAP: switch it off for the tween
  function noTr(t) { gsap.set(t, { transition: 'none' }); }
  function backTr(t) { gsap.set(t, { clearProps: 'transition' }); }
  document.documentElement.classList.add('has-motion');

  /* ---------------- 3. Headings: lines rise out of a mask ----------------
     Arabic letters join, so we never split into characters — lines and words only. */
  function splitLines(el) {
    if (!window.SplitText) return [el];
    var s = new window.SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'mline' });
    return s.lines;
  }
  var heroH1 = document.querySelector('.hero h1');
  var heads = document.querySelectorAll('.sec-head .h-lg, .sec-head .h-md, .phero h1, .capsule .h-md, .cta-band h2');
  document.fonts && document.fonts.ready.then(function () {
    heads.forEach(function (h) {
      if (h.closest('.hero')) return;
      takeOver(h);
      var lines = splitLines(h);
      var vars = { yPercent: 110, rotate: rtl ? -3 : 3, duration: 1.1, stagger: 0.12, ease: 'expo.out' };
      if (h.closest('.phero')) { gsap.set(lines, { yPercent: 110 }); afterLoad(function () { gsap.fromTo(lines, { yPercent: 110, rotate: vars.rotate }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', delay: 0.1 }); }); }
      else { vars.scrollTrigger = { trigger: h, start: 'top 88%', once: true }; gsap.from(lines, vars); }
    });
  });

  /* ---------------- 4. Hero intro timeline ---------------- */
  var hero = document.querySelector('.hero');
  if (hero && heroH1) {
    var badge = hero.querySelector('.hero__badge');
    var lead = hero.querySelector('.lead');
    var btns = hero.querySelectorAll('.btn-row .btn');
    var stats = hero.querySelectorAll('.hero__stat');
    var visual = hero.querySelector('.hero__visual');
    var logo = hero.querySelector('.hero__logo');
    var rings = hero.querySelectorAll('.hero__ring');
    [heroH1, lead, hero.querySelector('.btn-row'), hero.querySelector('.hero__stats'), visual].forEach(function (el) { if (el) takeOver(el); });
    // each line of the h1 is an explicit <span>: wrap it in a mask so the gradient text stays intact
    var parts = [];
    Array.prototype.slice.call(heroH1.children).forEach(function (sp) {
      if (sp.tagName === 'BR') { sp.remove(); return; }           // each line becomes its own block
      if (sp.tagName !== 'SPAN') return;
      var m = document.createElement('span'); m.className = 'mline';
      sp.parentNode.insertBefore(m, sp); m.appendChild(sp); sp.style.display = 'inline-block';
      parts.push(sp);
    });
    gsap.set(parts, { yPercent: 115 });
    gsap.set([badge, lead].concat(Array.prototype.slice.call(btns), Array.prototype.slice.call(stats)), { autoAlpha: 0, y: 30 });
    // the logo floats with a CSS animation on transform, so the intro moves a wrapper around it
    var wrap = document.createElement('span'); wrap.className = 'hero__logo-wrap';
    if (logo) { logo.parentNode.insertBefore(wrap, logo); wrap.appendChild(logo); }
    gsap.set(wrap, { autoAlpha: 0, scale: 0.6, rotate: rtl ? 18 : -18 });
    gsap.set(rings, { autoAlpha: 0 });
    afterLoad(function () {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to(badge, { autoAlpha: 1, y: 0, duration: 0.8 })
        .to(parts, { yPercent: 0, duration: 1.2, stagger: 0.14 }, '-=0.5')
        .to(wrap, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.6, ease: 'elastic.out(1,0.6)' }, '-=1.1')
        .to(rings, { autoAlpha: 1, duration: 1.4, stagger: 0.15 }, '<')
        .to(lead, { autoAlpha: 1, y: 0, duration: 0.9 }, '-=1.3')
        .to(btns, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, '-=0.7')
        .to(stats, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, '-=0.6');
    });
    // the hero drifts away as you scroll past it
    if (ST && visual) {
      gsap.to(visual, { yPercent: 18, scale: 0.92, autoAlpha: 0.4, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      var copy = heroH1.parentElement;
      gsap.to(copy, { yPercent: -10, autoAlpha: 0.2, ease: 'none',
        scrollTrigger: { trigger: hero, start: '35% top', end: 'bottom top', scrub: true } });
    }
  }

  if (!ST) return;

  /* ---------------- 5. Eyebrows + cards + steps ---------------- */
  gsap.utils.toArray('.sec-head .eyebrow').forEach(function (el) {
    gsap.from(el, { autoAlpha: 0, letterSpacing: '0.4em', duration: 1.2, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  // service and feature cards: tilt up in a wave
  var cardSel = '.cards-5 > .card, .cards-3 > .card, .cards-4 > .card, .cards-2 > .card';
  var cards = gsap.utils.toArray(cardSel);
  cards.forEach(takeOver);
  if (cards.length) gsap.set(cards, { autoAlpha: 0, y: 70, rotateX: -18, transformPerspective: 900, transformOrigin: '50% 100%' });
  if (cards.length) ST.batch(cards, {
    start: 'top 90%', once: true,
    onEnter: function (b) { noTr(b); gsap.to(b, { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out', clearProps: 'transform,transition' }); }
  });
  // process: the connecting line draws itself, numbers pop in order
  var proc = document.querySelector('.process');
  if (proc) {
    var steps = gsap.utils.toArray(proc.querySelectorAll('.step'));
    steps.forEach(takeOver);
    var line = document.createElement('i'); line.className = 'process__line'; line.setAttribute('aria-hidden', 'true'); proc.appendChild(line);
    var nums = proc.querySelectorAll('.step__n');
    var tl = gsap.timeline({ scrollTrigger: { trigger: proc, start: 'top 78%', once: true },
      onStart: function () { noTr(nums); }, onComplete: function () { backTr(nums); } });
    tl.from(line, { scaleX: 0, duration: 1.4, ease: 'power2.inOut' })
      .from(steps, { autoAlpha: 0, y: 50, duration: 0.9, stagger: 0.18 }, 0.1)
      .from(nums, { scale: 0.4, rotate: rtl ? 25 : -25, duration: 0.9, stagger: 0.18, ease: 'back.out(2)' }, 0.15);
  }
  // stats boxes
  gsap.utils.toArray('.stats .stat').forEach(function (s, i) {
    takeOver(s);
    gsap.fromTo(s, { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, delay: i * 0.08, ease: 'back.out(1.6)', onComplete: function () { gsap.set(s, { clearProps: 'transform,transition' }); },
      scrollTrigger: { trigger: s, start: 'top 92%', once: true } });
  });

  /* ---------------- 6. Portfolio: clip reveal + inner parallax ---------------- */
  gsap.utils.toArray('.work').forEach(function (w, i) {
    takeOver(w);
    var img = w.querySelector('.work__img picture') || w.querySelector('.work__img img');
    gsap.fromTo(w, { clipPath: 'inset(18% 8% 18% 8% round 24px)', autoAlpha: 0, y: 60 },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out', delay: (i % 3) * 0.08,
        onStart: function () { noTr(w); }, clearProps: 'clipPath,transform,transition', scrollTrigger: { trigger: w, start: 'top 92%', once: true } });
    if (img) gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------------- 7. Reel section entrance ---------------- */
  var reelBox = document.querySelector('[data-reel]');
  if (reelBox) {
    var sec = reelBox.closest('section');
    takeOver(reelBox);
    gsap.from(reelBox, { autoAlpha: 0, y: 120, rotate: rtl ? -8 : 8, scale: 0.85, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
    gsap.to(reelBox, { y: -40, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.utils.toArray(sec.querySelectorAll('.reel__point')).forEach(function (p, i) {
      takeOver(p);
      gsap.from(p, { autoAlpha: 0, x: rtl ? 50 : -50, duration: 0.9, delay: 0.15 + i * 0.1, scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
    });
  }

  /* ---------------- 8. Marquee that reacts to scroll speed (ScrollVelocity) ---------------- */
  gsap.utils.toArray('.marquee__track').forEach(function (track) {
    track.style.animation = 'none';
    var half = function () { return track.scrollWidth / 2; };
    var x = 0, dir = rtl ? 1 : -1, base = 55, boost = 0;
    gsap.ticker.add(function (t, dt) {
      var vel = lenis ? lenis.velocity : 0;
      boost += (Math.min(Math.abs(vel) * 9, 900) - boost) * 0.08;
      if (vel) dir = (rtl ? 1 : -1) * (vel > 0 ? 1 : -1);
      x += dir * (base + boost) * (dt / 1000);
      var h = half(); if (h) x = gsap.utils.wrap(rtl ? 0 : -h, rtl ? h : 0, x);
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
    });
  });

  /* ---------------- 9. Magnetic buttons (Magnet) ---------------- */
  if (fine) {
    document.querySelectorAll('.btn, .fab').forEach(function (b) {
      var xTo = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
      var yTo = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.45);
      });
      b.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ---------------- 10. Click sparks (ClickSpark) ---------------- */
  (function sparks() {
    var cv = document.createElement('canvas'); cv.className = 'spark-layer'; cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), list = [], dpr = Math.min(2, window.devicePixelRatio || 1), running = false;
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    size(); addEventListener('resize', size);
    function draw(now) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      list = list.filter(function (s) {
        var p = (now - s.t) / 450; if (p >= 1) return false;
        var e = 1 - Math.pow(1 - p, 3), d = e * 34 * dpr, len = 12 * dpr * (1 - e);
        ctx.strokeStyle = s.c; ctx.lineWidth = 2 * dpr; ctx.globalAlpha = 1 - p;
        ctx.beginPath();
        ctx.moveTo(s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d);
        ctx.lineTo(s.x + Math.cos(s.a) * (d + len), s.y + Math.sin(s.a) * (d + len));
        ctx.stroke(); return true;
      });
      if (list.length) requestAnimationFrame(draw); else { running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
    }
    document.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('.btn, .fab, .chip, .filter, .card, .reel__sound')) return;
      var now = performance.now();
      for (var i = 0; i < 9; i++) list.push({ x: e.clientX * dpr, y: e.clientY * dpr, a: (i / 9) * Math.PI * 2, t: now, c: i % 2 ? '#ffffff' : '#FF4950' });
      if (!running) { running = true; requestAnimationFrame(draw); }
    });
  })();

  /* ---------------- 11. Footer + CTA ---------------- */
  gsap.utils.toArray('.cta-band').forEach(function (cta) {
    takeOver(cta);
    gsap.from(cta, { scale: 0.9, autoAlpha: 0, y: 60, duration: 1.3, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: cta, start: 'top 88%', once: true } });
  });

  // recalc after images and the split text settle
  window.addEventListener('load', function () { ST.refresh(); });
})();
