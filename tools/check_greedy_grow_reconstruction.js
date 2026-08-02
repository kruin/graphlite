'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const engine = require('../greedy-grow-engine.js');

const ROOT = path.resolve(__dirname, '..');
const SAMPLE_FILES = [
  'samples/short_demo.json',
  'samples/space3_gridH20W20_grow_demo.json',
  'samples/no_limit_96_demo.json'
];

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

function generate(strategy, count, options = {}) {
  const state = engine.createState({ strategy, targetCount: count, ...options });
  while (engine.placeNext(state)) {
    // Iedere aanroep schrijft hoogstens één nieuwe knoop.
  }
  return state;
}

for (const relative of SAMPLE_FILES) {
  const sample = JSON.parse(read(relative));
  const state = generate('compact-four-arm', sample.nodes.length);
  const actual = state.points.map(({ x, y }) => [x, y]);
  const expected = sample.nodes.map(node => [node.model.x, node.model.y]);
  assert.deepStrictEqual(actual, expected, `${relative} wijkt af van de reconstructie`);
  assert.strictEqual(engine.validate(state.points), true, `${relative} hergebruikt een rij of kolom`);
  assert.strictEqual(state.events.length, state.points.length, `${relative} mist directe schrijfgebeurtenissen`);
}

const initial = engine.createState({ strategy: 'compact-four-arm', targetCount: 12 });
assert.strictEqual(initial.points.length, 1, 'de startstate mag alleen de centrale knoop bevatten');
assert.strictEqual(Object.hasOwn(initial, 'futurePlan'), false, 'de state mag geen toekomstplan bevatten');
assert.strictEqual(Object.hasOwn(initial, 'plannedPoints'), false, 'de state mag geen toekomstige punten bevatten');

const beforeLength = initial.points.length;
const first = engine.placeNext(initial);
assert.strictEqual(initial.points.length, beforeLength + 1, 'één stap moet exact één knoop schrijven');
assert.deepStrictEqual([first.x, first.y], [1, -1], 'de eerste gereconstrueerde kandidaat wijkt af');

const removed = engine.undoLast(initial);
assert.deepStrictEqual([removed.x, removed.y], [1, -1], 'undo verwijdert niet de laatste knoop');
const replayed = engine.placeNext(initial);
assert.deepStrictEqual([replayed.x, replayed.y], [1, -1], 'undo + stap is niet reproduceerbaar');

const reference = generate('compact-four-arm', 16);
const alternate = generate('near-center', 16);
assert.notDeepStrictEqual(
  reference.points.map(({ x, y }) => [x, y]),
  alternate.points.map(({ x, y }) => [x, y]),
  'een alternatieve zoekvolgorde moet een ander beeld kunnen opleveren'
);

for (const strategy of Object.keys(engine.STRATEGIES)) {
  const state = generate(strategy, 16);
  assert.strictEqual(engine.validate(state.points), true, `${strategy} hergebruikt een rij of kolom`);
}

const snapshot = engine.snapshot(reference);
assert.strictEqual(snapshot.placement_mode, 'direct-one-at-a-time');
assert.strictEqual(snapshot.future_plan_stored, false);
assert.strictEqual(snapshot.unique_rows_and_columns, true);
assert.strictEqual(snapshot.points.length, 16);

for (const [relative, markers] of Object.entries({
  'greedy-grow.html': ['OGN Free Placement · geaccepteerde reconstructie', '+1 · plaats direct', 'GREEDY_GROW_RECONSTRUCTION.md'],
  'greedy-grow.js': ['engine.placeNext(state)', 'engine.undoLast(state)', 'engine.snapshot(state)'],
  'greedy-grow-engine.js': ['compactReferenceCandidate', "placement_mode: 'direct-one-at-a-time'", 'future_plan_stored: false'],
  'GREEDY_GROW_RECONSTRUCTION.md': ['samples/no_limit_96_demo.json', 'A ≠ B', 'globaal optimaliseert']
})) {
  const source = read(relative);
  for (const marker of markers) assert(source.includes(marker), `${relative} mist ${marker}`);
}

console.log('GREEDY GROW RECONSTRUCTION CHECK: OK');
