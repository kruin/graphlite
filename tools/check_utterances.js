'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const corpus = JSON.parse(fs.readFileSync(path.join(root, 'samples', 'uitingen-kernzinnen.v1.json'), 'utf8'));
const input = fs.readFileSync(path.join(root, 'examples-input.html'), 'utf8');
const editor = fs.readFileSync(path.join(root, 'examples-editor.html'), 'utf8');
const viewer = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const lexicon = fs.readFileSync(path.join(root, 'lexicon-config.html'), 'utf8');
const spec = fs.readFileSync(path.join(root, 'projectie-master-spec.md'), 'utf8');
const kernels = require(path.join(root, 'utterance-kernel-engine.js'));
const compositor = require(path.join(root, 'multi-ogn-composition-engine.js'));

assert.equal(corpus.schema, 'ogn-utterance-corpus-v1');
assert.equal(corpus.utterances.length, 4);
assert.deepEqual(corpus.utterances.map(item => item.id), [
  'jan-wast-zichzelf',
  'jan-slaat-jek-omdat-die-hem-beet',
  'jan-beloonde-jek-omdat-die-het-bot-terugbracht',
  'ken-uzelf'
]);

for (const item of corpus.utterances) {
  assert.ok(item.kernels.length >= 1, `${item.id}: geen kernzinnen`);
  assert.ok(item.relations.length >= 1, `${item.id}: geen verknoping`);
  assert.ok(input.includes(`data-id="${item.id}"`), `${item.id}: niet beschikbaar in viewer`);
  assert.ok(input.includes(`data-utterance-type="${item.type}"`), `${item.id}: type ontbreekt`);
  for (const word of item.lex) assert.ok(input.includes(`>${word}<`), `${item.id}: woord ${word} ontbreekt`);
}

assert.equal(corpus.utterances[3].implicit_subject, 'U');
assert.deepEqual(corpus.utterances[3].lex, ['KEN', 'UZELF']);
assert.ok(input.includes('data-implicit-subject="U"'));
assert.ok(viewer.includes('card.dataset.implicitSubject'));
assert.ok(viewer.includes('utterance_kernels'));
assert.ok(viewer.includes('utterance_relations'));
assert.ok(editor.includes('utteranceKernels'));
assert.ok(editor.includes('utteranceRelations'));
assert.ok(spec.includes('UITING_EN_KERNZINNEN.md'));
assert.ok(viewer.includes('drawUtteranceKernelComposition'));
assert.ok(viewer.includes('buildUtteranceKernelOgnDocument'));
assert.ok(fs.existsSync(path.join(root, 'utterance-kernel-engine.js')));
assert.ok(fs.existsSync(path.join(root, 'tools', 'check_utterance_kernel_views.js')));

for (const id of ['jan', 'jek', 'zichzelf', 'uzelf', 'die', 'hem', 'wast', 'slaat', 'ken']) {
  assert.ok(lexicon.includes(`data-id="${id}"`), `lexeem ontbreekt: ${id}`);
}

const flip = corpus.utterances[1];
assert.equal(flip.kernels[0].agens, flip.kernels[1].patiens);
assert.equal(flip.kernels[0].patiens, flip.kernels[1].agens);
assert.ok(flip.relations.some(relation => relation.type === 'cause'));
assert.ok(flip.relations.some(relation => relation.type === 'role-flip'));
assert.deepEqual(flip.anaphor_variants.map(variant => variant.id), ['hij', 'die', 'die-hond', 'de-hond', 'jek']);
assert.ok(flip.anaphor_variants.every(variant => variant.referent === 'jek' && variant.category === 'NP'));
assert.deepEqual(flip.anaphor_variants.find(variant => variant.id === 'die-hond').words, ['DIE', 'HOND']);
assert.deepEqual(flip.anaphor_variants.find(variant => variant.id === 'de-hond').words, ['DE', 'HOND']);
assert.deepEqual(flip.anaphor_variants.find(variant => variant.id === 'jek').words, ['JEK']);
assert.equal(flip.anaphor_variants.find(variant => variant.default).id, 'die');

assert.deepEqual(flip.predicate_variants, ['bijt', 'beet', 'heeft gebeten', 'gebeten heeft', 'had gebeten', 'gebeten had']);
const reward = corpus.utterances[2];
assert.equal(reward.predicate_variants.length, 9);
for (const [variant, fragment] of [
  ['terugbrengt', 'terugbrengt.'], ['terugbracht', 'terugbracht.'],
  ['heeft-teruggebracht', 'heeft teruggebracht.'], ['had-teruggebracht', 'had teruggebracht.']
]) {
  assert.ok(kernels.definitionFor(reward.id, 'die', variant, 'het-bot').title.endsWith(fragment), `${variant}: beloon-uiting niet gekoppeld`);
}
assert.deepEqual(reward.object_variants.map(item => item.id), ['het-bot', 'zijn-bot']);
assert.ok(reward.object_variants.find(item => item.id === 'zijn-bot').todo.includes('Jan of Jek'));
assert.ok(reward.relations.some(relation => relation.type === 'ambiguity-todo'));

