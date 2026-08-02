(function attachRandomPlacementEngine(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OGNRandomPlacement = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function randomPlacementFactory() {
  'use strict';

  function finiteNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function integerInRange(value, fallback, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, Math.floor(finiteNumber(value, fallback))));
  }

  function normalizeSeed(value, fallback = 20260802) {
    const number = Number(value);
    return Number.isFinite(number) ? (Math.floor(number) >>> 0) || fallback : fallback;
  }

  function nextRandom(state) {
    state.randomState = (Math.imul(1664525, state.randomState >>> 0) + 1013904223) >>> 0;
    return state.randomState / 4294967296;
  }

  function candidatePool(radius) {
    const candidates = [];
    for (let x = -radius; x <= radius; x += 1) {
      for (let y = -radius; y <= radius; y += 1) {
        if (x !== 0 || y !== 0) candidates.push({ x, y });
      }
    }
    return candidates;
  }

  function positionIsFree(state, candidate) {
    return !state.usedX.has(candidate.x) && !state.usedY.has(candidate.y);
  }

  function createState(options = {}) {
    const targetCount = integerInRange(options.targetCount, 31, 1, 500);
    const intervalMs = integerInRange(options.intervalMs, 650, 80, 10000);
    const seed = normalizeSeed(options.seed);
    return {
      schema: 'ogn-random-placement-direct-state-v1',
      strategy: 'random',
      targetCount,
      intervalMs,
      seed,
      randomState: seed,
      points: [{ index: 0, x: 0, y: 0, attempts: 1 }],
      events: [{ step: 0, type: 'write', x: 0, y: 0, attempts: 1 }],
      usedX: new Set([0]),
      usedY: new Set([0]),
      searchRadius: 2,
      totalAttempts: 1
    };
  }

  function findRandomCandidate(state) {
    while (state.searchRadius <= 10000) {
      const candidates = candidatePool(state.searchRadius)
        .filter(candidate => positionIsFree(state, candidate));
      if (candidates.length) {
        const index = Math.min(candidates.length - 1, Math.floor(nextRandom(state) * candidates.length));
        return { candidate: candidates[index], attempts: candidates.length };
      }
      state.searchRadius *= 2;
    }
    throw new Error('De random zoekruimte leverde geen vrije positie op.');
  }

  function placeNext(state) {
    if (!state || !Array.isArray(state.points)) throw new TypeError('Ongeldige Random-state.');
    if (state.points.length >= state.targetCount) return null;
    const randomStateBefore = state.randomState;
    const searchRadiusBefore = state.searchRadius;
    const found = findRandomCandidate(state);
    const placed = {
      index: state.points.length,
      x: found.candidate.x,
      y: found.candidate.y,
      attempts: found.attempts,
      randomStateBefore,
      searchRadiusBefore
    };
    state.points.push(placed);
    state.usedX.add(placed.x);
    state.usedY.add(placed.y);
    state.totalAttempts += placed.attempts;
    state.events.push({
      step: placed.index,
      type: 'write',
      x: placed.x,
      y: placed.y,
      attempts: placed.attempts
    });
    return placed;
  }

  function undoLast(state) {
    if (!state || state.points.length <= 1) return null;
    const removed = state.points.pop();
    state.events.pop();
    state.usedX = new Set(state.points.map(candidate => candidate.x));
    state.usedY = new Set(state.points.map(candidate => candidate.y));
    state.randomState = removed.randomStateBefore >>> 0;
    state.searchRadius = removed.searchRadiusBefore;
    state.totalAttempts = state.points.reduce((total, candidate) => total + candidate.attempts, 0);
    return removed;
  }

  function bounds(points) {
    const xs = points.map(candidate => candidate.x);
    const ys = points.map(candidate => candidate.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX;
    const height = maxY - minY;
    return { minX, maxX, minY, maxY, width, height, perimeter: 2 * (width + height) };
  }

  function validate(points) {
    const xs = new Set();
    const ys = new Set();
    for (const candidate of points) {
      if (xs.has(candidate.x) || ys.has(candidate.y)) return false;
      xs.add(candidate.x);
      ys.add(candidate.y);
    }
    return true;
  }

  function snapshot(state) {
    return {
      schema: 'ogn-random-placement-direct-snapshot-v1',
      placement_mode: 'direct-one-at-a-time',
      strategy: 'random',
      target_count: state.targetCount,
      interval_ms: state.intervalMs,
      seed: state.seed,
      random_state: state.randomState,
      future_plan_stored: false,
      points: state.points.map(candidate => ({ ...candidate })),
      events: state.events.map(event => ({ ...event })),
      bounds: bounds(state.points),
      unique_rows_and_columns: validate(state.points)
    };
  }

  return Object.freeze({
    bounds,
    createState,
    placeNext,
    snapshot,
    undoLast,
    validate
  });
});
