'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const play = require('../multi-ogn-anaphor-play-engine.js');
const combinationEngine = require('../anaphor-combinations-engine.js');

const root = path.resolve(__dirname, '..');
const viewer = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const viewerHtml = fs.readFileSync(path.join(root, 'viewer.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const combinations = fs.readFileSync(path.join(root, 'anaphor-combinations-engine.js'), 'utf8');

function node(id, children = []) {
  return { id, children };
}

const sentences = [
  {
    id: 'S1', order: 1,
    tree: node('s1-s', [node('s1-ik'), node('s1-vp', [node('s1-man'), node('s1-zie')])])
  },
  {
    id: 'S2', order: 2,
    tree: node('s2-s', [node('s2-man'), node('s2-vp', [node('s2-hoed'), node('s2-draagt')])])
  }
];

const timeline = play.buildTimeline(sentences);
assert.equal(timeline.schema, 'ogn-anaphor-play-v1');
assert.equal(timeline.max, 16);
assert.deepEqual(timeline.units.map(unit => ({
  id: unit.id,
  first: unit.firstNodeStep,
  last: unit.lastNodeStep,
  lex: unit.lexBaseStep,
  move: unit.finiteVerbMoveStep
})), [
  { id: 'S1', first: 1, last: 5, lex: 6, move: 7 },
  { id: 'S2', first: 8, last: 12, lex: 13, move: 14 }
]);
assert.equal(timeline.coreferenceStep, 15);
assert.equal(timeline.lexicalizationStep, 16);

const afterS1 = play.stateAt(timeline, 7);
assert.equal(afterS1.units[0].treeComplete, true);
assert.equal(afterS1.units[0].finiteVerbMoved, true);
assert.equal(afterS1.units[1].treeStarted, false, 'S2 mag niet tegelijk met S1 beginnen');

const s2SourceLex = play.stateAt(timeline, 13);
assert.equal(s2SourceLex.units[1].lexBaseVisible, true);
assert.equal(s2SourceLex.units[1].finiteVerbMoved, false);
assert.equal(s2SourceLex.coreferenceVisible, false);
assert.equal(s2SourceLex.lexicalizationVisible, false);

const s2Moved = play.stateAt(timeline, 14);
assert.equal(s2Moved.units[1].finiteVerbMoved, true);
assert.equal(s2Moved.coreferenceVisible, false);
const related = play.stateAt(timeline, 15);
assert.equal(related.coreferenceVisible, true);
assert.equal(related.lexicalizationVisible, false, 'MAN moet vóór de laatste stap zichtbaar blijven');
const lexicalized = play.stateAt(timeline, 16);
assert.equal(lexicalized.lexicalizationVisible, true);

// Reverse is exact: de laatst toegevoegde laag verdwijnt steeds als eerste.
assert.deepEqual(
  [16, 15, 14, 13, 12, 7, 6, 5, 0].map(step => {
    const state = play.stateAt(timeline, step);
    return [
      state.lexicalizationVisible,
      state.coreferenceVisible,
      state.units[1].finiteVerbMoved,
      state.units[1].lexBaseVisible,
      state.units[1].treeStarted,
      state.units[0].finiteVerbMoved,
      state.units[0].lexBaseVisible,
      state.units[0].treeStarted
    ];
  }),
  [
    [true, true, true, true, true, true, true, true],
    [false, true, true, true, true, true, true, true],
    [false, false, true, true, true, true, true, true],
    [false, false, false, true, true, true, true, true],
    [false, false, false, false, true, true, true, true],
    [false, false, false, false, false, true, true, true],
    [false, false, false, false, false, false, true, true],
    [false, false, false, false, false, false, false, true],
    [false, false, false, false, false, false, false, false]
  ]
);
assert.equal(play.freeV2Y(200, 400), 300);

const configured = combinationEngine.normalizeCombinations();
const temporalTimeline = play.buildTimeline(configured[1].sentences);
assert.equal(temporalTimeline.max, 17);
assert.deepEqual(temporalTimeline.units.map(unit => unit.lexInsertionIds), [
  ['lex-s1-gisteren'], ['lex-s2-vandaag', 'lex-s2-er', 'lex-s2-niet-meer']
]);
assert.equal(play.phaseAt(temporalTimeline, temporalTimeline.units[0].lexInsertionStep).kind, 'lex-insertions');
assert.equal(play.stateAt(temporalTimeline, temporalTimeline.units[0].lexInsertionStep - 1).units[0].lexInsertionsVisible, false);
assert.equal(play.stateAt(temporalTimeline, temporalTimeline.units[0].lexInsertionStep).units[0].lexInsertionsVisible, true);

const becauseTimeline = play.buildTimeline(configured[3].sentences);
assert.equal(becauseTimeline.units[0].finiteVerbPlacement, 'v2');
assert.equal(becauseTimeline.units[1].clauseType, 'subordinate');
assert.equal(becauseTimeline.units[1].finiteVerbPlacement, 'final');
assert.equal(becauseTimeline.units[1].finiteVerbMoveStep, null);
assert.deepEqual(becauseTimeline.units[1].lexInsertionIds, ['lex-s2-omdat']);
assert.equal(play.stateAt(becauseTimeline, becauseTimeline.max).units[1].finiteVerbMoved, false);

const flipBranches = [
  { id: 's1-root', unitId: 'S1', variant: 'left-right' },
  { id: 's1-vp', unitId: 'S1', variant: 'left-right' },
  { id: 's2-vcluster', unitId: 'S2', variant: 'short-long' }
];
const flipTimeline = play.buildTimeline(configured[4].sentences, flipBranches);
assert.deepEqual(flipTimeline.units[0].branchFlipIds, ['s1-root', 's1-vp']);
assert.deepEqual(flipTimeline.units[1].branchFlipIds, ['s2-vcluster']);
assert.equal(play.phaseAt(flipTimeline, flipTimeline.units[0].branchFlipStep).kind, 'branch-flip');
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[0].branchFlipStep - 1).units[0].branchFlipped, false);
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[0].branchFlipStep).units[0].branchFlipped, true);
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[1].branchFlipStep - 1).units[1].branchFlipped, false);
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[1].branchFlipStep).units[1].branchFlipped, true);
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[1].branchFlipStep - 1).units[0].branchFlipped, true,
  'terugspelen moet de S2-flip eerder verwijderen dan de S1-flip');