assert.deepEqual(kernels.CAUSAL_VERB_VARIANTS.map(item => item.id), ['bijt', 'beet', 'heeft-gebeten', 'gebeten-heeft', 'had-gebeten', 'gebeten-had']);
assert.ok(!kernels.DEFINITIONS.some(item => item.id === 'jan-slaat-de-hond-omdat-die-hem-gebeten-heeft'));
for (const variant of ['heeft-gebeten', 'gebeten-heeft', 'had-gebeten', 'gebeten-had']) {
  const definition = kernels.definitionFor('jan-slaat-jek-omdat-die-hem-beet', 'die', variant);
  const layout = kernels.buildLayout(definition, 'lower');
  const cluster = layout.nodes.find(node => node.label === 'V-CLUSTER');
  assert.ok(cluster && cluster.role === 'predicate', `${variant}: syntactische V-CLUSTER ontbreekt`);
  const daughters = kernels.orderedVClusterDaughters(layout).map(node => node.label);
  assert.deepEqual(daughters, variant.startsWith('heeft-') ? ['HEEFT', 'GEBETEN'] : variant.startsWith('had-') ? ['HAD', 'GEBETEN'] : variant.endsWith('-heeft') ? ['GEBETEN', 'HEEFT'] : ['GEBETEN', 'HAD']);
  const composition = kernels.composeUtterance('jan-slaat-jek-omdat-die-hem-beet', compositor, 'die', variant);
  const projected = composition.lexItems
    .filter(item => item.vClusterDaughterNodeId)
    .map(item => item.label);
  assert.deepEqual(projected, daughters, `${variant}: LEX is niet uit de V-CLUSTER-subboom afgeleid`);
}
for (const marker of ['causal-vcluster-flip', 'function registerEvents()', 'const flipActiveVcluster = () =>', "'heeft-gebeten': 'gebeten-heeft'", "'gebeten-heeft': 'heeft-gebeten'"]) {
  assert.ok(viewer.includes(marker), `klikbare V-clusterflip ontbreekt: ${marker}`);
}
assert.ok(!viewer.includes('mainCausalVclusterFlipButton') && !indexHtml.includes('mainCausalVclusterFlipButton'), 'losse V-clusterknop naast de input mag niet bestaan');
assert.ok(!viewer.includes("beet: 'heeft-gebeten'") && !viewer.includes("bijt: 'heeft-gebeten'"), 'een enkelvoudig werkwoord mag niet kunstmatig een V-cluster worden');
for (const marker of [
  'function baseActiveLexItems()',
  'function vclusterLeafSourcesFromSyntax(node)',
  'vclusterLeafSourcesFromSyntax(surfaceSyntaxSpec())',
  'function subordinateVclusterInput()',
  "String(type).startsWith('subordinate-')",
  "String(item.slot || '').toLowerCase() === 'comp'",
  'function languageTreeVclusterActive()',
  '!subordinateVclusterInput()',
  'function flipLanguageTreeVcluster()',
  "state.languageTreeVclusterFlipped = !state.languageTreeVclusterFlipped",
  "data-node-config', 'language-tree-vcluster-flip'",
  "event.target?.closest?.('[data-action]')",
  "action === 'language-tree-vcluster-flip'",
  "const clusterPhraseBySource = new Map([['pv', aux], ['vdw', participle]])",
  "items\n        .map(item => clusterPhraseBySource.get(String(item.source || '')))",
  'if (state.languageTreeVclusterFlipped) clusterChildren.reverse()'
]) {
  assert.ok(viewer.includes(marker), `bijzinsgebonden Language Tree V-clusterflip ontbreekt: ${marker}`);
}
assert.ok(viewer.includes("breien: Object.freeze({"), 'BREIEN-tijdsfamilie ontbreekt');
assert.ok(viewer.includes("vtt: Object.freeze({ aux: 'HEEFT', participle: 'GEBREID' })"), 'BREIEN-perfectumvorming ontbreekt');

console.log('UITINGEN CHECK: OK (4 uitingen, 8 kernzinnen; node-only V-clusterflip in bijzinnen; LEX afgeleid uit SYN-subboom)');
