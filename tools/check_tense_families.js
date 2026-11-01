'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const viewer = fs.readFileSync(path.resolve(__dirname, '..', 'viewer.js'), 'utf8');
const index = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
const viewerHtml = fs.readFileSync(path.resolve(__dirname, '..', 'viewer.html'), 'utf8');
const kernelEngine = require(path.resolve(__dirname, '..', 'utterance-kernel-engine.js'));
const compositionEngine = require(path.resolve(__dirname, '..', 'multi-ogn-composition-engine.js'));

function extractFunction(name) {
  const start = viewer.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `functie ontbreekt: ${name}`);
  const brace = viewer.indexOf('{', start);
  let depth = 0, quote = '', escaped = false;
  for (let index = brace; index < viewer.length; index += 1) {
    const char = viewer[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (`'\"\``.includes(char)) quote = char;
    else if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) return viewer.slice(start, index + 1);
  }
  assert.fail(`functie niet volledig: ${name}`);
}

const constantsStart = viewer.indexOf('const TENSE_OPTIONS');
const constantsEnd = viewer.indexOf('\n\n  function normalizeLanguage', constantsStart);
assert.ok(constantsStart > 0 && constantsEnd > constantsStart, 'tijdsvormconstanten ontbreken');

const source = [
  viewer.slice(constantsStart, constantsEnd),
  extractFunction('activeTenseFamilyId'),
  extractFunction('tenseIdFromUtteranceVariant'),
  extractFunction('activeTenseId'),
  extractFunction('subordinateVclusterInput'),
  extractFunction('applyTenseToSimpleLexItems'),
  extractFunction('activeSurfaceSourceItems'),
  extractFunction('sourceLabelFallback'),
  extractFunction('vclusterLeafSourcesFromSyntax'),
  extractFunction('surfaceSyntaxSpec'),
  extractFunction('activeLexItems'),
  extractFunction('languageTreeVclusterActive'),
  `globalThis.api = { applyTenseToSimpleLexItems, surfaceSyntaxSpec, activeLexItems, languageTreeVclusterActive };`
].join('\n');

const state = { example: null, tenseByFamily: {}, languageTreeVclusterFlipped: false };
const context = {
  state,
  multiOgnAnaphorActive: () => false,
  activeUtteranceDefinition: () => null,
  sentenceTypeForExample: example => example?.sentenceType || state.example?.sentenceType || 'main-declarative',
  EXAMPLES: [],
  STRUCTURE_CONFIG: { syntaxNodes: [], syntaxRoot: '' },
  nodeConfigToTree: () => ({ id: 'empty', label: 'EMPTY', children: [] }),
  baseActiveLexItems: () => context.api.applyTenseToSimpleLexItems(state.example.lexItems.map(item => ({ ...item })))
};
vm.runInNewContext(source, context);

function setExample(tenseFamily, sentenceType, lexItems, tense) {
  state.example = { tenseFamily, defaultTense: 'ott', sentenceType, lexRule: sentenceType.startsWith('subordinate-') ? 'bijzin-omdat' : 'hoofdzininvariant', lexItems };
  state.tenseByFamily[tenseFamily] = tense;
  state.languageTreeVclusterFlipped = false;
}

const transitive = [
  { id: 's', label: 'HOND', source: 'subject', role: 'subject', thematicRole: 'agens' },
  { id: 'v', label: 'BIJT', source: 'predicate', role: 'predicate' },
  { id: 'o', label: 'MAN', source: 'object', role: 'object', thematicRole: 'patiens' }
];
setExample('bijten', 'main-declarative', transitive, 'vtt');
assert.deepEqual(Array.from(context.api.activeLexItems(), item => `${item.source}:${item.label}`), ['subject:HOND', 'pv:HEEFT', 'object:MAN', 'vdw:GEBETEN']);
assert.deepEqual(Array.from(context.api.surfaceSyntaxSpec().children[1].children[1].children, item => item.id), ['aux', 'vdw-phrase']);

setExample('bijten', 'subordinate-omdat', [{ id: 'c', label: 'OMDAT', slot: 'comp' }, ...transitive], 'vvt');
assert.equal(context.api.languageTreeVclusterActive(), true);
assert.deepEqual(Array.from(context.api.activeLexItems(), item => item.label), ['OMDAT', 'HOND', 'MAN', 'HAD', 'GEBETEN']);
state.languageTreeVclusterFlipped = true;
assert.deepEqual(Array.from(context.api.activeLexItems(), item => item.label), ['OMDAT', 'HOND', 'MAN', 'GEBETEN', 'HAD']);
assert.deepEqual(Array.from(context.api.surfaceSyntaxSpec().children[1].children[1].children, item => item.id), ['vdw-phrase', 'aux']);

