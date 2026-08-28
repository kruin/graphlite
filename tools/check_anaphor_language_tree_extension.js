'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const combinations = require('../anaphor-combinations-engine.js');
const compositor = require('../multi-ogn-composition-engine.js');
const play = require('../multi-ogn-anaphor-play-engine.js');
const lexicon = require('../anaphor-lexicalization-engine.js');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const json = relative => JSON.parse(read(relative));
const clone = value => JSON.parse(JSON.stringify(value));

const configured = combinations.normalizeCombinations();
assert.equal(configured.length, 7, 'zeven actieve anafoorcombinaties verwacht');
assert.deepEqual(configured.map(item => item.id), [
  'de-persoon-die-ik-gisteren-gesproken-heb',
  'de-persoon-die-ik-gisteren-gesproken-heb-is-er-vandaag-niet-meer',
  'ik-zie-man-hij-draagt-hoed',
  'ik-zag-man-gisteren-vandaag-was-hij-er-niet-meer',
  'boer-bezit-ezel-hij-slaat-hem',
  'boer-slaat-ezel-omdat-hij-hem-bezit',
  'man-slaat-hond-omdat-die-hem-heeft-gebeten'
]);
assert.ok(configured.every(item => item.relations.every(relation => relation.type === 'coreference')),
  'Anafoor accepteert uitsluitend centrale Text-coreferentie');

const incompleteRelative = configured.find(item => item.id === 'de-persoon-die-ik-gisteren-gesproken-heb');
assert.equal(incompleteRelative.title, 'De persoon die ik gisteren gesproken heb.');
assert.equal(incompleteRelative.completionStatus, 'incomplete');
assert.equal(incompleteRelative.utteranceForm, 'relative-np-fragment');
assert.deepEqual(incompleteRelative.sentences.flatMap(sentence => sentence.lexInsertions.map(item => item.label)), ['GISTEREN']);
assert.equal(incompleteRelative.contextRelations, undefined);

const completeRelative = configured.find(item => item.id === 'de-persoon-die-ik-gisteren-gesproken-heb-is-er-vandaag-niet-meer');
assert.equal(completeRelative.title, 'De persoon die ik gisteren gesproken heb, is er vandaag niet meer.');
assert.equal(completeRelative.completionStatus, 'complete');
assert.equal(completeRelative.utteranceForm, 'sentence-with-relative-clause');
assert.deepEqual(completeRelative.sentences.flatMap(sentence => sentence.lexInsertions.map(item => item.label)), ['GISTEREN', 'ER', 'VANDAAG', 'NIET MEER']);
assert.equal(completeRelative.contextRelations, undefined);
for (const insertion of completeRelative.sentences.flatMap(sentence => sentence.lexInsertions)) {
  assert.equal(insertion.axis, 'LEX');
  assert.equal(insertion.origin, 'LEX');
}

const temporal = configured.find(item => item.id === 'ik-zag-man-gisteren-vandaag-was-hij-er-niet-meer');
assert.equal(temporal.provenance.kind, 'user-supplied');
assert.equal(temporal.context.status, 'p.m.');
assert.equal(temporal.context.notation, 'Open Graph Notation');
assert.equal(temporal.context.representation, 'minimized-tree');
assert.equal(temporal.relations.length, 1);
assert.equal(temporal.relations[0].referent.nodeId, 'tm-s1-man');
assert.equal(temporal.relations[0].anaphor.nodeId, 'tm-s2-man');
assert.equal(temporal.contextRelations, undefined, 'gisteren–vandaag blijft voorlopig zonder actieve Context-relatie');
assert.deepEqual(temporal.sentences.map(sentence => sentence.lexInsertions.map(item => item.label)), [
  ['GISTEREN'], ['VANDAAG', 'ER', 'NIET MEER']
]);
assert.deepEqual([...combinations.collectNodes(temporal.sentences[1].tree).values()]
  .filter(node => node.kind === 'leaf').map(node => node.label), ['MAN', 'WAS']);
