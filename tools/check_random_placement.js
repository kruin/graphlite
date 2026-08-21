'use strict';

const assert = require('assert');
const engine = require('../random-placement-engine.js');

function generate(count, seed, spread = 'compact') {
  const state = engine.createState({ targetCount: count, seed, spread });
  while (engine.placeNext(state)) {
    // Iedere aanroep schrijft hoogstens één nieuwe knoop.
  }
  return state;
}

const first = generate(96, 12345);
const second = generate(96, 12345);
const other = generate(96, 54321);

for (const spread of Object.keys(engine.SPREADS)) {
  const spreadFirst = generate(48, 12345, spread);
  const spreadSecond = generate(48, 12345, spread);
  assert.strictEqual(engine.validate(spreadFirst.points), true, `${spread} hergebruikt een rij of kolom`);
  assert.deepStrictEqual(
    spreadFirst.points.map(({ x, y }) => [x, y]),
    spreadSecond.points.map(({ x, y }) => [x, y]),
    `${spread} moet met dezelfde seed reproduceerbaar zijn`
  );
  assert.strictEqual(engine.snapshot(spreadFirst).spread, spread, `${spread} ontbreekt in snapshot`);
}

assert.notDeepStrictEqual(
  generate(48, 12345, 'compact').points.map(({ x, y }) => [x, y]),
  generate(48, 12345, 'wide').points.map(({ x, y }) => [x, y]),
  'compact en ruim moeten een andere kandidaatverdeling kunnen tonen'
);

function repeatedAxisCounts(iterationCount, count, seed, spread) {
  const x = new Map();
  const y = new Map();
  for (let runIndex = 0; runIndex < iterationCount; runIndex += 1) {
    const runSeed = ((seed + Math.imul(runIndex, 0x9e3779b9)) >>> 0) || 20260802;
    const run = generate(count, runSeed, spread);
    assert.strictEqual(engine.validate(run.points), true, `iteratie ${runIndex + 1} schendt de invariant`);
    run.points.slice(1).forEach(point => {
      x.set(point.x, (x.get(point.x) || 0) + 1);
      y.set(point.y, (y.get(point.y) || 0) + 1);
    });
  }
  return {
    x: [...x.entries()].sort((left, right) => left[0] - right[0]),
    y: [...y.entries()].sort((left, right) => left[0] - right[0])
  };
}

const repeatedFirst = repeatedAxisCounts(10, 31, 20260802, 'balanced');
const repeatedSecond = repeatedAxisCounts(10, 31, 20260802, 'balanced');
assert.deepStrictEqual(repeatedFirst, repeatedSecond, 'Random-iteratieanalyse moet reproduceerbaar zijn');
assert.ok(repeatedFirst.x.length > 1 && repeatedFirst.y.length > 1, 'iteraties moeten beide asverdelingen vullen');
assert.strictEqual(
  repeatedFirst.x.reduce((sum, [, value]) => sum + value, 0),
  10 * (31 - 1),
  '10 iteraties met 31 knopen moeten 300 waarnemingen op de zuidas leveren'
);
assert.strictEqual(
  repeatedFirst.y.reduce((sum, [, value]) => sum + value, 0),
  10 * (31 - 1),
  '10 iteraties met 31 knopen moeten 300 waarnemingen op de westas leveren'
);

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
