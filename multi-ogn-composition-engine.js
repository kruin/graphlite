(function attachMultiOgnCompositionEngine(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OGNMultiComposition = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function multiOgnCompositionFactory() {
  'use strict';

  const SCHEMA = 'ogn-multi-composition-v1';

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

  function composePair(input = {}) {
    const upperInput = input.upper || {};
    const lowerInput = input.lower || {};
    const relationInput = input.relation || {};
    const upperId = String(upperInput.id || 'S1');
    const lowerId = String(lowerInput.id || 'S2');
    const upperOriginal = clone(upperInput.layout || {});
    const lowerOriginal = clone(lowerInput.layout || {});
    assertUnit(upperOriginal, upperId);
    assertUnit(lowerOriginal, lowerId);

    const antecedentId = String(relationInput.antecedentNodeId || '');
    const anaphorId = String(relationInput.anaphorNodeId || '');
    const antecedentBefore = nodeById(upperOriginal, antecedentId);
    const anaphorBefore = nodeById(lowerOriginal, anaphorId);
    if (!antecedentBefore) throw new Error(`Antecedent ${antecedentId || '(leeg)'} ontbreekt in ${upperId}.`);
    if (!anaphorBefore) throw new Error(`Anafoor ${anaphorId || '(leeg)'} ontbreekt in ${lowerId}.`);

    const upper = shiftLayout(upperOriginal, 0, 0);
    const upperBox = layoutBox(upper);
    const lowerBox = layoutBox(lowerOriginal);
    const gapRows = Math.max(1, Math.ceil(finiteNumber(input.gapRows ?? 3, 'gapRows')));
    const dx = Number(antecedentBefore.x) - Number(anaphorBefore.x);
    const dy = upperBox.maxY + gapRows - lowerBox.minY;
    const lower = shiftLayout(lowerOriginal, dx, dy);

    assertUnit(upper, upperId);
    assertUnit(lower, lowerId);
    rigidDeltaBeforeAfter(upperOriginal, upper);
    rigidDeltaBeforeAfter(lowerOriginal, lower);

    const antecedent = nodeById(upper, antecedentId);
    const anaphor = nodeById(lower, anaphorId);
    if (coordinateKey(antecedent.x) !== coordinateKey(anaphor.x)) {
      throw new Error('De antecedent–anafoorlijn is na compositie niet verticaal.');
    }
    if (!(Number(anaphor.y) > Number(antecedent.y))) {
      throw new Error('S2 moet later/lager staan dan S1.');
    }

    const sharedColumns = sharedCoordinates(upper, lower, 'x');
    const sharedRows = sharedCoordinates(upper, lower, 'y');
    if (sharedRows.length) throw new Error('Afzonderlijke OGN-eenheden mogen in deze stap geen horizontale gridlijn delen.');
    const additionalSharedColumns = sharedColumns.filter(item => item.first !== antecedentId || item.second !== anaphorId);
    if (!input.allowAdditionalSharedColumns && (sharedColumns.length !== 1
        || sharedColumns[0].first !== antecedentId
        || sharedColumns[0].second !== anaphorId)) {
      throw new Error('Alleen de gedeclareerde antecedent–anafoorkolom mag tussen S1 en S2 worden gedeeld.');
    }

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
        anaphor: Object.freeze({ unitId: lowerId, nodeId: anaphorId, x: anaphor.x, y: anaphor.y })
      }),
      sharedColumns: Object.freeze(sharedColumns.map(item => Object.freeze({ ...item }))),
      additionalSharedColumns: Object.freeze(additionalSharedColumns.map(item => Object.freeze({ ...item }))),
      compositionWarning: additionalSharedColumns.length ? 'extra-cross-unit-columns' : '',
      sharedRows: Object.freeze([]),
      box: Object.freeze(box),
      gapRows
    });
  }

  function composeDeclaredPair(input = {}) {
    const upperInput = input.upper || {};
    const lowerInput = input.lower || {};
    const upperId = String(upperInput.id || 'K1');
    const lowerId = String(lowerInput.id || 'K2');
    const upperOriginal = clone(upperInput.layout || {});
    const lowerOriginal = clone(lowerInput.layout || {});
    const declarations = Array.isArray(input.relations) ? input.relations : [];
    if (!declarations.length) throw new Error('Een uiting vereist minstens één gedeclareerde verticale anafoorrelatie.');
    assertUnit(upperOriginal, upperId);
    assertUnit(lowerOriginal, lowerId);

    const resolved = declarations.map((declaration, index) => {
      const antecedentNodeId = String(declaration.antecedentNodeId || '');
      const anaphorNodeId = String(declaration.anaphorNodeId || '');
      const antecedent = nodeById(upperOriginal, antecedentNodeId);
      const anaphor = nodeById(lowerOriginal, anaphorNodeId);
      if (!antecedent || !anaphor) {
        throw new Error(`Gedeclareerde anafoorrelatie ${index + 1} mist een bron- of doelknoop.`);
      }
      return { declaration, antecedent, anaphor, antecedentNodeId, anaphorNodeId };
    });

    const dx = Number(resolved[0].antecedent.x) - Number(resolved[0].anaphor.x);
    if (resolved.some(item => coordinateKey(Number(item.antecedent.x) - Number(item.anaphor.x)) !== coordinateKey(dx))) {
      throw new Error('De gedeclareerde anaforen kunnen niet gezamenlijk met één starre verschuiving verticaal worden uitgelijnd.');
    }

    const upper = shiftLayout(upperOriginal, 0, 0);
    const upperBox = layoutBox(upper);
    const lowerBox = layoutBox(lowerOriginal);
    const gapRows = Math.max(1, Math.ceil(finiteNumber(input.gapRows ?? 3, 'gapRows')));
    const dy = upperBox.maxY + gapRows - lowerBox.minY;
    const lower = shiftLayout(lowerOriginal, dx, dy);
    assertUnit(upper, upperId);
    assertUnit(lower, lowerId);
    rigidDeltaBeforeAfter(upperOriginal, upper);
    rigidDeltaBeforeAfter(lowerOriginal, lower);

    const relations = resolved.map(item => {
      const antecedent = nodeById(upper, item.antecedentNodeId);
      const anaphor = nodeById(lower, item.anaphorNodeId);
      if (coordinateKey(antecedent.x) !== coordinateKey(anaphor.x) || !(Number(anaphor.y) > Number(antecedent.y))) {
        throw new Error('Iedere gedeclareerde anafoorlijn moet verticaal van de bovenste naar de onderste kernzin lopen.');
      }
      return Object.freeze({
        type: String(item.declaration.type || 'coreference'),
        direction: 'none',
        referent: String(item.declaration.referent || ''),
        antecedentLabel: String(item.declaration.antecedentLabel || antecedent.label || ''),
        anaphorLabel: String(item.declaration.anaphorLabel || anaphor.label || ''),
        antecedent: Object.freeze({ unitId: upperId, nodeId: item.antecedentNodeId, x: antecedent.x, y: antecedent.y }),
        anaphor: Object.freeze({ unitId: lowerId, nodeId: item.anaphorNodeId, x: anaphor.x, y: anaphor.y })
      });
    });

    const declaredPairs = new Set(relations.map(relation => `${relation.antecedent.nodeId}\u0000${relation.anaphor.nodeId}`));
    if (declaredPairs.size !== relations.length) throw new Error('Iedere verticale anafoorrelatie moet een uniek knooppaar hebben.');
    const sharedColumns = sharedCoordinates(upper, lower, 'x');
    const sharedRows = sharedCoordinates(upper, lower, 'y');
    if (sharedRows.length) throw new Error('De twee kernzinnen mogen geen horizontale gridlijn delen.');
    const additionalSharedColumns = sharedColumns.filter(item => !declaredPairs.has(`${item.first}\u0000${item.second}`));
    if (!input.allowAdditionalSharedColumns && (sharedColumns.length !== relations.length
        || sharedColumns.some(item => !declaredPairs.has(`${item.first}\u0000${item.second}`)))) {
      throw new Error('Alleen expliciet gedeclareerde antecedent–anafoorkolommen mogen tussen kernzinnen worden gedeeld.');
    }

    return Object.freeze({
      schema: SCHEMA,
      kind: 'utterance-kernel-pair',
      units: Object.freeze([
        Object.freeze({ id: upperId, order: 1, layout: upper, shift: rigidDeltaBeforeAfter(upperOriginal, upper) }),
        Object.freeze({ id: lowerId, order: 2, layout: lower, shift: rigidDeltaBeforeAfter(lowerOriginal, lower) })
      ]),
      relation: relations[0],
      relations: Object.freeze(relations),
      sharedColumns: Object.freeze(sharedColumns.map(item => Object.freeze({ ...item }))),
      additionalSharedColumns: Object.freeze(additionalSharedColumns.map(item => Object.freeze({ ...item }))),
      compositionWarning: additionalSharedColumns.length ? 'extra-cross-unit-columns' : '',
      sharedRows: Object.freeze([]),
      box: Object.freeze({
        minX: Math.min(upper.box.minX, lower.box.minX),
        maxX: Math.max(upper.box.maxX, lower.box.maxX),
        minY: Math.min(upper.box.minY, lower.box.minY),
        maxY: Math.max(upper.box.maxY, lower.box.maxY)
      }),
      gapRows
    });
  }

  return Object.freeze({
    SCHEMA,
    composePair,
    composeDeclaredPair,
    rigidDeltaBeforeAfter,
    sharedCoordinates,
    validateUnit
  });
});
