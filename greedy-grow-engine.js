(function attachGreedyGrowEngine(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OGNGreedyGrow = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function greedyGrowFactory() {
  'use strict';

  const STRATEGIES = Object.freeze({
    'compact-four-arm': Object.freeze({
      labelNl: 'Compact · vierarmige referentie',
      labelEn: 'Compact · four-arm reference',
      descriptionNl: 'Herhaalt exact de teruggevonden demo-volgorde en breidt het veld per vier stappen evenwichtig uit.',
      descriptionEn: 'Replays the recovered demo order exactly and expands the field evenly in groups of four.'
    }),
    'near-center': Object.freeze({
      labelNl: 'Dicht bij centrum',
      labelEn: 'Near centre',
      descriptionNl: 'Probeert vrije kandidaten eerst op afstand tot het centrale startpunt.',
      descriptionEn: 'Tests free candidates primarily by distance from the central start.'
    }),
    ring: Object.freeze({
      labelNl: 'Ring voor ring',
      labelEn: 'Ring by ring',
      descriptionNl: 'Doorzoekt eerst de kleinste vierkante ring rond het centrale startpunt.',
      descriptionEn: 'Searches the smallest square ring around the central start first.'
    }),
    quadrant: Object.freeze({
      labelNl: 'Kwadranten spreiden',
      labelEn: 'Distribute quadrants',
      descriptionNl: 'Wisselt doelkwadranten af en houdt hun bezetting zo gelijk mogelijk.',
      descriptionEn: 'Alternates target quadrants and keeps their occupancy as even as possible.'
    }),
    'max-turn': Object.freeze({
      labelNl: 'Grootste draai eerst',
      labelEn: 'Largest turn first',
      descriptionNl: 'Probeert vanaf de vorige groeirichting eerst de kandidaat met de grootste draai.',
      descriptionEn: 'Tests the candidate with the largest turn from the previous growth direction first.'
    })
  });

  const QUADRANT_SEQUENCE = Object.freeze([0, 2, 1, 3, 0, 3, 1, 2]);

  function finiteNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function integerInRange(value, fallback, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, Math.floor(finiteNumber(value, fallback))));
  }

  function point(x, y) {
    return { x, y };
  }

  function vector(from, to) {
    return point(to.x - from.x, to.y - from.y);
  }

  function dot(left, right) {
    return left.x * right.x + left.y * right.y;
  }

  function angleDegrees(left, right) {
    const leftLength = Math.hypot(left.x, left.y);
    const rightLength = Math.hypot(right.x, right.y);
    if (!leftLength || !rightLength) return 0;
    const cosine = Math.max(-1, Math.min(1, dot(left, right) / (leftLength * rightLength)));
    return Math.acos(cosine) * 180 / Math.PI;
  }

  function quadrant(candidate) {
    if (candidate.x >= 0 && candidate.y < 0) return 0;
    if (candidate.x < 0 && candidate.y < 0) return 1;
    if (candidate.x < 0 && candidate.y >= 0) return 2;
    return 3;
  }

  function compareKeys(left, right) {
    const length = Math.min(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      if (left[index] < right[index]) return -1;
      if (left[index] > right[index]) return 1;
    }
    return left.length - right.length;
  }

  function compactReferenceCandidate(index) {
    if (index < 1) return point(0, 0);
    const offset = index - 1;
    const arm = Math.floor(offset / 4);
    const position = offset % 4;
    const odd = 2 * arm + 1;
    const even = 2 * arm + 2;
    return [
      point(odd, -odd),
      point(-odd, -even),
      point(-even, odd),
      point(even, even)
    ][position];
  }

  function candidatePool(radius) {
    const candidates = [];
    for (let x = -radius; x <= radius; x += 1) {
      for (let y = -radius; y <= radius; y += 1) {
        if (x !== 0 || y !== 0) candidates.push(point(x, y));
      }
    }
    return candidates;
  }

  function candidateKey(strategy, candidate, points) {
    const previous = points[points.length - 1];
    const newDirection = vector(previous, candidate);
    const previousDirection = points.length < 2
      ? null
      : vector(points[points.length - 2], previous);
    const centreDistance = candidate.x * candidate.x + candidate.y * candidate.y;
    const stepDistance = newDirection.x * newDirection.x + newDirection.y * newDirection.y;
    const turn = previousDirection ? angleDegrees(previousDirection, newDirection) : 90;
    const rightAngleDistance = Math.abs(turn - 90);
    const candidateQuadrant = quadrant(candidate);

    if (strategy === 'max-turn') {
      return [-turn, centreDistance, stepDistance, candidateQuadrant, candidate.y, candidate.x];
    }
    if (strategy === 'quadrant') {
      const counts = [0, 0, 0, 0];
      for (const placed of points) counts[quadrant(placed)] += 1;
      const target = QUADRANT_SEQUENCE[(points.length - 1) % QUADRANT_SEQUENCE.length];
      return [
        candidateQuadrant === target ? 0 : 1,
        counts[candidateQuadrant],
        centreDistance,
        rightAngleDistance,
        stepDistance,
        candidate.y,
        candidate.x
      ];
    }
    if (strategy === 'ring') {
      const radius = Math.max(Math.abs(candidate.x), Math.abs(candidate.y));
      return [radius, stepDistance, rightAngleDistance, candidateQuadrant, candidate.y, candidate.x];
    }
    return [centreDistance, rightAngleDistance, stepDistance, candidateQuadrant, candidate.y, candidate.x];
  }

  function normalizeStrategy(value) {
    const strategy = String(value || 'compact-four-arm');
    return Object.prototype.hasOwnProperty.call(STRATEGIES, strategy)
      ? strategy
      : 'compact-four-arm';
  }

  function createState(options = {}) {
    const strategy = normalizeStrategy(options.strategy);
    const targetCount = integerInRange(options.targetCount, 31, 1, 500);
    const intervalMs = integerInRange(options.intervalMs, 700, 80, 10000);
    return {
      schema: 'ogn-greedy-grow-direct-state-v1',
      strategy,
      targetCount,
      intervalMs,
      points: [{ index: 0, x: 0, y: 0, attempts: 1 }],
      events: [{ step: 0, type: 'write', x: 0, y: 0, attempts: 1 }],
      usedX: new Set([0]),
      usedY: new Set([0]),
      referenceCursor: 1,
      searchRadius: 2,
      totalAttempts: 1
    };
  }

  function positionIsFree(state, candidate) {
    return !state.usedX.has(candidate.x) && !state.usedY.has(candidate.y);
  }

  function findReferenceCandidate(state) {
    let attempts = 0;
    while (attempts < 100000) {
      const candidate = compactReferenceCandidate(state.referenceCursor);
      state.referenceCursor += 1;
      attempts += 1;
      if (positionIsFree(state, candidate)) return { candidate, attempts };
    }
    throw new Error('De historische kandidaatvolgorde vond geen vrije positie.');
  }

  function findRankedCandidate(state) {
    let attempts = 0;
    while (state.searchRadius <= 10000) {
      const candidates = candidatePool(state.searchRadius)
        .sort((left, right) => compareKeys(
          candidateKey(state.strategy, left, state.points),
          candidateKey(state.strategy, right, state.points)
        ));
      for (const candidate of candidates) {
        attempts += 1;
        if (positionIsFree(state, candidate)) return { candidate, attempts };
      }
      state.searchRadius *= 2;
    }
    throw new Error('De zoekruimte leverde geen vrije positie op.');
  }

  function placeNext(state) {
    if (!state || !Array.isArray(state.points)) throw new TypeError('Ongeldige Greedy Grow-state.');
    if (state.points.length >= state.targetCount) return null;
    const found = state.strategy === 'compact-four-arm'
      ? findReferenceCandidate(state)
      : findRankedCandidate(state);
    const index = state.points.length;
    const placed = {
      index,
      x: found.candidate.x,
      y: found.candidate.y,
      attempts: found.attempts
    };
    state.points.push(placed);
    state.usedX.add(placed.x);
    state.usedY.add(placed.y);
    state.totalAttempts += found.attempts;
    state.events.push({
      step: index,
      type: 'write',
      x: placed.x,
      y: placed.y,
      attempts: found.attempts
    });
    return placed;
  }

  function undoLast(state) {
    if (!state || state.points.length <= 1) return null;
    const removed = state.points.pop();
    state.events.pop();
    state.usedX = new Set(state.points.map(candidate => candidate.x));
    state.usedY = new Set(state.points.map(candidate => candidate.y));
    state.referenceCursor = state.points.length;
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
    return {
      minX,
      maxX,
      minY,
      maxY,
      width,
      height,
      perimeter: 2 * (width + height)
    };
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
      schema: 'ogn-greedy-grow-direct-snapshot-v1',
      placement_mode: 'direct-one-at-a-time',
      strategy: state.strategy,
      target_count: state.targetCount,
      interval_ms: state.intervalMs,
      future_plan_stored: false,
      points: state.points.map(candidate => ({ ...candidate })),
      events: state.events.map(event => ({ ...event })),
      bounds: bounds(state.points),
      unique_rows_and_columns: validate(state.points)
    };
  }

  return Object.freeze({
    STRATEGIES,
    bounds,
    compactReferenceCandidate,
    createState,
    normalizeStrategy,
    placeNext,
    snapshot,
    undoLast,
    validate
  });
});