for (const sentence of temporal.sentences) {
  const treeNodes = combinations.collectNodes(sentence.tree);
  for (const insertion of sentence.lexInsertions) {
    assert.equal(insertion.schema, combinations.LEXICAL_INSERTION_SCHEMA);
    assert.equal(insertion.layer, 'Context');
    assert.equal(insertion.axis, 'LEX');
    assert.equal(insertion.origin, 'LEX');
    assert.equal(insertion.nodeId, undefined);
    assert.equal(treeNodes.has(insertion.id), false);
    assert.equal([...treeNodes.values()].some(node => node.label === insertion.label), false,
      insertion.label + ' mag geen centrale Text-boomknoop zijn');
    assert.ok(sentence.lex.some(item => item.insertionId === insertion.id));
  }
}

const farmerDonkey = configured.find(item => item.id === 'boer-bezit-ezel-hij-slaat-hem');
assert.deepEqual(farmerDonkey.relations.map(item => item.id), ['boer-hij', 'ezel-hem']);

const because = configured.find(item => item.id === 'boer-slaat-ezel-omdat-hij-hem-bezit');
assert.equal(because.provenance.kind, 'user-supplied');
assert.deepEqual(because.relations.map(item => item.id), ['boer-hij', 'ezel-hem']);
assert.equal(because.context.status, 'p.m.');
assert.equal(because.context.notation, 'Open Graph Notation');
assert.equal(because.context.representation, 'minimized-tree');
assert.equal(because.sentences[0].finiteVerbPlacement, 'v2');
assert.equal(because.sentences[1].clauseType, 'subordinate');
assert.equal(because.sentences[1].finiteVerbPlacement, 'final');
assert.equal(because.sentences[1].lexInsertions[0].label, 'OMDAT');
assert.equal(because.sentences[1].lexInsertions[0].layer, 'Context');
assert.equal([...combinations.collectNodes(because.sentences[1].tree).values()]
  .some(node => node.label === 'OMDAT'), false);
assert.equal(lexicon.resolve(lexicon.DEFAULT_PROFILES, 'hem', 'ezel', 'object').selected.surface, 'HEM');
assert.equal(lexicon.resolve(lexicon.DEFAULT_PROFILES, 'hem', 'boer', 'subject').selected.id, 'hij');
assert.equal(lexicon.surfaceFromTemplate({surface:'HIJ'}, because.surfaceTemplate,
  {'ezel-hem': {surface:'HEM'}}), 'omdat hij hem bezit.');

const perfectFlip = configured.find(item => item.id === 'man-slaat-hond-omdat-die-hem-heeft-gebeten');
assert.equal(perfectFlip.provenance.kind, 'user-supplied');
assert.equal(perfectFlip.surfaceFromLex, true);
assert.deepEqual(perfectFlip.relations.map(item => item.id), ['hond-die', 'man-hem']);
assert.equal(perfectFlip.context.status, 'p.m.');
assert.equal(perfectFlip.sentences[1].clauseType, 'subordinate');
assert.equal(perfectFlip.sentences[1].finiteVerbPlacement, 'final');
assert.equal(perfectFlip.sentences[1].lexInsertions[0].label, 'OMDAT');
assert.equal(lexicon.resolve(lexicon.DEFAULT_PROFILES, 'die', 'hond', 'subject').selected.surface, 'DIE');
assert.equal(lexicon.resolve(lexicon.DEFAULT_PROFILES, 'hem', 'man', 'object').selected.surface, 'HEM');
assert.deepEqual(perfectFlip.layoutResolution.branches.map(branch => branch.id), ['s1-root', 's1-vp', 's2-vcluster']);
assert.deepEqual(perfectFlip.layoutResolution.branches[2].variants, ['normal', 'left-right', 'short-long', 'both']);
assert.equal(perfectFlip.layoutResolution.branches[2].linearization, 'child-order');

