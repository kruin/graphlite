(() => {
  'use strict';
  const PHASE = '1';
  const params = new URLSearchParams(window.location.search);
  const source = String(params.get('utm_source') || 'direct').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || 'direct';
  const campaign = String(params.get('utm_campaign') || 'ogn_kern').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 60) || 'ogn_kern';
  const sessionId = sessionStorage.getItem('opengraph-public-session') || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);
  sessionStorage.setItem('opengraph-public-session', sessionId);

  window.__opengraphPublication = Object.freeze({ phase: PHASE, source, campaign, sessionId });
  function publicationEvent(action) {
    const detail = Object.freeze({ phase: PHASE, source, campaign, action, sessionId, at: new Date().toISOString() });
    window.dispatchEvent(new CustomEvent('opengraph:publication-event', { detail }));
    try { localStorage.setItem('opengraph-public-last-event', JSON.stringify(detail)); } catch (_err) {}
  }

  const openAppLink = document.getElementById('openAppLink');
  if (openAppLink) {
    const href = new URL(openAppLink.href);
    href.searchParams.set('utm_source', source);
    href.searchParams.set('utm_campaign', campaign);
    openAppLink.href = href.toString();
    openAppLink.addEventListener('click', () => publicationEvent('open-interactive-graph'));
  }

  const graph = document.getElementById('phaseGraph');
  const button = document.getElementById('playPhaseButton');
  const status = document.getElementById('playStatus');
  let timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function play() {
    clearTimers();
    graph.classList.add('is-playing');
    graph.querySelectorAll('.draw-step').forEach(node => node.classList.remove('is-visible'));
    button.disabled = true;
    status.textContent = 'Knopen worden geschreven…';
    [1, 2, 3, 4].forEach((step, index) => {
      timers.push(setTimeout(() => {
        graph.querySelectorAll(`.step-${step}`).forEach(node => node.classList.add('is-visible'));
      }, 260 + index * 520));
    });
    timers.push(setTimeout(() => {
      graph.classList.remove('is-playing');
      button.disabled = false;
      status.textContent = 'Opbouw voltooid';
    }, 2600));
    publicationEvent('play-phase-1');
  }
  button?.addEventListener('click', play);

  const carousel = document.querySelector('[data-example-carousel]');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-example-slide]'));
    const current = carousel.querySelector('[data-carousel-current]');
    const dots = carousel.querySelector('[data-carousel-dots]');
    let activeIndex = 0;
    const showSlide = requestedIndex => {
      activeIndex = (requestedIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.hidden = !active;
        slide.classList.toggle('is-active', active);
      });
      dots?.querySelectorAll('button').forEach((dot, index) => dot.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false'));
      if (current) current.textContent = String(activeIndex + 1);
      publicationEvent(`carousel-slide-${activeIndex + 1}`);
    };
    slides.forEach((_slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Carrouselbeeld ${index + 1}`);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => showSlide(index));
      dots?.appendChild(dot);
    });
    carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => showSlide(activeIndex - 1));
    carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => showSlide(activeIndex + 1));
    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') showSlide(activeIndex - 1);
      if (event.key === 'ArrowRight') showSlide(activeIndex + 1);
    });
  }
  publicationEvent('view-phase-1');
})();
