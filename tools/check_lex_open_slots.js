'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const defaults = JSON.parse(fs.readFileSync(path.join(root, 'config', 'default-config.json'), 'utf8'));

const errors = [];
function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(js.includes("const DEFERRED_LEX_OPEN_SLOT_PLACEMENTS = Object.freeze(['before', 'after', 'between']);"), 'uitgestelde plaatsingsvoorraad ontbreekt');
assert(js.includes('function lexConfiguredOpenSlots(y0, occupiedYs = [])'), 'compatibele open-slotfunctie ontbreekt');
assert(js.includes('void y0;') && js.includes('void occupiedYs;') && js.includes('return [];'), 'open-slotfunctie is niet hard inactief');
assert(!index.includes('id="lexOpenSlotCountSelect"'), 'aantal vrije posities is nog zichtbaar in Config');
assert(!index.includes('id="lexOpenSlotPlacementSelect"'), 'plaatsingskeuze is nog zichtbaar in Config');
assert(index.includes('Generieke vrije plekken vóór, na of tussen') && index.includes('no-show'), 'Config legt de uitgestelde grens niet uit');
assert(index.includes('data-help-topic="lex-free-positions"'), 'Help-onderwerp voor het actieve LEX-profiel ontbreekt');
assert(index.includes('Oude Config- of OPN-velden daarvoor worden compatibel genegeerd'), 'compatibiliteitsuitleg ontbreekt');
assert(!Object.prototype.hasOwnProperty.call(defaults.config || {}, 'lexOpenSlotCount'), 'default-config schrijft lexOpenSlotCount nog');
assert(!Object.prototype.hasOwnProperty.call(defaults.config || {}, 'lexOpenSlotPlacement'), 'default-config schrijft lexOpenSlotPlacement nog');
assert(!js.includes('additional_open_slot_count:'), 'nieuwe OPN-export schrijft additional_open_slot_count nog');
assert(!js.includes('additional_open_slot_placement:'), 'nieuwe OPN-export schrijft additional_open_slot_placement nog');
assert(!js.includes('lex_open_slot_count:'), 'legacy-export schrijft lex_open_slot_count nog');
assert(!js.includes('lex_open_slot_placement:'), 'legacy-export schrijft lex_open_slot_placement nog');

if (errors.length) {
  console.error('LEX ACTIVE-PROFILE CHECK: FOUT');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('LEX ACTIVE-PROFILE CHECK: OK (upward + insertie + Comp; vóór/na/tussen no-show)');
