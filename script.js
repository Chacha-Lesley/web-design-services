/* ============================================
   LESLEY CHACHA — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ─────────────────────────────── */
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }, 1600);
  }

  /* ── Custom Cursor ──────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursor && cursorRing && window.innerWidth > 768) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverEls = document.querySelectorAll('a, button, .card, .btn, [data-hover]');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Theme Toggle ───────────────────────── */
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('lc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('lc-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    themeBtn.innerHTML = theme === 'dark'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  /* ── Sticky Nav ─────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Mobile Nav ─────────────────────────── */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      const spans = hamburger.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    mobileLinks.forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ── Scroll Reveal ──────────────────────── */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ── Counter Animation ──────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = target < 10 ? (target * ease).toFixed(1) : Math.round(target * ease);
      el.textContent = prefix + val + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ── Parallax Hero ──────────────────────── */
  const heroParallax = document.querySelectorAll('[data-parallax]');
  if (heroParallax.length > 0) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      heroParallax.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${sy * speed}px)`;
      });
    }, { passive: true });
  }

  /* ── Magnetic Buttons ───────────────────── */
  const magnetBtns = document.querySelectorAll('[data-magnet]');
  magnetBtns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── Marquee ────────────────────────────── */
  const marquees = document.querySelectorAll('.marquee-track');
  marquees.forEach(track => {
    const content = track.innerHTML;
    track.innerHTML = content + content;
  });

  /* ── Portfolio Filter ───────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const cats = item.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);
        item.style.opacity    = show ? '1' : '0';
        item.style.transform  = show ? 'scale(1)' : 'scale(0.9)';
        item.style.pointerEvents = show ? 'auto' : 'none';
        item.style.position   = show ? 'relative' : 'absolute';
        item.style.display    = show ? '' : 'none';
      });
    });
  });

  /* ── Language Switcher ──────────────────── */
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.dataset.lang;
      document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = lang === 'sw' ? el.dataset.sw : el.dataset.en;
      });
    });
  });

  /* ── Quote Calculator ───────────────────── */
  const calculator = document.querySelector('.calc-form') || document.getElementById('quote-calculator');
  if (calculator) {
    const inputs = calculator.querySelectorAll('input[type=checkbox], select');
    const total  = calculator.querySelector('#quote-total');
    inputs.forEach(inp => inp.addEventListener('change', updateQuote));

    function updateQuote() {
      const pagesValue = parseInt(calculator.querySelector('select[name=pages]')?.value || 1);
      let base;
      if (pagesValue === 1) base = 5000;        // 1-2 pages
      else if (pagesValue <= 4) base = 12000;   // 3-4 pages
      else if (pagesValue <= 6) base = 15000;   // 5-6 pages
      else base = 20000;                        // 7+ pages
      
      calculator.querySelectorAll('input[type=checkbox]:checked').forEach(cb => {
        base += parseInt(cb.dataset.price || 0);
      });
      if (total) {
        total.innerHTML = `<span>KSh</span> ${base.toLocaleString()}`;
      }
    }
  }

  /* ── Contact Form Feedback ──────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type=submit]');
      const formData = new FormData(contactForm);
      
      btn.textContent = 'Sending...';
      btn.disabled = true;
      
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          btn.textContent = 'Message Sent ✓';
          btn.style.background = 'var(--green)';
          btn.style.color = 'white';
          contactForm.reset();
          setTimeout(() => {
            btn.textContent = 'Send My Message';
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3000);
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(error => {
        btn.textContent = 'Error sending message';
        btn.style.background = '#d32f2f';
        btn.style.color = 'white';
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = 'Send My Message';
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      });
    });
  }

  /* ── Smooth Anchor Scroll ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Typed Text ─────────────────────────── */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const words = typedEl.dataset.words?.split(',') || ['Websites', 'Brands', 'Experiences'];
    let wi = 0, ci = 0, deleting = false;

    function type() {
      const word = words[wi];
      typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
      if (!deleting && ci > word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      if (deleting && ci < 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        ci = 0;
      }
      setTimeout(type, deleting ? 60 : 100);
    }
    type();
  }

});