for (const source of [index, viewerHtml]) {
  assert.match(source, /multi-ogn-anaphor-play-engine\.js/, 'Play-engine moet vóór viewer.js worden geladen');
}
assert.match(viewer, /multiOgnAnaphorActive\(\)\) return true;/, 'Anafoor moet Play-bediening ondersteunen');
assert.match(viewer, /S1 met V2-verplaatsing → S2/, 'zichtbare Play-volgorde ontbreekt');
assert.match(viewer, /bijzin zonder V2/, 'omdat-bijzin mag geen V2-Wissel tonen');
assert.match(viewer, /'data-v2-moved': visiblyMoved \? 'true' : 'false'/, 'V2-verplaatsing mist inspecteerbare status');
assert.match(viewer, /lexicalizationSummary/, 'laatste bron→anafoorstap ontbreekt');
assert.match(viewer, /'S2-anaphor-lexicalizations'/, 'OPN-export moet de laatste Play-fase bewaren');
assert.match(viewer, /'branch-flip'/, 'Play moet joint flip als inspecteerbare stap bewaren');
assert.match(viewer, /branch_flip_step: unit\.branchFlipStep/, 'OPN-export moet de flipstap bewaren');
assert.match(viewer, /reverse: 'exact'/, 'OPN-export moet exact reverse bewaren');
assert.ok(combinations.indexOf("id: 's1-man'") < combinations.indexOf("id: 's1-zie'"), 'S1-bron moet object vóór eindwerkwoord houden');
assert.ok(combinations.indexOf("id: 's2-hoed'") < combinations.indexOf("id: 's2-draagt'"), 'S2-bron moet object vóór eindwerkwoord houden');
assert.doesNotMatch(css, /placement-multi-ogn-active \.main-play-reset-bar/,
  'Anafoor mag de Play-balk niet meer verbergen');
assert.doesNotMatch(css, /placement-multi-ogn-active \.mobile-growth-nav/,
  'Anafoor mag mobiele Play-bediening niet verbergen');

console.log('MULTI-OGN ANAPHOR PLAY: OK (S1 → joint flip → V2 · S2 → clusterflip · dubbele anafoor · exact reverse)');
