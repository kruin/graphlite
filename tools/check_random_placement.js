'use strict';

const assert = require('assert');
const engine = require('../random-placement-engine.js');

function generate(count, seed, spread = 'available', dimensions = {}, distribution = 'uniform-v1.0', history = {}) {
  const state = engine.createState({
    targetCount: count,
    seed,
    spread,
    distribution,
    priorHitsX: history.x,
    priorHitsY: history.y,
    ...dimensions
  });
  while (engine.placeNext(state)) {
    // Iedere aanroep schrijft hoogstens één nieuwe knoop.
  }
  return state;
}

const first = generate(96, 12345);
const second = generate(96, 12345);
const other = generate(96, 54321);

assert.deepStrictEqual(
  Object.keys(engine.SPREADS),
  ['available', 'compact', 'balanced', 'wide'],
  'de toegevoegde standaard mag bestaande plaatsingsopties niet verwijderen'
);
assert.deepStrictEqual(
  Object.keys(engine.DISTRIBUTIONS),
  ['uniform-v1.0', 'impure-repeat-v0.1'],
  'alleen functionele Random-modellen mogen in Config verschijnen'
);

const bounded = generate(31, 20260802, 'available', { maxColumns: 31, maxRows: 40 });
assert.deepStrictEqual(
  bounded.placementArea,
  { minX: -15, maxX: 15, minY: -19, maxY: 20, columns: 31, rows: 40 },
  'interface-afmetingen moeten als vaste beschikbare rechthoek worden bewaard'
);
assert.ok(
  bounded.points.every(point => (
    point.x >= bounded.placementArea.minX
    && point.x <= bounded.placementArea.maxX
    && point.y >= bounded.placementArea.minY
    && point.y <= bounded.placementArea.maxY
  )),
  'Random mag de beschikbare interface-ruimte niet verlaten'
);
assert.strictEqual(
  bounded.points[1].attempts,
  30 * 39,
  'de standaardplaatsing moet direct ergens uit de volledige vrije ruimte kiezen'
);
assert.strictEqual(engine.snapshot(bounded).max_columns, 31);
assert.strictEqual(engine.snapshot(bounded).max_rows, 40);

const boundedCompact = engine.createState({
  targetCount: 31,
  seed: 20260802,
  spread: 'compact',
  maxColumns: 31,
  maxRows: 40
});
engine.placeNext(boundedCompact);
assert.ok(
  boundedCompact.points[1].attempts < bounded.points[1].attempts,
  'Compact moet als begrensd alternatief zijn eigen centrumgerichte zoekzone behouden'
);

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

function repeatedAxisCounts(iterationCount, count, seed, spread, dimensions = {}, distribution = 'uniform-v1.0') {
  const x = new Map();
  const y = new Map();
  for (let runIndex = 0; runIndex < iterationCount; runIndex += 1) {
    const runSeed = ((seed + Math.imul(runIndex, 0x9e3779b9)) >>> 0) || 20260802;
    const run = generate(count, runSeed, spread, dimensions, distribution, { x, y });
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

function axisVariance(counts) {
  const values = [...counts.x, ...counts.y].map(([, value]) => value);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length;
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

const impureFirst = repeatedAxisCounts(
  50,
  31,
  20260802,
  'available',
  { maxColumns: 48, maxRows: 48 },
  'impure-repeat-v0.1'
);
const impureSecond = repeatedAxisCounts(
  50,
  31,
  20260802,
  'available',
  { maxColumns: 48, maxRows: 48 },
  'impure-repeat-v0.1'
);
const uniformReference = repeatedAxisCounts(
  50,
  31,
  20260802,
  'available',
  { maxColumns: 48, maxRows: 48 },
  'uniform-v1.0'
);
assert.deepStrictEqual(impureFirst, impureSecond, 'Onzuiver uniform v0.1 moet reproduceerbaar blijven');
assert.ok(
  axisVariance(impureFirst) > axisVariance(uniformReference),
  'de vaste v0.1-referentiereeks moet door hit-herhaling meer ascontrast voorspellen dan Uniform v1.0'
);

const impureSnapshotState = generate(
  31,
  20260802,
  'available',
  { maxColumns: 48, maxRows: 48 },
  'impure-repeat-v0.1',
  { x: new Map([[4, 3]]), y: new Map([[-2, 5]]) }
);
const impureSnapshot = engine.snapshot(impureSnapshotState);
assert.strictEqual(impureSnapshot.distribution, 'impure-repeat-v0.1');
assert.strictEqual(impureSnapshot.repeat_mixture, 0.2);
assert.strictEqual(impureSnapshot.prior_hit_total_x, 3);
assert.strictEqual(impureSnapshot.prior_hit_total_y, 5);
assert.strictEqual(engine.validate(impureSnapshotState.points), true, 'v0.1 moet unieke rijen en kolommen behouden');

assert.strictEqual(engine.createState({ seed: -4 }).seed, 1, 'seed onder de grens moet naar 1 worden begrensd');
assert.strictEqual(engine.createState({ seed: 5000000000 }).seed, 0xffffffff, 'seed boven de grens moet worden begrensd');
assert.strictEqual(
  repeatedFirst.y.reduce((sum, [, value]) => sum + value, 0),
  10 * (31 - 1),
  '10 iteraties met 31 knopen moeten 300 waarnemingen op de westas leveren'
);

const predictedUniform = repeatedAxisCounts(
  10,
  31,
  20260802,
  'available',
  { maxColumns: 40, maxRows: 31 }
);
assert.strictEqual(predictedUniform.y.length, 30, 'R=N moet alle niet-centrale WEST-plekken raken');
assert.ok(
  predictedUniform.y.every(([, hitCount]) => hitCount === 10),
  'bij R=N moet iedere niet-centrale WEST-plek in iedere ronde één hit krijgen'
);
assert.strictEqual(
  predictedUniform.x.reduce((sum, [, value]) => sum + value, 0),
  10 * 30,
  'de ruimere SOUTH-as behoudt exact N-1 hits per ronde'
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