const duplicate = clone(farmerDonkey);
duplicate.relations[1].id = duplicate.relations[0].id;
assert.throws(() => combinations.normalizeCombination(duplicate), /Dubbele anafoorrelatie-id/);

const forbiddenTemporal = clone(temporal);
forbiddenTemporal.relations.push({id:'gisteren-vandaag',type:'temporal-reference'});
assert.throws(() => combinations.normalizeCombination(forbiddenTemporal), /uitsluitend centrale Text-coreferentie/);

const contextAsText = clone(temporal);
contextAsText.sentences[0].lexInsertions[0].layer = 'Text';
assert.throws(() => combinations.normalizeCombination(contextAsText), /iedere insertie behoort tot Context/);

const contextNodeEndpoint = clone(temporal);
contextNodeEndpoint.relations[0].anaphor = {unitId:'S2',insertionId:'lex-s2-vandaag'};
delete contextNodeEndpoint.relations[0].referentNodeId;
assert.throws(() => combinations.normalizeCombination(contextNodeEndpoint), /structurele boomknopen/);

const expandedContext = clone(temporal);
expandedContext.context.relations = [{type:'temporal-reference'}];
assert.throws(() => combinations.normalizeCombination(expandedContext), /uitsluitend gereserveerd als p\.m\./);

const notMinimized = clone(temporal);
notMinimized.context.representation = 'full-taxonomy';
assert.throws(() => combinations.normalizeCombination(notMinimized), /geminimaliseerde boom/);

const subordinateV2 = clone(because);
subordinateV2.sentences[1].finiteVerbPlacement = 'v2';
assert.throws(() => combinations.normalizeCombination(subordinateV2), /behoudt de persoonsvorm aan het einde/);

const group = clone(temporal);
group.relations[0] = {
  id:'groep-zij', type:'group-coreference',
  antecedents:[{unitId:'S1',nodeId:'tm-s1-man'}],
  anaphor:{unitId:'S2',nodeId:'tm-s2-man'}
};
assert.throws(() => combinations.normalizeCombination(group), /ogn-referent-anaphor-v2/);

function layout(nodes) {
  return {
    nodes: nodes.map(node => ({kind:'leaf', ...node})), edges:[], boxes:[],
    box: {
      minX: Math.min(...nodes.map(node => node.x)),
      maxX: Math.max(...nodes.map(node => node.x)),
      minY: Math.min(...nodes.map(node => node.y)),
      maxY: Math.max(...nodes.map(node => node.y))
    }
  };
}

const entity = temporal.relations[0];
const composed = compositor.composeDeclaredPair({
  upper: {id:'S1',layout:layout([
    {id:'tm-s1-man',label:'MAN',x:3,y:0},
    {id:'tm-s1-zag',label:'ZAG',x:5,y:1}
  ]),lexInsertions:temporal.sentences[0].lexInsertions},
  lower: {id:'S2',layout:layout([
    {id:'tm-s2-man',label:'MAN',x:-1,y:0},
    {id:'tm-s2-was',label:'WAS',x:0,y:1}
  ]),lexInsertions:temporal.sentences[1].lexInsertions},
  relation:entity, relations:temporal.relations,gapRows:3
});
assert.equal(composed.relations.length, 1);
assert.equal(composed.relations[0].antecedent.x, composed.relations[0].anaphor.x);
for (const unit of composed.units) {
  const sentence = temporal.sentences.find(item => item.id === unit.id);
  const plan = combinations.planLexInsertionRows(sentence, unit.layout);
  assert.equal(plan.length, unit.id === 'S1' ? 1 : 3);
  for (const item of plan) {
    assert.equal(item.layer, 'Context');
    assert.equal(unit.layout.nodes.some(node => node.id === item.id), false);
    assert.equal(unit.layout.nodes.some(node => node.y === item.y), false);
  }
}

