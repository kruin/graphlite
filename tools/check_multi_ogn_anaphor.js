'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const engine = require('../multi-ogn-composition-engine.js');
const lexicalizer = require('../anaphor-lexicalization-engine.js');
const combinations = require('../anaphor-combinations-engine.js');

const root = path.resolve(__dirname, '..');

function layout(prefix, subject, verb, object) {
  return {
    node: { id: `${prefix}-s`, label: 'S' },
    nodes: [
      { id: `${prefix}-s`, label: 'S', kind: 'cat', x: 0, y: 0 },
      { id: `${prefix}-${subject}`, label: subject.toUpperCase(), kind: 'leaf', x: -1, y: 1 },
      { id: `${prefix}-vp`, label: 'VP', kind: 'cat', x: 2, y: 2 },
      { id: `${prefix}-${verb}`, label: verb.toUpperCase(), kind: 'leaf', x: 1, y: 3 },
      { id: `${prefix}-${object}`, label: object.toUpperCase(), kind: 'leaf', x: 3, y: 4 }
    ],
    edges: [
      { from: `${prefix}-s`, to: `${prefix}-${subject}`, fromX: 0, fromY: 0, toX: -1, toY: 1 },
      { from: `${prefix}-s`, to: `${prefix}-vp`, fromX: 0, fromY: 0, toX: 2, toY: 2 },
      { from: `${prefix}-vp`, to: `${prefix}-${verb}`, fromX: 2, fromY: 2, toX: 1, toY: 3 },
      { from: `${prefix}-vp`, to: `${prefix}-${object}`, fromX: 2, fromY: 2, toX: 3, toY: 4 }
    ],
    boxes: [],
    box: { minX: -1, maxX: 3, minY: 0, maxY: 4 }
  };
}

const s1 = layout('s1', 'ik', 'zie', 'man');
const s2 = layout('s2', 'man', 'draagt', 'hoed');
const result = engine.composePair({
  upper: { id: 'S1', layout: s1 },
  lower: { id: 'S2', layout: s2 },
  relation: { antecedentNodeId: 's1-man', referentNodeId: 's2-man' },
  gapRows: 3
});

assert.equal(result.schema, 'ogn-multi-composition-v2');
assert.equal(result.units.length, 2);
assert.ok(result.units.every(unit => engine.validateUnit(unit.layout)));
assert.deepEqual(result.units[0].shift, { dx: 0, dy: 0 });
assert.deepEqual(result.units[1].shift, { dx: 4, dy: 7 });
assert.equal(result.relation.type, 'coreference');
assert.equal(result.relation.direction, 'none');
assert.equal(result.relation.antecedent.x, result.relation.referent.x);
assert.ok(result.relation.referent.y > result.relation.antecedent.y);
assert.deepEqual(result.sharedRows, []);
assert.deepEqual(result.sharedColumns, [{ coordinate: 3, first: 's1-man', second: 's2-man' }]);

const lowerAfter = result.units[1].layout;
assert.deepEqual(
  lowerAfter.nodes.map(node => [node.id, node.x - s2.nodes.find(before => before.id === node.id).x, node.y - s2.nodes.find(before => before.id === node.id).y]),
  lowerAfter.nodes.map(node => [node.id, 4, 7]),
  'S2 moet als één star geheel verschuiven'
);

const invalid = layout('bad', 'a', 'b', 'c');
invalid.nodes[1].x = invalid.nodes[0].x;
assert.equal(engine.validateUnit(invalid), false);
assert.throws(() => engine.composePair({
  upper: { id: 'BAD', layout: invalid },
  lower: { id: 'S2', layout: s2 },
  relation: { antecedentNodeId: 'bad-c', referentNodeId: 's2-man' }
}), /GRID-INVARIANT/);

