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
    return Number.isFinite(number)
      ? Math.max(1, Math.min(0xffffffff, Math.floor(number)))
      : fallback;
  }

  const SPREADS = Object.freeze({
    available: Object.freeze({ labelNl: 'Ergens in beschikbare ruimte', labelEn: 'Anywhere in available space', fullArea: true, factor: 0 }),
    compact: Object.freeze({ labelNl: 'Compact', labelEn: 'Compact', factor: 0 }),
    balanced: Object.freeze({ labelNl: 'Gebalanceerd', labelEn: 'Balanced', factor: 0.75 }),
    wide: Object.freeze({ labelNl: 'Ruim', labelEn: 'Wide', factor: 1.5 })
  });

  const DISTRIBUTIONS = Object.freeze({
    'uniform-v1.0': Object.freeze({
      labelNl: 'Uniform v1.0',
      labelEn: 'Uniform v1.0',
      repeatMixture: 0
    }),
    'impure-repeat-v0.1': Object.freeze({
      labelNl: 'Onzuiver uniform v0.1 · hit-herhaling',
      labelEn: 'Impure uniform v0.1 · hit repetition',
      repeatMixture: 0.2
    })
  });

  function normalizeSpread(value) {
    const spread = String(value || 'available');
    return Object.prototype.hasOwnProperty.call(SPREADS, spread) ? spread : 'available';
  }

  function normalizeDistribution(value) {
    const distribution = String(value || 'uniform-v1.0');
    return Object.prototype.hasOwnProperty.call(DISTRIBUTIONS, distribution)
      ? distribution
      : 'uniform-v1.0';
  }

  function normalizeHitCounts(value) {
    const entries = value instanceof Map
      ? [...value.entries()]
      : Object.entries(value && typeof value === 'object' ? value : {});
    const counts = new Map();
    entries.forEach(([coordinate, count]) => {
      const key = Number(coordinate);
      const amount = Math.max(0, Math.floor(Number(count) || 0));
      if (Number.isFinite(key) && amount) counts.set(key, amount);
    });
    return counts;
  }

  function nextRandom(state) {
    state.randomState = (Math.imul(1664525, state.randomState >>> 0) + 1013904223) >>> 0;
    return state.randomState / 4294967296;
  }

  function positionIsFree(state, candidate) {
    return !state.usedX.has(candidate.x) && !state.usedY.has(candidate.y);
  }

  function freeCoordinates(used, minimum, maximum) {
    const values = [];
    for (let value = minimum; value <= maximum; value += 1) {
      if (!used.has(value)) values.push(value);
    }
    return values;
  }

  function weightedCoordinateChoice(state, coordinates, priorHits, repeatMixture) {
    if (!coordinates.length) return null;
    const mixture = Math.max(0, Math.min(1, Number(repeatMixture) || 0));
    if (!mixture) {
      return coordinates[Math.min(coordinates.length - 1, Math.floor(nextRandom(state) * coordinates.length))];
    }
    const reinforcedTotal = coordinates.reduce(
      (total, coordinate) => total + 1 + (priorHits.get(coordinate) || 0),
      0
    );
    const probabilities = coordinates.map(coordinate => (
      ((1 - mixture) / coordinates.length)
      + (mixture * (1 + (priorHits.get(coordinate) || 0)) / reinforcedTotal)
    ));
    let cursor = nextRandom(state);
    for (let index = 0; index < coordinates.length; index += 1) {
      cursor -= probabilities[index];
      if (cursor <= 0 || index === coordinates.length - 1) return coordinates[index];
    }
    return coordinates[coordinates.length - 1];
  }

  function centeredLimits(size) {
    const count = Math.max(1, Math.floor(Number(size) || 1));
    const negative = Math.floor((count - 1) / 2);
    return { minimum: -negative, maximum: count - negative - 1 };
  }

  function createState(options = {}) {
    const targetCount = integerInRange(options.targetCount, 31, 1, 500);
    const intervalMs = integerInRange(options.intervalMs, 650, 80, 10000);
    const seed = normalizeSeed(options.seed);
    const spread = normalizeSpread(options.spread);
    const distribution = normalizeDistribution(options.distribution);
    const distributionProfile = DISTRIBUTIONS[distribution];
    const hasMaxColumns = options.maxColumns !== null && options.maxColumns !== undefined && Number.isFinite(Number(options.maxColumns));
    const hasMaxRows = options.maxRows !== null && options.maxRows !== undefined && Number.isFinite(Number(options.maxRows));
    const hasBoundedArea = hasMaxColumns || hasMaxRows;
    const maxColumns = hasBoundedArea
      ? integerInRange(options.maxColumns, targetCount, targetCount, 10000)
      : null;
    const maxRows = hasBoundedArea
      ? integerInRange(options.maxRows, targetCount, targetCount, 10000)
      : null;
    const xLimits = maxColumns ? centeredLimits(maxColumns) : null;
    const yLimits = maxRows ? centeredLimits(maxRows) : null;
    return {
      schema: 'ogn-random-placement-direct-state-v1',
      strategy: 'random',
      targetCount,
      intervalMs,
      seed,
      spread,
      distribution,
      repeatMixture: distributionProfile.repeatMixture,
      priorHitsX: normalizeHitCounts(options.priorHitsX),
      priorHitsY: normalizeHitCounts(options.priorHitsY),
      maxColumns,
      maxRows,
      placementArea: xLimits && yLimits ? {
        minX: xLimits.minimum,
        maxX: xLimits.maximum,
        minY: yLimits.minimum,
        maxY: yLimits.maximum,
        columns: maxColumns,
        rows: maxRows
      } : null,
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
    const spread = SPREADS[normalizeSpread(state.spread)];
    if (spread.fullArea && !state.placementArea) {
      state.searchRadius = Math.max(state.searchRadius, Math.ceil((state.targetCount - 1) / 2));
    }
    if (spread.factor > 0) {
      state.searchRadius = Math.max(
        state.searchRadius,
        Math.ceil(Math.max(2, state.points.length * spread.factor))
      );
    }
    while (state.searchRadius <= 10000) {
      const area = state.placementArea;
      const minX = area
        ? (spread.fullArea ? area.minX : Math.max(area.minX, -state.searchRadius))
        : -state.searchRadius;
      const maxX = area
        ? (spread.fullArea ? area.maxX : Math.min(area.maxX, state.searchRadius))
        : state.searchRadius;
      const minY = area
        ? (spread.fullArea ? area.minY : Math.max(area.minY, -state.searchRadius))
        : -state.searchRadius;
      const maxY = area
        ? (spread.fullArea ? area.maxY : Math.min(area.maxY, state.searchRadius))
        : state.searchRadius;
      const freeX = freeCoordinates(state.usedX, minX, maxX);
      const freeY = freeCoordinates(state.usedY, minY, maxY);
      const candidateCount = freeX.length * freeY.length;
      if (candidateCount) {
        if (state.repeatMixture > 0) {
          const candidate = {
            x: weightedCoordinateChoice(state, freeX, state.priorHitsX, state.repeatMixture),
            y: weightedCoordinateChoice(state, freeY, state.priorHitsY, state.repeatMixture)
          };
          if (!positionIsFree(state, candidate)) throw new Error('Interne onzuiver-uniforme kandidaat is niet vrij.');
          return { candidate, attempts: candidateCount };
        }
        // candidatePool used x-major/y-minor order. Selecting from the Cartesian
        // product preserves that exact seeded sequence without allocating r²
        // candidate objects; repeated-run analysis therefore stays inexpensive.
        const index = Math.min(candidateCount - 1, Math.floor(nextRandom(state) * candidateCount));
        const candidate = {
          x: freeX[Math.floor(index / freeY.length)],
          y: freeY[index % freeY.length]
        };
        if (!positionIsFree(state, candidate)) throw new Error('Interne Random-kandidaat is niet vrij.');
        return { candidate, attempts: candidateCount };
      }
      if (area && minX === area.minX && maxX === area.maxX && minY === area.minY && maxY === area.maxY) {
        break;
      }
      state.searchRadius *= 2;
    }
    throw new Error('De begrensde random zoekruimte leverde geen vrije positie op.');
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
      spread: state.spread,
      distribution: state.distribution,
      repeat_mixture: state.repeatMixture,
      prior_hit_total_x: [...state.priorHitsX.values()].reduce((total, count) => total + count, 0),
      prior_hit_total_y: [...state.priorHitsY.values()].reduce((total, count) => total + count, 0),
      max_columns: state.maxColumns,
      max_rows: state.maxRows,
      placement_area: state.placementArea ? { ...state.placementArea } : null,
      random_state: state.randomState,
      future_plan_stored: false,
      points: state.points.map(candidate => ({ ...candidate })),
      events: state.events.map(event => ({ ...event })),
      bounds: bounds(state.points),
      unique_rows_and_columns: validate(state.points)
    };
  }

  return Object.freeze({
    DISTRIBUTIONS,
    SPREADS,
    bounds,
    createState,
    normalizeDistribution,
    normalizeSpread,
    placeNext,
    snapshot,
    undoLast,
    validate
  });
});
