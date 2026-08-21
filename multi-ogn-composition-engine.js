(function attachMultiOgnCompositionEngine(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OGNMultiComposition = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function multiOgnCompositionFactory() {
  'use strict';

  const SCHEMA = 'ogn-multi-composition-v2';
  const LEGACY_SCHEMA = 'ogn-multi-composition-v1';
  const BRANCH_VARIANTS = Object.freeze(['normal', 'left-right', 'short-long', 'both']);

  function finiteNumber(value, label) {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error(`${label} moet een eindig getal zijn.`);
    return number;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function coordinateKey(value) {
    return String(Math.round(finiteNumber(value, 'gridcoördinaat') * 1e9) / 1e9);
  }

  function layoutBox(layout) {
    const nodes = Array.isArray(layout?.nodes) ? layout.nodes : [];
    if (!nodes.length) throw new Error('Een OGN-eenheid moet minstens één knoop bevatten.');
    return {
      minX: Math.min(...nodes.map(node => finiteNumber(node.x, `${node.id || 'knoop'}.x`))),
      maxX: Math.max(...nodes.map(node => finiteNumber(node.x, `${node.id || 'knoop'}.x`))),
      minY: Math.min(...nodes.map(node => finiteNumber(node.y, `${node.id || 'knoop'}.y`))),
      maxY: Math.max(...nodes.map(node => finiteNumber(node.y, `${node.id || 'knoop'}.y`)))
    };
  }

  function validateUnit(layout) {
    const nodes = Array.isArray(layout?.nodes) ? layout.nodes : [];
    if (!nodes.length) return false;
    const ids = new Set();
    const rows = new Set();
    const columns = new Set();
    for (const node of nodes) {
      const id = String(node?.id || '');
      if (!id || ids.has(id)) return false;
      ids.add(id);
      let row;
      let column;
      try {
        row = coordinateKey(node.y);
        column = coordinateKey(node.x);
      } catch (_error) {
        return false;
      }
      if (rows.has(row) || columns.has(column)) return false;
      rows.add(row);
      columns.add(column);
    }
    return true;
  }

  function assertUnit(layout, unitId = 'OGN') {
    if (!validateUnit(layout)) {
      throw new Error(`OGN GRID-INVARIANT geschonden binnen ${unitId}: iedere knoop vereist een eigen rij en kolom.`);
    }
    return layout;
  }

  function shiftLayout(layout, dx, dy) {
    const shifted = clone(layout);
    for (const node of shifted.nodes || []) {
      node.x = finiteNumber(node.x, `${node.id}.x`) + dx;
      node.y = finiteNumber(node.y, `${node.id}.y`) + dy;
    }
    for (const edge of shifted.edges || []) {
      if (Number.isFinite(Number(edge.fromX))) edge.fromX = Number(edge.fromX) + dx;
      if (Number.isFinite(Number(edge.fromY))) edge.fromY = Number(edge.fromY) + dy;
      if (Number.isFinite(Number(edge.toX))) edge.toX = Number(edge.toX) + dx;
      if (Number.isFinite(Number(edge.toY))) edge.toY = Number(edge.toY) + dy;
    }
    for (const box of shifted.boxes || []) {
      for (const key of ['minX', 'maxX', 'rootX']) if (Number.isFinite(Number(box[key]))) box[key] = Number(box[key]) + dx;
      for (const key of ['minY', 'maxY', 'rootY']) if (Number.isFinite(Number(box[key]))) box[key] = Number(box[key]) + dy;
    }
    shifted.box = layoutBox(shifted);
    return shifted;
  }

  function nodeById(layout, nodeId) {
    return (layout?.nodes || []).find(node => String(node.id) === String(nodeId)) || null;
  }

  function sharedCoordinates(firstLayout, secondLayout, axis) {
    const first = new Map((firstLayout?.nodes || []).map(node => [coordinateKey(node[axis]), node.id]));
    const shared = [];
    for (const node of secondLayout?.nodes || []) {
      const key = coordinateKey(node[axis]);
      if (first.has(key)) shared.push({ coordinate: Number(node[axis]), first: first.get(key), second: node.id });
    }
    return shared;
  }

  function rigidDeltaBeforeAfter(before, after) {
    const original = new Map((before?.nodes || []).map(node => [String(node.id), node]));
    const deltas = (after?.nodes || []).map(node => {
      const prior = original.get(String(node.id));
      if (!prior) throw new Error(`Knoop ${node.id} ontbreekt vóór de compositiestap.`);
      return { dx: Number(node.x) - Number(prior.x), dy: Number(node.y) - Number(prior.y) };
    });
    const first = deltas[0] || { dx: 0, dy: 0 };
    if (!deltas.every(delta => coordinateKey(delta.dx) === coordinateKey(first.dx) && coordinateKey(delta.dy) === coordinateKey(first.dy))) {
      throw new Error('Een OGN-eenheid is intern vervormd; compositie mag uitsluitend star verschuiven.');
    }
    return first;
  }

  function normalizeBranchCandidate(value, index = 0) {
    const candidate = value && typeof value === 'object' ? value : {};
    const id = String(candidate.id || `branch-${index + 1}`).trim();
    const unitId = String(candidate.unitId || candidate.unit_id || '').trim();
    const nodeId = String(candidate.nodeId || candidate.node_id || '').trim();
    if (!id || !unitId || !nodeId) {
      throw new Error(`Flipkandidaat ${index + 1} vereist id, unitId en nodeId.`);
    }
    const requested = Array.isArray(candidate.variants) && candidate.variants.length
      ? candidate.variants.map(item => String(item || '').trim().toLowerCase())
      : [...BRANCH_VARIANTS];
    const variants = [...new Set(requested)];
    if (!variants.length || variants.some(variant => !BRANCH_VARIANTS.includes(variant))) {
      throw new Error(`Flipkandidaat ${id} bevat een onbekende variant.`);
    }
    if (!variants.includes('normal')) variants.unshift('normal');
    return Object.freeze({
      id,
      unitId,
      nodeId,
      variants: Object.freeze(variants),
      defaultVariant: 'normal',
      operation: 'binary-placement-variant',
      linearization: String(candidate.linearization || 'none').trim().toLowerCase() === 'child-order'
        ? 'child-order'
        : 'none'
    });
  }

  function normalizeBranchCandidates(values = []) {
    const ids = new Set();
    const endpoints = new Set();
    return Object.freeze((Array.isArray(values) ? values : []).map((value, index) => {
      const candidate = normalizeBranchCandidate(value, index);
      const endpoint = `${candidate.unitId}:${candidate.nodeId}`;
      if (ids.has(candidate.id)) throw new Error(`Dubbele flipkandidaat-id: ${candidate.id}.`);
      if (endpoints.has(endpoint)) throw new Error(`Vertakking ${endpoint} is meer dan eenmaal als flipkandidaat gedeclareerd.`);
      ids.add(candidate.id);
      endpoints.add(endpoint);
      return candidate;
    }));
  }

  function enumerateBranchAssignments(branches = [], selectedVariants = {}) {
    const candidates = normalizeBranchCandidates(branches);
    const forced = selectedVariants && typeof selectedVariants === 'object' ? selectedVariants : {};
    const assignments = [];
    function visit(index, assignment) {
      if (index >= candidates.length) {
        assignments.push(Object.freeze({ ...assignment }));
        return;
      }
      const branch = candidates[index];
      const requested = String(forced[branch.id] || 'auto').trim().toLowerCase();
      const variants = requested === 'auto' || !requested
        ? branch.variants
        : branch.variants.includes(requested) ? [requested] : [];
      if (!variants.length) throw new Error(`Flipvariant ${requested} is niet toegestaan voor ${branch.id}.`);
      variants.forEach(variant => visit(index + 1, { ...assignment, [branch.id]: variant }));
    }
    visit(0, {});
    return Object.freeze(assignments);
  }

  function variantDimensions(variant) {
    const value = String(variant || 'normal');
    if (value === 'left-right') return 1;
    if (value === 'short-long') return 1;
    if (value === 'both') return 2;
    return 0;
  }

  function scoreJointCandidate(candidate, branches) {
    const composition = candidate?.composition;
    if (!composition) return null;
    const required = (composition.relationAlignments || []).filter(alignment => alignment.required !== false);
    if (required.some(alignment => alignment.satisfied !== true)) return null;
    const assignment = candidate.assignment || {};
    const changedBranches = branches.filter(branch => String(assignment[branch.id] || 'normal') !== 'normal').length;
    const changedDimensions = branches.reduce((total, branch) => total + variantDimensions(assignment[branch.id]), 0);
    const lowerShift = composition.units?.find(unit => Number(unit.order) === 2)?.shift || { dx: 0, dy: 0 };
    const rigidShift = Math.abs(Number(lowerShift.dx) || 0) + Math.abs(Number(lowerShift.dy) || 0);
    const signature = branches.map(branch => `${branch.unitId}:${branch.nodeId}:${assignment[branch.id] || 'normal'}`).join('|');
    return Object.freeze([changedBranches, changedDimensions, rigidShift, signature]);
  }

  function compareJointScores(first, second) {
    for (let index = 0; index < 3; index += 1) {
      if (first[index] !== second[index]) return first[index] - second[index];
    }
    return String(first[3]).localeCompare(String(second[3]), 'en');
  }

  function solveJoint(input = {}) {
    if (typeof input.buildCandidate !== 'function') {
      throw new Error('De gezamenlijke flipsolver vereist buildCandidate(assignment).');
    }
    const branches = normalizeBranchCandidates(input.branches || []);
    const assignments = enumerateBranchAssignments(branches, input.selectedVariants || {});
    const valid = [];
    const rejected = [];
    assignments.forEach(assignment => {
      try {
        const composition = input.buildCandidate(assignment);
        const candidate = { assignment, composition };
        const score = scoreJointCandidate(candidate, branches);
        if (score) valid.push({ ...candidate, score });
        else rejected.push({ assignment, reason: 'required-alignments-unsatisfied' });
      } catch (error) {
        rejected.push({ assignment, reason: String(error?.message || error) });
      }
    });
    valid.sort((first, second) => compareJointScores(first.score, second.score));
    const selected = valid[0];
    if (!selected) {
      throw new Error('FLIP CONFLICT: geen gezamenlijke variant kan alle vereiste S1–S2-uitlijningen oplossen.');
    }
    return Object.freeze({
      ...selected.composition,
      layoutResolution: Object.freeze({
        schema: 'ogn-joint-flip-resolution-v1',
        status: 'solved',
        exploredCandidates: assignments.length,
        validCandidates: valid.length,
        selectedVariants: Object.freeze({ ...selected.assignment }),
        selectedBranches: Object.freeze(branches.map(branch => Object.freeze({
          ...branch,
          variant: selected.assignment[branch.id] || 'normal',
          changedDimensions: variantDimensions(selected.assignment[branch.id])
        }))),
        score: Object.freeze([...selected.score]),
        rejectedCandidates: rejected.length
      })
    });
  }

  function composePair(input = {}) {
    const upperInput = input.upper || {};
    const lowerInput = input.lower || {};
    const relationInputs = Array.isArray(input.relations) && input.relations.length
      ? input.relations
      : [input.relation || {}];
    const relationInput = input.relation || relationInputs[0] || {};
    const upperId = String(upperInput.id || 'S1');
    const lowerId = String(lowerInput.id || 'S2');
    const upperOriginal = clone(upperInput.layout || {});
    const lowerOriginal = clone(lowerInput.layout || {});
    assertUnit(upperOriginal, upperId);
    assertUnit(lowerOriginal, lowerId);

    const antecedentId = String(relationInput.antecedentNodeId || '');
    const referentId = String(relationInput.referentNodeId || relationInput.anaphorNodeId || '');
    const antecedentBefore = nodeById(upperOriginal, antecedentId);
    const referentBefore = nodeById(lowerOriginal, referentId);
    if (!antecedentBefore) throw new Error(`Antecedent ${antecedentId || '(leeg)'} ontbreekt in ${upperId}.`);
    if (!referentBefore) throw new Error(`Coreferente S2-knoop ${referentId || '(leeg)'} ontbreekt in ${lowerId}.`);

    const upper = shiftLayout(upperOriginal, 0, 0);
    const upperBox = layoutBox(upper);
    const lowerBox = layoutBox(lowerOriginal);
    const gapRows = Math.max(1, Math.ceil(finiteNumber(input.gapRows ?? 3, 'gapRows')));
    const dx = Number(antecedentBefore.x) - Number(referentBefore.x);
    const dy = upperBox.maxY + gapRows - lowerBox.minY;
    const lower = shiftLayout(lowerOriginal, dx, dy);

    assertUnit(upper, upperId);
    assertUnit(lower, lowerId);
    rigidDeltaBeforeAfter(upperOriginal, upper);
    rigidDeltaBeforeAfter(lowerOriginal, lower);

    const antecedent = nodeById(upper, antecedentId);
    const referent = nodeById(lower, referentId);
    if (coordinateKey(antecedent.x) !== coordinateKey(referent.x)) {
      throw new Error('De coreferentielijn is na compositie niet verticaal.');
    }
    if (!(Number(referent.y) > Number(antecedent.y))) {
      throw new Error('S2 moet later/lager staan dan S1.');
    }

    const sharedColumns = sharedCoordinates(upper, lower, 'x');
    const sharedRows = sharedCoordinates(upper, lower, 'y');
    if (sharedRows.length) throw new Error('Afzonderlijke OGN-eenheden mogen in deze stap geen horizontale gridlijn delen.');
    if (!sharedColumns.some(column => column.first === antecedentId && column.second === referentId)) {
      throw new Error('Het primaire gedeclareerde coreferentiepaar deelt na compositie geen kolom.');
    }

    const relationAlignments = relationInputs.map((relation, index) => {
      const upperEndpoint = relation?.referent || relation?.reference || {};
      const lowerEndpoint = relation?.anaphor || relation?.relativeTime || {};
      const upperNodeId = String(
        upperEndpoint.nodeId
        || relation?.antecedentNodeId
        || relation?.referenceNodeId
        || ''
      );
      const lowerNodeId = String(
        lowerEndpoint.nodeId
        || relation?.referentNodeId
        || relation?.anaphorNodeId
        || relation?.relativeTimeNodeId
        || ''
      );
      const upperInsertionId = String(upperEndpoint.insertionId || relation?.referenceInsertionId || '');
      const lowerInsertionId = String(lowerEndpoint.insertionId || relation?.relativeTimeInsertionId || '');
      const alignmentType = String(relation?.alignment?.type || 'shared-column');
      if (alignmentType !== 'shared-column') {
        if (upperInsertionId) {
          if (!(upperInput.lexInsertions || []).some(insertion => String(insertion.id) === upperInsertionId)) {
            throw new Error(`Relatie ${relation?.id || index + 1}: S1-LEX-insertie ${upperInsertionId} ontbreekt.`);
          }
          if (nodeById(upper, upperInsertionId)) {
            throw new Error(`Relatie ${relation?.id || index + 1}: LEX-insertie ${upperInsertionId} mag geen boomknoop zijn.`);
          }
        }
        if (lowerInsertionId) {
          if (!(lowerInput.lexInsertions || []).some(insertion => String(insertion.id) === lowerInsertionId)) {
            throw new Error(`Relatie ${relation?.id || index + 1}: S2-LEX-insertie ${lowerInsertionId} ontbreekt.`);
          }
          if (nodeById(lower, lowerInsertionId)) {
            throw new Error(`Relatie ${relation?.id || index + 1}: LEX-insertie ${lowerInsertionId} mag geen boomknoop zijn.`);
          }
        }
        if (!upperInsertionId && upperNodeId && !nodeById(upper, upperNodeId)) {
          throw new Error(`Relatie ${relation?.id || index + 1}: S1-endpoint ${upperNodeId} ontbreekt.`);
        }
        if (!lowerInsertionId && lowerNodeId && !nodeById(lower, lowerNodeId)) {
          throw new Error(`Relatie ${relation?.id || index + 1}: S2-endpoint ${lowerNodeId} ontbreekt.`);
        }
        return Object.freeze({
          id: String(relation?.id || `relation-${index + 1}`),
          required: false,
          type: alignmentType,
          ...(upperInsertionId ? { referentInsertionId: upperInsertionId } : { referentNodeId: upperNodeId }),
          ...(lowerInsertionId ? { anaphorInsertionId: lowerInsertionId } : { anaphorNodeId: lowerNodeId }),
          dx: null,
          satisfied: null,
          status: 'not-a-geometric-constraint'
        });
      }
      if (upperInsertionId || lowerInsertionId) {
        throw new Error(`Relatie ${relation?.id || index + 1}: shared-column vereist boomknopen, geen LEX-inserties.`);
      }
      const upperNode = nodeById(upper, upperNodeId);
      const lowerNode = nodeById(lower, lowerNodeId);
      if (!upperNode || !lowerNode) {
        throw new Error(`Relatie ${relation?.id || index + 1} verwijst niet naar bestaande S1/S2-knopen.`);
      }
      const satisfied = coordinateKey(upperNode.x) === coordinateKey(lowerNode.x);
      return Object.freeze({
        id: String(relation?.id || `relation-${index + 1}`),
        required: relation?.alignment?.required !== false,
        type: alignmentType,
        referentNodeId: upperNodeId,
        anaphorNodeId: lowerNodeId,
        dx: Number(upperNode.x) - Number(lowerNode.x),
        satisfied,
        status: satisfied ? 'satisfied' : 'unsatisfied'
      });
    });

    const box = {
      minX: Math.min(upper.box.minX, lower.box.minX),
      maxX: Math.max(upper.box.maxX, lower.box.maxX),
      minY: Math.min(upper.box.minY, lower.box.minY),
      maxY: Math.max(upper.box.maxY, lower.box.maxY)
    };
    return Object.freeze({
      schema: SCHEMA,
      units: Object.freeze([
        Object.freeze({ id: upperId, order: 1, layout: upper, shift: rigidDeltaBeforeAfter(upperOriginal, upper) }),
        Object.freeze({ id: lowerId, order: 2, layout: lower, shift: rigidDeltaBeforeAfter(lowerOriginal, lower) })
      ]),
      relation: Object.freeze({
        type: 'coreference',
        direction: 'none',
        antecedent: Object.freeze({ unitId: upperId, nodeId: antecedentId, x: antecedent.x, y: antecedent.y }),
        referent: Object.freeze({ unitId: lowerId, nodeId: referentId, x: referent.x, y: referent.y })
      }),
      sharedColumns: Object.freeze(sharedColumns.map(item => Object.freeze({ ...item }))),
      sharedRows: Object.freeze([]),
      relationAlignments: Object.freeze(relationAlignments),
      box: Object.freeze(box),
      gapRows
    });
  }

  return Object.freeze({
    SCHEMA,
    LEGACY_SCHEMA,
    BRANCH_VARIANTS,
    SUPPORTED_SCHEMAS: Object.freeze([SCHEMA, LEGACY_SCHEMA]),
    composePair,
    normalizeBranchCandidate,
    normalizeBranchCandidates,
    enumerateBranchAssignments,
    variantDimensions,
    scoreJointCandidate,
    solveJoint,
    rigidDeltaBeforeAfter,
    sharedCoordinates,
    validateUnit
  });
});
