(() => {
  'use strict';

  const els = {
    svg: document.getElementById('graphSvg'),
    canvasWrap: document.getElementById('canvasWrap'),
    titleLine: document.getElementById('titleLine'),
    stepLabel: document.getElementById('stepLabel'),
    metaLine: document.getElementById('metaLine'),
    stepRange: document.getElementById('stepRange'),
    stepHeading: document.getElementById('stepHeading'),
    stepText: document.getElementById('stepText'),
    playButton: document.getElementById('playButton'),
    nextButton: document.getElementById('nextButton'),
    prevButton: document.getElementById('prevButton'),
    firstButton: document.getElementById('firstButton'),
    lastButton: document.getElementById('lastButton'),
    fitButton: document.getElementById('fitButton'),
    resetViewButton: document.getElementById('resetViewButton'),
    undoButton: document.getElementById('undoButton'),
    redoButton: document.getElementById('redoButton'),
    fileInput: document.getElementById('fileInput'),
    installButton: document.getElementById('installButton'),
    maxNodesInput: document.getElementById('maxNodesInput'),
    noLimitInput: document.getElementById('noLimitInput'),
    autoSizeInput: document.getElementById('autoSizeInput'),
    nodeSizeInput: document.getElementById('nodeSizeInput'),
    cellSizeInput: document.getElementById('cellSizeInput'),
    intervalInput: document.getElementById('intervalInput'),
    growGridInput: document.getElementById('growGridInput'),
    showGridInput: document.getElementById('showGridInput'),
    showLabelsInput: document.getElementById('showLabelsInput'),
    showEdgesInput: document.getElementById('showEdgesInput'),
    showAxesInput: document.getElementById('showAxesInput'),
    diagonalFreeSelect: document.getElementById('diagonalFreeSelect'),
    showConflictsInput: document.getElementById('showConflictsInput'),
    greedyStyleSelect: document.getElementById('greedyStyleSelect'),
    greedyRuleSelect: document.getElementById('greedyRuleSelect'),
    angleMinInput: document.getElementById('angleMinInput'),
    generateLayoutButton: document.getElementById('generateLayoutButton'),
    restoreLayoutButton: document.getElementById('restoreLayoutButton'),
    downloadJsonButton: document.getElementById('downloadJsonButton'),
    topGenerateLayoutButton: document.getElementById('topGenerateLayoutButton'),
    topRestoreLayoutButton: document.getElementById('topRestoreLayoutButton'),
    topDownloadJsonButton: document.getElementById('topDownloadJsonButton'),
    topConfigButton: document.getElementById('topConfigButton'),
    topConfigPanel: document.getElementById('topConfigPanel'),
    mobilePrevButton: document.getElementById('mobilePrevButton'),
    mobileNextButton: document.getElementById('mobileNextButton'),
    mobileGenerateLayoutButton: document.getElementById('mobileGenerateLayoutButton'),
    mobileMenuButton: document.getElementById('mobileMenuButton'),
    mobileSheet: document.getElementById('mobileSheet'),
    mobileSheetBackdrop: document.getElementById('mobileSheetBackdrop'),
    mobileSheetCloseButton: document.getElementById('mobileSheetCloseButton'),
    mobileFirstButton: document.getElementById('mobileFirstButton'),
    mobileLastButton: document.getElementById('mobileLastButton'),
    mobilePlayButton: document.getElementById('mobilePlayButton'),
    mobileFitButton: document.getElementById('mobileFitButton'),
    mobileRestoreLayoutButton: document.getElementById('mobileRestoreLayoutButton'),
    mobileDownloadJsonButton: document.getElementById('mobileDownloadJsonButton'),
    mobileConfigButton: document.getElementById('mobileConfigButton'),
    mobileFileInput: document.getElementById('mobileFileInput'),
    actionFeedback: document.getElementById('actionFeedback'),
    configSummary: document.getElementById('configSummary'),
    constraintStatus: document.getElementById('constraintStatus')
  };

  const state = {
    demo: null,
    originalDemo: null,
    lastGenerateReport: null,
    actionNotice: { level: 'neutral', text: 'Klaar om te testen. Config & uitleg staat prominent bovenaan; tap/hover op ? bij elke optie.' },
    mobileSheetOpen: false,
    configMenuOpen: true,
    step: 0,
    controlsReady: false,
    playing: false,
    timer: null,
    deferredInstallPrompt: null,
    touchStartX: null,
    touchStartY: null,
    undoStack: [],
    redoStack: [],
    view: {
      maxNodes: 30,
      noLimit: true,
      autoSize: true,
      nodeRadius: 6,
      cellSize: 28,
      intervalMs: 700,
      growGrid: true,
      showGrid: true,
      showLabels: true,
      showEdges: true,
      showAxes: true,
      diagonalFree: 'none',
      showConflicts: true,
      greedyStyle: 'near0',
      greedyRule: 'collinear',
      angleMin: 30
    },
    computed: {
      cellSize: 28,
      nodeRadius: 6,
      fontSize: 7,
      apparentCellPx: 24
    }
  };

  const NS = 'http://www.w3.org/2000/svg';

  const DEFAULT_SAMPLE_URL = 'samples/no_limit_96_demo.json';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function toNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeDiagonalFree(value) {
    const raw = String(value ?? 'none').trim().toLowerCase().replace(/[_\s-]+/g, '');
    if (raw === 'both' || raw === 'all' || raw === '2' || raw === 'slashbackslash' || raw === 'backslashslash') return 'both';
    if (raw === 'slash' || raw === '/' || raw === 'xplusy' || raw === 'xyplus') return 'slash';
    if (raw === 'backslash' || raw === '\\' || raw === 'xminusy' || raw === 'xyminus') return 'backslash';
    return 'none';
  }

  function diagonalLabel(value) {
    const mode = normalizeDiagonalFree(value);
    if (mode === 'slash') return 'slash /';
    if (mode === 'backslash') return 'backslash \\';
    if (mode === 'both') return 'both: / en \\';
    return 'none';
  }



  function normalizeGreedyStyle(value) {
    const raw = String(value ?? 'near0').trim().toLowerCase().replace(/[_\s-]+/g, '');
    if (raw === 'maxturn') return 'maxturn';
    if (raw === 'quadrant' || raw === 'kwadrant') return 'quadrant';
    if (raw === 'ring') return 'ring';
    return 'near0';
  }

  function normalizeGreedyRule(value) {
    const raw = String(value ?? 'collinear').trim().toLowerCase().replace(/[_\s-]+/g, '');
    if (raw === 'none' || raw === 'geen') return 'none';
    if (raw === 'extension' || raw === 'noextension') return 'extension';
    if (raw === 'angle' || raw.startsWith('angle')) return 'angle';
    return 'collinear';
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function demoDiagonalFree(demo = state.demo) {
    const candidates = [
      demo?.freedom?.diagonal_free,
      demo?.constraints?.diagonal_free,
      demo?.greedy?.diagonal_free,
      demo?.greedy?.constraints?.diagonal_free,
      demo?.greedy?.config?.diagonal_free,
      demo?.config?.diagonal_free,
      demo?.config?.constraints?.diagonal_free,
      demo?.source_spec?.constraints?.diagonal_free,
      demo?.source_spec?.greedy?.diagonal_free
    ];
    for (const candidate of candidates) {
      if (candidate !== undefined && candidate !== null && String(candidate).trim() !== '') return normalizeDiagonalFree(candidate);
    }
    return 'none';
  }

  function formatLineList(values, limit = 6) {
    const list = [...values].map(String).sort((a, b) => a.localeCompare(b, 'nl', { numeric: true }));
    if (list.length <= limit) return list.join(', ');
    return `${list.slice(0, limit).join(', ')} … +${list.length - limit}`;
  }

  function orderedNodes(demo = state.demo) {
    const nodes = Array.isArray(demo?.nodes) ? [...demo.nodes] : [];
    return nodes.sort((a, b) => {
      const sa = toNumber(a.step ?? a.order, 0);
      const sb = toNumber(b.step ?? b.order, 0);
      if (sa !== sb) return sa - sb;
      return String(a.id).localeCompare(String(b.id), 'nl', { numeric: true });
    });
  }

  function rawMaxStep(demo = state.demo) {
    if (!demo) return 0;
    const fromSteps = Array.isArray(demo.steps) && demo.steps.length ? Math.max(...demo.steps.map(s => toNumber(s.step, 0))) : 0;
    const fromNodes = Array.isArray(demo.nodes) && demo.nodes.length ? Math.max(...demo.nodes.map(n => toNumber(n.step ?? n.order, 0))) : 0;
    const fromEdges = Array.isArray(demo.edges) && demo.edges.length ? Math.max(...demo.edges.map(e => toNumber(e.step ?? e.order, 0))) : 0;
    return Math.max(fromSteps, fromNodes, fromEdges, 0);
  }

  function totalNodes(demo = state.demo) {
    return orderedNodes(demo).length;
  }

  function limitedNodesForMax(demo = state.demo) {
    const nodes = orderedNodes(demo);
    if (state.view.noLimit) return nodes;
    const maxNodes = clamp(Math.floor(toNumber(state.view.maxNodes, 30)), 1, Math.max(1, nodes.length));
    return nodes.slice(0, maxNodes);
  }

  function effectiveMaxStep(demo = state.demo) {
    if (!demo) return 0;
    if (state.view.noLimit) return rawMaxStep(demo);
    const limited = limitedNodesForMax(demo);
    if (!limited.length) return 0;
    return Math.max(...limited.map(n => toNumber(n.step ?? n.order, 0)));
  }

  function intervalMs() {
    const fromView = toNumber(state.view.intervalMs, NaN);
    const fromDemo = toNumber(state.demo?.grow?.interval_ms, 700);
    const value = Number.isFinite(fromView) ? fromView : fromDemo;
    return clamp(value, 80, 10000);
  }

  function visibleNodes() {
    const max = effectiveMaxStep();
    const stepLimit = Math.min(state.step, max);
    return limitedNodesForMax().filter(n => toNumber(n.step ?? n.order, 0) <= stepLimit);
  }

  function inferredGrowthEdges(nodeIds) {
    const nodes = orderedNodes(state.demo).filter(n => nodeIds.has(n.id));
    const edges = [];
    for (let i = 1; i < nodes.length; i++) {
      const previous = nodes[i - 1];
      const current = nodes[i];
      edges.push({
        id: `g${String(i - 1).padStart(3, '0')}`,
        from: previous.id,
        to: current.id,
        step: toNumber(current.step ?? current.order, i),
        order: i,
        inferred: true
      });
    }
    return edges;
  }

  function visibleEdges(nodeIds) {
    if (!state.view.showEdges) return [];
    const rawEdges = Array.isArray(state.demo?.edges) ? state.demo.edges : [];
    const stepLimit = Math.min(state.step, effectiveMaxStep());
    const actualEdges = rawEdges.filter(e => toNumber(e.step ?? e.order, 0) <= stepLimit && nodeIds.has(e.from) && nodeIds.has(e.to));
    // v4346: make the "Lijnen tonen" toggle visibly active even for free-node
    // demos whose JSON deliberately contains no edges. In that case we draw
    // derived growth lines between consecutive revealed steps. These lines are
    // visual aids only; they do not impose HOR/VER placement.
    if (actualEdges.length || rawEdges.length) return actualEdges;
    return inferredGrowthEdges(nodeIds).filter(e => toNumber(e.step ?? e.order, 0) <= stepLimit);
  }

  function hasInferredEdgesVisible() {
    return !!state.view.showEdges && Array.isArray(state.demo?.edges) && state.demo.edges.length === 0;
  }

  function currentGrowthSegment() {
    if (!state.demo || state.step <= 0) return null;
    const nodes = orderedNodes(state.demo)
      .filter(n => toNumber(n.step ?? n.order, 0) <= state.step)
      .filter(n => limitedNodesForMax().some(limited => limited.id === n.id));
    if (nodes.length < 2) return null;
    const current = nodes[nodes.length - 1];
    const previous = nodes[nodes.length - 2];
    return { previous, current, step: toNumber(current.step ?? current.order, state.step) };
  }

  function growthNarrative() {
    if (!state.view.showEdges) return 'Groeilijnen uit: alleen vrije bronknopen zichtbaar.';
    const segment = currentGrowthSegment();
    if (!segment) return 'Startpunt: de eerste vrije knoop is zichtbaar.';
    const from = String(segment.previous.label ?? segment.previous.id);
    const to = String(segment.current.label ?? segment.current.id);
    return `Groei: stap ${segment.step} voegt ${to} toe via een lijn vanaf ${from}.`;
  }

  function buildSvgDefs() {
    const defs = svgEl('defs');
    const marker = svgEl('marker', {
      id: 'growthArrow',
      markerWidth: 8,
      markerHeight: 8,
      refX: 7.2,
      refY: 4,
      orient: 'auto',
      markerUnits: 'strokeWidth'
    });
    marker.appendChild(svgEl('path', { d: 'M 0 0 L 8 4 L 0 8 z', class: 'growth-arrow' }));
    defs.appendChild(marker);
    return defs;
  }

  function configuredCellSize() {
    const fromView = toNumber(state.view.cellSize, NaN);
    if (Number.isFinite(fromView)) return clamp(fromView, 12, 80);
    const grid = state.demo?.grid || {};
    return clamp(toNumber(grid.cell_width || grid.step_x || 28, 28), 12, 80);
  }

  function modelPosition(node) {
    if (node?.model && Number.isFinite(Number(node.model.x)) && Number.isFinite(Number(node.model.y))) {
      return { x: Number(node.model.x), y: Number(node.model.y) };
    }
    if (node?.grid && Number.isFinite(Number(node.grid.x)) && Number.isFinite(Number(node.grid.y))) {
      const origin = state.demo?.grid?.origin || { x: 0, y: 0 };
      const ox = toNumber(origin.x, 0);
      const oy = toNumber(origin.y, 0);
      return { x: Number(node.grid.x) - ox, y: Number(node.grid.y) - oy };
    }
    if (node?.position && Number.isFinite(Number(node.position.x)) && Number.isFinite(Number(node.position.y))) {
      const gridCell = toNumber(state.demo?.grid?.cell_width || state.demo?.grid?.step_x, configuredCellSize());
      return { x: Number(node.position.x) / gridCell, y: Number(node.position.y) / gridCell };
    }
    return { x: 0, y: 0 };
  }

  function freedomCoordinate(node) {
    // For freedom checks, source grid/model coordinates are authoritative.
    // Pixel position is only a drawing fallback and may not hide HOR/VER conflicts.
    if (node?.model && Number.isFinite(Number(node.model.x)) && Number.isFinite(Number(node.model.y))) {
      return { x: Number(node.model.x), y: Number(node.model.y) };
    }
    if (node?.source && Number.isFinite(Number(node.source.x)) && Number.isFinite(Number(node.source.y))) {
      return { x: Number(node.source.x), y: Number(node.source.y) };
    }
    if (Number.isFinite(Number(node?.source_x)) && Number.isFinite(Number(node?.source_y))) {
      return { x: Number(node.source_x), y: Number(node.source_y) };
    }
    return modelPosition(node);
  }

  function constraintReport(nodes = limitedNodesForMax(), diagonalFree = state.view.diagonalFree) {
    const mode = normalizeDiagonalFree(diagonalFree);
    const trackers = {
      ver: new Map(),       // same x: vertical line conflict
      hor: new Map(),       // same y: horizontal line conflict
      slash: new Map(),     // same x+y: / diagonal conflict
      backslash: new Map()  // same x-y: \ diagonal conflict
    };

    function add(kind, key, node) {
      const k = String(key);
      if (!trackers[kind].has(k)) trackers[kind].set(k, []);
      trackers[kind].get(k).push(node);
    }

    for (const node of nodes) {
      const p = freedomCoordinate(node);
      add('ver', p.x, node);
      add('hor', p.y, node);
      add('slash', p.x + p.y, node);
      add('backslash', p.x - p.y, node);
    }

    const activeKinds = ['ver', 'hor'];
    if (mode === 'slash' || mode === 'both') activeKinds.push('slash');
    if (mode === 'backslash' || mode === 'both') activeKinds.push('backslash');

    const conflictKeys = { ver: new Set(), hor: new Set(), slash: new Set(), backslash: new Set() };
    const conflictsByNode = new Map();
    for (const kind of activeKinds) {
      for (const [key, group] of trackers[kind].entries()) {
        if (group.length <= 1) continue;
        conflictKeys[kind].add(key);
        for (const node of group) {
          const id = String(node.id);
          if (!conflictsByNode.has(id)) conflictsByNode.set(id, new Set());
          conflictsByNode.get(id).add(kind);
        }
      }
    }

    const duplicateCount = kind => conflictKeys[kind].size;
    const activeConflictCount = activeKinds.reduce((sum, kind) => sum + duplicateCount(kind), 0);
    return {
      ok: activeConflictCount === 0,
      mode,
      activeKinds,
      nodeCount: nodes.length,
      lineCount: {
        ver: trackers.ver.size,
        hor: trackers.hor.size,
        slash: trackers.slash.size,
        backslash: trackers.backslash.size
      },
      conflicts: {
        ver: duplicateCount('ver'),
        hor: duplicateCount('hor'),
        slash: duplicateCount('slash'),
        backslash: duplicateCount('backslash')
      },
      conflictKeys,
      conflictsByNode,
      activeConflictCount
    };
  }

  function constraintShortText(report) {
    if (!report) return 'geen constraintcontrole';
    const parts = [
      `HOR=${report.conflicts.hor}`,
      `VER=${report.conflicts.ver}`
    ];
    if (report.mode === 'slash' || report.mode === 'both') parts.push(`/=${report.conflicts.slash}`);
    if (report.mode === 'backslash' || report.mode === 'both') parts.push(`\\=${report.conflicts.backslash}`);
    return report.ok ? `${diagonalLabel(report.mode)} vrij` : `conflict ${parts.join(', ')}`;
  }

  function constraintLongText(report, scopeLabel) {
    if (!report) return 'Geen constraintcontrole beschikbaar.';
    const base = `${scopeLabel}: ${report.nodeCount} knopen · diagonal_free=${diagonalLabel(report.mode)} · lijnen HOR=${report.lineCount.hor}, VER=${report.lineCount.ver}`;
    const diag = report.mode === 'none'
      ? ''
      : `, /=${report.lineCount.slash}, \\=${report.lineCount.backslash}`;
    if (report.ok) return `${base}${diag} · vrij.`;
    const details = [];
    if (report.conflicts.hor) details.push(`HOR y=[${formatLineList(report.conflictKeys.hor)}]`);
    if (report.conflicts.ver) details.push(`VER x=[${formatLineList(report.conflictKeys.ver)}]`);
    if (report.conflicts.slash) details.push(`/ x+y=[${formatLineList(report.conflictKeys.slash)}]`);
    if (report.conflicts.backslash) details.push(`\\ x-y=[${formatLineList(report.conflictKeys.backslash)}]`);
    return `${base}${diag} · conflict: ${details.join(' · ')}.`;
  }



  function point(x, y) { return { x, y }; }
  function vec(a, b) { return point(b.x - a.x, b.y - a.y); }
  function cross(v1, v2) { return v1.x * v2.y - v1.y * v2.x; }
  function dot(v1, v2) { return v1.x * v2.x + v1.y * v2.y; }
  function collinear(v1, v2) { return cross(v1, v2) === 0; }
  function sameDirection(v1, v2) { return collinear(v1, v2) && dot(v1, v2) > 0; }
  function slashValue(p) { return p.x + p.y; }
  function backslashValue(p) { return p.x - p.y; }

  function angleDegrees(v1, v2) {
    const n1 = Math.hypot(v1.x, v1.y);
    const n2 = Math.hypot(v2.x, v2.y);
    if (!n1 || !n2) return 0;
    const c = clamp(dot(v1, v2) / (n1 * n2), -1, 1);
    return Math.acos(c) * 180 / Math.PI;
  }

  function quadrant(p) {
    if (p.x >= 0 && p.y < 0) return 0;
    if (p.x < 0 && p.y < 0) return 1;
    if (p.x < 0 && p.y >= 0) return 2;
    return 3;
  }

  function candidatePool(limit) {
    const n = Math.max(1, Math.floor(toNumber(limit, 1)));
    const list = [];
    for (let x = -n; x <= n; x++) {
      for (let y = -n; y <= n; y++) {
        if (x !== 0 || y !== 0) list.push(point(x, y));
      }
    }
    return list;
  }

  function compareKeys(a, b) {
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) {
      if (a[i] < b[i]) return -1;
      if (a[i] > b[i]) return 1;
    }
    return a.length - b.length;
  }

  function candidateKey(style, p, points, prevDir) {
    const prev = points[points.length - 1];
    const nd = vec(prev, p);
    const d0 = p.x * p.x + p.y * p.y;
    const step = nd.x * nd.x + nd.y * nd.y;
    const angle = prevDir ? angleDegrees(prevDir, nd) : 90;
    const angle90 = Math.abs(angle - 90);
    const q = quadrant(p);
    const normalizedStyle = normalizeGreedyStyle(style);
    if (normalizedStyle === 'maxturn') return [-angle, d0, step, q, p.y, p.x];
    if (normalizedStyle === 'quadrant') {
      const counts = [0, 0, 0, 0];
      for (const node of points) counts[quadrant(node)]++;
      const seq = [0, 2, 1, 3, 0, 3, 1, 2];
      const target = seq[(points.length - 1) % seq.length];
      return [q === target ? 0 : 1, counts[q], d0, angle90, step, p.y, p.x];
    }
    if (normalizedStyle === 'ring') {
      const radius = Math.max(Math.abs(p.x), Math.abs(p.y));
      return [radius, step, angle90, q, p.y, p.x];
    }
    return [d0, angle90, step, q, p.y, p.x];
  }

  function diagonalCandidateFree(mode, p, usedSlash, usedBackslash) {
    const normalized = normalizeDiagonalFree(mode);
    if (normalized === 'none') return true;
    if (normalized === 'slash') return !usedSlash.has(slashValue(p));
    if (normalized === 'backslash') return !usedBackslash.has(backslashValue(p));
    return !usedSlash.has(slashValue(p)) && !usedBackslash.has(backslashValue(p));
  }

  function forbiddenByRule(rule, prevDir, newDir, angleMin) {
    if (!prevDir) return false;
    const normalized = normalizeGreedyRule(rule);
    if (normalized === 'none') return false;
    if (normalized === 'extension') return sameDirection(prevDir, newDir);
    if (normalized === 'collinear') return collinear(prevDir, newDir);
    const angle = angleDegrees(prevDir, newDir);
    return angle < angleMin || angle > (180 - angleMin);
  }

  function orient(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  }

  function onSegment(a, b, c) {
    return Math.min(a.x, b.x) <= c.x && c.x <= Math.max(a.x, b.x) &&
           Math.min(a.y, b.y) <= c.y && c.y <= Math.max(a.y, b.y) &&
           orient(a, b, c) === 0;
  }

  function segmentsIntersect(a, b, c, d) {
    const o1 = orient(a, b, c);
    const o2 = orient(a, b, d);
    const o3 = orient(c, d, a);
    const o4 = orient(c, d, b);
    if (o1 === 0 && onSegment(a, b, c)) return true;
    if (o2 === 0 && onSegment(a, b, d)) return true;
    if (o3 === 0 && onSegment(c, d, a)) return true;
    if (o4 === 0 && onSegment(c, d, b)) return true;
    return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0);
  }

  function lineFree(points, candidate) {
    const a = points[points.length - 1];
    const b = candidate;
    for (let i = 0; i < points.length - 1; i++) {
      if (onSegment(a, b, points[i])) return false;
    }
    for (let i = 0; i < points.length - 2; i++) {
      if (segmentsIntersect(a, b, points[i], points[i + 1])) return false;
    }
    return true;
  }

  function generateGreedyPoints(spec) {
    const count = Math.max(1, Math.floor(toNumber(spec.count, 1)));
    const noLimit = !!spec.noLimit;
    let generationMax = Math.max(1, Math.floor(toNumber(spec.max, Math.max(1, Math.ceil((count - 1) / 2)))));
    const needed = Math.max(0, Math.floor((count - 1) / 2));
    if (noLimit) generationMax = Math.max(generationMax, needed);
    if (!noLimit && count > 2 * generationMax + 1) {
      throw new Error(`count=${count} past niet in max=${generationMax} met unieke HOR/VER-lijnen. Zet No limit aan of verhoog Max knopen.`);
    }

    const stats = { tested: 0, rejectedRowCol: 0, rejectedDiagonal: 0, rejectedRule: 0, rejectedLine: 0, expansions: 0 };
    const points = [point(0, 0)];
    const usedX = new Set([0]);
    const usedY = new Set([0]);
    const usedSlash = new Set([0]);
    const usedBackslash = new Set([0]);
    let pool = candidatePool(generationMax);

    while (points.length < count) {
      const prev = points[points.length - 1];
      const prevDir = points.length < 2 ? null : vec(points[points.length - 2], prev);
      pool.sort((a, b) => compareKeys(candidateKey(spec.style, a, points, prevDir), candidateKey(spec.style, b, points, prevDir)));
      let placed = false;
      for (const p of pool) {
        stats.tested++;
        if (usedX.has(p.x) || usedY.has(p.y)) { stats.rejectedRowCol++; continue; }
        if (!diagonalCandidateFree(spec.diagonalFree, p, usedSlash, usedBackslash)) { stats.rejectedDiagonal++; continue; }
        const newDir = vec(prev, p);
        if (forbiddenByRule(spec.rule, prevDir, newDir, spec.angleMin)) { stats.rejectedRule++; continue; }
        if (!lineFree(points, p)) { stats.rejectedLine++; continue; }
        points.push(p);
        usedX.add(p.x);
        usedY.add(p.y);
        usedSlash.add(slashValue(p));
        usedBackslash.add(backslashValue(p));
        placed = true;
        break;
      }
      if (!placed) {
        if (noLimit && generationMax < 10000) {
          generationMax = Math.max(generationMax + 1, generationMax * 2);
          pool = candidatePool(generationMax);
          stats.expansions++;
          continue;
        }
        throw new Error(`Geen geldig kandidaatpunt na ${points.length} knopen. Gebruik No limit, grotere Max of zwakkere constraints.`);
      }
    }
    return { points, generationMax, stats };
  }

  function layoutTargetNodes() {
    return limitedNodesForMax();
  }

  function currentGenerationSpec(count) {
    return {
      count,
      max: Math.max(1, Math.floor(toNumber(state.view.maxNodes, 30))),
      noLimit: !!state.view.noLimit,
      diagonalFree: normalizeDiagonalFree(state.view.diagonalFree),
      style: normalizeGreedyStyle(state.view.greedyStyle),
      rule: normalizeGreedyRule(state.view.greedyRule),
      angleMin: clamp(Math.floor(toNumber(state.view.angleMin, 30)), 0, 89)
    };
  }

  function setActionNotice(level, text) {
    state.actionNotice = { level: level || 'neutral', text: text || '' };
  }

  function showActionNotice() {
    if (!els.actionFeedback) return;
    const notice = state.actionNotice || { level: 'neutral', text: '' };
    els.actionFeedback.textContent = notice.text || '—';
    els.actionFeedback.className = `action-feedback ${notice.level || 'neutral'}`;
  }

  function generateBrowserLayout() {
    if (!state.demo) return;
    applyConfigFromControls(false);
    const targets = layoutTargetNodes();
    const spec = currentGenerationSpec(targets.length);
    let generated;
    try {
      generated = generateGreedyPoints(spec);
    } catch (err) {
      setActionNotice('conflict', `Geen layout gegenereerd: ${err.message}`);
      render();
      alert(err.message);
      return;
    }

    const generatedById = new Map();
    targets.forEach((node, index) => generatedById.set(String(node.id), generated.points[index]));
    state.demo.nodes = state.demo.nodes.map(node => {
      const p = generatedById.get(String(node.id));
      if (!p) return node;
      return {
        ...node,
        model: { x: p.x, y: p.y },
        source: { x: p.x, y: p.y },
        source_x: p.x,
        source_y: p.y,
        grid: { x: p.x, y: p.y },
        generated_by: 'browser-greedy-v4355'
      };
    });
    state.demo.constraints = { ...(state.demo.constraints || {}), hor_ver_free: true, diagonal_free: spec.diagonalFree };
    state.demo.freedom = { ...(state.demo.freedom || {}), hor_ver_free: true, x_line_unique: true, y_line_unique: true, diagonal_free: spec.diagonalFree };
    state.demo.greedy = {
      ...(state.demo.greedy || {}),
      style: spec.style,
      rule: spec.rule,
      angle_min: spec.angleMin,
      diagonal_free: spec.diagonalFree,
      count: targets.length,
      config_count: targets.length,
      max: spec.max,
      generation_max: generated.generationMax,
      no_limit: spec.noLimit,
      browser_generated: true,
      engine: 'browser-js-v4355',
      layout_scope: spec.noLimit ? 'all-nodes' : 'limited-nodes'
    };
    state.demo.title = (state.demo.title || 'JAN Open Notation Viewer').replace(/ \u2014 browser-generated.*$/, '') + ' — browser-generated v4355';
    state.lastGenerateReport = { ...generated.stats, generationMax: generated.generationMax, count: targets.length, style: spec.style, rule: spec.rule, diagonalFree: spec.diagonalFree };
    state.undoStack = [];
    state.redoStack = [];
    state.step = effectiveMaxStep();
    setActionNotice('ok', `Greedy-layout gegenereerd: ${targets.length} knopen · diagonal_free=${diagonalLabel(spec.diagonalFree)} · style=${spec.style} · rule=${spec.rule} · getest=${generated.stats.tested}. Eindbeeld wordt getoond.`);
    render();
  }

  function restoreJsonLayout() {
    if (!state.originalDemo) return;
    const currentView = { ...state.view };
    state.demo = validateDemo(deepClone(state.originalDemo));
    state.view = { ...state.view, ...currentView };
    state.lastGenerateReport = null;
    if (state.step > effectiveMaxStep()) state.step = effectiveMaxStep();
    setActionNotice('neutral', 'Originele JSON-layout hersteld. Gebruik Genereer Greedy-layout om opnieuw te testen.');
    syncConfigControls();
    render();
  }

  function safeDownloadName() {
    const stem = state.demo?.project?.stem || state.demo?.greedy?.stem || state.demo?.project?.name || 'opengraph_greedy_grow';
    return `${String(stem).replace(/[^A-Za-z0-9._-]+/g, '_')}_viewer_v4355.json`;
  }

  function downloadCurrentJson() {
    if (!state.demo) return;
    const payload = JSON.stringify(state.demo, null, 2);
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeDownloadName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setActionNotice('ok', `JSON gedownload: ${a.download}`);
    render();
  }

  function sourceNodesForBounds(nodes, useAllForStatic = false) {
    if (useAllForStatic) return limitedNodesForMax();
    return nodes.length ? nodes : limitedNodesForMax().slice(0, 1);
  }

  function modelBounds(nodes, useAllForStatic = false) {
    const grid = state.demo?.grid || {};
    const marginUnits = Math.max(1.6, toNumber(grid.margin, 2));
    const sourceNodes = sourceNodesForBounds(nodes, useAllForStatic);
    if (!sourceNodes.length) {
      return { minX: -3, minY: -3, maxX: 3, maxY: 3, widthUnits: 6, heightUnits: 6, marginUnits };
    }

    const pts = sourceNodes.map(modelPosition);
    let minX = Math.min(...pts.map(p => p.x));
    let maxX = Math.max(...pts.map(p => p.x));
    let minY = Math.min(...pts.map(p => p.y));
    let maxY = Math.max(...pts.map(p => p.y));
    if (minX === maxX) { minX -= 2; maxX += 2; }
    if (minY === maxY) { minY -= 2; maxY += 2; }
    minX -= marginUnits;
    maxX += marginUnits;
    minY -= marginUnits;
    maxY += marginUnits;
    return { minX, minY, maxX, maxY, widthUnits: Math.max(1, maxX - minX), heightUnits: Math.max(1, maxY - minY), marginUnits };
  }

  function recomputeVisuals(boundsUnits) {
    const cell = configuredCellSize();
    const wrap = els.canvasWrap?.getBoundingClientRect?.() || { width: 640, height: 480 };
    const usableWidth = Math.max(240, wrap.width || 640);
    const usableHeight = Math.max(240, wrap.height || 480);
    const apparentCellX = usableWidth / Math.max(1, boundsUnits.widthUnits);
    const apparentCellY = usableHeight / Math.max(1, boundsUnits.heightUnits);
    const apparentCellPx = Math.max(4, Math.min(apparentCellX, apparentCellY));

    if (!state.view.autoSize) {
      state.computed.cellSize = cell;
      state.computed.nodeRadius = clamp(toNumber(state.view.nodeRadius, 6), 3, 20);
      state.computed.fontSize = clamp(state.computed.nodeRadius * 1.1, 6, 16);
      state.computed.apparentCellPx = apparentCellPx;
      return;
    }

    // v4346: smooth auto sizing. The visible node size is derived from
    // available screen pixels and the current fitted grid. It no longer has
    // a hard minimum expressed in grid cells, because that made small graphs
    // look like connected beads rather than free OpenGraph nodes.
    const desiredRadiusPx = clamp(apparentCellPx * 0.18, 3.8, 7.4);
    const desiredFontPx = clamp(desiredRadiusPx * 1.35, 7.0, 10.5);
    const radiusInCells = clamp(desiredRadiusPx / apparentCellPx, 0.035, 0.22);
    const fontInCells = clamp(desiredFontPx / apparentCellPx, 0.055, 0.30);

    state.computed.cellSize = cell;
    state.computed.nodeRadius = radiusInCells * cell;
    state.computed.fontSize = fontInCells * cell;
    state.computed.apparentCellPx = apparentCellPx;
  }

  function nodePosition(node) {
    const p = modelPosition(node);
    const cell = state.computed.cellSize || configuredCellSize();
    return { x: p.x * cell, y: p.y * cell };
  }

  function layoutBounds(nodes, useAllForStatic = false) {
    const unitBounds = modelBounds(nodes, useAllForStatic);
    recomputeVisuals(unitBounds);
    const cell = state.computed.cellSize || configuredCellSize();
    return {
      minX: unitBounds.minX * cell,
      minY: unitBounds.minY * cell,
      maxX: unitBounds.maxX * cell,
      maxY: unitBounds.maxY * cell,
      cellW: cell,
      cellH: cell,
      unitBounds
    };
  }

  function setViewBox(bounds) {
    const width = Math.max(120, bounds.maxX - bounds.minX);
    const height = Math.max(120, bounds.maxY - bounds.minY);
    els.svg.setAttribute('viewBox', `${bounds.minX} ${bounds.minY} ${width} ${height}`);
  }

  function svgEl(name, attrs = {}, text = null) {
    const el = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
    if (text !== null) el.textContent = text;
    return el;
  }

  function setControlsEnabled(enabled) {
    state.controlsReady = !!enabled;
    const inputs = [
      els.firstButton, els.prevButton, els.playButton, els.nextButton, els.lastButton,
      els.fitButton, els.stepRange, els.undoButton, els.redoButton, els.resetViewButton,
      els.maxNodesInput, els.noLimitInput, els.autoSizeInput, els.nodeSizeInput, els.cellSizeInput, els.intervalInput,
      els.growGridInput, els.showGridInput, els.showLabelsInput, els.showEdgesInput, els.showAxesInput,
      els.diagonalFreeSelect, els.showConflictsInput, els.greedyStyleSelect, els.greedyRuleSelect, els.angleMinInput, els.generateLayoutButton, els.restoreLayoutButton, els.downloadJsonButton,
      els.topGenerateLayoutButton, els.topRestoreLayoutButton, els.topDownloadJsonButton,
      els.mobilePrevButton, els.mobileNextButton, els.mobileGenerateLayoutButton, els.mobileMenuButton,
      els.mobileFirstButton, els.mobileLastButton, els.mobilePlayButton, els.mobileFitButton,
      els.mobileRestoreLayoutButton, els.mobileDownloadJsonButton, els.mobileConfigButton, els.mobileFileInput
    ];
    for (const input of inputs) if (input) input.disabled = !enabled;
  }

  function makeFreeHorVerCoords(count) {
    // v4346: free placement means HOR/VER freedom on the source grid:
    // no two free nodes may share the same vertical x-line or horizontal y-line.
    // The compact 4-arm pattern stays readable while preserving that freedom.
    const n = Math.max(1, Math.floor(toNumber(count, 1)));
    const coords = [[0, 0]];
    let arm = 0;
    while (coords.length < n) {
      const a = 2 * arm + 1;
      const b = 2 * arm + 2;
      const block = [
        [a, -a],
        [-a, -b],
        [-b, a],
        [b, b]
      ];
      for (const p of block) {
        if (coords.length >= n) break;
        coords.push(p);
      }
      arm++;
    }
    return coords;
  }

  function buildDemoFromCoords(coords, title, stem, noLimit = true, max = 30, withEdges = false) {
    const nodes = [];
    const edges = [];
    const steps = [];
    coords.forEach(([x, y], i) => {
      const id = `n${String(i).padStart(3, '0')}`;
      nodes.push({ id, label: String(i), step: i, order: i, model: { x, y } });
      steps.push({ step: i, node: id, text: i === 0 ? 'Start: toon de eerste vrije knoop.' : `Grow: voeg knoop ${i} toe.` });
      if (withEdges && i > 0) edges.push({ id: `e${String(i - 1).padStart(3, '0')}`, from: `n${String(i - 1).padStart(3, '0')}`, to: id, step: i, order: i });
    });
    return {
      format: 'opengraph-greedy-grow-demo',
      format_version: 8,
      title,
      project: { name: 'opengraph-greedy-grow', language: 'nl', stem },
      grid: { rows: 35, columns: 35, cell_width: 28, cell_height: 28, origin: { x: 0, y: 0 }, fit_content: true, grow_with_step: true, show_grid: true, show_axes_through_origin: true, major_every: 5, margin: 2 },
      freedom: { hor_ver_free: true, x_line_unique: true, y_line_unique: true, diagonal_free: 'none' },
      constraints: { hor_ver_free: true, diagonal_free: 'none' },
      greedy: { count: coords.length, config_count: coords.length, max, generation_max: coords.length, no_limit: noLimit, style: 'free-hor-ver-demo', rule: 'hor-ver-free' },
      grow: { interval_ms: 700, start_step: 0, auto_start: false, reveal_edges: 'when_both_nodes_visible', stop_at_end: true, loop: false, undo_redo_per_step: true, last_step_equals_static: true },
      style: { node_radius: 6, show_labels: true, show_edges: true, auto_size: true, free_nodes: true, hor_ver_free: true },
      nodes, edges, steps
    };
  }

  function fallbackDemo() {
    return buildDemoFromCoords(makeFreeHorVerCoords(96), 'OpenGraph Greedy Grow — ingebouwde HOR/VER-vrije NoLimit-demo', 'fallback_no_limit_96_hor_ver_free_nodes', true, 30, false);
  }

  function normalizeDemo(raw) {
    const demo = { ...raw };
    demo.grid = demo.grid && typeof demo.grid === 'object' ? { ...demo.grid } : {};
    demo.grow = demo.grow && typeof demo.grow === 'object' ? { ...demo.grow } : {};
    demo.greedy = demo.greedy && typeof demo.greedy === 'object' ? { ...demo.greedy } : {};
    demo.style = demo.style && typeof demo.style === 'object' ? { ...demo.style } : {};
    demo.freedom = demo.freedom && typeof demo.freedom === 'object' ? { ...demo.freedom } : {};
    demo.constraints = demo.constraints && typeof demo.constraints === 'object' ? { ...demo.constraints } : {};
    demo.nodes = Array.isArray(demo.nodes) ? demo.nodes.map((node, index) => {
      const id = String(node.id ?? node.name ?? `n${index}`);
      const step = toNumber(node.step ?? node.order, index);
      return { ...node, id, label: String(node.label ?? id), step: Number.isFinite(step) ? step : index, order: toNumber(node.order, step) };
    }) : [];
    demo.edges = Array.isArray(demo.edges) ? demo.edges.map((edge, index) => {
      const step = toNumber(edge.step ?? edge.order, index + 1);
      return { ...edge, id: String(edge.id ?? `e${index}`), from: String(edge.from ?? ''), to: String(edge.to ?? ''), step: Number.isFinite(step) ? step : index + 1 };
    }) : [];
    demo.steps = Array.isArray(demo.steps) ? demo.steps.map((step, index) => {
      const n = toNumber(step.step, index);
      return { ...step, step: Number.isFinite(n) ? n : index };
    }) : [];
    if (!demo.steps.length) {
      demo.steps = demo.nodes.map(node => ({
        step: toNumber(node.step, 0),
        node: node.id,
        edge: null,
        text: `Stap ${toNumber(node.step, 0)}: toon ${node.label ?? node.id}.`
      }));
    }
    demo.grow.interval_ms = toNumber(demo.grow.interval_ms, 700);
    demo.grow.start_step = toNumber(demo.grow.start_step, 0);
    demo.grid.cell_width = toNumber(demo.grid.cell_width || demo.grid.step_x, 28);
    demo.grid.cell_height = toNumber(demo.grid.cell_height || demo.grid.step_y, demo.grid.cell_width);
    if (typeof demo.style.auto_size !== 'boolean') demo.style.auto_size = true;
    if (typeof demo.style.show_edges !== 'boolean') demo.style.show_edges = true;
    if (typeof demo.style.free_nodes !== 'boolean') demo.style.free_nodes = true;
    demo.constraints.diagonal_free = demoDiagonalFree(demo);
    demo.freedom.diagonal_free = demo.constraints.diagonal_free;
    return demo;
  }

  function applyDemoDefaultsToView(demo) {
    const nodeCount = orderedNodes(demo).length || 1;
    const configuredMax = toNumber(demo.greedy?.max ?? demo.greedy?.generation_max, Math.min(30, nodeCount));
    state.view.maxNodes = clamp(Math.floor(configuredMax), 1, Math.max(1, nodeCount));
    state.view.noLimit = demo.greedy?.no_limit === true || nodeCount > state.view.maxNodes;
    state.view.autoSize = demo.style?.auto_size !== false;
    state.view.nodeRadius = clamp(toNumber(demo.style?.node_radius, 6), 3, 20);
    state.view.cellSize = clamp(toNumber(demo.grid?.cell_width, 28), 12, 80);
    state.view.intervalMs = clamp(toNumber(demo.grow?.interval_ms, 700), 80, 10000);
    state.view.growGrid = demo.grid?.grow_with_step !== false;
    state.view.showGrid = demo.grid?.show_grid !== false;
    state.view.showLabels = demo.style?.show_labels !== false;
    state.view.showEdges = true;
    state.view.showAxes = demo.grid?.show_axes_through_origin !== false;
    state.view.diagonalFree = demoDiagonalFree(demo);
    state.view.showConflicts = true;
    state.view.greedyStyle = normalizeGreedyStyle(demo.greedy?.style);
    state.view.greedyRule = normalizeGreedyRule(demo.greedy?.rule);
    state.view.angleMin = clamp(Math.floor(toNumber(demo.greedy?.angle_min ?? demo.constraints?.angle_min, 30)), 0, 89);
    syncConfigControls();
  }

  function syncConfigControls() {
    const nodeCount = Math.max(1, totalNodes());
    els.maxNodesInput.value = String(clamp(Math.floor(state.view.maxNodes), 1, nodeCount));
    els.noLimitInput.checked = !!state.view.noLimit;
    els.maxNodesInput.disabled = !state.controlsReady || !!state.view.noLimit;
    if (els.autoSizeInput) els.autoSizeInput.checked = !!state.view.autoSize;
    els.nodeSizeInput.value = String(Math.round(state.view.nodeRadius));
    els.cellSizeInput.value = String(Math.round(state.view.cellSize));
    els.nodeSizeInput.disabled = !state.controlsReady || !!state.view.autoSize;
    els.cellSizeInput.disabled = !state.controlsReady || !!state.view.autoSize;
    els.intervalInput.value = String(intervalMs());
    els.growGridInput.checked = !!state.view.growGrid;
    els.showGridInput.checked = !!state.view.showGrid;
    els.showLabelsInput.checked = !!state.view.showLabels;
    if (els.showEdgesInput) els.showEdgesInput.checked = !!state.view.showEdges;
    els.showAxesInput.checked = !!state.view.showAxes;
    if (els.diagonalFreeSelect) els.diagonalFreeSelect.value = normalizeDiagonalFree(state.view.diagonalFree);
    if (els.showConflictsInput) els.showConflictsInput.checked = !!state.view.showConflicts;
    if (els.greedyStyleSelect) els.greedyStyleSelect.value = normalizeGreedyStyle(state.view.greedyStyle);
    if (els.greedyRuleSelect) els.greedyRuleSelect.value = normalizeGreedyRule(state.view.greedyRule);
    if (els.angleMinInput) els.angleMinInput.value = String(clamp(Math.floor(toNumber(state.view.angleMin, 30)), 0, 89));
  }

  function drawGrid(group, bounds) {
    if (!state.view.showGrid) return;
    const cellW = bounds.cellW || configuredCellSize();
    const cellH = bounds.cellH || configuredCellSize();
    const grid = state.demo?.grid || {};
    const majorEvery = Math.max(1, Math.round(toNumber(grid.major_every || grid.show_major_grid_every, 5)));
    const startX = Math.floor(bounds.minX / cellW) * cellW;
    const endX = Math.ceil(bounds.maxX / cellW) * cellW;
    const startY = Math.floor(bounds.minY / cellH) * cellH;
    const endY = Math.ceil(bounds.maxY / cellH) * cellH;

    for (let x = startX; x <= endX; x += cellW) {
      const ix = Math.round(x / cellW);
      group.appendChild(svgEl('line', { x1: x, y1: startY, x2: x, y2: endY, class: `grid-line ${ix % majorEvery === 0 ? 'major' : ''}` }));
    }
    for (let y = startY; y <= endY; y += cellH) {
      const iy = Math.round(y / cellH);
      group.appendChild(svgEl('line', { x1: startX, y1: y, x2: endX, y2: y, class: `grid-line ${iy % majorEvery === 0 ? 'major' : ''}` }));
    }

    if (state.view.showAxes) {
      if (0 >= startX && 0 <= endX) group.appendChild(svgEl('line', { x1: 0, y1: startY, x2: 0, y2: endY, class: 'axis' }));
      if (0 >= startY && 0 <= endY) group.appendChild(svgEl('line', { x1: startX, y1: 0, x2: endX, y2: 0, class: 'axis' }));
    }
  }

  function currentStepRecord() {
    const records = Array.isArray(state.demo?.steps) ? state.demo.steps : [];
    return records.find(s => toNumber(s.step, 0) === state.step) || null;
  }

  function render() {
    const demo = state.demo;
    if (!demo) return;
    const max = effectiveMaxStep(demo);
    state.step = clamp(state.step, 0, max);

    els.svg.replaceChildren();
    els.svg.appendChild(buildSvgDefs());
    const nodes = visibleNodes();
    const nodeIds = new Set(nodes.map(n => n.id));
    const edges = visibleEdges(nodeIds);
    const visibleConstraints = constraintReport(nodes);
    const allConstraints = constraintReport(limitedNodesForMax());
    const allNodesById = new Map((demo.nodes || []).map(n => [n.id, n]));
    const bounds = layoutBounds(nodes, !state.view.growGrid);
    setViewBox(bounds);

    const gridG = svgEl('g', { 'aria-hidden': 'true', class: 'grid' });
    drawGrid(gridG, bounds);
    els.svg.appendChild(gridG);

    const edgeG = svgEl('g', { class: 'edges' });
    for (const edge of edges) {
      const a = allNodesById.get(edge.from);
      const b = allNodesById.get(edge.to);
      if (!a || !b) continue;
      const p1 = nodePosition(a);
      const p2 = nodePosition(b);
      const edgeStep = toNumber(edge.step ?? edge.order, 0);
      const edgeClasses = ['edge', 'growth-edge', edge.inferred ? 'inferred-edge' : 'json-edge'];
      if (state.step > 0 && edgeStep === state.step) edgeClasses.push('current-growth-edge');
      const lineAttrs = { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: edgeClasses.join(' ') };
      if (state.step > 0 && edgeStep === state.step) lineAttrs['marker-end'] = 'url(#growthArrow)';
      const line = svgEl('line', lineAttrs);
      line.appendChild(svgEl('title', {}, `${edge.inferred ? 'Afgeleide groeilijn' : 'JSON-lijn'} · stap ${edgeStep}: ${edge.from} → ${edge.to}`));
      edgeG.appendChild(line);
    }
    els.svg.appendChild(edgeG);

    const circleG = svgEl('g', { class: 'node-circles' });
    const highlightG = svgEl('g', { class: 'node-highlights' });
    const labelG = svgEl('g', { class: 'node-labels' });
    const currentNodeId = currentStepRecord()?.node;
    const radius = clamp(toNumber(state.computed.nodeRadius, 6), 2, 24);
    const fontSize = clamp(toNumber(state.computed.fontSize, 7), 4, 18);
    for (const node of nodes) {
      const p = nodePosition(node);
      const conflictKinds = visibleConstraints.conflictsByNode.get(String(node.id));
      const nodeClass = state.view.showConflicts && conflictKinds ? 'node conflict-node' : 'node';
      const nodeCircle = svgEl('circle', { cx: p.x, cy: p.y, r: radius, class: nodeClass });
      if (conflictKinds) nodeCircle.appendChild(svgEl('title', {}, `Conflict: ${[...conflictKinds].join(', ')}`));
      circleG.appendChild(nodeCircle);
      if (state.view.showConflicts && conflictKinds) {
        highlightG.appendChild(svgEl('circle', { cx: p.x, cy: p.y, r: radius + Math.max(2.2, radius * 0.36), class: 'conflict-ring' }));
      }
      if (node.id === currentNodeId) {
        // Highlight is a separate outside ring. The actual node circle keeps
        // exactly the same radius as every other free node.
        highlightG.appendChild(svgEl('circle', { cx: p.x, cy: p.y, r: radius + Math.max(1.2, radius * 0.18), class: 'current-ring' }));
      }
      if (state.view.showLabels) {
        const labelText = String(node.label ?? node.id);
        const isLongLabel = labelText.length > 3 || /\s|:|\|/.test(labelText);
        if (isLongLabel) {
          labelG.appendChild(svgEl('text', { x: p.x + radius * 1.45, y: p.y, class: 'node-label node-label-long', style: `font-size:${Math.max(5.5, fontSize * 0.86)}px` }, labelText));
        } else {
          labelG.appendChild(svgEl('text', { x: p.x, y: p.y, class: 'node-label', style: `font-size:${fontSize}px` }, labelText));
        }
      }
    }
    els.svg.appendChild(circleG);
    els.svg.appendChild(highlightG);
    // Labels are deliberately appended after all circles and highlights so numbers can never disappear behind nodes.
    els.svg.appendChild(labelG);

    updateText();
  }

  function updateText() {
    const demo = state.demo;
    if (!demo) {
      els.titleLine.textContent = 'JAN Open Notation Viewer';
      els.stepLabel.textContent = 'Stap 0 / 0';
      els.stepRange.max = '0';
      els.stepRange.value = '0';
      els.stepHeading.textContent = 'Stap';
      els.stepText.textContent = 'Technische startdemo wordt geladen. Gebruik de carrousel voor uitlegbeelden.';
      els.metaLine.textContent = 'Wacht op een geldige Greedy Grow JSON-demo.';
      if (els.configSummary) els.configSummary.textContent = 'Greedy-config wordt geladen.';
      if (els.constraintStatus) { els.constraintStatus.textContent = 'Conflictcontrole wordt geladen.'; els.constraintStatus.className = 'constraint-status neutral'; }
      els.playButton.textContent = '▶';
      showActionNotice();
      return;
    }
    const max = effectiveMaxStep(demo);
    const rawMax = rawMaxStep(demo);
    const step = currentStepRecord();
    els.titleLine.textContent = demo.title || demo.project?.title || 'JAN Open Notation Viewer';
    els.stepLabel.textContent = `Stap ${state.step} / ${max}`;
    els.stepRange.max = String(max);
    els.stepRange.value = String(state.step);
    els.stepHeading.textContent = `Stap ${state.step}`;
    const baseStepText = step?.text || (state.step === max ? 'Eindbeeld: gelijk aan de statische Greedy-weergave.' : 'Geen staptekst beschikbaar.');
    els.stepText.textContent = `${baseStepText} ${growthNarrative()}`;
    const count = visibleNodes().length;
    const total = totalNodes(demo);
    const limitText = state.view.noLimit ? `NoLimit: alle ${total}` : `Max ${state.view.maxNodes}`;
    const sizeText = state.view.autoSize
      ? `auto-size · cel≈${Math.round(state.computed.apparentCellPx)}px · knoop≈${Math.round(state.computed.nodeRadius * state.computed.apparentCellPx / state.computed.cellSize)}px`
      : `manual · cel ${state.view.cellSize} · knoop ${state.view.nodeRadius}`;
    const topologyText = state.view.showEdges ? (hasInferredEdgesVisible() ? 'groeilijnen afgeleid · actuele groeilijn gemarkeerd' : 'JSON-lijnen aan · actuele groeilijn gemarkeerd') : 'lijnen uit · vrije bronknopen';
    const visibleConstraints = constraintReport(visibleNodes());
    const allConstraints = constraintReport(limitedNodesForMax());
    const constraintText = constraintShortText(allConstraints);
    const greedyBits = [];
    if (demo.greedy?.style) greedyBits.push(`style=${demo.greedy.style}`);
    if (demo.greedy?.rule) greedyBits.push(`rule=${demo.greedy.rule}`);
    if (demo.greedy?.generation_max !== undefined) greedyBits.push(`generation_max=${demo.greedy.generation_max}`);
    if (demo.greedy?.count !== undefined) greedyBits.push(`count=${demo.greedy.count}`);
    if (els.configSummary) {
      const browserBits = [`browser=${normalizeGreedyStyle(state.view.greedyStyle)}`, `rule=${normalizeGreedyRule(state.view.greedyRule)}`];
      if (normalizeGreedyRule(state.view.greedyRule) === 'angle') browserBits.push(`angle_min=${state.view.angleMin}`);
      if (state.lastGenerateReport) browserBits.push(`gegenereerd=${state.lastGenerateReport.count}`, `tested=${state.lastGenerateReport.tested}`);
      els.configSummary.textContent = `Greedy-config: ${limitText} · diagonal_free=${diagonalLabel(state.view.diagonalFree)} · ${browserBits.join(' · ')}${greedyBits.length ? ' · bron: ' + greedyBits.join(' · ') : ''}.`;
    }
    if (els.constraintStatus) {
      els.constraintStatus.textContent = `${constraintLongText(visibleConstraints, 'Zichtbaar')} ${constraintLongText(allConstraints, 'Gelimiteerd totaal')}`;
      els.constraintStatus.className = `constraint-status ${allConstraints.ok && visibleConstraints.ok ? 'ok' : (visibleConstraints.ok ? 'warn' : 'conflict')}`;
    }
    els.metaLine.textContent = `${count} / ${total} knopen zichtbaar · ${topologyText} · ${constraintText} · ${limitText} · raw ${rawMax} · ${sizeText} · interval ${intervalMs()} ms · ${state.playing ? 'grow-mode' : 'handmatig'}`;
    els.playButton.textContent = state.playing ? '⏸' : '▶';
    showActionNotice();
    els.undoButton.disabled = !state.undoStack.length;
    els.redoButton.disabled = !state.redoStack.length;
    syncConfigControls();
  }

  function setStep(step, historyMode = 'push') {
    if (!state.demo) return;
    const nextStep = clamp(Number(step) || 0, 0, effectiveMaxStep(state.demo));
    if (nextStep === state.step) {
      render();
      return;
    }
    if (historyMode === 'push') {
      state.undoStack.push(state.step);
      state.redoStack = [];
    }
    state.step = nextStep;
    render();
  }

  function next() {
    if (!state.demo) return;
    if (state.step >= effectiveMaxStep(state.demo)) {
      if (state.demo?.grow?.loop) setStep(0);
      else stopPlaying();
      return;
    }
    setStep(state.step + 1);
  }

  function prev() { setStep(state.step - 1); }
  function first() { setStep(0); }
  function last() { setStep(effectiveMaxStep(state.demo)); }

  function undo() {
    if (!state.undoStack.length) return;
    const previous = state.undoStack.pop();
    state.redoStack.push(state.step);
    state.step = previous;
    render();
  }

  function redo() {
    if (!state.redoStack.length) return;
    const restored = state.redoStack.pop();
    state.undoStack.push(state.step);
    state.step = restored;
    render();
  }

  function startPlaying() {
    if (!state.demo || state.playing) return;
    state.playing = true;
    els.playButton.textContent = '⏸';
    state.timer = window.setInterval(next, intervalMs());
    updateText();
  }

  function stopPlaying(update = true) {
    state.playing = false;
    if (state.timer) window.clearInterval(state.timer);
    state.timer = null;
    if (update) updateText();
  }

  function togglePlaying() { state.playing ? stopPlaying() : startPlaying(); }

  function validateDemo(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('JSON is geen object.');
    const demo = normalizeDemo(raw);
    if (!Array.isArray(demo.nodes) || !demo.nodes.length) throw new Error('JSON mist nodes[] of nodes[] is leeg.');
    return demo;
  }

  async function loadDemoUrl(url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Kon demo niet laden: ${response.status}`);
    const raw = await response.json();
    setDemo(validateDemo(raw));
  }

  function setDemo(demo) {
    stopPlaying(false);
    state.demo = validateDemo(demo);
    state.originalDemo = deepClone(state.demo);
    state.lastGenerateReport = null;
    applyDemoDefaultsToView(state.demo);
    state.step = clamp(toNumber(state.demo.grow?.start_step, 0), 0, effectiveMaxStep(state.demo));
    state.undoStack = [];
    state.redoStack = [];
    setControlsEnabled(true);
    render();
    if (state.demo.grow?.auto_start) startPlaying();
  }

  async function loadFile(file) {
    const text = await file.text();
    const raw = JSON.parse(text);
    setDemo(validateDemo(raw));
  }

  function applyConfigFromControls(shouldRender = true) {
    const oldNoLimit = !!state.view.noLimit;
    state.view.noLimit = !!els.noLimitInput.checked;
    if (!state.view.noLimit && oldNoLimit && Math.floor(toNumber(els.maxNodesInput.value, state.view.maxNodes)) >= totalNodes()) {
      // When leaving NoLimit, return to the config max instead of silently using all nodes.
      state.view.maxNodes = clamp(toNumber(state.demo?.greedy?.max, 30), 1, Math.max(1, totalNodes()));
    } else {
      state.view.maxNodes = clamp(Math.floor(toNumber(els.maxNodesInput.value, state.view.maxNodes)), 1, Math.max(1, totalNodes() || 9999));
    }
    state.view.autoSize = els.autoSizeInput ? !!els.autoSizeInput.checked : true;
    state.view.nodeRadius = clamp(toNumber(els.nodeSizeInput.value, state.view.nodeRadius), 3, 20);
    state.view.cellSize = clamp(toNumber(els.cellSizeInput.value, state.view.cellSize), 12, 80);
    state.view.intervalMs = clamp(toNumber(els.intervalInput.value, state.view.intervalMs), 80, 10000);
    state.view.growGrid = !!els.growGridInput.checked;
    state.view.showGrid = !!els.showGridInput.checked;
    state.view.showLabels = !!els.showLabelsInput.checked;
    state.view.showEdges = els.showEdgesInput ? !!els.showEdgesInput.checked : true;
    state.view.showAxes = !!els.showAxesInput.checked;
    state.view.diagonalFree = els.diagonalFreeSelect ? normalizeDiagonalFree(els.diagonalFreeSelect.value) : 'none';
    state.view.showConflicts = els.showConflictsInput ? !!els.showConflictsInput.checked : true;
    state.view.greedyStyle = els.greedyStyleSelect ? normalizeGreedyStyle(els.greedyStyleSelect.value) : 'near0';
    state.view.greedyRule = els.greedyRuleSelect ? normalizeGreedyRule(els.greedyRuleSelect.value) : 'collinear';
    state.view.angleMin = els.angleMinInput ? clamp(Math.floor(toNumber(els.angleMinInput.value, state.view.angleMin)), 0, 89) : 30;
    syncConfigControls();
    if (state.step > effectiveMaxStep()) state.step = effectiveMaxStep();
    if (!shouldRender) return;
    if (state.playing) { stopPlaying(false); startPlaying(); }
    else render();
  }

  function fitView() {
    // The viewer has no manual pan/zoom yet. Fit therefore means:
    // recompute bounds, autosize and SVG viewBox from the current visible set.
    render();
  }

  function resetViewSettings() {
    if (!state.demo) return;
    applyDemoDefaultsToView(state.demo);
    render();
  }

  function setMobileSheet(open) {
    state.mobileSheetOpen = !!open;
    if (els.mobileSheet) {
      els.mobileSheet.classList.toggle('open', state.mobileSheetOpen);
      els.mobileSheet.setAttribute('aria-hidden', state.mobileSheetOpen ? 'false' : 'true');
    }
    if (els.mobileSheetBackdrop) {
      els.mobileSheetBackdrop.classList.toggle('hidden', !state.mobileSheetOpen);
      els.mobileSheetBackdrop.setAttribute('aria-hidden', state.mobileSheetOpen ? 'false' : 'true');
    }
    if (els.mobileMenuButton) els.mobileMenuButton.setAttribute('aria-expanded', state.mobileSheetOpen ? 'true' : 'false');
  }

  function setTopConfigMenu(open) {
    state.configMenuOpen = !!open;
    if (els.topConfigPanel) {
      els.topConfigPanel.classList.toggle('hidden', !state.configMenuOpen);
      els.topConfigPanel.setAttribute('aria-hidden', state.configMenuOpen ? 'false' : 'true');
    }
    if (els.topConfigButton) {
      els.topConfigButton.setAttribute('aria-expanded', state.configMenuOpen ? 'true' : 'false');
      els.topConfigButton.textContent = state.configMenuOpen ? '⚙ Config & uitleg ▴' : '⚙ Config & uitleg ▾';
    }
  }

  function closeMobileSheetAfter(action) {
    return function wrappedMobileAction(event) {
      if (event) event.preventDefault();
      action();
      setMobileSheet(false);
    };
  }

  function loadFileFromInput(input) {
    const file = input?.files?.[0];
    if (!file) return;
    loadFile(file)
      .then(() => { if (input) input.value = ''; setMobileSheet(false); })
      .catch(err => alert(err.message));
  }

  function registerEvents() {
    els.nextButton.addEventListener('click', next);
    els.prevButton.addEventListener('click', prev);
    els.firstButton.addEventListener('click', first);
    els.lastButton.addEventListener('click', last);
    els.undoButton.addEventListener('click', undo);
    els.redoButton.addEventListener('click', redo);
    els.playButton.addEventListener('click', togglePlaying);
    els.fitButton.addEventListener('click', fitView);
    els.resetViewButton.addEventListener('click', resetViewSettings);
    if (els.generateLayoutButton) els.generateLayoutButton.addEventListener('click', generateBrowserLayout);
    if (els.restoreLayoutButton) els.restoreLayoutButton.addEventListener('click', restoreJsonLayout);
    if (els.downloadJsonButton) els.downloadJsonButton.addEventListener('click', downloadCurrentJson);
    if (els.topGenerateLayoutButton) els.topGenerateLayoutButton.addEventListener('click', generateBrowserLayout);
    if (els.topRestoreLayoutButton) els.topRestoreLayoutButton.addEventListener('click', restoreJsonLayout);
    if (els.topDownloadJsonButton) els.topDownloadJsonButton.addEventListener('click', downloadCurrentJson);
    if (els.topConfigButton) els.topConfigButton.addEventListener('click', () => setTopConfigMenu(!state.configMenuOpen));
    if (els.mobilePrevButton) els.mobilePrevButton.addEventListener('click', prev);
    if (els.mobileNextButton) els.mobileNextButton.addEventListener('click', next);
    if (els.mobileGenerateLayoutButton) els.mobileGenerateLayoutButton.addEventListener('click', generateBrowserLayout);
    if (els.mobileMenuButton) els.mobileMenuButton.addEventListener('click', () => setMobileSheet(!state.mobileSheetOpen));
    if (els.mobileSheetCloseButton) els.mobileSheetCloseButton.addEventListener('click', () => setMobileSheet(false));
    if (els.mobileSheetBackdrop) els.mobileSheetBackdrop.addEventListener('click', () => setMobileSheet(false));
    if (els.mobileFirstButton) els.mobileFirstButton.addEventListener('click', closeMobileSheetAfter(first));
    if (els.mobileLastButton) els.mobileLastButton.addEventListener('click', closeMobileSheetAfter(last));
    if (els.mobilePlayButton) els.mobilePlayButton.addEventListener('click', closeMobileSheetAfter(togglePlaying));
    if (els.mobileFitButton) els.mobileFitButton.addEventListener('click', closeMobileSheetAfter(fitView));
    if (els.mobileRestoreLayoutButton) els.mobileRestoreLayoutButton.addEventListener('click', closeMobileSheetAfter(restoreJsonLayout));
    if (els.mobileDownloadJsonButton) els.mobileDownloadJsonButton.addEventListener('click', closeMobileSheetAfter(downloadCurrentJson));
    if (els.mobileConfigButton) els.mobileConfigButton.addEventListener('click', closeMobileSheetAfter(() => { setTopConfigMenu(true); document.querySelector('.top-menu-config')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    els.stepRange.addEventListener('input', event => setStep(event.target.value));
    els.fileInput.addEventListener('change', event => loadFileFromInput(event.target));
    if (els.mobileFileInput) els.mobileFileInput.addEventListener('change', event => loadFileFromInput(event.target));

    [els.maxNodesInput, els.noLimitInput, els.autoSizeInput, els.nodeSizeInput, els.cellSizeInput, els.intervalInput, els.growGridInput, els.showGridInput, els.showLabelsInput, els.showEdgesInput, els.showAxesInput,
      els.diagonalFreeSelect, els.showConflictsInput, els.greedyStyleSelect, els.greedyRuleSelect, els.angleMinInput].filter(Boolean).forEach(input => {
      input.addEventListener('input', applyConfigFromControls);
      input.addEventListener('change', applyConfigFromControls);
    });

    els.canvasWrap.addEventListener('click', event => { if (event.detail <= 1) next(); });

    els.canvasWrap.addEventListener('touchstart', event => {
      const t = event.changedTouches[0];
      state.touchStartX = t.clientX;
      state.touchStartY = t.clientY;
    }, { passive: true });

    els.canvasWrap.addEventListener('touchend', event => {
      const t = event.changedTouches[0];
      if (state.touchStartX == null) return;
      const dx = t.clientX - state.touchStartX;
      const dy = t.clientY - state.touchStartY;
      state.touchStartX = state.touchStartY = null;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      dx < 0 ? next() : prev();
    }, { passive: true });

    window.addEventListener('keydown', event => {
      const key = event.key.toLowerCase();
      if (key === 'escape') { setTopConfigMenu(false); setMobileSheet(false); return; }
      if (key === 'escape' && state.mobileSheetOpen) { event.preventDefault(); setMobileSheet(false); return; }
      const ctrl = event.ctrlKey || event.metaKey;
      if (ctrl && key === 'z') { event.preventDefault(); undo(); return; }
      if (ctrl && (key === 'y' || (event.shiftKey && key === 'z'))) { event.preventDefault(); redo(); return; }
      if ([' ', 'enter', 'arrowright'].includes(key)) { event.preventDefault(); next(); }
      else if (['backspace', 'arrowleft'].includes(key)) { event.preventDefault(); prev(); }
      else if (key === 'home') first();
      else if (key === 'end') last();
      else if (key === 'g') togglePlaying();
      else if (key === 'r') first();
    });

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      state.deferredInstallPrompt = event;
      els.installButton.classList.remove('hidden');
    });

    els.installButton.addEventListener('click', async () => {
      if (!state.deferredInstallPrompt) return;
      state.deferredInstallPrompt.prompt();
      await state.deferredInstallPrompt.userChoice;
      state.deferredInstallPrompt = null;
      els.installButton.classList.add('hidden');
    });

    window.addEventListener('resize', () => render());
  }

  async function boot() {
    setControlsEnabled(false);
    updateText();
    registerEvents();
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    try {
      await loadDemoUrl(DEFAULT_SAMPLE_URL);
    } catch (err) {
      console.warn('Kon technische startdemo niet laden; probeer fallback-demo.', err);
      try {
        await loadDemoUrl('samples/no_limit_96_demo.json');
      } catch (err2) {
        console.warn('Kon NoLimit-sample niet laden; ingebouwde fallback-demo wordt gebruikt.', err2);
        setDemo(fallbackDemo());
        els.stepText.textContent = `Sample kon niet worden geladen (${err2.message}). Ingebouwde fallback-demo getoond.`;
      }
    }
  }

  boot();
})();
