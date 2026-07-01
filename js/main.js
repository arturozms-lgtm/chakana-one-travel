/* ═══════════════════════════════════════════════════════
   CHAKANA ONE TRAVEL — main.js
   Nav · Burger · Reveal · Bilingüe · Tabs de pago · Copy
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  let lang = 'es';

  /* ── NAV scroll ───────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Burger menu ──────────────────────────────────── */
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav__links');

  burger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ── Reveal on scroll ─────────────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.reveal-item').forEach(item => {
          item.classList.add('visible');
        });
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const itemObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-item').forEach(el => itemObserver.observe(el));

  /* ── Sistema bilingüe ─────────────────────────────── */
  const langToggle = document.getElementById('langToggle');

  function applyLang(newLang) {
    lang = newLang;
    langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';
    document.querySelectorAll('[data-es]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) el.textContent = text;
    });
  }

  langToggle?.addEventListener('click', () => {
    applyLang(lang === 'es' ? 'en' : 'es');
  });

  /* ── Tabs de pago ─────────────────────────────────── */
  const tabs = document.querySelectorAll('.pago__tab');
  const panels = document.querySelectorAll('.pago__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(`tab-${target}`);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Copy to clipboard ────────────────────────────── */
  const toast = document.getElementById('copyToast');
  let toastTimer;

  function showToast() {
    const msg = lang === 'en' ? 'Copied!' : '¡Copiado!';
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(showToast).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    });
  });

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast();
    } catch(e) {}
    document.body.removeChild(ta);
  }

  /* ── Logo fallback ────────────────────────────────── */
  ['logoImg', 'footerLogoImg'].forEach(id => {
    const img = document.getElementById(id);
    if (!img) return;
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

  /* ── HERO DIVIDIDO — ESTRELLAS + INTERACCIÓN ─────── */
  (function () {

    /* Generar estrellas en el panel noche */
    var starsEl = document.getElementById('panelStars');
    if (starsEl) {
      var STARS = 70;
      for (var i = 0; i < STARS; i++) {
        var s = document.createElement('div');
        s.className = 'star-dot';
        var size = (Math.random() * 2.8 + 0.4).toFixed(1);
        s.style.cssText =
          'width:' + size + 'px;' +
          'height:' + size + 'px;' +
          'left:' + (Math.random() * 100).toFixed(1) + '%;' +
          'top:' + (Math.random() * 100).toFixed(1) + '%;' +
          '--dur:' + (Math.random() * 3 + 1.8).toFixed(1) + 's;' +
          '--del:-' + (Math.random() * 4).toFixed(1) + 's;';
        starsEl.appendChild(s);
      }
    }

    /* Click en paneles → scroll a sección */
    var panelNoche = document.getElementById('panelNoche');
    var panelDia   = document.getElementById('panelDia');

    function scrollTo(id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    if (panelNoche) {
      panelNoche.addEventListener('click', function (e) {
        if (!e.target.closest('.hero__center-content')) scrollTo('plantas');
      });
      panelNoche.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') scrollTo('plantas');
      });
    }
    if (panelDia) {
      panelDia.addEventListener('click', function (e) {
        if (!e.target.closest('.hero__center-content')) scrollTo('programa');
      });
      panelDia.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') scrollTo('programa');
      });
    }

    /* Mover el divisor cuando cambia el ancho relativo de los paneles */
    var divider = document.querySelector('.hero__split-divider');
    var hero    = document.querySelector('.hero');

    function updateDivider() {
      if (!divider || !hero || window.innerWidth <= 768) return;
      var noche = panelNoche ? panelNoche.getBoundingClientRect() : null;
      if (noche) {
        var pct = (noche.width / hero.getBoundingClientRect().width) * 100;
        divider.style.left = pct.toFixed(1) + '%';
      }
    }

    if (panelNoche && panelDia) {
      panelNoche.addEventListener('mouseenter', function () {
        setTimeout(updateDivider, 50);
        var raf; (function tick() { updateDivider(); raf = requestAnimationFrame(tick); })();
        panelNoche.addEventListener('mouseleave', function () {
          cancelAnimationFrame(raf);
          setTimeout(function () { if (divider) divider.style.left = '50%'; }, 600);
        }, { once: true });
      });
      panelDia.addEventListener('mouseenter', function () {
        setTimeout(updateDivider, 50);
        var raf; (function tick() { updateDivider(); raf = requestAnimationFrame(tick); })();
        panelDia.addEventListener('mouseleave', function () {
          cancelAnimationFrame(raf);
          setTimeout(function () { if (divider) divider.style.left = '50%'; }, 600);
        }, { once: true });
      });
    }

  })();

  /* ── GALERÍA + LIGHTBOX ───────────────────────────── */
  (function () {
    const items   = Array.from(document.querySelectorAll('.galeria__item'));
    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lightboxImg');
    const lbCap   = document.getElementById('lightboxCaption');
    const lbCtr   = document.getElementById('lightboxCounter');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev  = document.getElementById('lightboxPrev');
    const lbNext  = document.getElementById('lightboxNext');
    const lbBg    = document.getElementById('lightboxBackdrop');

    if (!lb || !items.length) return;

    let current = 0;

    function getCaption(item) {
      const cap = item.querySelector('.galeria__caption');
      return cap ? (cap.getAttribute('data-' + lang) || cap.textContent) : '';
    }

    function showSlide(index) {
      current = (index + items.length) % items.length;
      const item = items[current];
      const src  = item.querySelector('img').src;
      const cap  = getCaption(item);

      lbImg.classList.add('loading');
      const temp = new Image();
      temp.onload = () => {
        lbImg.src = src;
        lbImg.alt = cap;
        lbImg.classList.remove('loading');
      };
      temp.onerror = () => { lbImg.src = src; lbImg.classList.remove('loading'); };
      temp.src = src;

      lbCap.textContent = cap;
      lbCtr.textContent = (current + 1) + ' / ' + items.length;
    }

    function openLightbox(index) {
      showSlide(index);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose && lbClose.focus();
    }

    function closeLightbox() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach(function(item, i) {
      item.addEventListener('click', function() { openLightbox(i); });
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    });

    lbClose && lbClose.addEventListener('click', closeLightbox);
    lbBg    && lbBg.addEventListener('click',    closeLightbox);
    lbPrev  && lbPrev.addEventListener('click',  function() { showSlide(current - 1); });
    lbNext  && lbNext.addEventListener('click',  function() { showSlide(current + 1); });

    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   showSlide(current - 1);
      if (e.key === 'ArrowRight')  showSlide(current + 1);
    });

    /* Swipe táctil */
    var touchStartX = 0;
    lb.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) showSlide(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });

    /* Actualizar caption al cambiar idioma con lightbox abierto */
    langToggle && langToggle.addEventListener('click', function() {
      if (lb.classList.contains('open')) {
        lbCap.textContent = getCaption(items[current]);
      }
    });

  })();

  /* ── Barra de progreso + volver arriba ────────────── */
  (function () {
    const bar   = document.getElementById('scrollProgress');
    const fabTop = document.getElementById('fabTop');
    let ticking = false;

    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = pct + '%';
      if (fabTop) fabTop.classList.toggle('show', h.scrollTop > 600);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    fabTop && fabTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ── Scrollspy — nav activo ───────────────────────── */
  (function () {
    const links = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
    if (!links.length) return;
    const map = links
      .map(l => ({ link: l, section: document.querySelector(l.getAttribute('href')) }))
      .filter(x => x.section);
    if (!map.length) return;

    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    map.forEach(x => spy.observe(x.section));
  })();

  /* ── Cuenta regresiva al retiro ───────────────────── */
  (function () {
    const cd = document.getElementById('countdown');
    if (!cd) return;
    // Inicio del Capac Inti Raymi: 22 diciembre 2026, 00:00 (hora Perú, UTC-5)
    const target = new Date('2026-12-22T00:00:00-05:00').getTime();
    const out = {
      days:    cd.querySelector('[data-cd="days"]'),
      hours:   cd.querySelector('[data-cd="hours"]'),
      minutes: cd.querySelector('[data-cd="minutes"]'),
      seconds: cd.querySelector('[data-cd="seconds"]')
    };
    const pad = n => String(n).padStart(2, '0');

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        out.days.textContent = out.hours.textContent =
        out.minutes.textContent = out.seconds.textContent = '00';
        clearInterval(timer);
        return;
      }
      const s = Math.floor(diff / 1000);
      out.days.textContent    = pad(Math.floor(s / 86400));
      out.hours.textContent   = pad(Math.floor((s % 86400) / 3600));
      out.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      out.seconds.textContent = pad(s % 60);
    }
    tick();
    const timer = setInterval(tick, 1000);
  })();

  /* ── Contadores animados (cifras) ─────────────────── */
  (function () {
    const nums = Array.from(document.querySelectorAll('.stat__num[data-count]'));
    if (!nums.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animate(el) {
      const end = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = end + suffix; return; }
      const dur = 1200;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(eased * end) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.done) {
          entry.target.dataset.done = '1';
          animate(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  })();

  /* ── Init ─────────────────────────────────────────── */
  applyLang('es');

})();
