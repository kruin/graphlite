(() => {
  'use strict';

  const VERSION = 'v4408';
  const CELL = 74;
  const ROOT_SIDE_GAP = 1;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const els = {
    svg: document.getElementById('graphSvg'),
    canvasWrap: document.getElementById('canvasWrap'),
    exampleSelect: document.getElementById('exampleSelect'),
    centralModeSelect: document.getElementById('centralModeSelect'),
    functionalOrderSelect: document.getElementById('functionalOrderSelect'),
    branchOrderSelect: document.getElementById('branchOrderSelect'),
    branchTopSelect: document.getElementById('branchTopSelect'),
    branchMiddleSelect: document.getElementById('branchMiddleSelect'),
    branchOtherSelect: document.getElementById('branchOtherSelect'),
    projectionHelp: document.getElementById('projectionHelp'),
    titleLine: document.getElementById('titleLine'),
    metaLine: document.getElementById('metaLine'),
    sentencePreview: document.getElementById('sentencePreview'),
    actionFeedback: document.getElementById('actionFeedback'),
    explainHeading: document.getElementById('explainHeading'),
    explainText: document.getElementById('explainText'),
    showGridInput: document.getElementById('showGridInput'),
    showRelationsInput: document.getElementById('showRelationsInput'),
    showLabelsInput: document.getElementById('showLabelsInput'),
    snapInput: document.getElementById('snapInput'),
    lexRuleSelect: document.getElementById('lexRuleSelect'),
    lexOrderList: document.getElementById('lexOrderList'),
    selectionEmpty: document.getElementById('selectionEmpty'),
    nodeEditor: document.getElementById('nodeEditor'),
    nodeIdField: document.getElementById('nodeIdField'),
    nodeLabelInput: document.getElementById('nodeLabelInput'),
    nodeCatInput: document.getElementById('nodeCatInput'),
    nodeRoleInput: document.getElementById('nodeRoleInput'),
    nodeXInput: document.getElementById('nodeXInput'),
    nodeYInput: document.getElementById('nodeYInput'),
    applyNodeButton: document.getElementById('applyNodeButton'),
    addNodeButton: document.getElementById('addNodeButton'),
    duplicateNodeButton: document.getElementById('duplicateNodeButton'),
    deleteNodeButton: document.getElementById('deleteNodeButton'),
    edgeFromSelect: document.getElementById('edgeFromSelect'),
    edgeToSelect: document.getElementById('edgeToSelect'),
    edgeTypeSelect: document.getElementById('edgeTypeSelect'),
    addEdgeButton: document.getElementById('addEdgeButton'),
    edgeList: document.getElementById('edgeList'),
    fileInput: document.getElementById('fileInput'),
    resetExampleButton: document.getElementById('resetExampleButton'),
    fitButton: document.getElementById('fitButton'),
    undoButton: document.getElementById('undoButton'),
    redoButton: document.getElementById('redoButton'),
    downloadJsonButton: document.getElementById('downloadJsonButton'),
    downloadOpnButton: document.getElementById('downloadOpnButton'),
    lexLeftButton: document.getElementById('lexLeftButton'),
    lexRightButton: document.getElementById('lexRightButton'),
    applyLexRuleButton: document.getElementById('applyLexRuleButton'),
    swapRolesButton: document.getElementById('swapRolesButton'),
    growthEnabledInput: document.getElementById('growthEnabledInput'),
    growthStepInput: document.getElementById('growthStepInput'),
    growthStepLabel: document.getElementById('growthStepLabel'),
    growthPrevButton: document.getElementById('growthPrevButton'),
    growthNextButton: document.getElementById('growthNextButton'),
    growthPlayButton: document.getElementById('growthPlayButton'),
    growthResetButton: document.getElementById('growthResetButton')
  };

  let EXAMPLES = [
    {
      id: 'hond-bijt-man',
      title: 'HOND BIJT MAN',
      phase: 'Fase 1+2',
      lexRule: 'hoofdzininvariant',
      sentence: 'HOND BIJT MAN',
      sentenceHtml: '<strong>HOND</strong> BIJT <em>MAN</em>',
      subjectDefault: 'HOND',
      objectDefault: 'MAN',
      predicate: 'BIJT',
      lexItems: [
        { id: 'hond', label: 'HOND', source: 'subject', role: 'subject' },
        { id: 'bijt', label: 'BIJT', source: 'predicate', role: 'predicate' },
        { id: 'man', label: 'MAN', source: 'object', role: 'object' }
      ]
    },
    {
      id: 'omdat-hond-man-bijt',
      title: 'OMDAT HOND MAN BIJT',
      phase: 'Fase 3',
      lexRule: 'bijzin-omdat',
      sentence: 'OMDAT HOND MAN BIJT',
      sentenceHtml: 'OMDAT <strong>HOND</strong> <em>MAN</em> BIJT',
      subjectDefault: 'HOND',
      objectDefault: 'MAN',
      predicate: 'BIJT',
      lexItems: [
        { id: 'omdat', label: 'OMDAT', source: null, slot: 'comp' },
        { id: 'hond', label: 'HOND', source: 'subject', role: 'subject' },
        { id: 'man', label: 'MAN', source: 'object', role: 'object' },
        { id: 'bijt', label: 'BIJT', source: 'predicate', role: 'predicate' }
      ]
    }
  ];

  const LEX_RULES = [
    { id: 'hoofdzininvariant', label: 'hoofdzin: subject – predicaat – object' },
    { id: 'bijzin-omdat', label: 'bijzin: Comp/(om)dat + subject + object + predicaat' },
    { id: 'perfectum-heeft-vdw', label: 'perfectum: subject – pv – object – vdw' }
  ];

  const CENTER_MODES = [
    { id: 'syntax', label: 'OPN · syntaxboom' },
    { id: 'functional', label: 'OPN · functionele structuur' }
  ];

  const FUNCTIONAL_ORDERS = [
    { id: 'left-first', label: 'layout: left-first' },
    { id: 'right-first', label: 'layout: right-first' }
  ];

  const BRANCH_ORDERS = [
    { id: 'auto-compact', label: 'doel: compact · auto per vertakking' },
    { id: 'auto-align', label: 'doel: align subj/agens + obj/patiens' },
    { id: 'normal', label: 'globaal: normaal' },
    { id: 'flip-all', label: 'globaal: flip alle vertakkingen' }
  ];

  const BRANCH_CHOICES = [
    { id: 'auto', label: 'auto' },
    { id: 'normal', label: 'normaal' },
    { id: 'flip', label: 'flip' }
  ];


  function baseStructureConfig() {
    return {
      syntaxRoot: 's',
      functionalRoot: 'ft-clause',
      syntaxNodes: [
        { id: 's', label: 'S', cat: 'S', kind: 'cat', children: ['np-subj', 'vp'] },
        { id: 'np-subj', label: 'NP', cat: 'NP', kind: 'cat', children: ['subj'] },
        { id: 'subj', label: '{subject}', cat: 'N', kind: 'leaf', role: 'subject', source: 'subject', children: [] },
        { id: 'vp', label: 'VP', cat: 'VP', kind: 'cat', children: ['np-obj', 'v'] },
        { id: 'np-obj', label: 'NP', cat: 'NP', kind: 'cat', children: ['obj'] },
        { id: 'obj', label: '{object}', cat: 'N', kind: 'leaf', role: 'object', source: 'object', children: [] },
        { id: 'v', label: 'V', cat: 'V', kind: 'cat', children: ['pred'] },
        { id: 'pred', label: '{predicate}', cat: 'V', kind: 'leaf', role: 'predicate', source: 'predicate', children: [] }
      ],
      functionalNodes: [
        { id: 'ft-clause', label: 'CLAUSE', cat: 'CLAUSE', kind: 'role-root', role: 'top', children: ['ft-pred', 'ft-argstruct'] },
        { id: 'ft-pred', label: 'PRED', cat: 'PRED', kind: 'role', role: 'pred', children: ['f-root'] },
        { id: 'f-root', label: '{predicate}', cat: 'V', kind: 'leaf', role: 'predicate', source: 'predicate', children: [] },
        { id: 'ft-argstruct', label: 'ARG-STRUCT', cat: 'ARG-STRUCT', kind: 'role', role: 'arguments', children: ['ft-arg1', 'ft-arg2'] },
        { id: 'ft-arg1', label: 'ARG1', cat: 'ARG', kind: 'role', role: 'arg1', children: ['f-subj-np'] },
        { id: 'f-subj-np', label: 'NP', cat: 'NP', kind: 'role', role: 'np-subj', children: ['f-subj'] },
        { id: 'f-subj', label: '{subject}', cat: 'N', kind: 'leaf', role: 'subject', source: 'subject', children: [] },
        { id: 'ft-arg2', label: 'ARG2', cat: 'ARG', kind: 'role', role: 'arg2', children: ['f-obj-np'] },
        { id: 'f-obj-np', label: 'NP', cat: 'NP', kind: 'role', role: 'np-obj', children: ['f-obj'] },
        { id: 'f-obj', label: '{object}', cat: 'N', kind: 'leaf', role: 'object', source: 'object', children: [] }
      ],
      lexSlots: [
        { id: 'comp', label: 'slot 0 · Comp/(om)dat' },
        { id: 'topic', label: 'slot 1 · vooropplaatsing/topicalisatie' },
        { id: 'aux', label: 'AUX / pv' }
      ],
      loaded: false
    };
  }

  let STRUCTURE_CONFIG = baseStructureConfig();

  const state = {
    example: EXAMPLES[0],
    projection: 'axes',
    centerMode: 'syntax',
    functionalOrder: 'left-first',
    branchOrder: 'auto-compact',
    branchOverrides: { top: 'auto', middle: 'auto', other: 'auto' },
    selectedNodeId: null,
    showGrid: true,
    showRelations: true,
    showLabels: true,
    roleSwap: false,
    growthEnabled: false,
    growthStep: 0,
    lastSupportedGrowthStep: 1,
    growthTimer: null
  };

  function svgEl(name, attrs = {}, text = '') {
    const el = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === null || value === undefined) continue;
      el.setAttribute(key, String(value));
    }
    if (text !== '') el.textContent = text;
    return el;
  }

  function pathEl(d, attrs = {}) {
    return svgEl('path', { d, fill: 'none', ...attrs });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function roleLabels() {
    const ex = state.example || EXAMPLES[0];
    const subject = ex.subjectDefault || 'HOND';
    const object = ex.objectDefault || 'MAN';
    return {
      subject: state.roleSwap ? object : subject,
      object: state.roleSwap ? subject : object,
      predicate: ex.predicate || 'BIJT'
    };
  }

  function activeLexItems() {
    const roles = roleLabels();
    return (state.example.lexItems || []).map(item => {
      if (item.role === 'subject') return { ...item, label: roles.subject };
      if (item.role === 'object') return { ...item, label: roles.object };
      if (item.role === 'predicate') return { ...item, label: roles.predicate };
      return { ...item };
    });
  }

  function activeSentenceText() {
    return activeLexItems().map(i => i.label).join(' ');
  }

  function tokenHtml(item) {
    const label = escapeHtml(item.label);
    if (item.role === 'subject') return `<strong>${label}</strong>`;
    if (item.role === 'object') return `<em>${label}</em>`;
    return label;
  }

  function activeSentenceHtml() {
    // v4408: preview follows the editable examples-input.html token list.
    // <strong> marks subject; <em> marks object. This also supports new examples
    // made in examples-editor.html instead of only the two hardcoded patterns.
    return activeLexItems().map(tokenHtml).join(' ');
  }

  async function loadExamplesFromHtml() {
    try {
      const response = await fetch(`examples-input.html?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) return;
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const cards = [...doc.querySelectorAll('.example-input')];
      const parsed = cards.map((card, idx) => {
        const sentenceEl = card.querySelector('.sentence');
        const subject = sentenceEl?.querySelector('[data-role="subject"]')?.textContent.trim() || 'HOND';
        const object = sentenceEl?.querySelector('[data-role="object"]')?.textContent.trim() || 'MAN';
        const lexItems = [...card.querySelectorAll('.lex-token')].map((token, i) => ({
          id: token.dataset.id || `lex-${i + 1}`,
          label: token.textContent.trim(),
          source: token.dataset.source || null,
          slot: token.dataset.slot || null,
          role: token.dataset.role || null,
          lexeme: token.dataset.lexeme || null
        }));
        return {
          id: card.dataset.id || `example-${idx + 1}`,
          title: (sentenceEl?.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase(),
          phase: card.dataset.phase || 'Fase',
          lexRule: card.dataset.lexRule || 'hoofdzininvariant',
          sentence: (sentenceEl?.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase(),
          sentenceHtml: sentenceEl?.innerHTML || '',
          subjectDefault: subject.toUpperCase(),
          objectDefault: object.toUpperCase(),
          predicate: (card.dataset.predicate || 'BIJT').toUpperCase(),
          lexItems
        };
      }).filter(ex => ex.id && ex.lexItems.length);
      if (parsed.length) {
        const currentId = state.example?.id;
        EXAMPLES = parsed;
        state.example = EXAMPLES.find(ex => ex.id === currentId) || EXAMPLES[0];
      }
    } catch (err) {
      // Fetch kan mislukken via file://. De ingebouwde fallback blijft dan actief.
    }
  }

  function nodeConfigToTree(nodes, rootId) {
    const byId = new Map(nodes.map(n => [n.id, n]));
    const roles = roleLabels();
    function labelFor(def) {
      let label = String(def.label || def.id);
      label = label.replace(/\{subject\}/gi, roles.subject)
                   .replace(/\{object\}/gi, roles.object)
                   .replace(/\{predicate\}/gi, roles.predicate);
      const projected = def.source ? activeLexItems().find(item => item.source === def.source) : null;
      if (projected) label = projected.label;
      if (def.role === 'subject') label = roles.subject;
      if (def.role === 'object') label = roles.object;
      if (def.role === 'predicate') label = roles.predicate;
      return label;
    }
    function build(id, trail = []) {
      const def = byId.get(id);
      if (!def) return { id, label: id.toUpperCase(), cat: id.toUpperCase(), kind: 'leaf', children: [] };
      if (trail.includes(id)) return { id, label: `${id}↻`, cat: def.cat || def.label || id, kind: 'leaf', children: [] };
      const kind = def.kind || ((def.children || []).length ? 'cat' : 'leaf');
      return {
        id: def.id,
        label: labelFor(def),
        cat: def.cat || def.label || def.id,
        role: def.role || '',
        source: def.source || '',
        kind,
        children: (def.children || []).map(childId => build(childId, [...trail, id]))
      };
    }
    return build(rootId || nodes[0]?.id || 's');
  }

  function parseStructureSection(doc, sectionId) {
    const section = doc.getElementById(sectionId);
    const nodes = [...(section?.querySelectorAll('.node-config') || [])].map(el => ({
      id: el.dataset.id || '',
      label: el.dataset.label || el.textContent.trim() || el.dataset.id || '',
      cat: el.dataset.cat || el.dataset.label || el.dataset.id || '',
      kind: el.dataset.kind || '',
      role: el.dataset.role || '',
      source: el.dataset.source || '',
      children: (el.dataset.children || '').trim().split(/\s+/).filter(Boolean)
    })).filter(n => n.id);
    return { root: section?.dataset.root || nodes[0]?.id || '', nodes };
  }

  async function loadStructureConfig() {
    try {
      const response = await fetch(`structure-config.html?${VERSION}`, { cache: 'no-store' });
      if (!response.ok) return;
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const syntax = parseStructureSection(doc, 'opengraph-syntax-config');
      const functional = parseStructureSection(doc, 'opengraph-functional-config');
      const lexSlots = [...doc.querySelectorAll('#opengraph-lex-config .lex-slot-config')].map(el => ({
        id: el.dataset.id || '',
        label: el.dataset.label || el.textContent.trim()
      })).filter(s => s.id);
      if (syntax.nodes.length) {
        STRUCTURE_CONFIG.syntaxRoot = syntax.root;
        STRUCTURE_CONFIG.syntaxNodes = syntax.nodes;
      }
      if (functional.nodes.length) {
        STRUCTURE_CONFIG.functionalRoot = functional.root;
        STRUCTURE_CONFIG.functionalNodes = functional.nodes;
      }
      if (lexSlots.length) STRUCTURE_CONFIG.lexSlots = lexSlots;
      STRUCTURE_CONFIG.loaded = true;
    } catch (err) {
      // Fallback blijft actief bij file:// of ontbrekende config.
    }
  }

  function treeSpec() {
    return nodeConfigToTree(STRUCTURE_CONFIG.syntaxNodes, STRUCTURE_CONFIG.syntaxRoot);
  }

  function functionalSpec() {
    return nodeConfigToTree(STRUCTURE_CONFIG.functionalNodes, STRUCTURE_CONFIG.functionalRoot);
  }

  function cloneTree(node) {
    return { ...node, children: node.children.map(cloneTree) };
  }

  function isLabel(node, label) {
    return node && String(node.label).toLowerCase() === String(label).toLowerCase();
  }

  function unionBox(a, b) {
    return {
      minX: Math.min(a.minX, b.minX),
      maxX: Math.max(a.maxX, b.maxX),
      minY: Math.min(a.minY, b.minY),
      maxY: Math.max(a.maxY, b.maxY)
    };
  }

  function shiftBox(box, dx, dy) {
    return { minX: box.minX + dx, maxX: box.maxX + dx, minY: box.minY + dy, maxY: box.maxY + dy };
  }

  function boxesOverlap(a, b, padding = 0) {
    return a.minX - padding <= b.maxX && b.minX - padding <= a.maxX &&
           a.minY - padding <= b.maxY && b.minY - padding <= a.maxY;
  }

  function cloneLayout(layout) {
    return {
      node: layout.node,
      nodes: layout.nodes.map(n => ({ ...n })),
      edges: layout.edges.map(e => ({ ...e })),
      boxes: layout.boxes.map(b => ({ ...b })),
      box: { ...layout.box }
    };
  }

  function shiftLayout(layout, dx, dy) {
    for (const n of layout.nodes) {
      n.x += dx;
      n.y += dy;
    }
    for (const e of layout.edges) {
      e.fromX += dx;
      e.fromY += dy;
      e.toX += dx;
      e.toY += dy;
    }
    for (const b of layout.boxes) {
      b.minX += dx;
      b.maxX += dx;
      b.minY += dy;
      b.maxY += dy;
      if (typeof b.rootX === 'number') b.rootX += dx;
      if (typeof b.rootY === 'number') b.rootY += dy;
    }
    layout.box = shiftBox(layout.box, dx, dy);
    if (layout.topicalizationSlot) {
      layout.topicalizationSlot.x += dx;
      layout.topicalizationSlot.y += dy;
    }
    return layout;
  }

  function rightExtent(layout) {
    return Math.max(0, layout.box.maxX);
  }

  function leftExtent(layout) {
    return Math.max(0, -layout.box.minX);
  }

  function isLabel(node, label) {
    return node && String(node.label).toLowerCase() === String(label).toLowerCase();
  }

  function stackedBelowShiftY(upperBox, upperShiftY, lowerBox, extraGap = 0) {
    return upperShiftY + upperBox.maxY + 1 + Math.max(0, extraGap) - lowerBox.minY;
  }

  function layoutBoxFromCells(cells) {
    let box = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    cells.forEach((cell, i) => {
      const b = { minX: cell.x, maxX: cell.x, minY: cell.y, maxY: cell.y };
      box = i === 0 ? b : unionBox(box, b);
    });
    return box;
  }

  function layoutLeaf(node) {
    return {
      node,
      nodes: [{ id: node.id, label: node.label, cat: node.cat, role: node.role || '', source: node.source || '', kind: node.kind, x: 0, y: 0 }],
      edges: [],
      boxes: [{ id: `box-${node.id}`, label: `BOX ${node.label}`, nodeId: node.id, leaf: true, rootX: 0, rootY: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 }],
      box: { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    };
  }

  function occupiedFromPlaced(rootNode, placedLayouts) {
    const occupied = {
      cells: new Set([`0,0`]),
      rootRows: new Set([0]),
      rootCols: new Set([0]),
      rows: new Set([0]),
      cols: new Set([0]),
      boxes: [{ minX: 0, maxX: 0, minY: 0, maxY: 0, rootX: 0, rootY: 0, label: rootNode.label }]
    };
    for (const layout of placedLayouts) {
      for (const n of layout.nodes) {
        occupied.cells.add(`${n.x},${n.y}`);
        occupied.rows.add(n.y);
        occupied.cols.add(n.x);
      }
      for (const b of layout.boxes) {
        occupied.boxes.push(b);
        if (typeof b.rootX === 'number' && typeof b.rootY === 'number') {
          occupied.rootRows.add(b.rootY);
          occupied.rootCols.add(b.rootX);
        }
      }
    }
    return occupied;
  }

  function candidatePositions(side, startY = 1) {
    const dir = side < 0 ? -1 : 1;
    const candidates = [];
    for (let y = startY; y < startY + 18; y++) {
      for (let distance = 1; distance <= 10; distance++) {
        candidates.push({ dx: dir * distance, dy: y });
      }
    }
    return candidates;
  }

  function shiftedRoot(layout, dx, dy) {
    const root = layout.nodes.find(n => n.id === layout.node.id) || layout.nodes[0];
    return { x: root.x + dx, y: root.y + dy };
  }

  function candidateIsFree(layout, dx, dy, occupied, options = {}) {
    const shifted = shiftBox(layout.box, dx, dy);
    if (boxesOverlap(shifted, { minX: 0, maxX: 0, minY: 0, maxY: 0 }, 0)) return false;

    for (const node of layout.nodes) {
      const shiftedX = node.x + dx;
      const shiftedY = node.y + dy;
      const key = `${shiftedX},${shiftedY}`;
      if (occupied.cells.has(key)) return false;
      if (occupied.rows.has(shiftedY)) return false;
      if (occupied.cols.has(shiftedX)) return false;
    }

    for (const box of occupied.boxes) {
      if (boxesOverlap(shifted, box, options.boxPadding ?? 0)) return false;
    }

    // Free OpenGraph placement: do not reuse occupied HOR/VER corridors.
    // This makes the next child box choose a new open row/column rather than a
    // nested side-by-side container position.
    const root = shiftedRoot(layout, dx, dy);
    if (occupied.rootRows.has(root.y)) return false;
    if (occupied.rootCols.has(root.x)) return false;
    return true;
  }

  function placeLayoutFree(layout, side, placedLayouts, parentNode, startY = 1) {
    const occupied = occupiedFromPlaced(parentNode, placedLayouts);
    const candidates = candidatePositions(side, startY);
    for (const c of candidates) {
      if (candidateIsFree(layout, c.dx, c.dy, occupied, { boxPadding: 0 })) {
        return shiftLayout(layout, c.dx, c.dy);
      }
    }

    // Safety fallback: keep moving downward until it is free.
    const dir = side < 0 ? -1 : 1;
    for (let y = startY + 18; y < startY + 80; y++) {
      for (let distance = 1; distance <= 24; distance++) {
        const dx = dir * distance;
        if (candidateIsFree(layout, dx, y, occupied, { boxPadding: 0 })) {
          return shiftLayout(layout, dx, y);
        }
      }
    }
    return shiftLayout(layout, dir, startY);
  }

  function composeLayout(node, placedLayouts) {
    const rootNode = { id: node.id, label: node.label, cat: node.cat, role: node.role || '', source: node.source || '', kind: node.kind, x: 0, y: 0 };
    const nodes = [rootNode];
    const edges = [];
    const childBoxes = [];
    let box = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    for (const child of placedLayouts) {
      const childRoot = child.nodes.find(n => n.id === child.node.id) || child.nodes[0];
      nodes.push(...child.nodes);
      edges.push({ from: node.id, to: child.node.id, fromX: 0, fromY: 0, toX: childRoot.x, toY: childRoot.y }, ...child.edges);
      childBoxes.push(...child.boxes);
      box = unionBox(box, child.box);
    }

    const rootBox = { id: `box-${node.id}`, label: `BOX ${node.label}`, nodeId: node.id, rootX: 0, rootY: 0, minX: box.minX, maxX: box.maxX, minY: box.minY, maxY: box.maxY };
    return { node, nodes, edges, boxes: [rootBox, ...childBoxes], box };
  }

  function preferredFirstSide(options = {}, sidePreference = 0) {
    if (sidePreference === -1 || sidePreference === 1) return sidePreference;
    return options.firstSide === 1 ? 1 : -1;
  }

  function layoutUnary(node, childLayout, sidePreference, options = {}) {
    const side = preferredFirstSide(options, sidePreference);
    const placed = placeLayoutFree(cloneLayout(childLayout), side, [], node, 1);
    return composeLayout(node, [placed]);
  }

  function layoutBinary(node, firstLayout, secondLayout, options = {}, sidePreference = 0) {
    const firstSide = preferredFirstSide(options, sidePreference);
    const first = placeLayoutFree(cloneLayout(firstLayout), firstSide, [], node, 1);
    const extraGap = isLabel(node, 'S') && isLabel(firstLayout.node, 'NP') && isLabel(secondLayout.node, 'VP') ? 1 : 0;

    // v4408: left-first/right-first is part of the placement strategy.
    // It changes the candidate-search direction before placement; it does
    // not mirror an already drawn tree and does not swap grammatical roles.
    // The second complete child box starts below the real bottom of the first
    // placed box, then searches the opposite side for the first free HOR/VER
    // position.
    const startY = Math.max(2, first.box.maxY + 1 + extraGap - secondLayout.box.minY);
    const second = placeLayoutFree(cloneLayout(secondLayout), -firstSide, [first], node, startY);
    return composeLayout(node, [first, second]);
  }

  function layoutNAry(node, childrenLayouts, options = {}, sidePreference = 0) {
    const placed = [];
    const firstSide = preferredFirstSide(options, sidePreference);
    childrenLayouts.forEach((layout, i) => {
      const side = i % 2 === 0 ? firstSide : -firstSide;
      const startY = placed.length ? Math.max(...placed.map(p => p.box.maxY)) + 1 : 1;
      placed.push(placeLayoutFree(cloneLayout(layout), side, placed, node, startY));
    });
    return composeLayout(node, placed);
  }

  function branchClass(node, options = {}) {
    const id = String(node?.id || '').toLowerCase();
    const label = String(node?.label || '').toLowerCase();
    const cat = String(node?.cat || '').toLowerCase();
    const rootIds = [STRUCTURE_CONFIG.syntaxRoot, STRUCTURE_CONFIG.functionalRoot]
      .filter(Boolean)
      .map(v => String(v).toLowerCase());
    if (rootIds.includes(id) || ['s', 'clause'].includes(label) || ['s', 'clause'].includes(cat)) return 'top';
    if (id.includes('vp') || label === 'vp' || cat === 'vp' || id.includes('argstruct') || label.includes('arg-struct') || cat.includes('arg-struct')) return 'middle';
    return 'other';
  }

  function explicitBranchOrder(node, options = {}) {
    if (options.branchOrder === 'normal') return 'normal';
    if (options.branchOrder === 'flip-all') return 'flip';
    const branchType = branchClass(node, options);
    const override = options.branchOverrides?.[branchType] || 'auto';
    if (override === 'normal' || override === 'flip') return override;
    return 'auto';
  }

  function layoutWidth(layout) {
    return layout.box.maxX - layout.box.minX + 1;
  }

  function layoutHeight(layout) {
    return layout.box.maxY - layout.box.minY + 1;
  }

  function scoreCompact(layout) {
    const w = layoutWidth(layout);
    const h = layoutHeight(layout);
    // Area first, then height, then width.  This keeps the old free placement
    // principle but lets every branch locally pick the tighter child order.
    return w * h * 1000 + h * 20 + w;
  }

  function nodeByRoleOrPattern(layout, roleNames, patterns, options = {}) {
    const roles = roleNames.map(v => String(v).toLowerCase());
    const checks = patterns.map(v => String(v).toLowerCase());
    const matchesKind = n => {
      if (options.leaf === true && n.kind !== 'leaf') return false;
      if (options.leaf === false && n.kind === 'leaf') return false;
      return true;
    };
    return layout.nodes.find(n => matchesKind(n) && roles.includes(String(n.role || '').toLowerCase())) ||
      layout.nodes.find(n => matchesKind(n) && checks.some(p => String(n.id || '').toLowerCase().includes(p) || String(n.label || '').toLowerCase().includes(p) || String(n.cat || '').toLowerCase().includes(p)));
  }

  function distX(a, b) {
    if (!a || !b) return 0;
    return Math.abs(a.x - b.x);
  }

  function scoreAlign(layout) {
    // Alignment goal: choose branch flips that bring equivalent vertical
    // corridors nearer together.  In syntax this means NP-subj with subject
    // and NP-obj with object.  In functional this means ARG1/AGENS with
    // subject and ARG2/PATIENS with object.  The score is still penalised by
    // area, so align-mode does not produce needlessly large drawings.
    const subj = nodeByRoleOrPattern(layout, ['subject'], ['subject', 'subj'], { leaf: true });
    const obj = nodeByRoleOrPattern(layout, ['object'], ['object', 'obj'], { leaf: true });
    const subjParent = nodeByRoleOrPattern(layout, ['np-subj', 'agens', 'arg1'], ['np-subj', 'f-subj-np', 'arg1', 'agens'], { leaf: false });
    const objParent = nodeByRoleOrPattern(layout, ['np-obj', 'patiens', 'patient', 'arg2'], ['np-obj', 'f-obj-np', 'arg2', 'patiens', 'patient'], { leaf: false });
    const alignPenalty = distX(subj, subjParent) + distX(obj, objParent);
    return alignPenalty * 10000 + scoreCompact(layout);
  }

  function branchScore(layout, options = {}) {
    return options.branchOrder === 'auto-align' ? scoreAlign(layout) : scoreCompact(layout);
  }

  function composeBranch(node, childLayouts, options = {}, sidePreference = 0) {
    const order = explicitBranchOrder(node, options);
    const normalChildren = childLayouts;
    const flippedChildren = [...childLayouts].reverse();

    function layoutWithChildOrder(childrenForOrder) {
      if (childrenForOrder.length === 2) {
        return layoutBinary(node, cloneLayout(childrenForOrder[0]), cloneLayout(childrenForOrder[1]), options, sidePreference);
      }
      return layoutNAry(node, childrenForOrder.map(cloneLayout), options, sidePreference);
    }

    if (order === 'normal') return layoutWithChildOrder(normalChildren);
    if (order === 'flip') return layoutWithChildOrder(flippedChildren);

    const normalLayout = layoutWithChildOrder(normalChildren);
    const flippedLayout = layoutWithChildOrder(flippedChildren);
    const normalScore = branchScore(normalLayout, options);
    const flippedScore = branchScore(flippedLayout, options);
    return flippedScore < normalScore ? flippedLayout : normalLayout;
  }

  function layoutTree(node, sidePreference = 0, options = {}) {
    const children = node.children || [];
    if (children.length === 0) return layoutLeaf(node);

    const localFirstSide = preferredFirstSide(options, sidePreference);
    if (children.length === 1) {
      const child = layoutTree(children[0], localFirstSide, options);
      return layoutUnary(node, child, localFirstSide, options);
    }

    // v4408: flip is no longer only global.  Every branching node can be
    // decided independently.  Global normal/flip remain available, but the
    // default is auto-compact; auto-align selects flips that reduce vertical
    // distance between syntactic/functionele equivalents such as subject/AGENS
    // and object/PATIENS.
    const childLayouts = children.map(child => layoutTree(child, 0, options));
    return composeBranch(node, childLayouts, options, localFirstSide);
  }

  function normalizeLayout(layout) {
    const dx = -Math.floor((layout.box.minX + layout.box.maxX) / 2);
    return shiftLayout(layout, dx, 0);
  }

  function addOpnTopicalizationSlot(layout, rootId = null) {
    // v4408: OPN source trees reserve an explicit local fronting/topicalization
    // slot between the start node (S/CLAUSE) and the upper tree material.
    // This is a structural OPN slot, not a transformation of the tree.  All
    // non-root tree material is shifted down one grid row so the slot occupies
    // its own free HOR/VER position.
    const root = layout.nodes.find(n => n.id === rootId) || layout.nodes[0];
    if (!root) return layout;

    for (const node of layout.nodes) {
      if (node.id !== root.id) node.y += 1;
    }
    for (const edge of layout.edges) {
      if (edge.from !== root.id) edge.fromY += 1;
      if (edge.to !== root.id) edge.toY += 1;
    }
    for (const box of layout.boxes) {
      if (box.nodeId === root.id) {
        box.maxY += 1;
      } else {
        box.minY += 1;
        box.maxY += 1;
        if (typeof box.rootY === 'number') box.rootY += 1;
      }
    }
    layout.box.maxY += 1;
    layout.topicalizationSlot = {
      id: `${root.id}-topic-slot`,
      label: 'slot 1 · vooropplaatsing/topicalisatie',
      x: root.x,
      y: root.y + 1,
      rootId: root.id
    };
    return layout;
  }

  function layoutFirstSide() {
    return state.functionalOrder === 'right-first' ? 1 : -1;
  }

  function branchModeLabel() {
    if (state.branchOrder === 'auto-compact') return 'per-vertakking: compact';
    if (state.branchOrder === 'auto-align') return 'per-vertakking: align';
    if (state.branchOrder === 'flip-all') return 'flip alle vertakkingen';
    return 'normale takvolgorde';
  }

  function getSyntaxLayout() {
    const firstSide = layoutFirstSide();
    return normalizeLayout(addOpnTopicalizationSlot(layoutTree(cloneTree(treeSpec()), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.syntaxRoot || 's'));
  }

  function layoutFunctionalRoleTree(order = 'left-first') {
    // v4408: dedicated non-binary functional OPN layout with topicalization slot.
    // The root is CLAUSE. It is not a predicate-root tree and not a binary tree.
    // Bottom-up idea: role leaf-box -> role-box -> CLAUSE n-ary box.
    // Placement uses free HOR/VER corridors: every role/root node and every leaf
    // receives a distinct row and a distinct column. left-first/right-first only
    // changes the first search direction and then alternates.
    const firstSide = order === 'right-first' ? 1 : -1;
    const labels = roleLabels();
    const roles = [
      { roleId: 'ft-agens', roleLabel: 'AGENS', role: 'agens', leafId: 'hond', leafLabel: labels.subject, cat: 'N' },
      { roleId: 'ft-pred', roleLabel: 'PRED', role: 'pred', leafId: 'bijt', leafLabel: labels.predicate, cat: 'V' },
      { roleId: 'ft-patiens', roleLabel: 'PATIENS', role: 'patiens', leafId: 'man', leafLabel: labels.object, cat: 'N' }
    ];

    const nodes = [{ id: 'ft-clause', label: 'CLAUSE', cat: 'CLAUSE', role: 'top', kind: 'role-root', x: 0, y: 0 }];
    const edges = [];
    const boxes = [];
    const occupiedRows = new Set([0]);
    const occupiedCols = new Set([0]);
    const occupiedBoxes = [];

    function cellBox(x, y) { return { minX: x, maxX: x, minY: y, maxY: y }; }
    function freeAt(roleBox) {
      for (const b of occupiedBoxes) if (boxesOverlap(roleBox, b, 0)) return false;
      if (occupiedRows.has(roleBox.roleY) || occupiedRows.has(roleBox.leafY)) return false;
      if (occupiedCols.has(roleBox.roleX) || occupiedCols.has(roleBox.leafX)) return false;
      return true;
    }
    function reserve(roleBox) {
      occupiedRows.add(roleBox.roleY);
      occupiedRows.add(roleBox.leafY);
      occupiedCols.add(roleBox.roleX);
      occupiedCols.add(roleBox.leafX);
      occupiedBoxes.push({ minX: roleBox.minX, maxX: roleBox.maxX, minY: roleBox.minY, maxY: roleBox.maxY });
    }
    function findRoleBox(i) {
      const side = (i % 2 === 0 ? firstSide : -firstSide);
      const mirror = side < 0 ? -1 : 1;
      const baseY = 1 + i * 2;
      // Candidate order: first intended side; then wider on that side; then a
      // mirrored fallback. Rows only move down, never reuse an occupied row.
      for (let extraY = 0; extraY <= 20; extraY++) {
        const roleY = baseY + extraY;
        const leafY = roleY + 1;
        for (let d = 1; d <= 18; d++) {
          for (const s of [mirror, -mirror]) {
            const roleX = s * (1 + i + d - 1);
            const leafX = s * (2 + i + d - 1);
            const minX = Math.min(roleX, leafX);
            const maxX = Math.max(roleX, leafX);
            const roleBox = { roleX, roleY, leafX, leafY, minX, maxX, minY: roleY, maxY: leafY };
            if (freeAt(roleBox)) return roleBox;
          }
        }
      }
      const fallbackX = mirror * (i + 2);
      return { roleX: fallbackX, roleY: baseY + 30, leafX: fallbackX + mirror, leafY: baseY + 31, minX: Math.min(fallbackX, fallbackX + mirror), maxX: Math.max(fallbackX, fallbackX + mirror), minY: baseY + 30, maxY: baseY + 31 };
    }

    roles.forEach((item, i) => {
      const b = findRoleBox(i);
      reserve(b);
      nodes.push({ id: item.roleId, label: item.roleLabel, cat: item.roleLabel, role: item.role, kind: 'role', x: b.roleX, y: b.roleY });
      nodes.push({ id: item.leafId, label: item.leafLabel, cat: item.cat, role: item.role, kind: 'leaf', x: b.leafX, y: b.leafY });
      edges.push({ from: 'ft-clause', to: item.roleId, fromX: 0, fromY: 0, toX: b.roleX, toY: b.roleY });
      edges.push({ from: item.roleId, to: item.leafId, fromX: b.roleX, fromY: b.roleY, toX: b.leafX, toY: b.leafY });
      boxes.push({ id: `box-${item.roleId}`, label: `ROLE ${item.roleLabel}`, nodeId: item.roleId, rootX: b.roleX, rootY: b.roleY, minX: b.minX, maxX: b.maxX, minY: b.minY, maxY: b.maxY, roleBox: true });
    });

    let box = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    for (const n of nodes) box = unionBox(box, cellBox(n.x, n.y));
    boxes.unshift({ id: 'box-ft-clause', label: 'BOX CLAUSE', nodeId: 'ft-clause', rootX: 0, rootY: 0, minX: box.minX, maxX: box.maxX, minY: box.minY, maxY: box.maxY, clauseBox: true });
    return { node: { id: 'ft-clause', label: 'CLAUSE', kind: 'role-root' }, nodes, edges, boxes, box };
  }

  function getFunctionalLayout() {
    const firstSide = layoutFirstSide();
    return normalizeLayout(addOpnTopicalizationSlot(layoutTree(cloneTree(functionalSpec()), 0, { firstSide, branchOrder: state.branchOrder, branchOverrides: state.branchOverrides }), STRUCTURE_CONFIG.functionalRoot || 'ft-clause'));
  }

  function px(x, origin) { return origin.x + x * CELL; }
  function py(y, origin) { return origin.y + y * CELL; }

  function drawGrid(g, width = 1600, height = 1000) {
    const grid = svgEl('g', { class: 'grid' });
    for (let x = -400; x <= width; x += CELL / 2) {
      grid.appendChild(svgEl('line', { x1: x, y1: -200, x2: x, y2: height, class: 'grid-line' }));
    }
    for (let y = -160; y <= height; y += CELL / 2) {
      grid.appendChild(svgEl('line', { x1: -400, y1: y, x2: width, y2: y, class: 'grid-line' }));
    }
    grid.appendChild(svgEl('line', { x1: -400, y1: 0, x2: width, y2: 0, class: 'grid-axis' }));
    grid.appendChild(svgEl('line', { x1: 0, y1: -200, x2: 0, y2: height, class: 'grid-axis' }));
    g.appendChild(grid);
  }

  function subtreeBoxArea(box) {
    return (box.maxX - box.minX + 1) * (box.maxY - box.minY + 1);
  }

  function growthSupportedProjection(projection = state.projection) {
    return ['axes', 'source', 'log'].includes(projection);
  }

  function growthActive() {
    return !!state.growthEnabled && growthSupportedProjection(state.projection);
  }

  function setProjection(projection) {
    const next = projection || 'axes';
    if (growthSupportedProjection(state.projection) && state.growthStep > 0) {
      state.lastSupportedGrowthStep = state.growthStep;
    }
    state.projection = next;
    if (!growthSupportedProjection(next)) {
      stopGrowthPlayback();
      return;
    }
    if (state.growthEnabled && state.growthStep === 0 && state.lastSupportedGrowthStep > 0) {
      state.growthStep = Math.min(state.lastSupportedGrowthStep, growthStepMax());
    }
  }

  function activeCentralSpec() {
    if (state.centerMode === 'functional' || state.projection === 'log') return functionalSpec();
    return treeSpec();
  }

  function collectGrowthMetrics(root) {
    const byId = new Map();
    function visit(node, depth = 0) {
      let height = 0;
      for (const child of node.children || []) {
        const childInfo = visit(child, depth + 1);
        height = Math.max(height, childInfo.height + 1);
      }
      const info = { id: node.id, depth, height, node };
      byId.set(node.id, info);
      return info;
    }
    const rootInfo = visit(root, 0);
    return { byId, maxHeight: rootInfo.height, rootId: root.id };
  }

  function growthStepMax() {
    if (!growthSupportedProjection()) return 0;
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const structureSteps = metrics.maxHeight + 1;
    return state.projection === 'axes' ? structureSteps + 2 : structureSteps + 1;
  }

  function clampGrowthStep(value) {
    const max = growthStepMax();
    const n = Math.max(0, Math.min(max, Number(value) || 0));
    return n;
  }

  function stopGrowthPlayback() {
    if (state.growthTimer) {
      clearInterval(state.growthTimer);
      state.growthTimer = null;
    }
  }

  function setGrowthStep(value, rerender = true) {
    if (!growthSupportedProjection()) {
      stopGrowthPlayback();
      if (rerender) render();
      return;
    }
    state.growthStep = clampGrowthStep(value);
    if (state.growthStep > 0) state.lastSupportedGrowthStep = state.growthStep;
    if (state.growthStep >= growthStepMax()) stopGrowthPlayback();
    if (rerender) render();
  }

  function growthPlanForLayout(layout) {
    if (!growthActive()) return { active: false, current: Infinity, max: 0, nodeStep: new Map(), structureStep: 0, slotStep: 0, projectionStep: 0 };
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const structureStep = metrics.maxHeight + 1;
    const slotStep = structureStep + 1;
    const projectionStep = structureStep + 2;
    const max = state.projection === 'axes' ? projectionStep : slotStep;
    if (state.growthStep > max) state.growthStep = max;
    const nodeStep = new Map();
    for (const node of layout.nodes) {
      const info = metrics.byId.get(node.id);
      nodeStep.set(node.id, info ? (info.height + 1) : 1);
    }
    return { active: true, current: state.growthStep, max, nodeStep, structureStep, slotStep, projectionStep };
  }

  function visibleAt(plan, step) {
    return !plan || !plan.active || step <= plan.current;
  }

  function nodeGrowthStep(plan, nodeId) {
    return plan?.nodeStep?.get(nodeId) || 1;
  }

  function boxGrowthStep(plan, box) {
    return nodeGrowthStep(plan, box.nodeId);
  }

  function edgeGrowthStep(plan, edge) {
    return Math.max(nodeGrowthStep(plan, edge.from), nodeGrowthStep(plan, edge.to));
  }

  function growthLabel() {
    if (!growthSupportedProjection()) return 'Groei: niet actief in deze projectie';
    const max = growthStepMax();
    const step = clampGrowthStep(state.growthStep);
    if (!state.growthEnabled) return `Groei uit · max ${max}`;
    if (step === 0) return `stap 0/${max}: raster/titels`;
    const metrics = collectGrowthMetrics(activeCentralSpec());
    const structureStep = metrics.maxHeight + 1;
    if (step <= structureStep) return `stap ${step}/${max}: boom groeit bottom-up`;
    if (step === structureStep + 1) return `stap ${step}/${max}: OPN-slot 1`;
    return `stap ${step}/${max}: LEX-projectie en projectiepanelen`;
  }

  function orderedSubtreeBoxes(layout) {
    // v4408: render-order is explicit, not an accidental side effect of the
    // layout recursion or of JavaScript sort stability.  Large background boxes
    // are drawn first.  Equal-sized boxes use a deterministic spatial tie-break:
    // top-to-bottom, then left-to-right, then original layout order.
    return [...layout.boxes]
      .map((box, index) => ({ box, index }))
      .filter(item => !item.box.leaf)
      .sort((a, b) => {
        const areaDiff = subtreeBoxArea(b.box) - subtreeBoxArea(a.box);
        if (areaDiff) return areaDiff;
        const yDiff = a.box.minY - b.box.minY;
        if (yDiff) return yDiff;
        const xDiff = a.box.minX - b.box.minX;
        if (xDiff) return xDiff;
        return a.index - b.index;
      });
  }

  function drawSubtreeBoxes(g, layout, origin, growthPlan = null) {
    const ordered = orderedSubtreeBoxes(layout).filter(({ box }) => visibleAt(growthPlan, boxGrowthStep(growthPlan, box)));
    const rectLayer = svgEl('g', { class: 'subtree-box-rect-layer' });
    const captionLayer = svgEl('g', { class: 'subtree-box-caption-layer' });

    for (const { box } of ordered) {
      const x = px(box.minX - 0.75, origin);
      const y = py(box.minY - 0.55, origin);
      const w = (box.maxX - box.minX + 1.5) * CELL;
      const h = (box.maxY - box.minY + 1.1) * CELL;
      rectLayer.appendChild(svgEl('rect', { x, y, width: w, height: h, rx: 18, class: 'jan-subtree-box' }));
    }

    for (const { box } of ordered) {
      const x = px(box.minX - 0.75, origin);
      const y = py(box.minY - 0.55, origin);
      captionLayer.appendChild(svgEl('text', { x: x + 14, y: y + 24, class: 'jan-box-caption' }, `BOX ${box.label.replace(/^BOX\s+/i, '')}`));
    }

    g.appendChild(rectLayer);
    g.appendChild(captionLayer);
  }

  function drawOpnTopicalizationSlot(g, layout, origin, growthPlan = null) {
    if (!layout.topicalizationSlot) return;
    if (growthPlan?.active && !visibleAt(growthPlan, growthPlan.slotStep)) return;
    const slot = layout.topicalizationSlot;
    const x = px(slot.x, origin);
    const y = py(slot.y, origin);
    g.appendChild(svgEl('rect', { x: x - 125, y: y - 28, width: 250, height: 56, rx: 16, class: 'opn-topicalization-slot' }));
    g.appendChild(svgEl('text', { x, y: y - 36, class: 'slot-caption opn-slot-caption' }, 'OPN-slot 1'));
    g.appendChild(svgEl('text', { x, y: y + 5, class: 'opn-slot-label' }, 'vooropplaatsing / topicalisatie'));
  }

  function drawTreeEdges(g, layout, origin, growthPlan = null) {
    if (!state.showRelations) return;
    for (const edge of layout.edges) {
      if (!visibleAt(growthPlan, edgeGrowthStep(growthPlan, edge))) continue;
      g.appendChild(svgEl('line', {
        x1: px(edge.fromX, origin), y1: py(edge.fromY, origin) + 18,
        x2: px(edge.toX, origin), y2: py(edge.toY, origin) - 18,
        class: 'tree-edge syntax-tree-edge'
      }));
    }
  }

  function orderedTreeNodes(layout) {
    // v4408: actual node rendering is also explicit.  Shapes are drawn before
    // labels.  Within each layer, ties follow spatial order: top-to-bottom,
    // left-to-right, then original layout order.
    return [...layout.nodes]
      .map((node, index) => ({ node, index }))
      .sort((a, b) => {
        const yDiff = a.node.y - b.node.y;
        if (yDiff) return yDiff;
        const xDiff = a.node.x - b.node.x;
        if (xDiff) return xDiff;
        return a.index - b.index;
      });
  }

  function nodeRenderClass(node) {
    return `tree-node ${node.kind === 'leaf' ? 'leaf-node' : (node.kind === 'role' ? 'role-node' : 'cat-node')} ${state.selectedNodeId === node.id ? 'selected' : ''}`;
  }

  function makeSelectable(group, node, selectable) {
    if (selectable) group.addEventListener('click', () => selectNode(node.id));
    return group;
  }

  function drawTreeNodes(g, layout, origin, selectable = true, growthPlan = null) {
    const ordered = orderedTreeNodes(layout).filter(({ node }) => visibleAt(growthPlan, nodeGrowthStep(growthPlan, node.id)));
    const shapeLayer = svgEl('g', { class: 'node-shape-layer' });
    const labelLayer = svgEl('g', { class: 'node-label-layer' });

    for (const { node } of ordered) {
      const cx = px(node.x, origin);
      const cy = py(node.y, origin);
      const group = makeSelectable(svgEl('g', { class: `${nodeRenderClass(node)} node-shape`, 'data-node-id': node.id }), node, selectable);
      if (node.kind === 'leaf') {
        group.appendChild(svgEl('circle', { cx, cy, r: 27, class: 'node-circle' }));
      } else {
        const boxClass = node.kind === 'role-root' ? 'synt-box role-root-box' : (node.kind === 'role' ? 'synt-box role-box' : 'synt-box category-box');
        group.appendChild(svgEl('rect', { x: cx - 52, y: cy - 23, width: 104, height: 46, rx: 13, class: boxClass }));
      }
      shapeLayer.appendChild(group);
    }

    for (const { node } of ordered) {
      const cx = px(node.x, origin);
      const cy = py(node.y, origin);
      const group = makeSelectable(svgEl('g', { class: `${nodeRenderClass(node)} node-label`, 'data-node-id': node.id }), node, selectable);
      if (node.kind === 'leaf') {
        group.appendChild(svgEl('text', { x: cx, y: cy - 2, class: 'node-main-label' }, node.label));
        group.appendChild(svgEl('text', { x: cx, y: cy + 18, class: 'node-sub-label' }, node.cat));
      } else {
        group.appendChild(svgEl('text', { x: cx, y: cy + 5, class: 'box-label' }, node.label));
      }
      labelLayer.appendChild(group);
    }

    g.appendChild(shapeLayer);
    g.appendChild(labelLayer);
  }

  function drawSyntaxTree(g, origin, options = {}) {
    const layout = getSyntaxLayout();
    const growthPlan = growthPlanForLayout(layout);
    layout.__growthPlan = growthPlan;
    drawSubtreeBoxes(g, layout, origin, growthPlan);
    drawTreeEdges(g, layout, origin, growthPlan);
    drawOpnTopicalizationSlot(g, layout, origin, growthPlan);
    drawTreeNodes(g, layout, origin, options.selectable !== false, growthPlan);
    return layout;
  }

  function layoutNodeMap(layout, origin) {
    const map = new Map();
    for (const node of layout.nodes) {
      const entry = { ...node, px: px(node.x, origin), py: py(node.y, origin) };
      map.set(node.id, entry);
      if (node.source && !map.has(node.source)) map.set(node.source, entry);
    }
    if (layout.topicalizationSlot) {
      const slot = layout.topicalizationSlot;
      map.set('opn-topic-slot', { id: slot.id, label: slot.label, kind: 'opn-slot', x: slot.x, y: slot.y, px: px(slot.x, origin), py: py(slot.y, origin) });
    }
    return map;
  }

  function drawAxisTitle(g, x, y, text) {
    g.appendChild(svgEl('text', { x, y, class: 'axis-title' }, text));
  }

  function lexTopicSlotY(sourceMap = null, y0 = 0) {
    const slot = sourceMap ? sourceMap.get('opn-topic-slot') : null;
    return slot ? slot.py : y0;
  }

  function drawLexTopicSlot(g, x, y) {
    g.appendChild(svgEl('rect', { x: x - 98, y: y - 27, width: 196, height: 54, rx: 16, class: 'lex-free-slot topic-slot' }));
    g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 1 · vooropplaatsing'));
    g.appendChild(svgEl('text', { x, y: y + 5, class: 'lex-local-label' }, 'TOPIC'));
  }

  function lexItemY(item, index, y0, sourceMap = null) {
    const p = item.source && sourceMap ? sourceMap.get(item.source) : null;
    if (p) return p.py;

    // Slot 0: Comp/(om)dat is a local LEX slot. In the axes view it must sit
    // one grid row above the central S/CLAUSE root box, not in the ordinary
    // local utterance list. This keeps the central tree invariant and makes
    // the Comp slot a genuine LEX-axis position.
    if (!item.source && item.slot === 'comp') {
      const root = sourceMap ? (sourceMap.get('s') || sourceMap.get('ft-clause')) : null;
      return root ? root.py - CELL : y0 - CELL;
    }

    return y0 + index * 64;
  }

  function lexSlotIndex(item, index) {
    return item.slot === 'comp' ? '0' : String(index + 1);
  }

  function drawLexAxis(g, x, y0, items, sourceMap = null) {
    const horizontalProjectionMode = !!sourceMap;
    drawAxisTitle(g, x - 98, y0 - 70, horizontalProjectionMode ? 'LEX-projectie · horizontaal' : 'LEX-as · lokale uitingtype-regel');

    const itemYs = items.map((item, i) => lexItemY(item, i, y0, sourceMap));
    const topicSlotY = sourceMap ? lexTopicSlotY(sourceMap, y0) : null;
    const axisYs = [...itemYs, ...(topicSlotY === null ? [] : [topicSlotY]), y0 - 48, y0 + Math.max(3, items.length) * 64 + 40];
    const axisMinY = Math.min(...axisYs) - 36;
    const axisMaxY = Math.max(...axisYs) + 44;
    g.appendChild(svgEl('line', { x1: x, y1: axisMinY, x2: x, y2: axisMaxY, class: 'lex-axis-line' }));

    const positions = new Map();
    if (sourceMap && topicSlotY !== null) drawLexTopicSlot(g, x, topicSlotY);
    items.forEach((item, i) => {
      const p = item.source && sourceMap ? sourceMap.get(item.source) : null;
      // Fase 2: bronknopen projecteren horizontaal op LEX. De LEX-kopie krijgt
      // daarom dezelfde y-positie als de centrale bronknoop. Lokale items
      // zoals OMDAT blijven op de uitingtype-regel staan.
      const y = lexItemY(item, i, y0, sourceMap);
      positions.set(item.id, { x, y, item, sourcePoint: p || null });
      if (!item.source && item.slot === 'comp') {
        g.appendChild(svgEl('rect', { x: x - 86, y: y - 28, width: 172, height: 56, rx: 16, class: 'lex-free-slot comp-slot' }));
        g.appendChild(svgEl('text', { x, y: y - 34, class: 'slot-caption' }, 'slot 0 · Comp/(om)dat'));
      } else if (!item.source) {
        g.appendChild(svgEl('rect', { x: x - 66, y: y - 26, width: 132, height: 52, rx: 14, class: 'lex-local-slot' }));
      } else {
        g.appendChild(svgEl('rect', { x: x - 62, y: y - 28, width: 124, height: 56, rx: 14, class: 'lex-slot-box lex-projection-slot' }));
      }
      g.appendChild(svgEl('text', { x: x - 92, y: y + 5, class: 'lex-index' }, lexSlotIndex(item, i)));
      g.appendChild(svgEl('text', { x, y: y + 5, class: item.source ? 'lex-label' : 'lex-local-label' }, item.label));
    });

    if (sourceMap) {
      for (const item of items) {
        if (!item.source) continue;
        const p = sourceMap.get(item.source);
        if (!p) continue;
        // Projecties zijn vanaf v4384 horizontaal: geen knik en geen verticale
        // correctie op de as. Dit is het model voor alle latere projecties.
        g.appendChild(pathEl(`M ${p.px} ${p.py} L ${x} ${p.py}`, { class: 'projection-line lex horizontal' }));
      }
    }
    return positions;
  }

  function syntaxRules() {
    return (STRUCTURE_CONFIG.syntaxNodes || [])
      .filter(n => (n.children || []).length)
      .map(n => `${n.label.replace(/\{subject\}/gi, 'SUBJ').replace(/\{object\}/gi, 'OBJ').replace(/\{predicate\}/gi, roleLabels().predicate).replace(/\{pv\}/gi, 'PV').replace(/\{vdw\}/gi, 'VDW')} → ${n.children.map(id => {
        const child = (STRUCTURE_CONFIG.syntaxNodes || []).find(c => c.id === id);
        return child ? child.label.replace(/\{subject\}/gi, 'SUBJ').replace(/\{object\}/gi, 'OBJ').replace(/\{predicate\}/gi, roleLabels().predicate).replace(/\{pv\}/gi, 'PV').replace(/\{vdw\}/gi, 'VDW') : id;
      }).join(' ')}`);
  }

  function drawSyntaxRules(g, x, y) {
    drawAxisTitle(g, x, y - 60, 'SYNTAX-projectie · regels');
    const rules = syntaxRules();
    rules.forEach((rule, i) => {
      const yy = y + i * 66;
      g.appendChild(svgEl('rect', { x: x - 62, y: yy - 26, width: 170, height: 52, rx: 14, class: 'syntax-rule-box' }));
      g.appendChild(svgEl('text', { x: x - 42, y: yy + 5, class: 'rule-label' }, rule));
    });
  }

  function drawFunctional(g, origin, options = {}) {
    const layout = getFunctionalLayout();
    const rootLabel = layout.node?.label || STRUCTURE_CONFIG.functionalRoot || 'CLAUSE';
    const functionalNodes = STRUCTURE_CONFIG.functionalNodes || [];
    const rootDef = functionalNodes.find(n => n.id === STRUCTURE_CONFIG.functionalRoot);
    const roleNames = (rootDef?.children || [])
      .map(id => functionalNodes.find(n => n.id === id)?.label || id)
      .join(' + ') || 'role-boxen';
    if (options.showTitle !== false) drawAxisTitle(g, origin.x - 180, origin.y - 70, `OPN · functionele structuur · ${rootLabel} → ${roleNames} · ${state.functionalOrder}`);
    drawAxisTitle(g, origin.x - 176, origin.y - 48, `v4408 · ${branchModeLabel()} · left/right stuurt vrije plaatsing`);
    const growthPlan = growthPlanForLayout(layout);
    layout.__growthPlan = growthPlan;
    drawSubtreeBoxes(g, layout, origin, growthPlan);
    drawTreeEdges(g, layout, origin, growthPlan);
    drawOpnTopicalizationSlot(g, layout, origin, growthPlan);
    drawTreeNodes(g, layout, origin, options.selectable !== false, growthPlan);
    return layout;
  }

  function drawAxes() {
    const g = baseSvg('axes-view');
    const origin = { x: 760, y: 115 };
    drawAxisTitle(g, origin.x - 170, origin.y - 76, state.centerMode === 'functional' ? `CENTRAAL · OPN-functioneel · structure-config · ${state.functionalOrder}` : `CENTRAAL · OPN-syntaxboom · structure-config · ${state.functionalOrder}`);

    let sourceMap = null;
    let centralLayout = null;
    if (state.centerMode === 'functional') {
      centralLayout = drawFunctional(g, origin, { showTitle: false });
      sourceMap = layoutNodeMap(centralLayout, origin);
    } else {
      centralLayout = drawSyntaxTree(g, origin);
      sourceMap = layoutNodeMap(centralLayout, origin);
    }

    const growthPlan = centralLayout?.__growthPlan;
    const showProjectionPanels = !growthPlan?.active || visibleAt(growthPlan, growthPlan.projectionStep);
    if (showProjectionPanels) {
      drawLexAxis(g, 210, 185, activeLexItems(), sourceMap);
      drawSyntaxRules(g, 1240, 180);
    } else {
      drawAxisTitle(g, 165, 116, `Groei-presentatie · ${growthLabel()}`);
      drawAxisTitle(g, 1210, 116, 'SYNTAX-projectie verschijnt in de laatste stap');
    }
    els.svg.appendChild(g);
  }

  function drawSource() {
    const g = baseSvg('source-view');
    if (state.centerMode === 'functional') {
      drawFunctional(g, { x: 760, y: 170 });
      drawAxisTitle(g, 520, 70, `BRON · OPN-functioneel · slot 1 + structure-config · ${state.functionalOrder}`);
    } else {
      drawAxisTitle(g, 490, 58, 'BRON · OPN-syntax-tree · structure-config + vrije HOR/VER-boxplaatsing');
      drawSyntaxTree(g, { x: 780, y: 125 });
    }
    els.svg.appendChild(g);
  }

  function drawLex() {
    const g = baseSvg('lex-view');
    drawLexAxis(g, 560, 130, activeLexItems(), null);
    g.appendChild(svgEl('text', { x: 700, y: 70, class: 'axis-title' }, state.example.lexRule === 'bijzin-omdat' ? 'Regel: bijzin met lokaal Comp-slot' : 'Regel: hoofdzin zonder verplaatsing'));
    els.svg.appendChild(g);
  }

  function drawSynt() {
    const g = baseSvg('synt-view');
    drawSyntaxRules(g, 540, 130);
    g.appendChild(svgEl('text', { x: 540, y: 370, class: 'rule-label' }, 'Alleen regels. Geen rollenboom en geen LEX-verplaatsing op de syntax-as.'));
    els.svg.appendChild(g);
  }

  function drawLog() {
    const g = baseSvg('log-view');
    drawFunctional(g, { x: 650, y: 165 });
    els.svg.appendChild(g);
  }

  function baseSvg(className) {
    els.svg.replaceChildren();
    els.svg.setAttribute('viewBox', '0 0 1500 900');
    els.svg.classList.toggle('no-grid', !state.showGrid);
    const g = svgEl('g', { class: className });
    if (state.showGrid) drawGrid(g, 1500, 900);
    return g;
  }

  function render() {
    syncControls();
    if (state.projection === 'source') drawSource();
    else if (state.projection === 'lex') drawLex();
    else if (state.projection === 'synt') drawSynt();
    else if (state.projection === 'log') drawLog();
    else drawAxes();
    renderSideLists();
    renderStatus();
    renderSelection();
  }

  function renderStatus() {
    els.titleLine.textContent = `${activeSentenceText()} · ${state.projectionLabel || projectionLabel()} · ${state.centerMode === 'syntax' ? 'OPN-syntaxboom' : 'OPN-functioneel'}`;
    els.metaLine.textContent = `${state.example.phase} · centrale boom invariant · LEX=${activeSentenceText()} · HTML-input=examples-input.html · lexicon=lexicon-config.html · editor=examples-editor.html`;
    if (els.sentencePreview) els.sentencePreview.innerHTML = activeSentenceHtml();
    const baseFeedback = state.projection === 'source'
      ? 'Bron toont de gekozen OPN-bron uit structure-config.html. Syntax en functioneel gebruiken bottom-up recursieve box-layout; left/right stuurt beide layouts; takvolgorde kan globaal, compact-auto of align-auto zijn.'
      : 'Faseversie: eerst structure-config, dan voorbeeldzinnen die naar die sources projecteren, dan lokale LEX-regel.';
    els.actionFeedback.textContent = state.growthEnabled ? `${baseFeedback} · ${growthLabel()}` : baseFeedback;
    els.projectionHelp.textContent = helpText();
    els.explainHeading.textContent = `Uitleg · ${activeSentenceText()}`;
    els.explainText.textContent = state.example.id === 'hond-bijt-man'
      ? 'Eerst wordt alleen de centrale syntax-tree opgebouwd. Daarna projecteert LEX de drie eindknopen HOND, BIJT en MAN horizontaal op de LEX-as; OPN-slot 1 reserveert vooropplaatsing tussen S en de boom; Comp/(om)dat gebruikt LEX-slot 0 net boven de S-box. Er is nog geen lokale bijzinregel.'
      : 'De centrale syntax-tree blijft HOND-BIJT-MAN. De bijzin wordt uitsluitend lokaal op de LEX-as gevormd: OMDAT staat in LEX-slot 0 net boven S/CLAUSE; OPN-slot 1 reserveert vooropplaatsing/topicalisatie. Lidwoorden zijn uit het systeem verwijderd.';
  }

  function projectionLabel() {
    return ({ axes: 'OPN/assen', source: 'Bron', lex: 'LEX', synt: 'SYNTAX-projectie', log: 'LOG/FT' })[state.projection] || state.projection;
  }

  function helpText() {
    if (state.projection === 'source') return 'Bron: OPN-syntax en OPN-functioneel worden gelezen uit structure-config.html. Beide gebruiken dezelfde left/right layoutstrategie en reserveren OPN-slot 1.';
    if (state.projection === 'lex') return 'LEX: lokale uitingtype-regel. OMDAT is lokaal en wijzigt de boom niet. Lidwoorden zijn verwijderd.';
    if (state.projection === 'synt') return 'SYNTAX-projectie: regels uit structure-config.html. Nieuwe VP-regelsets worden hier zichtbaar.';
    if (state.projection === 'log') return 'LOG/FT: functioneel = CLAUSE met aparte PRED-knoop en ARG-STRUCT-subtree; bottom-up vrij geplaatst.';
    return 'Assen: centrale OPN-boom uit structure-config.html; horizontale projecties naar LEX links; SYNTAX-regels rechts.';
  }

  function renderSideLists() {
    els.lexOrderList.replaceChildren();
    activeLexItems().forEach((item, i) => {
      const row = document.createElement('div');
      row.className = `lex-order-item ${item.source ? '' : 'local'}`;
      row.textContent = `${i + 1}. ${item.label}${item.role ? ' · ' + item.role : ''}${item.source ? '' : ' · lokaal'}`;
      els.lexOrderList.appendChild(row);
    });
    fillEdgeList();
  }

  function fillEdgeList() {
    if (!els.edgeList) return;
    els.edgeList.replaceChildren();
    const rows = syntaxRules();
    for (const row of rows) {
      const div = document.createElement('div');
      div.className = 'edge-item';
      div.textContent = row;
      els.edgeList.appendChild(div);
    }
  }

  function fillSelect(select, options, selected) {
    if (!select) return;
    select.replaceChildren();
    for (const opt of options) {
      const el = document.createElement('option');
      el.value = opt.id;
      el.textContent = opt.label || opt.title || opt.id;
      if (opt.id === selected) el.selected = true;
      select.appendChild(el);
    }
  }

  function syncControls() {
    fillSelect(els.exampleSelect, EXAMPLES, state.example.id);
    fillSelect(els.centralModeSelect, CENTER_MODES, state.centerMode);
    fillSelect(els.functionalOrderSelect, FUNCTIONAL_ORDERS, state.functionalOrder);
    fillSelect(els.branchOrderSelect, BRANCH_ORDERS, state.branchOrder);
    fillSelect(els.branchTopSelect, BRANCH_CHOICES, state.branchOverrides.top);
    fillSelect(els.branchMiddleSelect, BRANCH_CHOICES, state.branchOverrides.middle);
    fillSelect(els.branchOtherSelect, BRANCH_CHOICES, state.branchOverrides.other);
    if (els.functionalOrderSelect) els.functionalOrderSelect.disabled = false;
    if (els.branchOrderSelect) els.branchOrderSelect.disabled = false;
    fillSelect(els.lexRuleSelect, LEX_RULES, state.example.lexRule);
    if (els.showGridInput) els.showGridInput.checked = state.showGrid;
    if (els.showRelationsInput) els.showRelationsInput.checked = state.showRelations;
    if (els.showLabelsInput) els.showLabelsInput.checked = state.showLabels;
    const growthSupported = growthSupportedProjection();
    const growthMax = growthSupported ? growthStepMax() : 0;
    if (growthSupported) {
      state.growthStep = clampGrowthStep(state.growthStep);
      if (state.growthStep > 0) state.lastSupportedGrowthStep = state.growthStep;
    }
    if (els.growthEnabledInput) {
      els.growthEnabledInput.checked = state.growthEnabled;
      els.growthEnabledInput.disabled = !growthSupported;
    }
    if (els.growthStepInput) {
      els.growthStepInput.min = 0;
      els.growthStepInput.max = growthMax;
      els.growthStepInput.value = growthSupported ? state.growthStep : state.lastSupportedGrowthStep;
      els.growthStepInput.disabled = !state.growthEnabled || !growthSupported;
    }
    if (els.growthStepLabel) els.growthStepLabel.textContent = growthLabel();
    if (els.growthPrevButton) els.growthPrevButton.disabled = !state.growthEnabled || !growthSupported || state.growthStep <= 0;
    if (els.growthNextButton) els.growthNextButton.disabled = !state.growthEnabled || !growthSupported || state.growthStep >= growthMax;
    if (els.growthResetButton) els.growthResetButton.disabled = !state.growthEnabled || !growthSupported;
    if (els.growthPlayButton) {
      els.growthPlayButton.disabled = !growthSupported;
      els.growthPlayButton.textContent = state.growthTimer ? 'Pauze' : 'Play';
    }
    document.querySelectorAll('.projection-tab').forEach(tab => {
      const active = tab.dataset.projection === state.projection;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  function selectNode(id) {
    state.selectedNodeId = id;
    renderSelection();
    render();
  }

  function renderSelection() {
    const layout = state.centerMode === 'functional' ? getFunctionalLayout() : getSyntaxLayout();
    const node = layout.nodes.find(n => n.id === state.selectedNodeId);
    if (!node) {
      els.selectionEmpty?.classList.remove('hidden');
      els.nodeEditor?.classList.add('hidden');
      return;
    }
    els.selectionEmpty?.classList.add('hidden');
    els.nodeEditor?.classList.remove('hidden');
    if (els.nodeIdField) els.nodeIdField.value = node.id;
    if (els.nodeLabelInput) els.nodeLabelInput.value = node.label;
    fillSelect(els.nodeCatInput, [{ id: node.cat, label: node.cat }], node.cat);
    fillSelect(els.nodeRoleInput, [{ id: node.role || 'syntax', label: node.role || 'syntax' }], node.role || 'syntax');
    if (els.nodeXInput) els.nodeXInput.value = node.x;
    if (els.nodeYInput) els.nodeYInput.value = node.y;
  }

  function download(filename, text, type = 'application/json') {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadJson() {
    const payload = {
      version: VERSION,
      example: state.example.id,
      central_opn: state.centerMode,
      functional_order: state.functionalOrder,
      branch_order: state.branchOrder,
      branch_overrides: state.branchOverrides,
      syntax_rules: syntaxRules(),
      structure_config: 'structure-config.html',
      lex: activeLexItems()
    };
    download(`${state.example.id}.${VERSION}.json`, JSON.stringify(payload, null, 2));
  }

  function downloadOpn() {
    const lines = [
      `opn_version: ${VERSION}`,
      `example: ${state.example.title}`,
      'tree:',
      ...syntaxRules().map(rule => `  ${rule}`),
      `lex: ${activeSentenceText()}`,
      `lex_rule: ${state.example.lexRule}`,
      `functional_order: ${state.functionalOrder}`,
      `branch_order: ${state.branchOrder}`,
      `branch_overrides: top=${state.branchOverrides.top}, middle=${state.branchOverrides.middle}, other=${state.branchOverrides.other}`
    ];
    download(`${state.example.id}.${VERSION}.opn`, lines.join('\n'), 'text/plain');
  }

  function registerEvents() {
    document.querySelectorAll('.projection-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        setProjection(tab.dataset.projection || 'axes');
        render();
      });
    });
    els.exampleSelect?.addEventListener('change', event => {
      state.example = EXAMPLES.find(e => e.id === event.target.value) || EXAMPLES[0];
      state.roleSwap = false;
      state.selectedNodeId = null;
      render();
    });
    els.centralModeSelect?.addEventListener('change', event => {
      state.centerMode = event.target.value;
      render();
    });
    els.functionalOrderSelect?.addEventListener('change', event => {
      state.functionalOrder = event.target.value === 'right-first' ? 'right-first' : 'left-first';
      render();
    });
    els.branchOrderSelect?.addEventListener('change', event => {
      const allowed = new Set(BRANCH_ORDERS.map(opt => opt.id));
      state.branchOrder = allowed.has(event.target.value) ? event.target.value : 'auto-compact';
      render();
    });
    const updateBranchOverride = (key, value) => {
      state.branchOverrides[key] = ['auto', 'normal', 'flip'].includes(value) ? value : 'auto';
      render();
    };
    els.branchTopSelect?.addEventListener('change', event => updateBranchOverride('top', event.target.value));
    els.branchMiddleSelect?.addEventListener('change', event => updateBranchOverride('middle', event.target.value));
    els.branchOtherSelect?.addEventListener('change', event => updateBranchOverride('other', event.target.value));
    els.lexRuleSelect?.addEventListener('change', event => {
      const targetExample = event.target.value === 'bijzin-omdat' ? (EXAMPLES.find(e => e.lexRule === 'bijzin-omdat') || EXAMPLES[1]) : (EXAMPLES.find(e => e.lexRule === 'hoofdzininvariant') || EXAMPLES[0]);
      state.example = targetExample;
      state.roleSwap = false;
      render();
    });
    els.showGridInput?.addEventListener('change', event => { state.showGrid = event.target.checked; render(); });
    els.showRelationsInput?.addEventListener('change', event => { state.showRelations = event.target.checked; render(); });
    els.showLabelsInput?.addEventListener('change', event => { state.showLabels = event.target.checked; render(); });
    els.growthEnabledInput?.addEventListener('change', event => {
      state.growthEnabled = event.target.checked;
      if (state.growthEnabled && state.growthStep === 0) state.growthStep = 1;
      if (!state.growthEnabled) stopGrowthPlayback();
      render();
    });
    els.growthStepInput?.addEventListener('input', event => setGrowthStep(event.target.value));
    els.growthPrevButton?.addEventListener('click', () => { state.growthEnabled = true; setGrowthStep(state.growthStep - 1); });
    els.growthNextButton?.addEventListener('click', () => { state.growthEnabled = true; setGrowthStep(state.growthStep + 1); });
    els.growthResetButton?.addEventListener('click', () => { state.growthEnabled = true; stopGrowthPlayback(); setGrowthStep(0); });
    els.growthPlayButton?.addEventListener('click', () => {
      if (state.growthTimer) { stopGrowthPlayback(); render(); return; }
      if (!growthSupportedProjection()) return;
      state.growthEnabled = true;
      if (state.growthStep >= growthStepMax()) state.growthStep = 0;
      state.growthTimer = setInterval(() => setGrowthStep(state.growthStep + 1), 850);
      render();
    });
    els.resetExampleButton?.addEventListener('click', () => { state.selectedNodeId = null; render(); });
    els.fitButton?.addEventListener('click', () => { els.svg.setAttribute('viewBox', '0 0 1500 900'); });
    els.downloadJsonButton?.addEventListener('click', downloadJson);
    els.downloadOpnButton?.addEventListener('click', downloadOpn);
    els.applyLexRuleButton?.addEventListener('click', () => {
      state.example = state.example.lexRule === 'bijzin-omdat' ? (EXAMPLES.find(e => e.lexRule === 'bijzin-omdat') || EXAMPLES[1]) : (EXAMPLES.find(e => e.lexRule === 'hoofdzininvariant') || EXAMPLES[0]);
      render();
    });
    els.swapRolesButton?.addEventListener('click', () => {
      state.roleSwap = !state.roleSwap;
      render();
    });
    for (const button of [els.undoButton, els.redoButton, els.addNodeButton, els.duplicateNodeButton, els.deleteNodeButton, els.applyNodeButton, els.addEdgeButton, els.lexLeftButton, els.lexRightButton]) {
      button?.addEventListener('click', () => {
        if (els.actionFeedback) els.actionFeedback.textContent = 'Deze redesign-fase is bewust beperkt: eerst layout corrigeren, daarna editing weer uitbreiden.';
      });
    }
    window.addEventListener('keydown', event => {
      if (event.key === '1') setProjection('axes');
      else if (event.key === '2') setProjection('source');
      else if (event.key === '3') setProjection('lex');
      else if (event.key.toLowerCase() === 'g') { state.growthEnabled = !state.growthEnabled; if (state.growthEnabled && state.growthStep === 0) state.growthStep = 1; }
      else if (event.key.toLowerCase() === 'n') { state.growthEnabled = true; setGrowthStep(state.growthStep + 1, false); }
      else if (event.key.toLowerCase() === 'p') { state.growthEnabled = true; setGrowthStep(state.growthStep - 1, false); }
      else if (event.key.toLowerCase() === 'f') els.svg.setAttribute('viewBox', '0 0 1500 900');
      else return;
      render();
    });
  }

  async function init() {
    registerEvents();
    await loadStructureConfig();
    await loadExamplesFromHtml();
    render();
    window.__opengraphBoot = { version: VERSION, loaded: true };
    // v4408: lokale ontwikkelviewer gebruikt geen PWA-cache meer.
    // Oude service workers worden actief verwijderd, zodat structure-config/examples-input
    // niet per ongeluk uit een oudere versie blijven komen.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(registrations => Promise.all(registrations.map(reg => reg.unregister())))
        .catch(() => {});
    }
  }

  init();
})();
