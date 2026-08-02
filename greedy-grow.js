(function greedyGrowLab() {
  'use strict';

  const engine = globalThis.OGNGreedyGrow;
  if (!engine) throw new Error('greedy-grow-engine.js ontbreekt');

  const elements = {
    strategy: document.getElementById('greedyStrategySelect'),
    target: document.getElementById('greedyTargetInput'),
    interval: document.getElementById('greedyIntervalInput'),
    showPath: document.getElementById('greedyShowPathInput'),
    previous: document.getElementById('greedyPreviousButton'),
    next: document.getElementById('greedyNextButton'),
    play: document.getElementById('greedyPlayButton'),
    reset: document.getElementById('greedyResetButton'),
    download: document.getElementById('greedyDownloadButton'),
    strategyDescription: document.getElementById('greedyStrategyDescription'),
    status: document.getElementById('greedyStatus'),
    metrics: document.getElementById('greedyMetrics'),
    eventLog: document.getElementById('greedyEventLog'),
    svg: document.getElementById('greedyCanvas')
  };

  let state;
  let timer = null;

  function svgElement(name, attributes = {}) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    return node;
  }

  function stop() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    elements.play.textContent = 'Play';
  }

  function newState() {
    stop();
    state = engine.createState({
      strategy: elements.strategy.value,
      targetCount: elements.target.value,
      intervalMs: elements.interval.value
    });
    render('Startknoop direct geschreven op (0, 0).');
  }

  function syncEditableSettings() {
    const target = Math.max(state.points.length, Math.min(500, Number(elements.target.value) || 31));
    elements.target.value = String(target);
    state.targetCount = target;
    state.intervalMs = Math.max(80, Math.min(10000, Number(elements.interval.value) || 700));
    elements.interval.value = String(state.intervalMs);
  }

  function writeNext() {
    syncEditableSettings();
    const placed = engine.placeNext(state);
    if (!placed) {
      stop();
      render(`Doelaantal ${state.targetCount} bereikt.`);
      return;
    }
    render(`Knoop ${placed.index} direct geschreven op (${placed.x}, ${placed.y}) na ${placed.attempts} kandidaatproef${placed.attempts === 1 ? '' : 'en'}.`);
    if (state.points.length >= state.targetCount) stop();
  }

  function draw() {
    const cell = 46;
    const field = engine.bounds(state.points);
    const margin = 2;
    const minX = field.minX - margin;
    const maxX = field.maxX + margin;
    const minY = field.minY - margin;
    const maxY = field.maxY + margin;
    const width = Math.max(5, maxX - minX) * cell;
    const height = Math.max(5, maxY - minY) * cell;
    elements.svg.setAttribute('viewBox', `${minX * cell} ${minY * cell} ${width} ${height}`);
    elements.svg.replaceChildren();

    const grid = svgElement('g', { class: 'greedy-grid' });
    for (let x = minX; x <= maxX; x += 1) {
      grid.appendChild(svgElement('line', {
        x1: x * cell,
        y1: minY * cell,
        x2: x * cell,
        y2: maxY * cell,
        class: x === 0 ? 'greedy-axis' : ''
      }));
    }
    for (let y = minY; y <= maxY; y += 1) {
      grid.appendChild(svgElement('line', {
        x1: minX * cell,
        y1: y * cell,
        x2: maxX * cell,
        y2: y * cell,
        class: y === 0 ? 'greedy-axis' : ''
      }));
    }
    elements.svg.appendChild(grid);

    if (elements.showPath.checked && state.points.length > 1) {
      const path = state.points.map((candidate, index) => `${index ? 'L' : 'M'} ${candidate.x * cell} ${candidate.y * cell}`).join(' ');
      elements.svg.appendChild(svgElement('path', { d: path, class: 'greedy-path' }));
    }

    const nodes = svgElement('g', { class: 'greedy-nodes' });
    state.points.forEach((candidate, index) => {
      const group = svgElement('g', {
        class: index === state.points.length - 1 ? 'greedy-node is-current' : 'greedy-node',
        transform: `translate(${candidate.x * cell} ${candidate.y * cell})`
      });
      group.appendChild(svgElement('circle', { r: 13 }));
      const label = svgElement('text', { x: 0, y: 4, 'text-anchor': 'middle' });
      label.textContent = String(candidate.index);
      group.appendChild(label);
      nodes.appendChild(group);
    });
    elements.svg.appendChild(nodes);
  }

  function render(message) {
    const strategy = engine.STRATEGIES[state.strategy];
    const field = engine.bounds(state.points);
    elements.strategyDescription.textContent = strategy.descriptionNl;
    elements.status.textContent = message;
    elements.metrics.innerHTML = `
      <span><strong>${state.points.length}</strong> knopen</span>
      <span><strong>${state.usedX.size}</strong> bezette kolommen</span>
      <span><strong>${state.usedY.size}</strong> bezette rijen</span>
      <span><strong>${field.width} × ${field.height}</strong> omtrekkend veld</span>
      <span><strong>${field.perimeter}</strong> veldomtrek</span>
      <span><strong>${state.totalAttempts}</strong> kandidaatproeven</span>`;
    elements.eventLog.replaceChildren(...state.events.slice(-10).reverse().map(event => {
      const item = document.createElement('li');
      item.textContent = `stap ${event.step}: schrijf (${event.x}, ${event.y}) · ${event.attempts} proef${event.attempts === 1 ? '' : 'en'}`;
      return item;
    }));
    elements.previous.disabled = state.points.length <= 1;
    elements.next.disabled = state.points.length >= state.targetCount;
    elements.play.disabled = state.points.length >= state.targetCount;
    draw();
  }

  function downloadSnapshot() {
    const payload = JSON.stringify(engine.snapshot(state), null, 2);
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `greedy-grow-${state.strategy}-${state.points.length}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  Object.entries(engine.STRATEGIES).forEach(([id, strategy]) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = strategy.labelNl;
    elements.strategy.appendChild(option);
  });
  elements.strategy.value = 'compact-four-arm';
  elements.strategy.addEventListener('change', newState);
  elements.target.addEventListener('change', () => {
    syncEditableSettings();
    render(`Doelaantal ingesteld op ${state.targetCount}; bestaande knopen blijven staan.`);
  });
  elements.interval.addEventListener('change', () => {
    syncEditableSettings();
    if (timer !== null) {
      stop();
      elements.play.click();
    }
    render(`Speelinterval ingesteld op ${state.intervalMs} ms.`);
  });
  elements.showPath.addEventListener('change', () => render(elements.showPath.checked ? 'Groeipad zichtbaar.' : 'Groeipad verborgen.'));
  elements.previous.addEventListener('click', () => {
    stop();
    const removed = engine.undoLast(state);
    render(removed ? `Laatste schrijfhandeling ongedaan gemaakt: knoop ${removed.index}.` : 'Alleen de startknoop staat nog.')
  });
  elements.next.addEventListener('click', () => {
    stop();
    writeNext();
  });
  elements.play.addEventListener('click', () => {
    if (timer !== null) {
      stop();
      render('Play gepauzeerd.');
      return;
    }
    syncEditableSettings();
    elements.play.textContent = 'Pauze';
    writeNext();
    if (state.points.length < state.targetCount) timer = window.setInterval(writeNext, state.intervalMs);
  });
  elements.reset.addEventListener('click', newState);
  elements.download.addEventListener('click', downloadSnapshot);

  newState();
})();
