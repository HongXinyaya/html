/* Init */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Nav: smooth scroll + toggle */
const linksWrap = document.getElementById('nav-links');
const toggleBtn = document.querySelector('.nav-toggle');
if (toggleBtn && linksWrap) {
  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    linksWrap.classList.toggle('open');
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 56, behavior: 'smooth' });
    if (linksWrap) linksWrap.classList.remove('open');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
  });
});

/* GSAP */
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero reveal
  const heroTl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 0.9 }
  });
  heroTl
    .from('.nav .brand', { y: -24, opacity: 0, duration: 0.6 })
    .from('.nav .links a', { y: -18, opacity: 0, stagger: 0.06, duration: 0.4 }, '<0.05')
    .from('.eyebrow', { y: 16, opacity: 0 }, '-=0.2')
    .from('.headline', { y: 16, opacity: 0 }, '-=0.2')
    .from('.subhead', { y: 16, opacity: 0 }, '-=0.3')
    .from('.cta .btn', { y: 18, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.2');

  // Floating blobs (idle)
  if (!prefersReduced) {
    gsap.to('.shape.s1', { y: 22, x: 12, duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to('.shape.s2', { y: -18, x: -10, duration: 5.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to('.shape.s3', { y: -14, x: 10, duration: 5.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
  }

  // Parallax on scroll for blobs
  if (!prefersReduced) {
    const parallax = (selector, y) => gsap.to(selector, {
      yPercent: y,
      ease: 'none',
      scrollTrigger: { trigger: 'main.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    parallax('.shape.s1', 8);
    parallax('.shape.s2', -10);
    parallax('.shape.s3', 12);
  }

  // Scroll reveals
  const fadeUpItems = gsap.utils.toArray('[data-animate="fade-up"]');
  fadeUpItems.forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  const fadeLeftItems = gsap.utils.toArray('[data-animate="fade-left"]');
  fadeLeftItems.forEach((el) => {
    gsap.from(el, {
      x: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  const fadeRightItems = gsap.utils.toArray('[data-animate="fade-right"]');
  fadeRightItems.forEach((el) => {
    gsap.from(el, {
      x: -24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Card tilt on hover (subtle)
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotationY: px * 8, rotationX: -py * 8, transformPerspective: 600, transformOrigin: 'center', duration: 0.3, ease: 'power2.out' });
    };
    const reset = () => gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power3.out' });
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
  });
}

