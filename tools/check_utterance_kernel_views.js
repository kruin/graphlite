'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const compositionEngine = require(path.join(root, 'multi-ogn-composition-engine.js'));
const kernelEngine = require(path.join(root, 'utterance-kernel-engine.js'));
const browserRuntime = fs.readFileSync(path.join(root, 'tools', 'check_multi_ogn_anaphor_runtime.js'), 'utf8');

function extract(start, next) {
  const begin = source.indexOf(`  function ${start}`);
  const end = source.indexOf(`\n  function ${next}`, begin);
  assert.ok(begin >= 0 && end > begin, `Viewerfunctie ontbreekt: ${start}`);
  return source.slice(begin, end);
}

class FakeElement {
  constructor(tag, attributes = {}, content = '') {
    this.tagName = tag;
    this.attributes = {};
    this.children = [];
    this.parentElement = null;
    this.listeners = new Map();
    this.pointerCaptures = [];
    this.textContent = String(content);
    for (const [key, value] of Object.entries(attributes)) this.setAttribute(key, value);
    this.classList = {
      add: (...names) => this.setAttribute('class', [...new Set([...this.classes(), ...names])].join(' ')),
      contains: name => this.classes().includes(name)
    };
  }

  classes() { return String(this.attributes.class || '').split(/\s+/).filter(Boolean); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  appendChild(element) { element.parentElement = this; this.children.push(element); return element; }
  addEventListener(type, listener, options = false) {
    const list = this.listeners.get(type) || [];
    list.push({ listener, capture: options === true || options?.capture === true });
    this.listeners.set(type, list);
  }
  setPointerCapture(pointerId) { this.pointerCaptures.push(pointerId); }
  closest(selector) {
    const parts = selector.split(',').map(part => part.trim());
    for (let element = this; element; element = element.parentElement) {
      for (const part of parts) {
        const match = part.match(/^\[([^=\]]+)(?:="([^"]+)")?\]$/);
        if (match && element.getAttribute(match[1]) !== null
            && (match[2] === undefined || element.getAttribute(match[1]) === match[2])) return element;
      }
    }
    return null;
  }
  dispatch(type, target, extra = {}) {
    const event = {
      type, target, button: 0, pointerId: 41, clientX: 40, clientY: 40,
      defaultPrevented: false, stopped: false,
      preventDefault() { this.defaultPrevented = true; },
      stopPropagation() { this.stopped = true; },
      ...extra
    };
    const list = this.listeners.get(type) || [];
    for (const entry of [...list.filter(item => item.capture), ...list.filter(item => !item.capture)]) {
      if (event.stopped) break;
      entry.listener(event);
    }
    return event;
  }

  querySelectorAll(selector) {
    const match = selector.match(/^\[data-node-id="([^"]+)"\]$/);
    assert.ok(match, `Onverwachte selector in renderer: ${selector}`);
    return descendants(this).filter(element => element.getAttribute('data-node-id') === match[1]);
  }
}

function descendants(element) {
  return element.children.flatMap(child => [child, ...descendants(child)]);
}

function assertDiagonalFreeNodeEdges(rootElement, context) {
  const elements = descendants(rootElement);
  const edges = elements.filter(element => element.classList.contains('utterance-free-node-edge'));
  assert.equal(edges.length, 8, `${context}: twee kernzinnen vereisen acht free-node-takken`);
  const nodes = new Map(elements
    .filter(element => element.tagName === 'circle' && element.getAttribute('data-node-id') !== null)
    .map(element => [element.getAttribute('data-node-id'), element]));
  for (const edge of edges) {
    const x1 = Number(edge.getAttribute('x1'));
    const y1 = Number(edge.getAttribute('y1'));
    const x2 = Number(edge.getAttribute('x2'));
    const y2 = Number(edge.getAttribute('y2'));
    assert.ok(Math.abs(x2 - x1) > 0.01, `${context}: free-node-tak mag niet verticaal zijn`);
    assert.ok(Math.abs(y2 - y1) > 0.01, `${context}: free-node-tak mag niet horizontaal zijn`);
    const from = nodes.get(edge.getAttribute('data-from-node-id'));
    const to = nodes.get(edge.getAttribute('data-to-node-id'));
    assert.ok(from && to, `${context}: tak moet twee bestaande vrije knopen verbinden`);
    const nodeDx = Number(to.getAttribute('cx')) - Number(from.getAttribute('cx'));
    const nodeDy = Number(to.getAttribute('cy')) - Number(from.getAttribute('cy'));
    const cross = (x2 - x1) * nodeDy - (y2 - y1) * nodeDx;
    assert.ok(Math.abs(cross) < 0.001, `${context}: tak volgt niet de schuine lijn tussen vrije knopen`);
    assert.equal(edge.getAttribute('data-free-node-edge'), 'slanted');
  }
}

let currentComposition = null;
const state = {
  showRelations: true, showGrid: true, showLabels: true, language: 'nl',
  layoutDensity: 'standard', viewFitMode: 'fit', paradataEvents: [],
  multiOgnPlayEnabled: false, multiOgnPlayStep: 4,
  kernelBranchHorizontal: 'compact', kernelBranchVertical: 'compact', kernelBranchFlip: 'auto',
  gridSizeHorizontal: '100', gridSizeVertical: '100',
  canvasPanEnabled: true, activePointers: new Map(), viewClickSuppressed: false,
  paradataSessionId: 'test', paradataStartedAt: '2026-08-24T00:00:00.000Z'
};
const els = { svg: new FakeElement('svg') };
const EXAMPLES = kernelEngine.DEFINITIONS.map(definition => ({
  id: definition.id, utteranceKernels: [definition.upper.text, definition.lower.text],
  utteranceRelations: definition.relations
}));
const OPN_DOCUMENT_TYPE = 'opengraph-document';
const OPN_FORMAT_VERSION = '1.0';
const VERSION = 'v2.0.0-rc.45';
globalThis.OGNMultiComposition = compositionEngine;
globalThis.OGNUtteranceKernels = kernelEngine;

function multiOgnAnaphorComposition() { return currentComposition; }
function multiOgnAnaphorActive() { return true; }
function svgEl(tag, attributes = {}, content = '') { return new FakeElement(tag, attributes, content); }
function baseSvg(classes) { els.svg.children = []; return svgEl('g', { class: classes }); }
function validGridSize(value) { return ['60', '80', '100', '125', '150', '200'].includes(String(value)) ? String(value) : '100'; }
function gridSizeScale(value) { return Number(validGridSize(value)) / 100; }
function cellX() { return 80 * gridSizeScale(state.gridSizeHorizontal); }
function cellY() { return 55 * gridSizeScale(state.gridSizeVertical); }
function px(value, origin) { return origin.x + value * cellX(); }
function py(value, origin) { return origin.y + value * cellY(); }
function validKernelBranchSpacing(value) { return ['compact', 'normal', 'wide'].includes(value) ? value : 'compact'; }
function kernelBranchScale(value) { return ({ compact: 0.68, normal: 1, wide: 1.34 })[validKernelBranchSpacing(value)]; }
function validKernelBranchFlip(value) { return value === 'flip' ? 'flip' : 'auto'; }
function treeNodeRenderMetrics() { return { leafRadius: 12 }; }
function isEnglish() { return false; }
function drawAxisTitle(group, x, y, title) { group.appendChild(svgEl('text', { x, y }, title)); }
function drawCanvasGuideText(group, x, y, title, classes = '') {
  group.appendChild(svgEl('text', { x, y, class: classes }, title));
}
function drawTreeEdges(group, layout) {
  layout.edges.forEach(edge => group.appendChild(svgEl('line', {
    'data-from': edge.from, 'data-to': edge.to
  })));
}
function drawTreeNodes(group, layout, origin) {
  layout.nodes.forEach(node => group.appendChild(svgEl('circle', {
    'data-node-id': node.id, cx: px(node.x, origin), cy: py(node.y, origin)
  })));
}
function ensureDocumentMetadata() { return { language: 'nl' }; }
function jsonClone(value, fallback) { return value == null ? fallback : JSON.parse(JSON.stringify(value)); }
function serializeLayoutGraph(layout) { return jsonClone(layout, {}); }

// Execute the actual shipped SVG renderer and OPN writer, not a parallel mock.
const applyMultiOgnPlaybackVisibility = eval(`(${extract('applyMultiOgnPlaybackVisibility(', 'drawMultiOgnAnaphor()')})`);
const drawUtteranceKernelComposition = eval(`(${extract('drawUtteranceKernelComposition()', 'drawDirectPlacement()')})`);
const buildUtteranceKernelOpnDocument = eval(`(${extract('buildUtteranceKernelOpnDocument(', 'buildMultiOgnOpnDocument(')})`);
const validateImportedUtteranceComposition = eval(`(${extract('validateImportedUtteranceComposition(', 'validateImportedMultiOgnComposition(')})`);

for (const definition of kernelEngine.DEFINITIONS) {
  currentComposition = kernelEngine.composeUtterance(definition.id, compositionEngine);
  assert.equal(currentComposition.units.length, 2, `${definition.id}: geen twee kernzinnen`);
  assert.deepEqual(currentComposition.units.map(unit => unit.id), ['K1', 'K2']);
  assert.ok(currentComposition.units.every(unit => compositionEngine.validateUnit(unit.layout)));
  for (const unit of currentComposition.units) {
    const rootNode = unit.layout.nodes.find(node => node.label === 'S');
    const vpNode = unit.layout.nodes.find(node => node.label === 'VP');
    const subject = unit.layout.nodes.find(node => node.role === 'subject');
    const object = unit.layout.nodes.find(node => node.role === 'object');
    const predicate = unit.layout.nodes.find(node => node.role === 'predicate');
    assert.deepEqual(unit.layout.edges.filter(edge => edge.from === rootNode.id).map(edge => edge.to),
      [subject.id, vpNode.id], `${definition.id}/${unit.id}: S moet NP, VP zijn`);
    assert.deepEqual(unit.layout.edges.filter(edge => edge.from === vpNode.id).map(edge => edge.to),
      [object.id, predicate.id], `${definition.id}/${unit.id}: VP moet NP, V zijn`);
    assert.ok(object.y < predicate.y, `${definition.id}/${unit.id}: NP moet vóór V staan`);
    assert.ok((subject.x - rootNode.x) * (vpNode.x - rootNode.x) < 0,
      `${definition.id}/${unit.id}: S moet visueel links/rechts vertakken`);
    assert.ok((object.x - vpNode.x) * (predicate.x - vpNode.x) < 0,
      `${definition.id}/${unit.id}: VP moet visueel links/rechts vertakken`);
  }
  assert.deepEqual(compositionEngine.sharedCoordinates(
    currentComposition.units[0].layout, currentComposition.units[1].layout, 'y'
  ), [], `${definition.id}: kernzinnen delen een rij`);
  assert.equal(compositionEngine.sharedCoordinates(
    currentComposition.units[0].layout, currentComposition.units[1].layout, 'x'
  ).length, definition.relations.length);

  drawUtteranceKernelComposition();
  assert.equal(els.svg.children[0].getAttribute('data-branch-horizontal'), 'compact');
  assert.equal(els.svg.children[0].getAttribute('data-branch-vertical'), 'compact');
  assert.equal(els.svg.children[0].getAttribute('data-branch-flip'), 'auto');
  assert.equal(els.svg.children[0].getAttribute('data-free-node-rendering'), 'slanted');
  assertDiagonalFreeNodeEdges(els.svg, `${definition.id}/compact`);
  const rendered = descendants(els.svg);
  const frames = rendered.filter(node => node.classList.contains('utterance-kernel-frame'));
  assert.deepEqual(frames.map(node => node.getAttribute('data-ogn-unit')), ['K1', 'K2']);
  assert.ok(Number(frames[1].getAttribute('y')) > Number(frames[0].getAttribute('y')));

  const lines = rendered.filter(node => node.classList.contains('utterance-coreference-line'));
  assert.equal(lines.length, definition.relations.length);
  for (const line of lines) {
    assert.equal(line.getAttribute('x1'), line.getAttribute('x2'), `${definition.id}: anafoor niet verticaal`);
    assert.ok(Number(line.getAttribute('y2')) > Number(line.getAttribute('y1')));
    assert.equal(line.getAttribute('marker-end'), null);
  }

  const slots = rendered.filter(node => node.getAttribute('data-surface-label') !== null);
  const expectedSurface = definition.surface.flatMap(item => item.words || [item.label]);
  assert.deepEqual(slots.map(node => node.getAttribute('data-surface-label')),
    expectedSurface, `${definition.id}: gerealiseerde LEX-volgorde onjuist`);
  assert.ok(slots.every((slot, index) => index === 0
    || Number(slot.getAttribute('y')) > Number(slots[index - 1].getAttribute('y'))),
  `${definition.id}: LEX-woorden staan niet van boven naar beneden in uitingvolgorde`);
  if (definition.type === 'causal-role-flip') {
    const connector = slots.find(node => node.getAttribute('data-surface-label') === 'OMDAT');
    assert.equal(connector.getAttribute('data-node-id'), '');
    assert.equal(currentComposition.relations.length, 2);
    assert.equal(currentComposition.relations[0].antecedentLabel, 'HOND');
    assert.equal(currentComposition.relations[0].anaphorLabel, 'HOND');
    assert.equal(currentComposition.relations[0].referent, 'jek');
    assert.equal(currentComposition.relations[1].antecedentLabel, 'JAN');
    assert.ok(currentComposition.relations[1].anaphorLabel.includes('MAN'));
    assert.equal(currentComposition.relations[1].referent, 'jan');
    assert.deepEqual(frames.map(frame => frame.getAttribute('data-branch-orientation')), ['normal', 'mirrored']);
  }
  if (definition.implicitSubject) {
    assert.equal(rendered.filter(node => node.getAttribute('data-implicit-subject') === 'true').length, 2);
    assert.deepEqual(slots.map(node => node.getAttribute('data-surface-label')), ['KEN', 'UZELF']);
  }

  const compactWidth = Number(frames[0].getAttribute('width'));
  const compactHeight = Number(frames[0].getAttribute('height'));
  state.kernelBranchHorizontal = 'wide';
  drawUtteranceKernelComposition();
  assertDiagonalFreeNodeEdges(els.svg, `${definition.id}/horizontaal-ruim`);
  let resizedFrame = descendants(els.svg).find(node => node.classList.contains('utterance-kernel-frame'));
  assert.ok(Number(resizedFrame.getAttribute('width')) > compactWidth,
    `${definition.id}: horizontale instelling maakt de boom niet breder`);
  assert.equal(Number(resizedFrame.getAttribute('height')), compactHeight,
    `${definition.id}: horizontale instelling mag de hoogte niet wijzigen`);
  state.kernelBranchHorizontal = 'compact';
  state.kernelBranchVertical = 'wide';
  drawUtteranceKernelComposition();
  assertDiagonalFreeNodeEdges(els.svg, `${definition.id}/verticaal-ruim`);
  resizedFrame = descendants(els.svg).find(node => node.classList.contains('utterance-kernel-frame'));
  assert.equal(Number(resizedFrame.getAttribute('width')), compactWidth,
    `${definition.id}: verticale instelling mag de breedte niet wijzigen`);
  assert.ok(Number(resizedFrame.getAttribute('height')) > compactHeight,
    `${definition.id}: verticale instelling maakt de boom niet hoger`);
  state.kernelBranchVertical = 'compact';

  state.gridSizeHorizontal = '150';
  drawUtteranceKernelComposition();
  assertDiagonalFreeNodeEdges(els.svg, `${definition.id}/raster-horizontaal-150`);
  resizedFrame = descendants(els.svg).find(node => node.classList.contains('utterance-kernel-frame'));
  assert.ok(Number(resizedFrame.getAttribute('width')) > compactWidth);
  assert.equal(Number(resizedFrame.getAttribute('height')), compactHeight);
  assert.equal(els.svg.children[0].getAttribute('data-grid-size-horizontal'), '150');
  state.gridSizeHorizontal = '100';
  state.gridSizeVertical = '150';
  drawUtteranceKernelComposition();
  assertDiagonalFreeNodeEdges(els.svg, `${definition.id}/raster-verticaal-150`);
  resizedFrame = descendants(els.svg).find(node => node.classList.contains('utterance-kernel-frame'));
  assert.equal(Number(resizedFrame.getAttribute('width')), compactWidth);
  assert.ok(Number(resizedFrame.getAttribute('height')) > compactHeight);
  assert.equal(els.svg.children[0].getAttribute('data-grid-size-vertical'), '150');
  state.gridSizeVertical = '100';

  state.kernelBranchFlip = 'flip';
  drawUtteranceKernelComposition();
  assertDiagonalFreeNodeEdges(els.svg, `${definition.id}/flip`);
  const flippedRoot = els.svg.children[0];
  assert.equal(flippedRoot.getAttribute('data-branch-flip'), 'flip');
  const flipped = descendants(els.svg);
  const flippedFrames = flipped.filter(node => node.classList.contains('utterance-kernel-frame'));
  assert.deepEqual(flippedFrames.map(frame => frame.getAttribute('data-branch-orientation')),
    frames.map(frame => frame.getAttribute('data-branch-orientation') === 'normal' ? 'mirrored' : 'normal'));
  assert.deepEqual(flipped.filter(node => node.getAttribute('data-surface-label') !== null)
    .map(node => node.getAttribute('data-surface-label')), expectedSurface,
  `${definition.id}: Flip mag de LEX-woordvolgorde niet veranderen`);
  for (const line of flipped.filter(node => node.classList.contains('utterance-coreference-line'))) {
    assert.equal(line.getAttribute('x1'), line.getAttribute('x2'),
      `${definition.id}: Flip mag een anafoor niet scheef maken`);
  }
  state.kernelBranchFlip = 'auto';

  // Play shows K1, K2 before Flip, the local Flip, rigid anaphor alignment, and LEX.
  state.multiOgnPlayEnabled = true;
  let k2BeforeFlipOrientation = null;
  for (let phase = 0; phase <= 5; phase += 1) {
    state.multiOgnPlayStep = phase;
    drawUtteranceKernelComposition();
    const playRoot = els.svg.children[0];
    assert.equal(playRoot.getAttribute('data-play-step'), String(phase));
    const playLayers = playRoot.children;
    const nodes = playLayers.find(layer => layer.classList.contains('multi-ogn-tree-node-layer'));
    assert.deepEqual(nodes.children.map(unit => unit.getAttribute('visibility')),
      [phase >= 1 ? 'visible' : 'hidden', phase >= 2 ? 'visible' : 'hidden']);
    const anaphors = playLayers.filter(layer => layer.classList.contains('multi-ogn-coreference'));
    assert.ok(anaphors.every(layer => layer.getAttribute('visibility') === (phase >= 4 ? 'visible' : 'hidden')));
    const lex = playLayers.find(layer => layer.classList.contains('multi-ogn-shared-lex'));
    assert.equal(lex.getAttribute('visibility'), phase >= 5 ? 'visible' : 'hidden');
    if (definition.type === 'causal-role-flip') {
      assert.equal(playRoot.getAttribute('data-local-flip-applied'), phase >= 3 ? 'true' : 'false');
      const k2Frame = descendants(playRoot).find(node => node.classList.contains('utterance-kernel-frame') && node.getAttribute('data-ogn-unit') === 'K2');
      if (phase === 2) k2BeforeFlipOrientation = k2Frame.getAttribute('data-branch-orientation');
      if (phase === 3) {
        assert.notEqual(k2Frame.getAttribute('data-branch-orientation'), k2BeforeFlipOrientation,
          `${definition.id}: Play moet de lokale K2-Flip zichtbaar maken`);
        const reveal = descendants(playRoot).find(node => node.classList.contains('utterance-flip-reveal-layer'));
        assert.ok(reveal, `${definition.id}: Flipstap mist gelijktijdige vóór/na-weergave`);
        assert.equal(reveal.getAttribute('data-play-operation'), 'flip-k2-left-right');
        assert.ok(descendants(reveal).some(node => node.classList.contains('utterance-flip-before-nodes')),
          `${definition.id}: transparante K2-vóór ontbreekt`);
        assert.ok(descendants(reveal).some(node => node.classList.contains('utterance-flip-motion')),
          `${definition.id}: zichtbare verplaatsingslijnen ontbreken`);
        assert.ok(descendants(reveal).some(node => node.classList.contains('utterance-flip-badge')),
          `${definition.id}: FLIP K2-label ontbreekt`);
      }
      if (phase !== 3) assert.ok(!descendants(playRoot).some(node => node.classList.contains('utterance-flip-reveal-layer')),
        `${definition.id}: vóór/na-overlay hoort uitsluitend bij PLAY-stap 3`);
    }
  }
  state.multiOgnPlayEnabled = false;
  state.multiOgnPlayStep = 5;

  const document = buildUtteranceKernelOpnDocument(currentComposition);
  assert.equal(document.data.composition.kind, 'utterance-kernel-pair');
  assert.equal(document.data.composition.units.length, 2);
  assert.equal(document.data.composition.relations.length, definition.relations.length);
  assert.equal(validateImportedUtteranceComposition(document.data.composition), true);
  assert.deepEqual(document.data.composition.shared_lex_axis.items.map(item => item.label),
    expectedSurface);
}

const causalId = 'jan-slaat-jek-omdat-die-hem-beet';
for (const variant of kernelEngine.CAUSAL_ANAPHOR_VARIANTS) {
  currentComposition = kernelEngine.composeUtterance(causalId, compositionEngine, variant.id);
  const definition = currentComposition.definition;
  assert.equal(definition.anaphorVariant, variant.id);
  assert.equal(definition.title, `Jan slaat Jek omdat ${variant.text} hem beet.`);
  assert.equal(currentComposition.units[1].layout.nodes.find(node => node.role === 'subject').label, 'HOND',
    'de kernzin houdt de standaardbronknoop; alleen LEX realiseert de variant');
  assert.deepEqual(currentComposition.relations.map(relation =>
    `${relation.antecedentLabel}↔${relation.anaphorLabel}`), ['HOND↔HOND', 'JAN↔MAN']);
  drawUtteranceKernelComposition();
  assertDiagonalFreeNodeEdges(els.svg, `causale-variant/${variant.id}`);
  assert.equal(els.svg.children[0].getAttribute('data-anaphor-variant'), variant.id);
  const rendered = descendants(els.svg);
  const configurableNodes = rendered.filter(node => node.getAttribute('data-node-config') === 'causal-subject');
  assert.ok(configurableNodes.length >= 1, `${variant.id}: subjectknoop moet rechtstreeks klikbaar zijn`);
  assert.ok(configurableNodes.every(node => node.getAttribute('data-node-config-value') === variant.id));
  assert.ok(configurableNodes.every(node => node.getAttribute('role') === 'button'));
  assert.deepEqual(rendered.filter(node => node.getAttribute('data-surface-label') !== null)
    .map(node => node.getAttribute('data-surface-label')),
  ['JAN', 'SLAAT', 'JEK', 'OMDAT', ...variant.words, 'HEM', 'BEET']);
  assert.ok(rendered.some(node => node.classList.contains('utterance-flip-explanation')),
    `${variant.id}: zichtbare uitleg waarom K2 flipt ontbreekt`);
  for (const line of rendered.filter(node => node.classList.contains('utterance-coreference-line'))) {
    assert.equal(line.getAttribute('x1'), line.getAttribute('x2'));
  }
  const document = buildUtteranceKernelOpnDocument(currentComposition);
  assert.equal(document.data.example.anaphor_variant, variant.id);
  assert.equal(document.data.example.anaphor_phrase, variant.label);
  assert.deepEqual(document.data.composition.shared_lex_axis.items.map(item => item.label),
    ['JAN', 'SLAAT', 'JEK', 'OMDAT', ...variant.words, 'HEM', 'BEET']);
  if (variant.phrase) {
    const phrase = document.data.composition.shared_lex_axis.items.filter(item => item.phrase === variant.label);
    assert.equal(phrase.length, 2);
    assert.equal(phrase[0].node_id, phrase[1].node_id,
      'DIE HOND moet één subject-NP met twee LEX-woorden zijn');
  }
}

// Exercise actual canvas pointer interception and the shipped node-click handler.
const registerCanvasPan = eval(`(${extract('registerCanvasPan()', 'cycleSouthLogicalMode(')})`);
const handlerStart = source.indexOf('    const activateConfigurableNode = event => {');
const handlerEnd = source.indexOf("\n    els.svg?.addEventListener('click', activateConfigurableNode);", handlerStart);
assert.ok(handlerStart >= 0 && handlerEnd > handlerStart);
function updateCausalAnaphorVariant(event) {
  state.causalAnaphorVariant = kernelEngine.validCausalAnaphorVariant(event.target.value);
  currentComposition = kernelEngine.composeUtterance(causalId, compositionEngine, state.causalAnaphorVariant);
  drawUtteranceKernelComposition();
}
const activateConfigurableNode = eval(`(${source.slice(handlerStart, handlerEnd)
  .replace('    const activateConfigurableNode = ', '').replace(/;\s*$/, '')})`);
state.causalAnaphorVariant = 'die';
currentComposition = kernelEngine.composeUtterance(causalId, compositionEngine, state.causalAnaphorVariant);
drawUtteranceKernelComposition();
registerCanvasPan();
els.svg.addEventListener('click', activateConfigurableNode);
els.svg.addEventListener('keydown', activateConfigurableNode);
let clickableNode = descendants(els.svg).find(node => node.getAttribute('data-node-config') === 'causal-subject');
assert.equal(clickableNode.getAttribute('data-action'), 'utterance-config-node');
const pointerDown = els.svg.dispatch('pointerdown', clickableNode);
assert.equal(pointerDown.defaultPrevented, false, 'canvas-pan mag de knoopklik niet onderscheppen');
assert.equal(els.svg.pointerCaptures.length, 0, 'canvas-pan mag de configureerbare knoop niet capturen');
const click = els.svg.dispatch('click', clickableNode);
assert.equal(click.defaultPrevented, true, 'knoopklik moet worden afgehandeld');
assert.equal(state.causalAnaphorVariant, 'die-hond', 'werkelijke klik moet DIE veranderen in DIE HOND');
assert.equal(els.svg.children[0].getAttribute('data-anaphor-variant'), 'die-hond');
clickableNode = descendants(els.svg).find(node => node.getAttribute('data-node-config') === 'causal-subject');
els.svg.dispatch('keydown', clickableNode, { key: 'Enter' });
assert.equal(state.causalAnaphorVariant, 'de-hond', 'Enter op de knoop moet naar DE HOND schakelen');

for (const file of ['index.html', 'viewer.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.ok(html.indexOf('multi-ogn-composition-engine.js') < html.indexOf('utterance-kernel-engine.js'));
  assert.ok(html.indexOf('utterance-kernel-engine.js') < html.indexOf('viewer.js'));
  assert.ok(html.includes('id="mainActiveUtteranceText"'), `${file}: vaste uiting bovenin ontbreekt`);
  assert.ok(html.indexOf('id="mainActiveUtteranceText"') < html.indexOf('class="main-play-reset-bar"'),
    `${file}: actieve uiting staat niet boven Play en werkvlak`);
  assert.ok(html.includes('id="treeLineWeightSelect"'), `${file}: boomlijninstelling ontbreekt`);
  assert.ok(html.includes('id="mainCausalAnaphorSelect"'), `${file}: directe anafoorkeuze ontbreekt`);
  assert.ok(html.includes('id="gridSizeHorizontalSelect"'), `${file}: horizontale rastermaat ontbreekt`);
  assert.ok(html.includes('id="gridSizeVerticalSelect"'), `${file}: verticale rastermaat ontbreekt`);
}

const stylesheet = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
assert.ok(!/body\.placement-multi-ogn-active\s+\.main-play-reset-bar\s*,/.test(stylesheet),
  'Play-balk wordt nog verborgen in Anafoor · multi-OGN');
assert.ok(source.includes('else if (multiOgnAnaphorActive()) toggleMultiOgnPlayback();'));
assert.ok(source.includes('id="multiTreeLineWeightSelect"'), 'Anafoor-config mist boomlijnen');
assert.ok(source.includes('id="multiTreeLayoutDensitySelect"'), 'Anafoor-config mist boomruimte');
assert.ok(source.includes('id="multiTreeBranchHorizontalSelect"'), 'Anafoor-config mist horizontale vertakking');
assert.ok(source.includes('id="multiTreeBranchVerticalSelect"'), 'Anafoor-config mist verticale vertakking');
assert.ok(source.includes('id="multiTreeBranchFlipSelect"'), 'Anafoor-config mist links/rechts-Flip');
assert.ok(source.includes('id="multiCausalAnaphorSelect"'), 'Anafoor-config mist flexibele subjectkeuze');
assert.ok(source.includes('id="multiGridSizeHorizontalSelect"'));
assert.ok(source.includes('id="multiGridSizeVerticalSelect"'));
assert.ok(source.includes("data-node-config', 'causal-subject'"));
assert.ok(source.includes("els.svg?.addEventListener('click', activateConfigurableNode)"));
assert.ok(source.includes("element.setAttribute('data-action', 'utterance-config-node')"));
assert.ok(source.includes("input,select,button,a,label,[data-action],[data-node-config]"));
assert.ok(stylesheet.includes('pointer-events:auto !important'));
assert.ok(source.includes('layoutVisualProfile().cellX * gridSizeScale(state.gridSizeHorizontal)'));
assert.ok(source.includes('layoutVisualProfile().cellY * gridSizeScale(state.gridSizeVertical)'));
assert.ok(source.includes('<strong>Waar?</strong>'), 'Interface mist uitleg waar Flip optreedt');
assert.ok(source.includes('<strong>Wanneer?</strong>'), 'Interface mist uitleg wanneer Flip nodig is');
assert.ok(source.includes('<strong>Waarom?</strong>'), 'Interface mist uitleg waarom Flip nodig is');
assert.ok(source.includes('payload?.data?.example?.anaphor_variant'), 'OPN-import herstelt de anafoorvariant niet');
assert.ok(stylesheet.includes('stroke-width:var(--og-tree-line-width,3.55) !important'));
assert.ok(stylesheet.includes('#graphSvg .utterance-kernel-view .node-main-label'),
  'Compacte free-node-weergave mist aangepaste knooplabels');
assert.ok(browserRuntime.includes("await page.click('#mainViewSummary');"),
  'Browsertest moet het hoofdmenu openen voordat de modusknop zichtbaar is');
assert.ok(browserRuntime.includes("'#mainViewMenu[open] [data-placement-mode=\"multi-ogn-anaphor\"]'"),
  'Browsertest moet de zichtbare modusknop binnen het geopende menu selecteren');
assert.ok(browserRuntime.includes("':scope > .node-shape-layer > .node-shape[data-node-id]'"),
  'Browsertest moet knopen binnen de actuele vormlaag zoeken');
assert.ok(browserRuntime.includes("await page.click('[data-config-scope-button=\"general\"]')"),
  'Browsertest moet voor OPN-export eerst de algemene Config openen');
assert.ok(browserRuntime.includes("await page.click('[data-config-tab-button=\"files\"]')"),
  'Browsertest moet voor OPN-export de zichtbare Bestanden-tab openen');
assert.ok(browserRuntime.includes("await readDownload(page, '#configDownloadOpnButton')"),
  'Browsertest moet de zichtbare OPN-knop in Config gebruiken');
assert.ok(browserRuntime.includes("path.resolve(os.tmpdir(), 'opengraph-runtime-checks'"),
  'Browsertest mag geen screenshot in de Git-projectmap achterlaten');
const defaults = JSON.parse(fs.readFileSync(path.join(root, 'config', 'default-config.json'), 'utf8')).config;
assert.equal(defaults.treeLineColor, 'blue');
assert.equal(defaults.treeLineWeight, 'strong');
assert.equal(defaults.gridSizeHorizontal, '100');
assert.equal(defaults.gridSizeVertical, '100');
assert.equal(defaults.kernelBranchHorizontal, 'compact');
assert.equal(defaults.kernelBranchVertical, 'compact');
assert.equal(defaults.kernelBranchFlip, 'auto');
assert.equal(defaults.causalAnaphorVariant, 'die');

console.log('UITING KERNZIN VIEW CHECK: OK (5 uitingen, schuine free-node-takken, zichtbare K2-Flipstap, varianten, verticale anaforen, gedetailleerde Play en OPN)');
