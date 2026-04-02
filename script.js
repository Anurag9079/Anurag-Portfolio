/* ═══════════════════════════════════════════════════════════
   script.js  —  Anurag Sharma Portfolio  (v2.0)
   Features: Loader · Navbar · Theme · Typing · Reveal ·
             Skills · Stats Counter · Download CV (Blob) ·
             Toast Notifications · Copy-to-Clipboard ·
             Contact Form · Back-to-top · Parallax
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   0. Helpers
──────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ────────────────────────────────────────
   1. DOM references
──────────────────────────────────────── */
const navbar      = $('#navbar');
const hamburger   = $('#hamburger');
const mobileMenu  = $('#mobileMenu');
const themeToggle = $('#themeToggle');
const themeIcon   = $('#themeIcon');
const typingEl    = $('#typingText');
const btt         = $('#btt');
const contactForm = $('#contactForm');
const formStatus  = $('#formStatus');
const html        = document.documentElement;
const pageLoader  = $('#pageLoader');
const toastCont   = $('#toastContainer');

/* ════════════════════════════════════════
   PAGE LOADER
════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    pageLoader.classList.add('hide');
    setTimeout(() => pageLoader.remove(), 600);
  }, 900);
});

/* ════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
════════════════════════════════════════ */
function showToast(message, type = 'info', duration = 3500) {
  const icons = {
    success : 'fa-circle-check',
    error   : 'fa-circle-xmark',
    info    : 'fa-circle-info',
    warning : 'fa-triangle-exclamation',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  toastCont.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  // Auto dismiss
  const timer = setTimeout(() => dismissToast(toast), duration);

  // Manual close
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timer);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 400);
}

/* ════════════════════════════════════════
   RESUME DOWNLOAD (Fetch → Blob method)
   — works on local & live servers
════════════════════════════════════════ */
function downloadResume() {
  const btn = $('#downloadBtn');
  if (!btn || btn.disabled) return;

  // ── Loading state ──
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing…';

  fetch('assets/anurag sharma (p).pdf')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.blob();
    })
    .then(blob => {
      // Force download via object URL
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = 'Anurag_Sharma_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // ── Success state ──
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Downloaded!';
      showToast('Resume downloaded successfully! 🎉', 'success');

      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> Download CV';
        btn.disabled  = false;
      }, 2500);
    })
    .catch(err => {
      console.error('Resume download failed:', err);

      // ── Error state ──
      btn.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> Download CV';
      btn.disabled  = false;

      showToast(
        '⚠️ Resume file not found! Make sure <code>assets/anurag sharma (p).pdf</code> exists.',
        'error',
        5000
      );
    });
}

// Expose globally (called from HTML onclick)
window.downloadResume = downloadResume;

/* ════════════════════════════════════════
   COPY TO CLIPBOARD (contact cards)
════════════════════════════════════════ */
$$('.cc[data-copy]').forEach(card => {
  card.addEventListener('click', e => {
    const text = card.getAttribute('data-copy');
    if (!text) return;

    // Only copy — don't follow mailto/tel if user clicked copy icon
    if (e.target.closest('.cc-arr')) {
      e.preventDefault();
      navigator.clipboard.writeText(text)
        .then(() => showToast(`Copied: ${text}`, 'success', 2500))
        .catch(() => showToast('Could not copy. Please do it manually.', 'warning'));
    }
  });
});

/* ════════════════════════════════════════
   STICKY NAVBAR
════════════════════════════════════════ */
function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* ════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
════════════════════════════════════════ */
const sections = $$('section[id]');
const navLinks = $$('.nl');

function setActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    }
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });

/* ════════════════════════════════════════
   MOBILE MENU TOGGLE
════════════════════════════════════════ */
hamburger.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

$$('.ml').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

/* ════════════════════════════════════════
   DARK / LIGHT THEME TOGGLE
════════════════════════════════════════ */
// Theme was already applied by inline <head> script to prevent FOUC.
// Here we just sync the icon and wire up the toggle button.
const savedTheme = html.getAttribute('data-theme') || 'dark';
updateThemeIcon(savedTheme);

// Enable smooth transitions only after first paint
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.add('theme-ready');
  });
});

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
  showToast(`Switched to ${next} mode`, 'info', 1800);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark'
    ? 'fa-solid fa-moon'
    : 'fa-solid fa-sun';
}