const timeline = play.buildTimeline(because.sentences);
assert.equal(timeline.units[0].finiteVerbPlacement, 'v2');
assert.equal(timeline.units[1].lexInsertionIds[0], 'lex-s2-omdat');
assert.equal(timeline.units[1].finiteVerbMoveStep, null);
assert.equal(play.phaseAt(timeline,timeline.units[1].lexInsertionStep).kind,'lex-insertions');
assert.equal(play.stateAt(timeline,timeline.max).units[1].finiteVerbMoved,false);

const flipTimeline = play.buildTimeline(perfectFlip.sentences, [
  {id:'s1-root',unitId:'S1',variant:'left-right'},
  {id:'s1-vp',unitId:'S1',variant:'left-right'},
  {id:'s2-vcluster',unitId:'S2',variant:'short-long'}
]);
assert.deepEqual(flipTimeline.units[0].branchFlipIds, ['s1-root', 's1-vp']);
assert.deepEqual(flipTimeline.units[1].branchFlipIds, ['s2-vcluster']);
assert.equal(play.phaseAt(flipTimeline, flipTimeline.units[0].branchFlipStep).kind, 'branch-flip');
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[0].branchFlipStep - 1).units[0].branchFlipped, false);
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[0].branchFlipStep).units[0].branchFlipped, true);
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[1].branchFlipStep - 1).units[1].branchFlipped, false);
assert.equal(play.stateAt(flipTimeline, flipTimeline.units[1].branchFlipStep).units[1].branchFlipped, true);

const defaultConfig = json('config/default-config.json').config;
assert.deepEqual(defaultConfig.anaphorFlipVariants, {});
const fileConfigured = combinations.normalizeCombinations(defaultConfig.anaphorCombinations);
assert.deepEqual(fileConfigured.map(item => item.relations.length),[1,1,1,1,2,2,2]);

const fixtureCatalog = json('samples/s1-s2-relation-fixtures.json');
assert.equal(fixtureCatalog.fixtures.length,9);
assert.ok(fixtureCatalog.fixtures.every(fixture =>
  (fixture.assertedRelations || []).every(item => item.type === 'coreference')));
const baseline = fixtureCatalog.fixtures.find(item => item.id === 'user-man-yesterday-today');
assert.equal(baseline.expected.hardRelationCount,1);
assert.equal(baseline.expected.contextInsertionCount,4);
assert.equal(baseline.expected.contextRelationCount,1);
assert.equal(baseline.contextRelations[0].display,'dashed-bracket-along-lex-axis');
assert.ok(baseline.lexInsertions.every(item => item.layer === 'Context'));
assert.deepEqual(fixtureCatalog.contextModel,{
  notation:'Open Graph Notation',representation:'minimized-tree',status:'p.m.'
});
const becauseFixture = fixtureCatalog.fixtures.find(item => item.id === 'user-farmer-donkey-because');
assert.equal(becauseFixture.expected.hardRelationCount,2);
assert.equal(becauseFixture.expected.s2FiniteVerbPlacement,'final');
const perfectFixture = fixtureCatalog.fixtures.find(item => item.id === 'user-man-dog-because-perfect');
assert.equal(perfectFixture.expected.hardRelationCount,2);
assert.deepEqual(perfectFixture.flip.variants,['normal','left-right','short-long','both']);
assert.equal(perfectFixture.flip.vclusterLinearization['short-long'],'GEBETEN HEEFT');

const literature = json('samples/anaphor-s1-s2-literature-catalog.json');
const userEntry = literature.entries.find(entry => entry.id === 'user-man-temporal');
assert.deepEqual(userEntry.relations.map(item => item.type),['coreference']);
assert.equal(literature.entries.find(entry => entry.id === 'user-farmer-donkey-because').relations.length,2);
assert.equal(literature.entries.find(entry => entry.id === 'user-man-dog-because-perfect').relations.length,2);
assert.ok(literature.entries.filter(entry => entry.provenance.url).length >= 5);

