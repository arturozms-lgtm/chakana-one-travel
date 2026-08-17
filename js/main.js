/* ═══════════════════════════════════════════════════════
   CHAKANA ONE TRAVEL — main.js
   Nav · Burger · Reveal · Bilingüe · Tabs de pago · Copy
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  let lang = 'es';

  /* ── Intro splash: Cruz del Sur → Chakana ─────────── */
  const splash = document.getElementById('introSplash');
  if (splash && !splash.classList.contains('intro-splash--off')) {
    const INTRO_TOTAL = 10400; // fin de la secuencia completa

    const endIntro = () => {
      if (splash.classList.contains('intro-splash--exit')) return;
      clearTimeout(autoEnd);
      splash.classList.add('intro-splash--exit');
      try { sessionStorage.setItem('chakanaIntroSeen', '1'); } catch (e) {}
      document.documentElement.classList.remove('intro-lock');
      setTimeout(() => splash.remove(), 1000);
    };

    const autoEnd = setTimeout(endIntro, INTRO_TOTAL);
    document.getElementById('introSkip')?.addEventListener('click', endIntro);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') endIntro();
    });
  } else if (splash) {
    splash.remove();
    document.documentElement.classList.remove('intro-lock');
  }

  /* ── Modales de Plantas (Ayahuasca · Wachuma) ─────── */
  function initPlantaModal(modalId, openBtnId) {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openBtnId);
    if (!modal || !openBtn) return;

    const closeEls = modal.querySelectorAll('[data-pmodal-close]');

    function openModal() {
      modal.hidden = false;
      modal.querySelector('.pmodal__scroll').scrollTop = 0;
      document.documentElement.classList.add('pmodal-lock');
      modal.querySelector('.pmodal__close').focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.documentElement.classList.remove('pmodal-lock');
      openBtn.focus();
    }

    openBtn.addEventListener('click', openModal);
    closeEls.forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  initPlantaModal('ayahuascaModal', 'ayahuascaOpen');
  initPlantaModal('wachumaModal', 'wachumaOpen');

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
    document.querySelectorAll('[data-ph-es]').forEach(el => {
      const ph = el.getAttribute(`data-ph-${lang}`);
      if (ph) el.placeholder = ph;
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

  /* ── Acordeones: programa (días) + FAQ ────────────── */
  (function () {
    const toggles = document.querySelectorAll('.timeline__toggle, .faq__toggle');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;
        const isOpen = panel.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  })();

  /* ── Cuestionario de inscripción ──────────────────── */
  (function () {
    const form = document.getElementById('inscForm');
    if (!form) return;

    /* ═══ CONFIGURACIÓN — cómo te llegan las inscripciones ═══
       1) ENDPOINT (recomendado): pega aquí la URL de tu servicio de formularios.
          Formspree  → https://formspree.io/f/tuCodigo
          FormSubmit → https://formsubmit.co/ajax/tucorreo@ejemplo.com
          Las respuestas viajan en el cuerpo del envío, no en la URL.
       2) Si ENDPOINT queda vacío y pones EMAIL, se abre el correo del visitante
          con todas las respuestas ya escritas, listo para enviarte.
       3) Si ambos quedan vacíos, se copian las respuestas al portapapeles y se
          abre WhatsApp con un aviso corto (sin datos de salud en la URL).      */
    const ENDPOINT = '';
    const EMAIL    = 'arturozms@gmail.com';   /* ← dirección donde te llegan las inscripciones */
    const WHATSAPP = '51949745661';

    const statusEl = document.getElementById('inscStatus');
    const copyBtn  = document.getElementById('inscCopy');
    const submitBtn = form.querySelector('.insc__submit');

    const T = {
      fix:   { es: 'Revisa los campos marcados en rojo, por favor.',
               en: 'Please review the fields marked in red.' },
      send:  { es: 'Enviando…', en: 'Sending…' },
      ok:    { es: '¡Cuestionario enviado! Te responderemos por WhatsApp o email.',
               en: 'Questionnaire sent! We will reply by WhatsApp or email.' },
      err:   { es: 'No pudimos enviarlo. Copiamos tus respuestas: pégalas por WhatsApp y las recibimos igual.',
               en: 'We could not send it. Your answers were copied: paste them on WhatsApp and we will get them.' },
      mail:  { es: 'Abrimos tu correo con el cuestionario ya escrito: solo pulsa enviar. También copiamos tus respuestas por si prefieres pegarlas por WhatsApp.',
               en: 'We opened your email app with the questionnaire ready: just hit send. We also copied your answers in case you prefer to paste them on WhatsApp.' },
      wa:    { es: 'Respuestas copiadas. En WhatsApp pega el mensaje y envíalo, por favor.',
               en: 'Answers copied. Paste the message in WhatsApp and send it, please.' },
      thanksT: { es: 'Gracias por tu confianza', en: 'Thank you for your trust' },
      thanksB: { es: 'Hemos recibido tu cuestionario. Lo leemos con calma y te escribimos para confirmar tu lugar.',
                 en: 'We have received your questionnaire. We will read it carefully and write to confirm your place.' }
    };

    const t = key => T[key][document.documentElement.lang === 'en' ? 'en' : 'es'];

    function setStatus(msg, kind) {
      statusEl.textContent = msg || '';
      statusEl.classList.remove('insc__status--ok', 'insc__status--err');
      if (kind) statusEl.classList.add('insc__status--' + kind);
    }

    /* ── Lectura de campos ── */
    function fieldLabel(field) {
      if (field.querySelector('.insc__consent')) {
        return document.documentElement.lang === 'en'
          ? 'Confirms the information is true' : 'Confirma que la información es verdadera';
      }
      const l = field.querySelector('.insc__label');
      return l ? l.textContent.replace(/\s*\*\s*$/, '').replace(/\s+/g, ' ').trim() : '';
    }

    function fieldValue(field) {
      const radios = field.querySelectorAll('input[type="radio"]');
      if (radios.length) {
        const checked = Array.from(radios).find(r => r.checked);
        return checked ? checked.value : '';
      }
      const cb = field.querySelector('input[type="checkbox"]');
      if (cb) return cb.checked ? 'Sí' : 'No';
      const el = field.querySelector('input, select, textarea');
      return el ? el.value.trim() : '';
    }

    function buildSummary() {
      const lines = ['CUESTIONARIO DE INSCRIPCIÓN — CHAKANA ONE TRAVEL'];
      form.querySelectorAll('.insc__block').forEach(block => {
        const legend = block.querySelector('.insc__legend');
        lines.push('', '── ' + (legend ? legend.textContent.trim().toUpperCase() : '') + ' ──');
        block.querySelectorAll('.insc__field').forEach(field => {
          lines.push(fieldLabel(field) + ': ' + (fieldValue(field) || '—'));
        });
      });
      return lines.join('\n');
    }

    /* ── Validación ── */
    function validate() {
      let firstBad = null;
      form.querySelectorAll('.insc__field').forEach(field => {
        const req = field.querySelector('[required]');
        if (!req) return;
        let ok;
        if (req.type === 'radio') {
          ok = !!field.querySelector('input[type="radio"]:checked');
        } else if (req.type === 'checkbox') {
          ok = req.checked;
        } else if (req.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(req.value.trim());
        } else {
          ok = req.value.trim() !== '';
        }
        field.classList.toggle('has-error', !ok);
        if (!ok && !firstBad) firstBad = req;
      });
      return firstBad;
    }

    ['input', 'change'].forEach(evt => {
      form.addEventListener(evt, e => {
        const field = e.target.closest('.insc__field');
        if (field) field.classList.remove('has-error');
      });
    });

    /* ── Copiar respuestas ── */
    function copySummary() {
      const text = buildSummary();
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text).then(showToast).catch(() => fallbackCopy(text));
      }
      fallbackCopy(text);
      return Promise.resolve();
    }

    copyBtn?.addEventListener('click', () => { copySummary(); });

    /* ── Pantalla de gracias ── */
    function showThanks() {
      const box = document.createElement('div');
      box.className = 'insc__thanks';
      box.innerHTML =
        '<h3></h3><p></p>' +
        '<a class="btn btn--gold" target="_blank" rel="noopener" ' +
        'href="https://wa.me/' + WHATSAPP + '">WhatsApp</a>';
      box.querySelector('h3').textContent = t('thanksT');
      box.querySelector('p').textContent = t('thanksB');
      form.replaceWith(box);
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /* ── Envío ── */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const bad = validate();
      if (bad) {
        setStatus(t('fix'), 'err');
        bad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        bad.focus({ preventScroll: true });
        return;
      }

      const summary = buildSummary();
      const nombre  = document.getElementById('inscNombre').value.trim();
      const apellido = document.getElementById('inscApellido').value.trim();
      const evento  = document.getElementById('inscEvento').value;
      const fecha   = document.getElementById('inscFecha').value;
      const asunto  = 'Inscripción — ' + nombre + ' ' + apellido + ' — ' + evento;

      /* 1) Servicio de formularios (POST, datos fuera de la URL) */
      if (ENDPOINT) {
        const data = new FormData(form);
        data.append('_subject', asunto);
        data.append('resumen', summary);
        setStatus(t('send'));
        submitBtn.disabled = true;

        fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            setStatus(t('ok'), 'ok');
            showThanks();
          })
          .catch(() => {
            submitBtn.disabled = false;
            copySummary();
            setStatus(t('err'), 'err');
          });
        return;
      }

      /* 2) Correo del visitante con todo escrito */
      if (EMAIL) {
        window.location.href = 'mailto:' + EMAIL +
          '?subject=' + encodeURIComponent(asunto) +
          '&body=' + encodeURIComponent(summary);
        copySummary();
        setStatus(t('mail'), 'ok');
        return;
      }

      /* 3) WhatsApp: aviso corto en la URL + respuestas en el portapapeles */
      const aviso = 'Hola Kurmi, acabo de completar el cuestionario de inscripción. ' +
                    'Soy ' + nombre + ' ' + apellido + '. Quiero participar en: ' + evento +
                    (fecha ? ' (' + fecha + ')' : '') + '. Te pego mis respuestas a continuación.';
      copySummary().then(() => {
        setStatus(t('wa'), 'ok');
        window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(aviso), '_blank', 'noopener');
      });
    });
  })();

  /* ── Init ─────────────────────────────────────────── */
  applyLang('es');

})();
