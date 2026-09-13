const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('lead-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nome = data.get('nome') || '';
  const telefone = data.get('telefone') || '';
  const tipo = data.get('tipo') || '';
  const mensagem = data.get('mensagem') || '';
  const texto = `Olá, vim através do site. Preciso de atendimento!\n\nNome: ${nome}\nWhatsApp: ${telefone}\nTipo de imóvel: ${tipo}\nNecessidade: ${mensagem}`;
  window.open(`https://wa.me/5548996865570?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
});

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observeOnce = (elements, onEnter, options = { threshold: 0.18 }) => {
    const list = [...elements].filter(Boolean);
    if (reduceMotion || !('IntersectionObserver' in window)) {
      list.forEach(onEnter);
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onEnter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, options);
    list.forEach(el => io.observe(el));
  };

  // Entrada consistente nas seções e cards
  const revealItems = document.querySelectorAll('.section .eyebrow, .section h2, .section .section-head p, .intro-copy, .service-card, .audience-card, .preventive-visual, .preventive-grid>div:last-child, .benefit, .step, .gallery-grid img, .region-tags span, .map-frame, .testimonial-grid blockquote, .faq details, .cta-grid>div, .contact-form');
  revealItems.forEach((el, i) => {
    el.classList.add('reveal-item');
    el.style.setProperty('--reveal-delay', `${Math.min((i % 6) * 55, 275)}ms`);
  });
  observeOnce(revealItems, el => el.classList.add('is-revealed'));

  // Divisor entre Quem Somos e Soluções: desenha uma única vez ao entrar no viewport

  // Estatísticas do hero
  const trust = document.querySelector('.hero-trust');
  if (trust) observeOnce([trust], el => el.classList.add('is-visible'), { threshold: 0.45 });

  // Ícones SVG dos serviços
  const serviceCards = [...document.querySelectorAll('.service-card')];
  serviceCards.forEach(card => {
    card.querySelectorAll('svg path').forEach(path => {
      try {
        const len = Math.ceil(path.getTotalLength());
        path.style.setProperty('--path-len', len);
      } catch (_) {}
    });
  });
  observeOnce(serviceCards, card => card.classList.add('icon-drawn'), { threshold: 0.3 });

  // Spotlight no diferencial
  const differential = document.getElementById('diferenciais');
  if (differential && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    differential.addEventListener('pointermove', e => {
      const r = differential.getBoundingClientRect();
      differential.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
      differential.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
    });
  }

  // Count-up 01-04
  const counters = [...document.querySelectorAll('#diferenciais .benefit strong')];
  const runCounter = el => {
    const target = parseInt(el.textContent, 10);
    if (!Number.isFinite(target)) return;
    if (reduceMotion) { el.textContent = String(target).padStart(2,'0'); return; }
    let start = null;
    const duration = 700;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const v = Math.max(0, Math.round(target * (1 - Math.pow(1-p, 3))));
      el.textContent = String(v).padStart(2,'0');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  observeOnce(counters, runCounter, { threshold: 0.55 });

  // Linha pontilhada do processo
  const steps = document.querySelector('.steps');
  const updateStepProgress = () => {
    if (!steps || window.innerWidth <= 900) return;
    const r = steps.getBoundingClientRect();
    const start = window.innerHeight * 0.82;
    const end = window.innerHeight * 0.28;
    const p = Math.max(0, Math.min(1, (start - r.top) / Math.max(1, start - end)));
    steps.style.setProperty('--step-progress', p.toFixed(3));
  };
  if (steps && !reduceMotion) {
    updateStepProgress();
    window.addEventListener('scroll', updateStepProgress, { passive:true });
    window.addEventListener('resize', updateStepProgress);
  } else if (steps) steps.style.setProperty('--step-progress', '1');

  // Checks da manutenção preventiva em sequência
  const checkList = document.querySelector('.check-list');
  if (checkList) {
    [...checkList.querySelectorAll('li')].forEach((li, i) => {
      li.classList.add('stagger-check');
      li.style.setProperty('--check-delay', `${i * 120}ms`);
    });
    observeOnce([checkList], el => el.classList.add('is-visible'), { threshold: 0.35 });
  }

  // Galeria de fotos reais: swipe nativo + setas + autoplay suave
  const gallery = document.querySelector('.gallery-carousel');
  if (gallery) {
    const track = gallery.querySelector('.gallery-track');
    const slides = [...gallery.querySelectorAll('.gallery-slide')];
    const prev = gallery.querySelector('.gallery-prev');
    const next = gallery.querySelector('.gallery-next');
    const dotsWrap = gallery.querySelector('.gallery-dots');
    let timer = null;
    let paused = false;

    slides.forEach((slide, i) => {
      slide.classList.add('reveal-item');
      slide.style.setProperty('--reveal-delay', `${Math.min(i * 70, 350)}ms`);
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir para foto ${i + 1}`);
      dot.addEventListener('click', () => scrollToSlide(i));
      dotsWrap?.appendChild(dot);
    });
    observeOnce(slides, el => el.classList.add('is-revealed'), { threshold: .18 });

    const dots = [...gallery.querySelectorAll('.gallery-dot')];
    const visibleCount = () => window.innerWidth <= 680 ? 1 : window.innerWidth <= 1000 ? 2 : 3;
    const slideStep = () => {
      if (!slides[0] || !track) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    };
    const maxStart = () => Math.max(0, slides.length - visibleCount());
    const currentIndex = () => Math.min(maxStart(), Math.max(0, Math.round(track.scrollLeft / Math.max(1, slideStep()))));
    const updateDots = () => {
      const idx = currentIndex();
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    function scrollToSlide(i) {
      const idx = Math.max(0, Math.min(maxStart(), i));
      track.scrollTo({ left: idx * slideStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
      window.setTimeout(updateDots, 380);
    }
    prev?.addEventListener('click', () => scrollToSlide(currentIndex() - 1));
    next?.addEventListener('click', () => {
      const idx = currentIndex();
      scrollToSlide(idx >= maxStart() ? 0 : idx + 1);
    });
    track?.addEventListener('scroll', () => requestAnimationFrame(updateDots), { passive: true });

    const startAuto = () => {
      if (reduceMotion || timer) return;
      timer = setInterval(() => {
        if (paused) return;
        const idx = currentIndex();
        scrollToSlide(idx >= maxStart() ? 0 : idx + 1);
      }, 4600);
    };
    const stopAuto = () => { if (timer) { clearInterval(timer); timer = null; } };
    gallery.addEventListener('mouseenter', () => { paused = true; });
    gallery.addEventListener('mouseleave', () => { paused = false; });
    gallery.addEventListener('focusin', () => { paused = true; });
    gallery.addEventListener('focusout', () => { paused = false; });
    gallery.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    gallery.addEventListener('touchend', () => { paused = false; }, { passive: true });
    window.addEventListener('resize', updateDots);
    startAuto();
  }
})();
