'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const engine = require('../multi-ogn-composition-engine.js');

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
const s2 = layout('s2', 'hij', 'draagt', 'hoed');
const result = engine.composePair({
  upper: { id: 'S1', layout: s1 },
  lower: { id: 'S2', layout: s2 },
  relation: { antecedentNodeId: 's1-man', anaphorNodeId: 's2-hij' },
  gapRows: 3
});

assert.equal(result.schema, 'ogn-multi-composition-v1');
assert.equal(result.units.length, 2);
assert.ok(result.units.every(unit => engine.validateUnit(unit.layout)));
assert.deepEqual(result.units[0].shift, { dx: 0, dy: 0 });
assert.deepEqual(result.units[1].shift, { dx: 4, dy: 7 });
assert.equal(result.relation.type, 'coreference');
assert.equal(result.relation.direction, 'none');
assert.equal(result.relation.antecedent.x, result.relation.anaphor.x);
assert.ok(result.relation.anaphor.y > result.relation.antecedent.y);
assert.deepEqual(result.sharedRows, []);
assert.deepEqual(result.sharedColumns, [{ coordinate: 3, first: 's1-man', second: 's2-hij' }]);

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
  relation: { antecedentNodeId: 'bad-c', anaphorNodeId: 's2-hij' }
}), /GRID-INVARIANT/);

const sample = JSON.parse(fs.readFileSync(
  path.join(root, 'samples', 'ik-zie-man-hij-draagt-hoed.multi-ogn.v1.opn'),
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
  [{ coordinate: 2, first: 's1-man', second: 's2-hij' }]
);

const sources = {
  html: fs.readFileSync(path.join(root, 'index.html'), 'utf8'),
  js: fs.readFileSync(path.join(root, 'viewer.js'), 'utf8'),
  css: fs.readFileSync(path.join(root, 'styles.css'), 'utf8'),
  docs: fs.existsSync(path.join(root, 'MULTI_OGN_ANAPHOR.md'))
    ? fs.readFileSync(path.join(root, 'MULTI_OGN_ANAPHOR.md'), 'utf8')
    : ''
};

for (const [source, markers] of [
  [sources.html, ['data-placement-mode="multi-ogn-anaphor"', 'multi-ogn-composition-engine.js']],
  [sources.js, ['MULTI_OGN_ANAPHOR_DEMO', 'function drawMultiOgnAnaphor()', "'data-directed': 'false'", 'composePair({']],
  [sources.css, ['.multi-ogn-coreference-line', '.multi-ogn-lex-axis']],
  [sources.docs, ['antecedent', 'anafoor', 'coreferentieel', 'star verschuiven', 'per afzonderlijke OGN']]
]) {
  for (const marker of markers) assert.ok(source.includes(marker), `marker ontbreekt: ${marker}`);
}

console.log('MULTI-OGN ANAPHOR CHECK: OK (S1 en S2 afzonderlijk geldig; alleen MAN–HIJ deelt een kolom)');
