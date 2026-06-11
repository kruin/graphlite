(() => {
  'use strict';
  const els = {
    image: document.getElementById('slideImage'),
    title: document.getElementById('slideTitle'),
    text: document.getElementById('slideText'),
    counter: document.getElementById('counter'),
    range: document.getElementById('slideRange'),
    first: document.getElementById('firstBtn'),
    prev: document.getElementById('prevBtn'),
    next: document.getElementById('nextBtn'),
    last: document.getElementById('lastBtn')
  };
  let slides = [];
  let index = 0;
  function clamp(v){ return Math.max(0, Math.min(slides.length - 1, v)); }
  function show(i){
    if (!slides.length) return;
    index = clamp(i);
    const s = slides[index];
    els.image.src = s.image;
    els.image.alt = s.title || 'JAN carousel slide';
    els.title.textContent = s.title || 'Slide';
    els.text.textContent = s.text || '';
    els.counter.textContent = `${index + 1} / ${slides.length}`;
    els.range.max = String(slides.length - 1);
    els.range.value = String(index);
  }
  function next(){ show(index + 1); }
  function prev(){ show(index - 1); }
  async function boot(){
    const response = await fetch('slides.json', { cache: 'no-store' });
    slides = await response.json();
    show(0);
    els.first.addEventListener('click', () => show(0));
    els.prev.addEventListener('click', prev);
    els.next.addEventListener('click', next);
    els.last.addEventListener('click', () => show(slides.length - 1));
    els.range.addEventListener('input', e => show(Number(e.target.value)));
    window.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      if (['arrowright', ' ', 'enter'].includes(key)) { e.preventDefault(); next(); }
      else if (['arrowleft', 'backspace'].includes(key)) { e.preventDefault(); prev(); }
      else if (key === 'home') show(0);
      else if (key === 'end') show(slides.length - 1);
    });
  }
  boot().catch(err => {
    els.title.textContent = 'Carousel kon niet laden';
    els.text.textContent = err.message;
  });
})();
