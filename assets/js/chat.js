/* ============================================================
   مساعد الرضا — المحرّك والواجهة
   Elreda Assistant — retrieval engine + UI
   يعمل بالكامل داخل متصفح الزائر. لا API ولا سيرفر ولا أي طلب خارجي.
   Runs entirely in the visitor's browser. No API, no server, no outbound request.
   ============================================================ */
(function () {
  'use strict';

  var KB = window.ELREDA_KB;
  if (!KB) return;

  var AR = KB.lang === 'ar';

  /* ---------- 1. تطبيع النص ---------- */
  var TASHKEEL = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
  var PUNCT = /[^ء-يa-z0-9\s]/g;

  function normalize(s) {
    if (!s) return '';
    s = String(s).toLowerCase();
    // الأرقام العربية والهندية → لاتينية
    s = s.replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 0x0660; })
         .replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 0x06F0; });
    s = s.replace(TASHKEEL, '');
    s = s.replace(/[أإآٱ]/g, 'ا')   // أ إ آ → ا
         .replace(/ى/g, 'ي')                        // ى → ي
         .replace(/ة/g, 'ه')                        // ة → ه
         .replace(/[ؤئ]/g, 'ء');               // ؤ ئ → ء
    s = s.replace(PUNCT, ' ').replace(/\s+/g, ' ').trim();
    return s;
  }

  var STOP = {};
  (AR ? ['في', 'من', 'الي', 'على', 'عن', 'مع', 'هو', 'هي', 'انا', 'انت', 'ده', 'دي',
         'ايه', 'ولا', 'او', 'يا', 'ان', 'كان', 'لو', 'بس', 'كده', 'عشان', 'عندي',
         'عندكم', 'هل', 'ممكن', 'لي', 'لك', 'ال', 'يعني', 'بتاع', 'حاجه', 'واحد',
         'ازاي', 'ازي', 'اللي', 'الي', 'عاوز', 'عايز', 'حابب', 'اعرف', 'قولي',
         'كام', 'مين', 'امتي', 'فين', 'ليه', 'ازاى', 'دلوقتي', 'برضو', 'كمان']
      : ['the', 'a', 'an', 'is', 'are', 'do', 'does', 'of', 'to', 'for', 'in', 'on',
         'and', 'or', 'i', 'you', 'we', 'it', 'my', 'your', 'me', 'can', 'could',
         'would', 'what', 'how', 'about', 'with', 'have', 'has', 'be', 'that', 'this',
         'there', 'any', 'get', 'need', 'want', 'like', 'know', 'tell', 'give', 'make',
         'your', 'our', 'their', 'some', 'much', 'many', 'please', 'should', 'will']
  ).forEach(function (w) { STOP[w] = 1; });

  /* جذّاع خفيف: بيرجّع كل الصيغ المحتملة للكلمة (الأصل + المجرّدة) */
  var AR_PRE = ['وال', 'بال', 'كال', 'فال', 'ال', 'لل', 'و', 'ب', 'ل', 'ف', 'ك'];
  var AR_SUF = ['اتها', 'اتهم', 'يتها', 'ات', 'ين', 'ون', 'ان', 'ها', 'هم', 'كم', 'نا', 'يه', 'ه', 'ي', 'ا'];

  function variants(t) {
    var out = [t];
    if (AR) {
      for (var i = 0; i < AR_PRE.length; i++) {
        var p = AR_PRE[i];
        if (t.length > p.length + 2 && t.indexOf(p) === 0) { out.push(t.slice(p.length)); break; }
      }
      var extra = [];
      for (var a = 0; a < out.length; a++) {
        var w = out[a];
        for (var j = 0; j < AR_SUF.length; j++) {
          var sfx = AR_SUF[j];
          if (w.length > sfx.length + 2 && w.slice(-sfx.length) === sfx) { extra.push(w.slice(0, -sfx.length)); break; }
        }
      }
      out = out.concat(extra);
    } else {
      var w2 = t;
      if (w2.length > 4 && /ies$/.test(w2)) out.push(w2.slice(0, -3) + 'y');
      else if (w2.length > 4 && /(ses|ches|shes|xes)$/.test(w2)) out.push(w2.slice(0, -2));
      else if (w2.length > 3 && /s$/.test(w2) && !/ss$/.test(w2)) out.push(w2.slice(0, -1));
      if (w2.length > 5 && /ing$/.test(w2)) out.push(w2.slice(0, -3));
      if (w2.length > 4 && /ed$/.test(w2)) out.push(w2.slice(0, -2));
      if (w2.length > 4 && /ly$/.test(w2)) out.push(w2.slice(0, -2));
    }
    return out;
  }

  /* groups(): كل كلمة أصلية تُرجع مجموعة صيغها — تُحسب مرة واحدة عند التسجيل */
  function groups(s) {
    var raw = normalize(s).split(' ');
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var t0 = raw[i];
      if (!t0 || t0.length < 2 || STOP[t0]) continue;
      var g = [], seen = {};
      var forms = variants(t0);
      for (var f = 0; f < forms.length; f++) {
        var t = forms[f];
        if (!t || t.length < 2 || STOP[t]) continue;
        var syn = KB.syn[t];
        var list = syn ? [t, syn] : [t];
        for (var j = 0; j < list.length; j++) {
          var v = list[j];
          if (!seen[v]) { seen[v] = 1; g.push(v); }
        }
      }
      if (g.length) out.push(g);
    }
    return out;
  }

  function tokens(s) {
    var out = [], seen = {};
    groups(s).forEach(function (g) {
      g.forEach(function (t) { if (!seen[t]) { seen[t] = 1; out.push(t); } });
    });
    return out;
  }

  /* ---------- 2. الفهرس و IDF ---------- */
  var docs = KB.entries.map(function (e) {
    var set = {};
    tokens(e.k).forEach(function (t) { set[t] = 1; });
    // أول 3 كلمات في مفاتيح المدخل = موضوعه الرئيسي، وزنها أعلى
    var head = normalize(e.k).split(' ').slice(0, 3).join(' ');
    tokens(head).forEach(function (t) { set[t] = 2.5; });
    return { e: e, set: set, norm: normalize(e.k) };
  });

  var df = {};
  docs.forEach(function (d) {
    for (var t in d.set) df[t] = (df[t] || 0) + 1;
  });
  var N = docs.length;
  function idf(t) {
    var n = df[t] || 0;
    if (!n) return 0;
    return Math.log(1 + N / n);
  }

  function search(q) {
    var qg = groups(q);
    if (!qg.length) return [];
    // وزن كل كلمة = أعلى idf بين صيغها
    var gIdf = qg.map(function (g) {
      var m = 0;
      g.forEach(function (t) { var v = idf(t); if (v > m) m = v; });
      return m || 0.4;
    });
    var total = 0;
    gIdf.forEach(function (v) { total += v; });
    if (total <= 0) return [];

    var qn = normalize(q);
    var qw = qn.split(' ').filter(function (w) { return w.length > 1; });
    var bigrams = [];
    for (var b = 0; b + 1 < qw.length; b++) bigrams.push(qw[b] + ' ' + qw[b + 1]);

    var scored = [];
    for (var i = 0; i < docs.length; i++) {
      var d = docs[i], s = 0, hits = 0;
      for (var j = 0; j < qg.length; j++) {
        var g = qg[j], best = 0;
        for (var t = 0; t < g.length; t++) {
          var w = d.set[g[t]];
          if (w) { var v = idf(g[t]) * w; if (v > best) best = v; }
        }
        if (best > 0) { s += best; hits++; }
      }
      if (!hits) continue;
      var coverage = hits / qg.length;
      var sc = (s / total) * (0.55 + 0.45 * coverage);
      // مكافأة المطابقة النصية: السؤال كامل أو أزواج كلماته موجودة حرفيًا
      // السؤال كامل مكتوب حرفيًا في مفاتيح المدخل = إشارة نية شبه مؤكدة
      if (qn.length > 6 && d.norm.indexOf(qn) > -1) sc += (qw.length >= 3 ? 1.2 : 0.5);
      for (var g = 0; g < bigrams.length; g++) {
        if (d.norm.indexOf(bigrams[g]) > -1) sc += 0.14;
      }
      scored.push({ e: d.e, score: sc, hits: hits, cov: coverage });
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored;
  }

  function findSmallTalk(q) {
    var n = normalize(q);
    if (n.split(' ').length > 5) return null;
    for (var i = 0; i < KB.smallTalk.length; i++) {
      var st = KB.smallTalk[i];
      for (var j = 0; j < st.k.length; j++) {
        var k = normalize(st.k[j]);
        if (n === k || n.indexOf(k) === 0 || (k.length > 3 && n.indexOf(k) > -1)) return st;
      }
    }
    return null;
  }

  function hasTrigger(q, list) {
    var n = normalize(q);
    for (var i = 0; i < list.length; i++) {
      if (n.indexOf(normalize(list[i])) > -1) return true;
    }
    return false;
  }

  /* ---------- 3. بناء الواجهة ---------- */
  var I = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-3.8-.7L3 21l1.9-4.6A8.3 8.3 0 0 1 3.6 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8.4 8.4z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    wa: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8c1.9 1 4 1.6 6.2 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3zm7.6 18.4c-.3.9-1.6 1.6-2.5 1.8-.7.1-1.5.2-4.3-.9-3.6-1.5-6-5.2-6.1-5.4-.2-.2-1.5-2-1.5-3.8s.9-2.7 1.3-3.1c.3-.3.7-.5 1-.5h.7c.2 0 .5 0 .8.6l1.1 2.6c.1.2.2.5 0 .8l-.4.6-.4.5c-.1.2-.3.4-.1.7.2.3.8 1.4 1.8 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.5-.2.8-.1l2.4 1.2c.3.2.6.3.7.4.1.3.1.9-.2 1.7z"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4"/><path d="M3 4v5h5"/></svg>'
  };

  var root = document.createElement('div');
  root.className = 'chatw';
  root.setAttribute('data-open', 'false');
  root.innerHTML =
    '<button class="chatw__launch" type="button" aria-expanded="false" aria-controls="chatw-panel" aria-label="' + esc(KB.ui.launch) + '">' +
      '<span class="chatw__launch-ico">' + I.chat + '</span>' +
      '<span class="chatw__dot" aria-hidden="true"></span>' +
    '</button>' +
    '<section class="chatw__panel" id="chatw-panel" role="dialog" aria-label="' + esc(KB.ui.title) + '" hidden>' +
      '<header class="chatw__head">' +
        '<span class="chatw__avatar" aria-hidden="true">' + I.chat + '</span>' +
        '<span class="chatw__id"><b>' + esc(KB.ui.title) + '</b><i>' + esc(KB.ui.status) + '</i></span>' +
        '<button class="chatw__icon" type="button" data-act="reset" aria-label="' + esc(KB.ui.reset) + '" title="' + esc(KB.ui.reset) + '">' + I.reset + '</button>' +
        '<button class="chatw__icon" type="button" data-act="close" aria-label="' + esc(KB.ui.close) + '">' + I.close + '</button>' +
      '</header>' +
      '<div class="chatw__log" id="chatw-log" role="log" aria-live="polite" tabindex="0"></div>' +
      '<div class="chatw__chips" id="chatw-chips"></div>' +
      '<form class="chatw__form" novalidate>' +
        '<input class="chatw__in" type="text" autocomplete="off" placeholder="' + esc(KB.ui.placeholder) + '" aria-label="' + esc(KB.ui.placeholder) + '">' +
        '<button class="chatw__send" type="submit" aria-label="' + esc(KB.ui.send) + '">' + I.send + '</button>' +
      '</form>' +
      '<p class="chatw__note">' + esc(KB.ui.disclaimer) + '</p>' +
    '</section>';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(root);
    wire();
  });

  /* ---------- 4. التشغيل ---------- */
  var log, chipsEl, form, input, launch, panel;
  var state = null;           // التدفّق النشط
  var busy = false;

  function wire() {
    log = root.querySelector('#chatw-log');
    chipsEl = root.querySelector('#chatw-chips');
    form = root.querySelector('.chatw__form');
    input = root.querySelector('.chatw__in');
    launch = root.querySelector('.chatw__launch');
    panel = root.querySelector('.chatw__panel');

    launch.addEventListener('click', toggle);
    root.querySelector('[data-act="close"]').addEventListener('click', function () { setOpen(false); });
    root.querySelector('[data-act="reset"]').addEventListener('click', reset);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v || busy) return;
      input.value = '';
      say(v);
      handle(v);
    });

    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-chip]');
      if (!b || busy) return;
      var label = b.getAttribute('data-chip');
      say(label);
      handle(label);
    });

    log.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-chip]');
      if (b && !busy) {
        var label = b.getAttribute('data-chip');
        say(label);
        handle(label);
        return;
      }
      var w = e.target.closest('[data-wa]');
      if (w) { openWa(w.getAttribute('data-wa')); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.getAttribute('data-open') === 'true') setOpen(false);
    });

    reset();
  }

  function toggle() { setOpen(root.getAttribute('data-open') !== 'true'); }

  function setOpen(on) {
    root.setAttribute('data-open', on ? 'true' : 'false');
    document.documentElement.classList.toggle('chat-open', !!on);
    launch.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) {
      panel.hidden = false;
      setTimeout(function () { if (window.innerWidth > 640) input.focus(); }, 260);
    } else {
      setTimeout(function () {
        if (root.getAttribute('data-open') !== 'true') panel.hidden = true;
      }, 280);
      launch.focus();
    }
  }

  function reset() {
    state = null;
    log.innerHTML = '';
    bot(KB.greeting);
    setChips(KB.openChips);
  }

  /* ---------- 5. الرسائل ---------- */
  function bubble(cls, html) {
    var d = document.createElement('div');
    d.className = 'chatw__msg chatw__msg--' + cls;
    d.innerHTML = '<div class="chatw__b">' + html + '</div>';
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function say(text) { bubble('me', esc(text)); }

  function bot(html, extra) {
    var d = bubble('bot', html + (extra || ''));
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function typing(cb, ms) {
    busy = true;
    var d = bubble('bot chatw__msg--typing', '<span class="chatw__typing"><i></i><i></i><i></i></span>');
    setTimeout(function () {
      d.remove();
      busy = false;
      cb();
    }, ms || (320 + Math.random() * 260));
  }

  function setChips(list) {
    chipsEl.innerHTML = '';
    if (!list || !list.length) { chipsEl.hidden = true; return; }
    chipsEl.hidden = false;
    list.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chatw__chip';
      b.setAttribute('data-chip', c);
      b.textContent = c;
      chipsEl.appendChild(b);
    });
  }

  function ctaHtml(cta) {
    if (!cta) return '';
    if (cta.type === 'wa') {
      return '<button class="chatw__cta" type="button" data-wa="">' + I.wa + esc(cta.label) + '</button>';
    }
    if (cta.type === 'link') {
      return '<a class="chatw__cta" href="' + esc(cta.href) + '"' +
        (/^https?:/.test(cta.href) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(cta.label) + '</a>';
    }
    if (cta.type === 'pack') {
      return '<a class="chatw__cta" href="' + (AR ? '' : '') + 'contact.html?service=' + esc(cta.pack) + '">' + esc(cta.label) + '</a>';
    }
    return '';
  }

  function openWa(msg) {
    var url = 'https://wa.me/' + KB.wa + (msg ? '?text=' + encodeURIComponent(msg) : '');
    window.open(url, '_blank', 'noopener');
  }

  /* ---------- 6. التوجيه ---------- */
  function handle(q) {
    if (state) { return flowStep(q); }

    if (hasTrigger(q, KB.estimate.trigger)) return startEstimate();
    if (hasTrigger(q, KB.recommend.trigger)) return startRecommend();
    if (hasTrigger(q, KB.lead.trigger)) return startLead();

    var st = findSmallTalk(q);
    if (st) {
      return typing(function () { bot(st.a); setChips(KB.openChips); });
    }

    var res = search(q);
    var best = res[0];

    // دليل واحد ضعيف داخل سؤال طويل يعني السؤال بره نطاق المعرفة
    var thin = best && best.hits < 2 && best.cov < 0.5;
    if (!best || best.score < 0.2 || thin) {
      return typing(function () {
        bot(KB.fallback, ctaHtml({ type: 'wa', label: KB.waLabel }));
        setChips(KB.fallbackChips);
      });
    }

    typing(function () {
      bot(best.e.a, ctaHtml(best.e.cta));
      var chips = (best.e.chips || []).slice();
      // اقتراحات قريبة لو في تقارب في النتائج
      if (res[1] && res[1].score > best.score * 0.72 && chips.length < 4) {
        var alt = res[1].e.chips && res[1].e.chips[0];
        if (alt && chips.indexOf(alt) === -1) chips.push(alt);
      }
      setChips(chips.length ? chips : KB.openChips);
    });
  }

  /* ---------- 7. التدفّقات ---------- */
  function cancelChip() { return [KB.cancelLabel]; }

  function isCancel(q) {
    var n = normalize(q);
    return n === normalize(KB.cancelLabel) ||
      (AR ? (n.indexOf('الغاء') > -1 || n.indexOf('لغي') > -1) : n.indexOf('cancel') > -1);
  }

  function flowStep(q) {
    if (isCancel(q)) {
      state = null;
      return typing(function () { bot(KB.cancel); setChips(KB.openChips); });
    }
    if (state.kind === 'estimate') return estimateStep(q);
    if (state.kind === 'recommend') return recommendStep(q);
    if (state.kind === 'lead') return leadStep(q);
  }

  function pick(list, q) {
    var n = normalize(q);
    for (var i = 0; i < list.length; i++) {
      if (normalize(list[i].label) === n) return list[i];
    }
    for (var j = 0; j < list.length; j++) {
      var ln = normalize(list[j].label);
      if (ln && (n.indexOf(ln) > -1 || ln.indexOf(n) > -1)) return list[j];
    }
    return null;
  }

  function fmt(n) { return Math.round(n / 50) * 50; }
  function money(n) { return String(fmt(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* --- تقدير السعر --- */
  function startEstimate() {
    state = { kind: 'estimate', step: 1 };
    typing(function () {
      bot(KB.estimate.intro);
      bot('<b>' + esc(KB.estimate.q1) + '</b>');
      setChips(KB.estimate.services.map(function (s) { return s.label; }).concat(cancelChip()));
    });
  }

  function estimateStep(q) {
    var E = KB.estimate;
    if (state.step === 1) {
      var svc = pick(E.services, q);
      if (!svc) return typing(function () {
        bot('<b>' + esc(E.q1) + '</b>');
        setChips(E.services.map(function (s) { return s.label; }).concat(cancelChip()));
      });
      state.svc = svc;
      if (svc.id === 'print') {
        state = null;
        return typing(function () {
          bot(E.printNote, ctaHtml({ type: 'wa', label: KB.waLabel }));
          setChips(KB.openChips);
        });
      }
      state.step = 2;
      return typing(function () {
        bot('<b>' + esc(E.q2) + '</b>');
        setChips(E.scales.map(function (s) { return s.label; }).concat(cancelChip()));
      });
    }

    if (state.step === 2) {
      var sc = pick(E.scales, q);
      if (!sc) return typing(function () {
        bot('<b>' + esc(E.q2) + '</b>');
        setChips(E.scales.map(function (s) { return s.label; }).concat(cancelChip()));
      });
      state.scale = sc;
      state.step = 3;
      return typing(function () {
        bot('<b>' + esc(E.q3) + '</b>');
        setChips(E.regions.map(function (r) { return r.label; }).concat(cancelChip()));
      });
    }

    if (state.step === 3) {
      var rg = pick(E.regions, q);
      if (!rg) return typing(function () {
        bot('<b>' + esc(E.q3) + '</b>');
        setChips(E.regions.map(function (r) { return r.label; }).concat(cancelChip()));
      });
      var svc2 = state.svc, sc2 = state.scale;
      var intl = rg.id === 'intl';
      var base = intl ? svc2.usd : svc2.base;
      var lo = base * sc2.mult[0], hi = base * sc2.mult[1];
      var cur = rg.cur;
      var line = intl
        ? '<b>' + cur + money(lo) + ' – ' + cur + money(hi) + '</b>'
        : '<b>' + money(lo) + ' – ' + money(hi) + ' ' + cur + '</b>';
      state = null;
      return typing(function () {
        bot(E.result.replace('{svc}', esc(svc2.label)).replace('{scale}', esc(sc2.label)) +
            '<br><span class="chatw__price">' + line + '</span>');
        bot(E.after, ctaHtml({ type: 'wa', label: KB.waLabel }));
        setChips(KB.openChips);
      }, 520);
    }
  }

  /* --- ترشيح باقة --- */
  function startRecommend() {
    state = { kind: 'recommend', step: 1, score: { pack1: 0, pack2: 0, pack3: 0 } };
    typing(function () {
      bot(KB.recommend.intro);
      bot('<b>' + esc(KB.recommend.q1) + '</b>');
      setChips(KB.recommend.a1.map(function (a) { return a.label; }).concat(cancelChip()));
    });
  }

  function recommendStep(q) {
    var R = KB.recommend;
    var keyQ = ['q1', 'q2', 'q3'][state.step - 1];
    var keyA = ['a1', 'a2', 'a3'][state.step - 1];
    var chosen = pick(R[keyA], q);
    if (!chosen) return typing(function () {
      bot('<b>' + esc(R[keyQ]) + '</b>');
      setChips(R[keyA].map(function (a) { return a.label; }).concat(cancelChip()));
    });

    for (var p in chosen.s) state.score[p] += chosen.s[p];

    if (state.step < 3) {
      state.step++;
      var nq = ['q1', 'q2', 'q3'][state.step - 1];
      var na = ['a1', 'a2', 'a3'][state.step - 1];
      return typing(function () {
        bot('<b>' + esc(R[nq]) + '</b>');
        setChips(R[na].map(function (a) { return a.label; }).concat(cancelChip()));
      });
    }

    var best = 'pack1', bv = -1;
    for (var k in state.score) { if (state.score[k] > bv) { bv = state.score[k]; best = k; } }
    var info = R.packs[best];
    state = null;
    typing(function () {
      bot(R.result.replace('{name}', esc(info.name))
                  .replace('{price}', esc(info.price))
                  .replace('{why}', esc(info.why)),
          ctaHtml({ type: 'pack', pack: best, label: AR ? 'اطلب ' + info.name : 'Request the ' + info.name }));
      setChips(KB.openChips);
    }, 560);
  }

  /* --- تسجيل طلب --- */
  function startLead() {
    state = { kind: 'lead', step: 1, data: {} };
    typing(function () {
      bot(KB.lead.intro);
      bot('<b>' + esc(KB.lead.qName) + '</b>');
      setChips(cancelChip());
    });
  }

  function leadStep(q) {
    var L = KB.lead;
    if (state.step === 1) {
      state.data.name = q.slice(0, 60);
      state.step = 2;
      return typing(function () { bot('<b>' + esc(L.qBiz) + '</b>'); setChips(cancelChip()); });
    }
    if (state.step === 2) {
      state.data.biz = q.slice(0, 120);
      state.step = 3;
      return typing(function () { bot('<b>' + esc(L.qNeed) + '</b>'); setChips(cancelChip()); });
    }
    if (state.step === 3) {
      state.data.need = q.slice(0, 400);
      var d = state.data;
      var msg = L.waTemplate.replace('{name}', d.name).replace('{biz}', d.biz).replace('{need}', d.need);
      state = null;
      return typing(function () {
        bot(L.done.replace('{name}', esc(d.name)) +
            '<div class="chatw__quote">' + esc(msg).replace(/\n/g, '<br>') + '</div>' +
            '<button class="chatw__cta" type="button" data-wa="' + esc(msg) + '">' + I.wa + esc(L.send) + '</button>');
        setChips(KB.openChips);
      }, 500);
    }
  }

  /* يتاح للاختبار الآلي فقط */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { normalize: normalize, tokens: tokens, search: search };
  }
  window.__elredaChat = { search: search, normalize: normalize, tokens: tokens };
})();
