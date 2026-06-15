(() => {
  'use strict';
  const VERSION = 'v4465';
  const FALLBACK_SLIDES = [
  {
    "image": "slides/01-simpele-vertakking-een-level.png",
    "text": "Simpele vertakking: één niveau. De eerste stap is niet een volledige syntactische eindboom, maar een klein OpenGraph-veld met vrije knopen en takken. De student ziet hier dat een vertakking een ruimtelijke notatie is, geen zwaartekracht.",
    "title": "Simpele vertakking een level"
  },
  {
    "image": "slides/02-vertakking-links-rechts-varianten.png",
    "text": "Varianten van een simpele vertakking. In de klassieke boomnotatie lijkt links/rechts meteen woordvolgorde te zijn. In OpenGraph is dit eerst een vrije tekening; de uitingsvolgorde kan later via LEX worden geprojecteerd.",
    "title": "Vertakking links rechts varianten"
  },
  {
    "image": "slides/03-oude-boom-s-np-vp.png",
    "text": "Traditionele boomrichting: S met NP en VP. In oude notatie betekent S-NP,VP iets anders dan S-VP,NP, omdat de volgorde in de vertakking zelf zit ingebakken.",
    "title": "Oude boom s np vp"
  },
  {
    "image": "slides/04-oude-boom-s-vp-np.png",
    "text": "Variant met andere lokale volgorde: S-VP,NP. Dit is in de klassieke notatie een andere boomvorm. OpenGraph wil laten zien dat volgorde ook als projectie kan worden behandeld.",
    "title": "Oude boom s vp np"
  },
  {
    "image": "slides/05-standaard-m-tree.png",
    "text": "Een standaard M-tree-achtige verdeling. Deze screenshot is bruikbaar om te laten zien hoe taklengte en vrije ruimte bepalen of projecties later leesbaar naast de bronboom passen.",
    "title": "Standaard m tree"
  },
  {
    "image": "slides/06-standaard-m-tree-variant.png",
    "text": "Tweede M-tree-variant. Vergelijk met de vorige: dezelfde notatiegedachte kan anders worden uitgespreid, zolang de projectieruimte helder blijft.",
    "title": "Standaard m tree variant"
  },
  {
    "image": "slides/07-projectieveld-klein.png",
    "text": "Klein projectieveld. De gekleurde randen markeren waar later projecties kunnen landen. Voor de student: de boom staat niet alleen; rondom de boom ontstaat projectieruimte.",
    "title": "Projectieveld klein"
  },
  {
    "image": "slides/08-projectieveld-klein-variant.png",
    "text": "Variant van het kleine projectieveld. Dit ondersteunt de uitleg dat projecties op een rand of as kunnen landen, zonder de bronboom zelf te veranderen.",
    "title": "Projectieveld klein variant"
  },
  {
    "image": "slides/09-kale-projectielijn-links.png",
    "text": "Kale projectielijn naar links. Eerst zonder projectienaam: alleen een lijn en kopieën van knopen. Dat maakt zichtbaar wat projecteren betekent voordat LEX/SYN/LF-labels worden toegevoegd.",
    "title": "Kale projectielijn links"
  },
  {
    "image": "slides/10-projectie-met-rand-boven.png",
    "text": "Projectieruimte met bovenrand. Deze stap bereidt het idee voor dat meerdere projectierichtingen rond dezelfde bronboom kunnen bestaan.",
    "title": "Projectie met rand boven"
  },
  {
    "image": "slides/11-projectie-met-rand-en-kopie.png",
    "text": "Projectie met kopie van een knoop. De kopie hoort niet als nieuw syntactisch kind in de centrale boom; zij toont een andere lezing of projectielaag.",
    "title": "Projectie met rand en kopie"
  },
  {
    "image": "slides/12-projectie-met-labelruimte.png",
    "text": "Projectie met ruimte voor labels. Pas na de kale projectie worden namen als LEX, SYN of LF nuttig; eerst moet duidelijk zijn wat de lijn en kopie doen.",
    "title": "Projectie met labelruimte"
  }
];

  const els = {
    image: document.getElementById('slideImage'),
    stage: document.querySelector('.stage'),
    title: document.getElementById('slideTitle'),
    text: document.getElementById('slideText'),
    counter: document.getElementById('counter'),
    range: document.getElementById('slideRange'),
    first: document.getElementById('firstBtn'),
    prev: document.getElementById('prevBtn'),
    next: document.getElementById('nextBtn'),
    last: document.getElementById('lastBtn'),
    status: document.getElementById('carouselStatus'),
    slideList: document.getElementById('slideList')
  };

  let slides = [];
  let index = 0;
  let touchStartX = null;

  function clamp(value) {
    if (!slides.length) return 0;
    return Math.max(0, Math.min(slides.length - 1, Number(value) || 0));
  }

  function setStatus(message, isError = false) {
    if (!els.status) return;
    els.status.textContent = message || '';
    els.status.classList.toggle('error', !!isError);
  }

  function normalizeSlide(slide, i) {
    const title = String(slide?.title || `Slide ${i + 1}`).trim();
    const image = String(slide?.image || '').trim();
    const text = String(slide?.text || '').trim();
    return { title, image, text };
  }

  function normalizeSlides(value) {
    const arr = Array.isArray(value) ? value : [];
    return arr.map(normalizeSlide).filter(slide => slide.title || slide.image || slide.text);
  }

  function updateButtons() {
    const atStart = index <= 0;
    const atEnd = index >= slides.length - 1;
    [els.first, els.prev].forEach(button => { if (button) button.disabled = atStart; });
    [els.next, els.last].forEach(button => { if (button) button.disabled = atEnd; });
    if (els.range) {
      els.range.max = String(Math.max(0, slides.length - 1));
      els.range.value = String(index);
      els.range.disabled = slides.length <= 1;
    }
  }

  function renderSlideList() {
    if (!els.slideList) return;
    els.slideList.replaceChildren();
    slides.forEach((slide, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = i === index ? 'active' : '';
      button.textContent = `${i + 1}. ${slide.title}`;
      button.addEventListener('click', () => show(i));
      els.slideList.appendChild(button);
    });
  }

  function show(i) {
    if (!slides.length) {
      els.title.textContent = 'Geen slides gevonden';
      els.text.textContent = 'Controleer carousel/slides.json en carousel/slides/.';
      els.counter.textContent = '0 / 0';
      setStatus('Geen slides gevonden.', true);
      updateButtons();
      return;
    }
    index = clamp(i);
    const slide = slides[index];
    els.image.hidden = !slide.image;
    if (slide.image) {
      els.image.src = `${slide.image}?${VERSION}`;
      els.image.alt = slide.title || 'JAN carousel slide';
    }
    els.title.textContent = slide.title || 'Slide';
    els.text.textContent = slide.text || '';
    els.counter.textContent = `${index + 1} / ${slides.length}`;
    updateButtons();
    renderSlideList();
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  async function loadSlides() {
    try {
      const response = await fetch(`slides.json?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`slides.json ${response.status}`);
      const parsed = normalizeSlides(await response.json());
      if (!parsed.length) throw new Error('slides.json bevat geen slides');
      setStatus(`Slides geladen uit slides.json · ${parsed.length} beelden`);
      return parsed;
    } catch (err) {
      const fallback = normalizeSlides(FALLBACK_SLIDES);
      setStatus(`slides.json niet geladen; fallback in carousel.js gebruikt. ${err.message}`, true);
      return fallback;
    }
  }

  function bindEvents() {
    els.first?.addEventListener('click', () => show(0));
    els.prev?.addEventListener('click', prev);
    els.next?.addEventListener('click', next);
    els.last?.addEventListener('click', () => show(slides.length - 1));
    els.range?.addEventListener('input', event => show(event.target.value));
    els.image?.addEventListener('error', () => {
      setStatus(`Afbeelding niet gevonden: ${slides[index]?.image || '—'}`, true);
      els.image.hidden = true;
      els.stage?.classList.add('image-error');
    });
    els.image?.addEventListener('load', () => {
      els.image.hidden = false;
      els.stage?.classList.remove('image-error');
    });
    window.addEventListener('keydown', event => {
      const key = event.key.toLowerCase();
      if (['arrowright', ' ', 'enter'].includes(key)) { event.preventDefault(); next(); }
      else if (['arrowleft', 'backspace'].includes(key)) { event.preventDefault(); prev(); }
      else if (key === 'home') show(0);
      else if (key === 'end') show(slides.length - 1);
    });
    els.stage?.addEventListener('touchstart', event => {
      touchStartX = event.changedTouches?.[0]?.clientX ?? null;
    }, { passive: true });
    els.stage?.addEventListener('touchend', event => {
      if (touchStartX === null) return;
      const dx = (event.changedTouches?.[0]?.clientX ?? touchStartX) - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 42) return;
      if (dx < 0) next(); else prev();
    }, { passive: true });
  }

  async function boot() {
    if (!els.image || !els.title || !els.text || !els.counter) return;
    slides = await loadSlides();
    bindEvents();
    show(0);
  }

  boot().catch(err => {
    els.title.textContent = 'Carousel kon niet laden';
    els.text.textContent = err.message;
    setStatus(err.message, true);
  });
})();
