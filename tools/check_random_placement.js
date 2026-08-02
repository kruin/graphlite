'use strict';

const assert = require('assert');
const engine = require('../random-placement-engine.js');

function generate(count, seed) {
  const state = engine.createState({ targetCount: count, seed });
  while (engine.placeNext(state)) {
    // Iedere aanroep schrijft hoogstens één nieuwe knoop.
  }
  return state;
}

const first = generate(96, 12345);
const second = generate(96, 12345);
const other = generate(96, 54321);

assert.strictEqual(engine.validate(first.points), true, 'Random hergebruikt een rij of kolom');
assert.deepStrictEqual(
  first.points.map(({ x, y }) => [x, y]),
  second.points.map(({ x, y }) => [x, y]),
  'dezelfde seed moet dezelfde directe plaatsing opleveren'
);
assert.notDeepStrictEqual(
  first.points.map(({ x, y }) => [x, y]),
  other.points.map(({ x, y }) => [x, y]),
  'een andere seed moet een ander beeld kunnen opleveren'
);

const last = { ...first.points[first.points.length - 1] };
engine.undoLast(first);
const replay = engine.placeNext(first);
assert.deepStrictEqual(
  [replay.x, replay.y],
  [last.x, last.y],
  'undo + stap moet met dezelfde seed reproduceerbaar zijn'
);

const snapshot = engine.snapshot(first);
assert.strictEqual(snapshot.placement_mode, 'direct-one-at-a-time');
assert.strictEqual(snapshot.strategy, 'random');
assert.strictEqual(snapshot.future_plan_stored, false);
assert.strictEqual(snapshot.unique_rows_and_columns, true);

console.log('RANDOM PLACEMENT CHECK: OK');
