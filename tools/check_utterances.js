'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const corpus = JSON.parse(fs.readFileSync(path.join(root, 'samples', 'uitingen-kernzinnen.v1.json'), 'utf8'));
const input = fs.readFileSync(path.join(root, 'examples-input.html'), 'utf8');
const editor = fs.readFileSync(path.join(root, 'examples-editor.html'), 'utf8');
const viewer = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const lexicon = fs.readFileSync(path.join(root, 'lexicon-config.html'), 'utf8');
const spec = fs.readFileSync(path.join(root, 'projectie-master-spec.md'), 'utf8');

assert.equal(corpus.schema, 'ogn-utterance-corpus-v1');
assert.equal(corpus.utterances.length, 5);
assert.deepEqual(corpus.utterances.map(item => item.id), [
  'jan-wast-zichzelf',
  'jan-slaat-jek-omdat-die-hem-beet',
  'jan-slaat-de-hond-omdat-die-hem-gebeten-heeft',
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

assert.equal(corpus.utterances[4].implicit_subject, 'U');
assert.deepEqual(corpus.utterances[4].lex, ['KEN', 'UZELF']);
assert.ok(input.includes('data-implicit-subject="U"'));
assert.ok(viewer.includes('card.dataset.implicitSubject'));
assert.ok(viewer.includes('utterance_kernels'));
assert.ok(viewer.includes('utterance_relations'));
assert.ok(editor.includes('utteranceKernels'));
assert.ok(editor.includes('utteranceRelations'));
assert.ok(spec.includes('UITING_EN_KERNZINNEN.md'));
assert.ok(viewer.includes('drawUtteranceKernelComposition'));
assert.ok(viewer.includes('buildUtteranceKernelOpnDocument'));
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

const perfect = corpus.utterances[2];
assert.deepEqual(perfect.predicate_variants, ['beet', 'heeft gebeten', 'gebeten heeft']);
const reward = corpus.utterances[3];
assert.equal(reward.predicate_variants.length, 6);
assert.deepEqual(reward.object_variants.map(item => item.id), ['het-bot', 'zijn-bot']);
assert.ok(reward.object_variants.find(item => item.id === 'zijn-bot').todo.includes('Jan of Jek'));
assert.ok(reward.relations.some(relation => relation.type === 'ambiguity-todo'));

console.log('UITINGEN CHECK: OK (5 uitingen, 10 kernzinnen, anafoor-, werkwoord- en botvarianten, ambiguïteit-TODO, rol-flip en impliciete agens)');
