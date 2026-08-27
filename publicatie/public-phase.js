(() => {
  'use strict';
  const PHASE = '1';
  const params = new URLSearchParams(window.location.search);
  const source = String(params.get('utm_source') || 'direct').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || 'direct';
  const campaign = String(params.get('utm_campaign') || 'hond_bijt_man').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 60) || 'hond_bijt_man';
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
    status.textContent = 'Opbouw wordt afgespeeld…';
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
  publicationEvent('view-phase-1');
})();
