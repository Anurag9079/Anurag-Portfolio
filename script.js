/* ═══════════════════════════════════════════════════════════
   script.js  —  Anurag Sharma Portfolio
   Features: Navbar, Theme Toggle, Typing, Reveal, Skills,
             Back-to-top, Contact Form, Mobile Menu
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   1. DOM references (central lookup)
──────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

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

/* ────────────────────────────────────────
   2. Sticky Navbar — add 'scrolled' class
──────────────────────────────────────── */
function handleNavbarScroll() {
  const scrolled = window.scrollY > 30;
  navbar.classList.toggle('scrolled', scrolled);
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run once on load


/* ────────────────────────────────────────
   3. Active nav link on scroll
──────────────────────────────────────── */
const sections  = $$('section[id]');
const navLinks  = $$('.nl');

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


/* ────────────────────────────────────────
   4. Mobile menu toggle
──────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
$$('.ml').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close mobile menu on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  }
});


/* ────────────────────────────────────────
   5. Dark / Light theme toggle
──────────────────────────────────────── */
// Persist preference in localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark'
    ? 'fa-solid fa-moon'
    : 'fa-solid fa-sun';
}


/* ────────────────────────────────────────
   6. Typing animation (hero)
──────────────────────────────────────── */
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
let typingTimeout;

function typeLoop() {
  const phrase = typingPhrases[phraseIdx];

  if (!deleting) {
    // Typing forward
    charIdx++;
    typingEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === phrase.length) {
      // Pause at full phrase before deleting
      typingTimeout = setTimeout(() => {
        deleting = true;
        typeLoop();
      }, 2000);
      return;
    }
  } else {
    // Deleting
    charIdx--;
    typingEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % typingPhrases.length;
    }
  }

  const speed = deleting ? 55 : 100;
  typingTimeout = setTimeout(typeLoop, speed);
}

// Start typing after hero fade-up animation
setTimeout(typeLoop, 900);


/* ────────────────────────────────────────
   7. Scroll reveal (IntersectionObserver)
──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target); // one-shot
      }
    });
  },
  { threshold: 0.12 }
);

$$('.reveal').forEach(el => revealObserver.observe(el));


/* ────────────────────────────────────────
   8. Skill bar animation
      Fires when the skills section enters viewport
──────────────────────────────────────── */
const skillBars  = $$('.sk-bar, .sk-fill');
let   barsAnimated = false;

const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !barsAnimated) {
        barsAnimated = true;
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-w');
          if (width) {
            // Slight delay for visual delight
            setTimeout(() => {
              bar.style.width = `${width}%`;
            }, 200);
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


/* ────────────────────────────────────────
   9. Back-to-top button
──────────────────────────────────────── */
function handleBtt() {
  btt.classList.toggle('show', window.scrollY > 400);
}
window.addEventListener('scroll', handleBtt, { passive: true });

btt.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ────────────────────────────────────────
  10. Contact form — validation + feedback
──────────────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = $('#cName').value.trim();
    const email   = $('#cEmail').value.trim();
    const subject = $('#cSubject').value.trim();
    const message = $('#cMsg').value.trim();

    /* Simple client-side validation */
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'err');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'err');
      return;
    }

    /* Simulate submission (replace with backend / EmailJS / Formspree) */
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      showStatus('✅ Message sent! I\'ll get back to you soon.', 'ok');
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }, 1800);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className   = `form-status ${type}`;
  // Auto-clear after 5 s
  setTimeout(() => {
    formStatus.textContent = '';
    formStatus.className   = 'form-status';
  }, 5000);
}


/* ────────────────────────────────────────
  11. Smooth scroll for ALL anchor links
      (belt-and-suspenders for older browsers)
──────────────────────────────────────── */
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


/* ────────────────────────────────────────
  12. Hero grid parallax (subtle)
──────────────────────────────────────── */
const heroGrid = $('.hero-grid');
if (heroGrid) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.25;
    heroGrid.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}
