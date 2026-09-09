'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const viewer = fs.readFileSync(path.join(root, 'viewer.html'), 'utf8');
const lexicon = fs.readFileSync(path.join(root, 'lexicon-config.html'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'catalog.public.json'), 'utf8'));

const start = source.indexOf('const SIMPLE_LEXICON_POLICY =');
const endMarker = '\n\n  function tokenLexemeId';
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('Lexiconbeleid of werkwoordframes niet gevonden.');

const context = {};
const definitions = source.slice(start, end)
  .replace('const SIMPLE_LEXICON_POLICY =', 'SIMPLE_LEXICON_POLICY =')
  .replace('const SIMPLE_VERB_FRAMES =', 'SIMPLE_VERB_FRAMES =');
vm.runInNewContext(definitions, context);

const frameMapStart = source.indexOf('const TENSE_FAMILY_FRAME_IDS =');
const frameMapEnd = source.indexOf('\n\n  function validateExamplePolicy', frameMapStart);
if (frameMapStart < 0 || frameMapEnd < 0) throw new Error('Koppeling tijdsfamilie → werkwoordframe niet gevonden.');
const frameContext = { SIMPLE_VERB_FRAMES: context.SIMPLE_VERB_FRAMES };
const frameDefinitions = source.slice(frameMapStart, frameMapEnd)
  .replace('const TENSE_FAMILY_FRAME_IDS =', 'TENSE_FAMILY_FRAME_IDS =')
  .replace('function tokenLexemeId(item)', 'function tokenLexemeId(item)');
vm.runInNewContext(frameDefinitions, frameContext);
for (const [family, expectedFrame] of [['bijten', 'bijt'], ['breien', 'breit'], ['vallen', 'valt']]) {
  const resolved = frameContext.verbFrameForLexemeId(family);
  if (resolved !== context.SIMPLE_VERB_FRAMES[expectedFrame]) {
    throw new Error(`${family}: tijdsfamilie verbreekt het lexicale selectiekader ${expectedFrame}.`);
  }
}
if (frameContext.verbFrameForLexemeId('bijt') !== context.SIMPLE_VERB_FRAMES.bijt) {
  throw new Error('Rechtstreekse OTT-framesleutel BIJT werkt niet meer.');
}

const expected = ['vrouw', 'man', 'meisje', 'jongen', 'jan', 'anna', 'marie', 'piet'];
const frame = context.SIMPLE_VERB_FRAMES.breit;
if (JSON.stringify(Array.from(frame.subjects)) !== JSON.stringify(expected)) {
  throw new Error(`Onjuiste BREIEN-agenten: ${frame.subjects.join(', ')}`);
}
if (frame.subjects.includes('jek')) throw new Error('JEK mag niet in het BREIEN-frame staan.');
for (const id of frame.subjects) {
  const entry = context.SIMPLE_LEXICON_POLICY[id];
  if (!entry || entry.entityClass !== 'human' || entry.animacy !== 'animate' || !entry.themes.includes('agens')) {
    throw new Error(`${id} is niet volledig als menselijke animate agens geclassificeerd.`);
  }
}
if (context.SIMPLE_LEXICON_POLICY.jek.entityClass !== 'animal') {
  throw new Error('JEK moet expliciet als dier zijn geclassificeerd.');
}
if (frame.present !== 'BREIT' || frame.imperfectum !== 'BREIDE') {
  throw new Error('BREIT/BREIDE zijn niet als vormen van één werkwoordframe beschikbaar.');
}
if (context.SIMPLE_VERB_FRAMES.bijt.present !== 'BIJT' || context.SIMPLE_VERB_FRAMES.bijt.imperfectum !== 'BEET') {
  throw new Error('BIJT/BEET zijn niet als vormen van één werkwoordframe beschikbaar.');
}
const biteObjects = context.SIMPLE_VERB_FRAMES.bijt.objects;
for (const id of ['man', 'hond', 'kat', 'vrouw', 'jan', 'jek']) {
  if (!biteObjects.includes(id) || !context.SIMPLE_LEXICON_POLICY[id].roles.includes('object')) {
    throw new Error(`${id} ontbreekt als gelijkwaardige patiens van BIJTEN.`);
  }
}

for (const marker of [
  'function lexicalCandidatesForRole(role)',
  "role === 'object' || role === 'patiens'",
  "['subject', 'object', 'predicate'].includes(role)",
  "role === 'object' ? 'Kies een patiens'",
  "'data-action': 'lexical-role-choice'",
  'function chooseLexicalRoleItem(role, candidate)',
  "role === 'predicate'",
  "{ id: `${lexeme}:present`",
  "{ id: `${lexeme}:past`",
  'renderLexicalChoicePrompt();'
  ,'return verbFrameForLexemeId(tokenLexemeId(predicate));'
]) {
  if (!source.includes(marker)) throw new Error(`Runtimekoppeling ontbreekt: ${marker}`);
}
for (const marker of ['id="lexicalChoicePanel"', 'id="lexicalChoiceOptions"', 'id="lexicalChoiceCloseButton"']) {
  if (!index.includes(marker)) throw new Error(`Keuzepaneel ontbreekt: ${marker}`);
  if (!viewer.includes(marker)) throw new Error(`Keuzepaneel ontbreekt in viewer.html: ${marker}`);
}
for (const id of expected) {
  if (!lexicon.includes(`data-id="${id}"`) || !lexicon.includes(`data-frame-subjects="${expected.join(' ')}"`)) {
    throw new Error(`Lexicon-config mist ${id} of het volledige BREIEN-frame.`);
  }
}
if (!lexicon.includes('data-id="jek"') || !lexicon.includes('data-entity-class="animal"')) {
  throw new Error('Lexicon-config classificeert JEK niet als dier.');
}

const publicIds = new Set(catalog.items.flatMap(item => item.source_ids || [item.source_id]));
for (const id of [
  'example:hond-beet-man',
  'example:omdat-hond-man-beet',
  'example:vrouw-breide-trui',
  'example:omdat-vrouw-trui-breide'
  ,'utterance:jan-slaat-de-hond-omdat-die-hem-gebeten-heeft'
  ,'anaphor:man-slaat-hond-omdat-die-hem-heeft-gebeten'
]) {
  if (publicIds.has(id)) throw new Error(`Dubbele vorm staat nog publiek: ${id}`);
}
for (const id of [
  'example:hond-bijt-man',
  'example:omdat-hond-man-bijt',
  'example:vrouw-breit-trui'
]) {
  if (!publicIds.has(id)) throw new Error(`Canonieke structurele testcase ontbreekt: ${id}`);
}

console.log('LEXICALE KEUZES CHECK: OK (MAN-popup/patiënten; 8 BREIEN-agenten; vormdoublures niet publiek)');