const sample = JSON.parse(fs.readFileSync(
  path.join(root, 'samples', 'ik-zie-man-hij-draagt-hoed.multi-ogn.v2.opn'),
  'utf8'
));
const sampleComposition = sample.data.composition;
assert.equal(sampleComposition.schema, engine.SCHEMA);
assert.equal(sampleComposition.grid_invariant_scope, 'per-ogn');
assert.equal(sampleComposition.rigid_shift_only, true);
assert.equal(sampleComposition.relation.direction, 'none');
assert.ok(sampleComposition.units.every(unit => engine.validateUnit(unit.graph)));
assert.deepEqual(engine.sharedCoordinates(sampleComposition.units[0].graph, sampleComposition.units[1].graph, 'y'), []);
assert.deepEqual(
  engine.sharedCoordinates(sampleComposition.units[0].graph, sampleComposition.units[1].graph, 'x'),
  [{ coordinate: 2, first: 's1-man', second: 's2-man' }]
);
assert.equal(sampleComposition.units[1].graph.nodes.find(node => node.id === 's2-man').label, 'MAN');
assert.equal(sampleComposition.relation.referent.nodeId, 's2-man');
assert.equal(sampleComposition.relation.lexicalization.profile_id, 'hij');
assert.equal(sampleComposition.relation.lexicalization.surface, 'HIJ');
assert.equal(sampleComposition.shared_lex_axis.items.find(item => item.node_id === 's2-man').source_label, 'MAN');
assert.equal(sampleComposition.shared_lex_axis.items.find(item => item.node_id === 's2-man').label, 'HIJ');

const legacySample = JSON.parse(fs.readFileSync(
  path.join(root, 'samples', 'ik-zie-man-hij-draagt-hoed.multi-ogn.v1.opn'),
  'utf8'
));
assert.ok(engine.SUPPORTED_SCHEMAS.includes(legacySample.data.composition.schema), 'legacy-v1 moet importeerbaar blijven');

assert.equal(lexicalizer.resolve(lexicalizer.DEFAULT_PROFILES, 'hij', 'man').selected.surface, 'HIJ');
assert.equal(lexicalizer.resolve(lexicalizer.DEFAULT_PROFILES, 'die', 'man').selected.surface, 'DIE');
assert.equal(lexicalizer.resolve(lexicalizer.DEFAULT_PROFILES, 'die-man', 'man').selected.surface, 'DIE MAN');
assert.equal(lexicalizer.resolve(lexicalizer.DEFAULT_PROFILES, 'die-vrouw', 'man').selected.id, 'hij');
assert.equal(lexicalizer.options(lexicalizer.DEFAULT_PROFILES, 'man').find(profile => profile.id === 'die-vrouw').applicable, false);
assert.equal(lexicalizer.resolve(lexicalizer.DEFAULT_PROFILES, 'die-vrouw', 'vrouw').selected.surface, 'DIE VROUW');
assert.equal(lexicalizer.resolve(lexicalizer.DEFAULT_PROFILES, 'hem', 'ezel', 'object').selected.surface, 'HEM');
assert.equal(lexicalizer.resolve(lexicalizer.DEFAULT_PROFILES, 'hem', 'boer', 'subject').selected.id, 'hij');

const sources = {
  html: fs.readFileSync(path.join(root, 'index.html'), 'utf8'),
  js: fs.readFileSync(path.join(root, 'viewer.js'), 'utf8'),
  css: fs.readFileSync(path.join(root, 'styles.css'), 'utf8'),
  lexicon: fs.readFileSync(path.join(root, 'lexicon-config.html'), 'utf8'),
  docs: fs.existsSync(path.join(root, 'MULTI_OGN_ANAPHOR.md'))
    ? fs.readFileSync(path.join(root, 'MULTI_OGN_ANAPHOR.md'), 'utf8')
    : '',
  combinations: fs.readFileSync(path.join(root, 'anaphor-combinations-engine.js'), 'utf8')
};