setExample('vallen', 'main-declarative', [
  { id: 's', label: 'HOND', source: 'subject', role: 'subject', thematicRole: 'thema' },
  { id: 'v', label: 'VALT', source: 'predicate', role: 'predicate' }
], 'vtt');
assert.deepEqual(Array.from(context.api.activeLexItems(), item => `${item.source}:${item.label}`), ['subject:HOND', 'pv:IS', 'vdw:GEVALLEN']);

setExample('ontroeren', 'main-declarative', [
  { id:'s', label:'DE MUZIEK', source:'subject', role:'subject', thematicRole:'stimulus' },
  { id:'v', label:'ONTROERT', source:'predicate', role:'predicate' },
  { id:'o', label:'ANNA', source:'object', role:'object', thematicRole:'experiencer' }
], 'vtt');
assert.deepEqual(Array.from(context.api.activeLexItems(), item => item.label), ['DE MUZIEK','HEEFT','ANNA','ONTROERD']);

const storyId='story-jan-sloeg-jek-waarna-hij-hem-ontweek';
const originalStory=kernelEngine.composeUtterance(storyId,compositionEngine);
assert.equal(originalStory.surfaceText,'JAN SLOEG JEK OMDAT DIE HEM BEET WAARNA HIJ HEM ONTWEEK');
const perfectStory=kernelEngine.composeUtterance(storyId,compositionEngine,'die','','het-bot','vtt');
assert.equal(perfectStory.surfaceText,'JAN HEEFT JEK GESLAGEN OMDAT DIE HEM HEEFT GEBETEN WAARNA HIJ HEM HEEFT ONTWEKEN');
assert.deepEqual(perfectStory.units.map(unit=>unit.layout.nodes.filter(node=>node.label==='V-CLUSTER').length),[1,1,1]);

for (const label of ['OTT — onvoltooid tegenwoordige tijd', 'OVT — onvoltooid verleden tijd', 'VTT — voltooid tegenwoordige tijd', 'VVT — voltooid verleden tijd']) {
  assert.ok(viewer.includes(label), `Nederlandse knopnaam ontbreekt: ${label}`);
}
for (const tense of ['ott', 'ovt', 'vtt', 'vvt']) {
  for (const [name, html] of [['index.html', index], ['viewer.html', viewerHtml]]) {
    assert.ok(html.includes(`data-main-tense-choice="${tense}"`), `${name}: zichtbare ${tense.toUpperCase()}-keuzeknop ontbreekt`);
  }
}
for (const [name, html] of [['index.html', index], ['viewer.html', viewerHtml]]) {
  const menu = html.indexOf('id="mainTenseChoice"');
  const topMenu = html.indexOf('class="main-top-menu"');
  const inputBar = html.indexOf('id="mainActiveUtterance"');
  assert.ok(menu > topMenu && menu < inputBar, `${name}: tijdskeuze staat niet in het vaste topmenu`);
  assert.ok(html.includes('id="mainTenseSummary"'), `${name}: zichtbare samenvatting Varianten ontbreekt`);
  assert.ok(html.includes('>Varianten</summary>'), `${name}: Varianten blijft niet zichtbaar in het hoofdmenu`);
  assert.ok(html.includes('id="mainVclusterFlipNote"'), `${name}: V-cluster Flip-markering ontbreekt`);
}
assert.ok(viewer.includes("button.addEventListener('click', () => updateActiveTense"), 'tijdsvormknoppen zijn niet functioneel gekoppeld');
assert.ok(viewer.includes('const inputText = multiOgnAnaphorActive() ? analysisEnvelope(inputSource).originalInput : activeSentenceText();'), 'actieve tijdsvorm verschijnt niet als input');
console.log('TIJDSFAMILIES CHECK: OK (ontroeren; HEBBEN en ZIJN; K1→K2/K3-synchronisatie; V-clusterbomen; VVT-flip)');

assert.ok(source.includes('function baseSingleKernelItemIds()'), 'basislijst per kernzin ontbreekt');
assert.ok(source.includes("return meta.completion === 'AF' ? 'Anders · Complex' : 'Anders · Onaf';"), 'Anders-groepering op kernzintelling/completion ontbreekt');
assert.ok(source.includes('function sentenceFormVariantsFor(id)'), 'zinsvormvarianten ontbreken');
assert.ok(source.includes('function renderSentenceFormVariants()'), 'Varianten-menu toont zinsvormen niet');
