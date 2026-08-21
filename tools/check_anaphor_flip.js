'use strict';

const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const combinations = require('../anaphor-combinations-engine.js');
const composition = require('../multi-ogn-composition-engine.js');

const viewer = fs.readFileSync(path.resolve(__dirname, '..', 'viewer.js'), 'utf8');
const names = [
  'cloneTree', 'isLabel', 'unionBox', 'shiftBox', 'boxesOverlap', 'cloneLayout', 'shiftLayout',
  'layoutLeaf', 'occupiedFromPlaced', 'candidatePositions', 'shiftedRoot', 'candidateIsFree',
  'placeLayoutFree', 'composeLayout', 'preferredFirstSide', 'layoutUnary', 'layoutBinary',
  'layoutNAry', 'branchClass', 'explicitBranchOrder', 'explicitBinaryBranchVariant', 'layoutWidth',
  'layoutHeight', 'scoreCompact', 'nodeByRoleOrPattern', 'distX', 'scoreAlign', 'branchScore',
  'composeBranch', 'layoutTree', 'normalizeLayout', 'findTreeSpecNode', 'treeNodeIdSet',
  'multiOgnLexForVariants'
];

function extractFunction(name) {
  const marker = `  function ${name}(`;
  const start = viewer.indexOf(marker);
  if (start < 0) throw new Error(`Functie ontbreekt: ${name}`);
  const openParenthesis = viewer.indexOf('(', start);
  let parenthesisDepth = 0;
  let closeParenthesis = -1;
  for (let index = openParenthesis; index < viewer.length; index += 1) {
    if (viewer[index] === '(') parenthesisDepth += 1;
    if (viewer[index] === ')') {
      parenthesisDepth -= 1;
      if (parenthesisDepth === 0) { closeParenthesis = index; break; }
    }
  }
  const brace = viewer.indexOf('{', closeParenthesis);
  let depth = 0;
  let quote = '';
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = brace; index < viewer.length; index += 1) {
    const char = viewer[index];
    const next = viewer[index + 1];
    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') { blockComment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '/' && next === '/') { lineComment = true; index += 1; continue; }
    if (char === '/' && next === '*') { blockComment = true; index += 1; continue; }
    if (char === '\'' || char === '"' || char === '`') { quote = char; continue; }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return viewer.slice(start, index + 1);
    }
  }
  throw new Error(`Functie niet afgesloten: ${name}`);
}

const sandbox = { STRUCTURE_CONFIG: {}, assertUniqueNodeGridLines: value => value };
vm.createContext(sandbox);
const generated = `${names.map(extractFunction).join('\n')}\nObject.assign(this, { layoutTree, normalizeLayout, multiOgnLexForVariants });`;
try {
  vm.runInContext(generated, sandbox);
} catch (error) {
  const line = Number(String(error.stack || '').match(/evalmachine\.<anonymous>:(\d+)/)?.[1] || 1);
  console.error(generated.split('\n').slice(Math.max(0, line - 5), line + 4).join('\n'));
  throw error;
}

const fixture = combinations.normalizeCombinations(combinations.DEFAULT_COMBINATIONS).at(-1);

function buildCandidate(assignment) {
  const layouts = Object.fromEntries(fixture.sentences.map(sentence => {
    const variants = Object.fromEntries(fixture.layoutResolution.branches
      .filter(branch => branch.unitId === sentence.id)
      .map(branch => [branch.nodeId, assignment[branch.id]]));
    const layout = sandbox.normalizeLayout(sandbox.layoutTree(JSON.parse(JSON.stringify(sentence.tree)), 0, {
      firstSide: -1,
      branchOrder: 'normal',
      branchOverrides: { top: 'normal', middle: 'normal', other: 'normal' },
      branchVariants: variants
    }));
    return [sentence.id, layout];
  }));
  return composition.composePair({
    upper: { id: 'S1', layout: layouts.S1 },
    lower: { id: 'S2', layout: layouts.S2 },
    relation: fixture.relation,
    relations: fixture.relations,
    gapRows: fixture.gapRows
  });
}

function solve(selectedVariants = {}) {
  return composition.solveJoint({
    branches: fixture.layoutResolution.branches,
    selectedVariants,
    buildCandidate
  });
}

assert.deepEqual(composition.BRANCH_VARIANTS, ['normal', 'left-right', 'short-long', 'both']);
assert.deepEqual(fixture.layoutResolution.branches.map(branch => branch.id), ['s1-root', 's1-vp', 's2-vcluster']);
const solved = solve();
assert.deepEqual(solved.layoutResolution.selectedVariants, {
  's1-root': 'left-right',
  's1-vp': 'left-right',
  's2-vcluster': 'normal'
});
assert.equal(solved.layoutResolution.exploredCandidates, 64);
assert.equal(solved.layoutResolution.validCandidates, 16);
assert.deepEqual(solved.relationAlignments.map(item => [item.id, item.satisfied, item.dx]), [
  ['hond-die', true, 0],
  ['man-hem', true, 0]
]);

const shortLong = solve({ 's2-vcluster': 'short-long' });
assert.equal(shortLong.layoutResolution.selectedVariants['s2-vcluster'], 'short-long');
assert.ok(shortLong.relationAlignments.every(item => item.satisfied));
const both = solve({ 's2-vcluster': 'both' });
assert.equal(both.layoutResolution.selectedVariants['s2-vcluster'], 'both');
assert.ok(both.relationAlignments.every(item => item.satisfied));
assert.throws(() => solve({ 's1-root': 'normal', 's1-vp': 'normal' }), /FLIP CONFLICT/);

const s2 = fixture.sentences[1];
const lexOrder = variants => sandbox.multiOgnLexForVariants(s2, fixture, variants)
  .map(item => item.insertionId || item.nodeId);
const regularLex = [
  'lex-mf-s2-omdat', 'mf-s2-hond', 'mf-s2-man', 'mf-s2-heeft', 'mf-s2-gebeten'
];
const reversedLex = [
  'lex-mf-s2-omdat', 'mf-s2-hond', 'mf-s2-man', 'mf-s2-gebeten', 'mf-s2-heeft'
];
assert.deepEqual(lexOrder({ 's2-vcluster': 'normal' }), regularLex);
assert.deepEqual(lexOrder({ 's2-vcluster': 'left-right' }), regularLex);
assert.deepEqual(lexOrder({ 's2-vcluster': 'short-long' }), reversedLex);
assert.deepEqual(lexOrder({ 's2-vcluster': 'both' }), reversedLex);

console.log('ANAPHOR FLIP CHECK: OK (4 varianten; 64 kandidaten; HOND↔HOND + MAN↔MAN; HEEFT GEBETEN↔GEBETEN HEEFT)');