/* ════════════════════════════════════════
   TYPING ANIMATION (hero)
════════════════════════════════════════ */
const typingPhrases = [
  'Python Developer',
  'Problem Solver',
  'OOP Enthusiast',
  'Fast Learner',
  'Open to Opportunities',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;

function typeLoop() {
  const phrase = typingPhrases[phraseIdx];

  if (!deleting) {
    charIdx++;
    typingEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === phrase.length) {
      setTimeout(() => { deleting = true; typeLoop(); }, 2000);
      return;
    }
  } else {
    charIdx--;
    typingEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % typingPhrases.length;
    }
  }

  setTimeout(typeLoop, deleting ? 55 : 100);
}

setTimeout(typeLoop, 1400);

/* ════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

$$('.reveal').forEach(el => revealObserver.observe(el));

/* ════════════════════════════════════════
   SKILL BAR ANIMATION
════════════════════════════════════════ */
const skillBars    = $$('.sk-bar, .sk-fill');
let   barsAnimated = false;

const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !barsAnimated) {
        barsAnimated = true;
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-w');
          if (width) {
            setTimeout(() => { bar.style.width = `${width}%`; }, 200);
          }
        });
        skillObserver.disconnect();
      }
    });
  },
  { threshold: 0.2 }
);

const skillsSection = $('#skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ════════════════════════════════════════
   STATS COUNTER ANIMATION
════════════════════════════════════════ */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1500;
  const step     = target / (duration / 16);
  let   current  = 0;

  const tick = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  };

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const numEl = entry.target.querySelector('.stat-num');
      if (!numEl) return;

      if (entry.isIntersecting) {
        // Reset to 0 first, then animate up
        numEl.textContent = '0';
        animateCounter(numEl);
      } else {
        // Reset when card leaves viewport so next entry starts fresh
        numEl.textContent = '0';
      }
    });
  },
  { threshold: 0.5 }
);

$$('.stat-card').forEach(card => counterObserver.observe(card));

/* ════════════════════════════════════════
   BACK TO TOP BUTTON
════════════════════════════════════════ */
function handleBtt() {
  btt.classList.toggle('show', window.scrollY > 400);
}
window.addEventListener('scroll', handleBtt, { passive: true });

btt.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ════════════════════════════════════════
   CONTACT FORM — Validation + Submission
   Replace Formspree URL with your own at:
   https://formspree.io (free, no backend needed)
════════════════════════════════════════ */
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = $('#cName').value.trim();
    const email   = $('#cEmail').value.trim();
    const subject = $('#cSubject').value.trim();
    const message = $('#cMsg').value.trim();

    // ── Validation ──
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'err');
      showToast('Please fill in all fields before submitting.', 'warning');
      return;
    }
    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'err');
      showToast('Invalid email address.', 'warning');
      return;
    }

    // ── Submit state ──
    const btn     = contactForm.querySelector('button[type="submit"]');
    btn.disabled  = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    try {
      /* ── OPTION A: Formspree (recommended)
         1. Go to https://formspree.io → create free account
         2. Create a new form → copy your Form ID
         3. Replace YOUR_FORM_ID below ──────────────────── */
      const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← paste your ID here

      if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method  : 'POST',
          headers : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body    : JSON.stringify({ name, email, subject, message }),
        });

        if (!res.ok) throw new Error('Form submission failed');
      } else {
        // ── OPTION B: Simulation (until Formspree is set up) ──
        await new Promise(r => setTimeout(r, 1800));
      }

      showStatus('✅ Message sent! I\'ll get back to you soon.', 'ok');
      showToast('Message sent successfully! 🚀', 'success');
      contactForm.reset();

    } catch {
      showStatus('❌ Something went wrong. Please try again.', 'err');
      showToast('Failed to send message. Please try emailing directly.', 'error');
    } finally {
      btn.disabled  = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(msg, type) {
  formStatus.innerHTML = msg;
  formStatus.className = `form-status ${type}`;
  setTimeout(() => {
    formStatus.textContent = '';
    formStatus.className   = 'form-status';
  }, 5000);
}

/* ════════════════════════════════════════
   SMOOTH SCROLL for anchor links
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ════════════════════════════════════════
   HERO GRID PARALLAX (subtle)
════════════════════════════════════════ */
const heroGrid = $('.hero-grid');
if (heroGrid) {
  window.addEventListener('scroll', () => {
    heroGrid.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}