function sourceFunction(source, name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  assert.ok(start >= 0, `productiefunctie ontbreekt: ${name}`);
  const bodyStart = source.indexOf('{', start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = bodyStart; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"' || character === '`') quote = character;
    else if (character === '{') depth += 1;
    else if (character === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`onafgesloten productiefunctie: ${name}`);
}

// Bewaak expliciet dat het blad Anafoor geen vooraf getekende x/y-bomen
// gebruikt. De demo legt uitsluitend de boomtopologie vast; beide eenheden
// lopen daarna afzonderlijk door dezelfde recursieve layoutTree-berekening.
const demoStart = sources.combinations.indexOf('const DEFAULT_COMBINATIONS');
const demoEnd = sources.combinations.indexOf('function clone(', demoStart);
assert.ok(demoStart >= 0 && demoEnd > demoStart, 'Anafoor-demo ontbreekt');
const demoSource = sources.combinations.slice(demoStart, demoEnd);
assert.doesNotMatch(demoSource, /\b[xy]\s*:/, 'Anafoor-demo mag geen ad-hoc x/y-coördinaten bevatten');
assert.match(demoSource, /id:\s*'s2-man',\s*label:\s*'MAN'/, 'S2 moet onderliggend MAN als subject bevatten');
assert.doesNotMatch(demoSource, /id:\s*'s2-hij'/, 'HIJ mag geen bronknoop in S2 zijn');

const sentenceLayoutSource = sourceFunction(sources.js, 'multiOgnSentenceLayout');
assert.match(sentenceLayoutSource, /layoutTree\(cloneTree\(sentence\.tree\)/,
  'iedere Anafoor-zin moet via de recursieve Language Tree-layout lopen');
assert.match(sentenceLayoutSource, /assertUniqueNodeGridLines\(layout/,
  'iedere afzonderlijk berekende Anafoor-boom moet vóór compositie worden gevalideerd');

const compositionSource = sourceFunction(sources.js, 'multiOgnAnaphorComposition');
assert.match(compositionSource, /layout:\s*multiOgnSentenceLayout\(s1\)/,
  'S1 moet afzonderlijk worden berekend');
assert.match(compositionSource, /layout:\s*multiOgnSentenceLayout\(s2\)/,
  'S2 moet afzonderlijk worden berekend');
assert.match(compositionSource, /engine\.composePair\(/,
  'pas na beide boomberekeningen mag de multi-OGN-compositie starten');

for (const [source, markers] of [
  [sources.html, ['data-placement-mode="multi-ogn-anaphor"', 'multi-ogn-composition-engine.js', 'anaphor-lexicalization-engine.js', 'anaphor-combinations-engine.js', 'multi-ogn-anaphor-play-engine.js']],
  [sources.js, ['function activeMultiOgnAnaphorDemo()', 'function drawMultiOgnAnaphor()', "'data-directed': 'false'", 'composePair({', 'anaphorLexicalizationSelect', 'function multiOgnAnaphorPlayPlan()']],
  [sources.css, ['.multi-ogn-coreference-line', '.multi-ogn-lex-axis', '.anaphor-lexicalization-result']],
  [sources.lexicon, ['data-id="anaphor-subject"', 'data-id="anaphor-object"', 'surface=HIJ', 'surface=HEM', 'surface=DIE_MAN', 'surface=DIE_VROUW']],
  [sources.docs, ['antecedent', 'anafoor', 'coreferentieel', 'star verschuiven', 'per afzonderlijke OGN', 'MAN–MAN', 'DIE MAN']]
]) {
  for (const marker of markers) assert.ok(source.includes(marker), `marker ontbreekt: ${marker}`);
}

const configured = combinations.normalizeCombinations();
assert.equal(configured.length, 4);
assert.equal(configured[0].relations[0].referent.nodeId, 's1-man');
assert.equal(configured[0].relations[0].anaphor.nodeId, 's2-man');
assert.equal(configured[0].layoutResolution.mode, 'joint');
assert.deepEqual(configured[1].relations.map(relation => relation.type), ['coreference']);
assert.deepEqual(configured[1].sentences.flatMap(sentence => sentence.lexInsertions.map(item => item.label)), ['GISTEREN', 'VANDAAG', 'ER', 'NIET MEER']);
assert.ok(configured[1].sentences.flatMap(sentence => sentence.lexInsertions).every(item => item.layer === 'Context'));
assert.equal(configured[1].context.representation, 'minimized-tree');
assert.deepEqual(configured[2].relations.map(relation => relation.id), ['boer-hij', 'ezel-hem']);
assert.deepEqual(configured[3].relations.map(relation => relation.id), ['boer-hij', 'ezel-hem']);
assert.equal(configured[3].sentences[1].finiteVerbPlacement, 'final');
assert.equal(configured[3].sentences[1].lexInsertions[0].label, 'OMDAT');

console.log('MULTI-OGN ANAPHOR CHECK: OK (recursieve S1/S2-bomen; broncoreferentie MAN–MAN; HIJ/DIE/DIE MAN uitsluitend als toepasselijke LEX-realisatie)');
