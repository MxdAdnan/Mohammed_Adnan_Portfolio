/* ═══════════════════════════════════════════════════════
   MOHAMMED ADNAN PORTFOLIO — app.js
   ─────────────────────────────────────────────────────
   • Navigation: scroll-aware + mobile menu
   • Tabs: About section + Work section
   • Scroll Reveal: IntersectionObserver
   • Smooth active nav highlighting
   • Contact form: Google Sheets integration
═══════════════════════════════════════════════════════ */

'use strict';

// ─── Utility: debounce ────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ─── DOM Ready ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initAboutTabs();
  initWorkTabs();
  initScrollReveal();
  initActiveNavLinks();
  initContactForm();
  initStaggeredReveal();
});

/* ═══════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const navLinks = document.getElementById('navLinks');

  if (!nav) return;

  // Scroll-aware styling
  const onScroll = debounce(() => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, 10);

  window.addEventListener('scroll', onScroll, { passive: true });

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // Open mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.contains('open');
      openMenu(!isOpen);
    });
  }

  // Close via X button
  if (navClose) {
    navClose.addEventListener('click', () => openMenu(false));
  }

  // Close via overlay
  overlay.addEventListener('click', () => openMenu(false));

  // Close on nav link click
  const allNavLinks = navLinks ? navLinks.querySelectorAll('.nav__link') : [];
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      openMenu(false);
    });
  });

  // Keyboard: Escape closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') openMenu(false);
  });

  function openMenu(open) {
    if (!navLinks) return;
    if (open) {
      navLinks.classList.add('open');
      overlay.classList.add('open');
      navToggle && navToggle.classList.add('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      navLinks.classList.remove('open');
      overlay.classList.remove('open');
      navToggle && navToggle.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }
}

/* ═══════════════════════════════════════════════════════
   ACTIVE NAV LINK (highlight on scroll)
═══════════════════════════════════════════════════════ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observerOpts = {
    root: null,
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOpts);

  sections.forEach(section => observer.observe(section));
}

/* ═══════════════════════════════════════════════════════
   ABOUT SECTION TABS
═══════════════════════════════════════════════════════ */
function initAboutTabs() {
  const buttons = document.querySelectorAll('.tabs__btn');
  const panels = document.querySelectorAll('.tabs__panel');

  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      // Update buttons
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(panel => {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');

        // Animate panel in
        targetPanel.style.opacity = '0';
        targetPanel.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
          targetPanel.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          targetPanel.style.opacity = '1';
          targetPanel.style.transform = 'translateY(0)';
        });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   WORK SECTION TABS (category switching)
═══════════════════════════════════════════════════════ */
function initWorkTabs() {
  const workTabs = document.querySelectorAll('.work-tab');
  const workPanels = document.querySelectorAll('.work-panel');

  if (!workTabs.length) return;

  workTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetPanel = this.getAttribute('data-panel');

      // Update tab buttons
      workTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Update panels
      workPanels.forEach(panel => {
        panel.classList.remove('active');
      });

      const activePanel = document.getElementById(`panel-${targetPanel}`);
      if (activePanel) {
        activePanel.classList.add('active');

        // Trigger reveal for newly visible cards
        const panelRevealEls = activePanel.querySelectorAll('.reveal:not(.visible)');
        panelRevealEls.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('visible');
          }, i * 80);
        });

        // Animate panel entrance
        activePanel.style.opacity = '0';
        activePanel.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => {
          activePanel.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          activePanel.style.opacity = '1';
          activePanel.style.transform = 'translateY(0)';
        });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) return;

  // Check if reduced motion is preferred
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealEls.forEach((el, i) => {
    // Stagger siblings in the same grid parent
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
      const idx = siblings.indexOf(el);
      if (idx > 0) {
        el.style.transitionDelay = `${idx * 80}ms`;
      }
    }

    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════
   STAGGERED HERO REVEAL
═══════════════════════════════════════════════════════ */
function initStaggeredReveal() {
  // Hero elements animate via CSS keyframes already.
  // This triggers any section-level stagger that needs JS help.
  const grids = document.querySelectorAll('.expertise__grid, .projects-grid, .design-gallery');

  grids.forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 70}ms`;
    });
  });
}

/* ═══════════════════════════════════════════════════════
   CONTACT FORM — Google Sheets
═══════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbykSNk1ufVn2Ol6p9pzAcB_RFFYo2FXmxqHFjIPq97jzOLKvZd-EnEP6Z49Ezdx3_c/exec';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate
    const nameVal = form.querySelector('[name="Name"]')?.value.trim();
    const emailVal = form.querySelector('[name="Email"]')?.value.trim();

    if (!nameVal || !emailVal) {
      showStatus('Please fill in your name and email.', 'error');
      return;
    }

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending…';
    }

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: new FormData(form),
      });

      showStatus('Message sent successfully! I'll be in touch soon.', 'success');
      form.reset();
    } catch (err) {
      showStatus('Something went wrong. Please try emailing directly.', 'error');
      console.error('Form error:', err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      }
    }
  });

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;

    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }, 6000);
  }
}
