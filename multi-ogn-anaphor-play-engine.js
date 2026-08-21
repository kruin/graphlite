(function attachMultiOgnAnaphorPlayEngine(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OGNAnaphorPlay = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function multiOgnAnaphorPlayFactory() {
  'use strict';

  const SCHEMA = 'ogn-anaphor-play-v1';

  function collectNodeIds(root) {
    const ids = [];
    const seen = new Set();
    function visit(node) {
      if (!node || !node.id || seen.has(String(node.id))) return;
      const id = String(node.id);
      seen.add(id);
      ids.push(id);
      (node.children || []).forEach(visit);
    }
    visit(root);
    return ids;
  }

  function buildTimeline(sentences = [], selectedBranches = []) {
    if (!Array.isArray(sentences) || sentences.length !== 2) {
      throw new Error('Anafoor-Play vereist precies twee zinnen.');
    }
    let cursor = 0;
    const units = sentences.map((sentence, index) => {
      const nodeIds = collectNodeIds(sentence?.tree);
      if (!nodeIds.length) throw new Error(`Zin ${sentence?.id || index + 1} heeft geen boomknopen.`);
      const nodeSteps = {};
      nodeIds.forEach(nodeId => {
        cursor += 1;
        nodeSteps[nodeId] = cursor;
      });
      const branchFlipIds = (Array.isArray(selectedBranches) ? selectedBranches : [])
        .filter(branch => String(branch?.unitId || '') === String(sentence?.id || `S${index + 1}`)
          && String(branch?.variant || 'normal') !== 'normal')
        .map(branch => String(branch.id || '').trim()).filter(Boolean);
      const branchFlipStep = branchFlipIds.length ? ++cursor : null;
      const lexBaseStep = ++cursor;
      const lexInsertionIds = (Array.isArray(sentence?.lexInsertions) ? sentence.lexInsertions : [])
        .map(insertion => String(insertion.id || '').trim()).filter(Boolean);
      const lexInsertionStep = lexInsertionIds.length ? ++cursor : null;
      const finiteVerbPlacement = String(sentence?.finiteVerbPlacement
        || (sentence?.clauseType === 'subordinate' ? 'final' : 'v2')).trim().toLowerCase();
      const finiteVerbMoveStep = finiteVerbPlacement === 'v2' ? ++cursor : null;
      return Object.freeze({
        id: String(sentence?.id || `S${index + 1}`),
        order: Number(sentence?.order || index + 1),
        nodeIds: Object.freeze(nodeIds),
        nodeSteps: Object.freeze(nodeSteps),
        firstNodeStep: nodeSteps[nodeIds[0]],
        lastNodeStep: nodeSteps[nodeIds[nodeIds.length - 1]],
        branchFlipIds: Object.freeze(branchFlipIds),
        branchFlipStep,
        lexBaseStep,
        lexInsertionIds: Object.freeze(lexInsertionIds),
        lexInsertionStep,
        clauseType: String(sentence?.clauseType || 'main'),
        finiteVerbPlacement,
        finiteVerbMoveStep
      });
    });
    const coreferenceStep = ++cursor;
    const lexicalizationStep = ++cursor;
    return Object.freeze({
      schema: SCHEMA,
      units: Object.freeze(units),
      coreferenceStep,
      lexicalizationStep,
      max: cursor
    });
  }

  function clampStep(timeline, value) {
    return Math.max(0, Math.min(Number(timeline?.max) || 0, Number(value) || 0));
  }

  function stateAt(timeline, value) {
    const step = clampStep(timeline, value);
    return Object.freeze({
      step,
      max: Number(timeline?.max) || 0,
      units: Object.freeze((timeline?.units || []).map(unit => Object.freeze({
        id: unit.id,
        visibleNodeIds: Object.freeze(unit.nodeIds.filter(nodeId => step >= unit.nodeSteps[nodeId])),
        treeStarted: step >= unit.firstNodeStep,
        treeComplete: step >= unit.lastNodeStep,
        branchFlipped: unit.branchFlipStep === null ? true : step >= unit.branchFlipStep,
        branchFlipIds: unit.branchFlipIds,
        lexBaseVisible: step >= unit.lexBaseStep,
        lexInsertionsVisible: unit.lexInsertionStep === null ? false : step >= unit.lexInsertionStep,
        finiteVerbMoved: unit.finiteVerbMoveStep === null ? false : step >= unit.finiteVerbMoveStep,
        finiteVerbPlacement: unit.finiteVerbPlacement
      }))),
      coreferenceVisible: step >= Number(timeline?.coreferenceStep),
      lexicalizationVisible: step >= Number(timeline?.lexicalizationStep)
    });
  }

  function phaseAt(timeline, value) {
    const step = clampStep(timeline, value);
    if (step === 0) return Object.freeze({ kind: 'intro', step, unitId: null });
    for (const unit of timeline?.units || []) {
      if (step >= unit.firstNodeStep && step <= unit.lastNodeStep) {
        return Object.freeze({ kind: 'tree', step, unitId: unit.id });
      }
      if (unit.branchFlipStep !== null && step === unit.branchFlipStep) {
        return Object.freeze({ kind: 'branch-flip', step, unitId: unit.id, branchIds: unit.branchFlipIds });
      }
      if (step === unit.lexBaseStep) return Object.freeze({ kind: 'lex-base', step, unitId: unit.id });
      if (unit.lexInsertionStep !== null && step === unit.lexInsertionStep) {
        return Object.freeze({ kind: 'lex-insertions', step, unitId: unit.id });
      }
      if (unit.finiteVerbMoveStep !== null && step === unit.finiteVerbMoveStep) {
        return Object.freeze({ kind: 'finite-verb-move', step, unitId: unit.id });
      }
    }
    if (step === Number(timeline?.coreferenceStep)) {
      return Object.freeze({ kind: 'coreference', step, unitId: null });
    }
    return Object.freeze({ kind: 'lexicalization', step, unitId: 'S2' });
  }

  function freeV2Y(subjectY, objectY) {
    const subject = Number(subjectY);
    const object = Number(objectY);
    if (!Number.isFinite(subject) || !Number.isFinite(object) || object <= subject) {
      throw new Error('De vrije V2-rij vereist een objectbronrij onder de subjectbronrij.');
    }
    return subject + (object - subject) / 2;
  }

  return Object.freeze({
    SCHEMA,
    collectNodeIds,
    buildTimeline,
    clampStep,
    stateAt,
    phaseAt,
    freeV2Y
  });
});
