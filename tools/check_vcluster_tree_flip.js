'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const viewer = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');

function extractFunction(name) {
  const marker = `function ${name}(`;
  const start = viewer.indexOf(marker);
  assert.notEqual(start, -1, `functie ontbreekt: ${name}`);
  const brace = viewer.indexOf('{', start);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = brace; index < viewer.length; index += 1) {
    const char = viewer[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return viewer.slice(start, index + 1);
    }
  }
  assert.fail(`functie niet volledig: ${name}`);
}

// This is deliberately already flipped. The final layout preparation must
// preserve this subtree order instead of alphabetically restoring AUX -> VDW.
const flippedInputTree = {
  id: 's', label: 'S', children: [
    { id: 'np-subj', label: 'NP', role: 'subject', children: [] },
    { id: 'vp', label: 'VP', children: [
      { id: 'np-obj', label: 'NP', role: 'object', children: [] },
      { id: 'vp-perfectum', label: 'V-CLUSTER', children: [
        { id: 'v-vdw', label: 'VDW', children: [] },
        { id: 'v-aux', label: 'AUX', children: [] }
      ] }
    ] }
  ]
};

const source = [
  extractFunction('cloneTree'),
  extractFunction('sortChildrenByRanks'),
  extractFunction('southAwareSyntaxSpec'),
  `globalThis.result = southAwareSyntaxSpec('SOV');`
].join('\n');

const context = {
  state: { southLogicalMode: 'SOV' },
  treeSpec: () => flippedInputTree,
  southModeRankMap: () => new Map([['S', 0], ['O', 1], ['V', 2]])
};
vm.runInNewContext(source, context);

const cluster = context.result.children[1].children.find(node => node.id === 'vp-perfectum');
assert.ok(cluster, 'V-CLUSTER ontbreekt na de uiteindelijke boomsortering');
assert.deepEqual(
  Array.from(cluster.children, node => node.id),
  ['v-vdw', 'v-aux'],
  'de uiteindelijke boomsortering maakt de structurele V-clusterflip ongedaan'
);

console.log('V-CLUSTER TREE FLIP CHECK: OK (uiteindelijke boom behoudt VDW -> AUX)');

const functionalSource = `${extractFunction('functionalPredicateRealization')}\n`
  + `globalThis.functionalResult = functionalPredicateRealization(
      { predicate: 'GEBETEN' },
      [{ source: 'pv', label: 'HEEFT' }, { source: 'vdw', label: 'GEBETEN' }],
      ['vdw', 'pv']
    );`;
const functionalContext = {
  activeSurfaceSourceItems: items => items,
  baseActiveLexItems: () => [],
  vclusterLeafSourcesFromSyntax: () => [],
  surfaceSyntaxSpec: () => ({}),
  sourceLabelFallback: sourceName => `{${sourceName}}`
};
vm.runInNewContext(functionalSource, functionalContext);
assert.equal(functionalContext.functionalResult.label, 'V-CLUSTER');
assert.deepEqual(
  Array.from(functionalContext.functionalResult.children, node => `${node.source}:${node.role}`),
  ['vdw:predicate', 'pv:aux'],
  'Functional moet beide V-clusterleden in de geflipte subboom opnemen'
);

assert.ok(viewer.includes('functionalPredicateRealization(labels)'), 'Functional gebruikt de V-clusterrealisatie niet');
console.log('FUNCTIONAL V-CLUSTER CHECK: OK (PRED -> V-CLUSTER -> VDW AUX)');

assert.ok(
  viewer.includes("class: 'vcluster-flip-marker'"),
  'zichtbare FLIP-markering ontbreekt in de V-CLUSTER-rendering'
);
assert.ok(
  viewer.includes("'data-vcluster-flip': 'heeft-gebeten'"),
  'HEEFT/GEBETEN-marker ontbreekt in de V-CLUSTER-rendering'
);
assert.ok(
  viewer.includes("'FLIP: HEEFT ↔ GEBETEN'"),
  'tekst FLIP: HEEFT ↔ GEBETEN ontbreekt'
);
console.log('V-CLUSTER FLIP MARKER CHECK: OK (FLIP: HEEFT ↔ GEBETEN)');