for (const [main,copy] of [
  ['TEXT_AND_CONTEXT.md','docs/TEXT_AND_CONTEXT.md'],
  ['CONTEXT_TAXONOMY.md','docs/CONTEXT_TAXONOMY.md'],
  ['ANAPHOR_LANGUAGE_TREE_EXTENSION.md','docs/ANAPHOR_LANGUAGE_TREE_EXTENSION.md'],
  ['ANAPHOR_S1_S2_LITERATURE_CATALOG.md','docs/ANAPHOR_S1_S2_LITERATURE_CATALOG.md'],
  ['ANAPHOR_AND_S1_S2_RELATION_DEFINITIONS.md','docs/ANAPHOR_AND_S1_S2_RELATION_DEFINITIONS.md'],
  ['S1_S2_RELATION_TEST_FIXTURES.md','docs/S1_S2_RELATION_TEST_FIXTURES.md'],
  ['MULTI_OGN_ANAPHOR.md','docs/MULTI_OGN_ANAPHOR.md'],
  ['FLIP_CONSTRAINT_SOLVER.md','docs/FLIP_CONSTRAINT_SOLVER.md'],
  ['OPN_STORAGE_FORMAT.md','docs/OPN_STORAGE_FORMAT.md']
]) assert.equal(read(main),read(copy),main+' en '+copy+' moeten identiek zijn');

for (const marker of ['**Text**','**Context**','Iedere insertie','geminimaliseerde boom','BOER(S1)','EZEL(S1)','CONTEXT_TAXONOMY.md','p.m.']) {
  assert.ok(read('TEXT_AND_CONTEXT.md').includes(marker),'Text/Context-definitie ontbreekt: '+marker);
}
const contextTaxonomy = read('CONTEXT_TAXONOMY.md');
for (const marker of ['`CONTEXT`','`STATISCH`','`DYNAMISCH`','`TIJD`','`PLAATS`','`RICHTING`','`DOEL`','`BRON`','`ACTIE`','`HOE`','`INSTRUMENT`','`MANIER`','`MOTIEF`','`REDEN`','`OORZAAK`']) {
  assert.ok(contextTaxonomy.includes(marker),'Context-tak ontbreekt: '+marker);
}
const contextSvg = read('references/context-taxonomy.svg');
assert.ok(contextSvg.includes('>CONTEXT</text>'),'Context-referentieboom heeft een onjuiste wortelnaam');
assert.ok(contextSvg.includes('data-ogn-unit="CONTEXT"'),'Context is een zelfstandige Open Graph Notation');
const contextNodes = [...contextSvg.matchAll(/<circle[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/g)]
  .map(match => ({ x: Number(match[1]), y: Number(match[2]) }));
assert.equal(contextNodes.length,15,'Context-OGN bevat vijftien knopen');
assert.equal(new Set(contextNodes.map(node => node.x)).size,contextNodes.length,'Context-OGN hergebruikt een verticale gridlijn');
assert.equal(new Set(contextNodes.map(node => node.y)).size,contextNodes.length,'Context-OGN hergebruikt een horizontale gridlijn');
assert.ok(contextNodes.every(node => (node.x - 10) % 20 === 0 && (node.y - 10) % 20 === 0),'Context-knopen staan niet op het OGN-raster');
const viewer = read('viewer.js');
for (const marker of [
  "sourceKind: insertion ? 'lexical-insertion' : 'tree-node'",
  "layer: insertion ? 'Context' : 'Text'",
  "source_layer: item.layer",
  'lex_insertion_step: unit.lexInsertionStep',
  'branch_flip_step: unit.branchFlipStep',
  "finite_verb_placement: unit.finiteVerbPlacement",
  "cross_ogn_column_semantics: 'column-sharing-alone-does-not-declare-coreference'"
]) assert.ok(viewer.includes(marker),'viewer-marker ontbreekt: '+marker);
assert.equal(read('index.html'),read('viewer.html'),'index.html en viewer.html moeten identiek zijn');

console.log('LANGUAGE TREE EXTENSIE 1 CHECK: OK (Text/Context; 5 combinaties; joint flip; geminimaliseerde Context-OGN p.m.; 9 fixtures)');
