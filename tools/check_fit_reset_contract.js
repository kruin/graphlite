'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const documentation = fs.readFileSync(path.join(root, 'FIT_AND_RESET.md'), 'utf8');
const config = JSON.parse(fs.readFileSync(path.join(root, 'config', 'default-config.json'), 'utf8'));

assert.ok(source.includes('function applyFullStartupState()'), 'Volledige startstand ontbreekt');
assert.ok(source.includes("state.centerMode = 'syntax'"), 'Browserstart moet met Syntax beginnen');
assert.ok(source.includes("state.projection = 'axes'"), 'Browserstart moet alle projecties tonen');
assert.ok(source.includes('state.sourceAxes = SOURCE_AXIS_IDS.slice()'), 'Alle bronassen moeten bij browserstart zichtbaar zijn');
assert.ok(source.includes('resetForNewExample();'), 'Browserstart moet tijdelijke itemstand herstellen');
assert.ok(
  source.indexOf('applyFullStartupState();') > source.indexOf('loadSavedConfigSnapshot()'),
  'Opgeslagen Config moet vóór de tijdelijke startreset worden geladen'
);
assert.ok(
  source.indexOf("const requestedItem = queryParamValue('item', 'example')") > source.indexOf('applyFullStartupState();'),
  'Een expliciet URL-item moet na de startreset worden verwerkt'
);
assert.ok(!source.includes('localStorage.clear()'), 'Viewer mag browseropslag niet stilzwijgend volledig wissen');
assert.ok(!source.includes('removeItem(CONFIG_STORAGE_KEY)'), 'Volledige startstand mag opgeslagen Config niet wissen');

const multiReset = source.slice(source.indexOf('function activePlacementReset()'), source.indexOf('function setGrowthStep('));
assert.ok(multiReset.includes('applyProjectionAxes(SOURCE_AXIS_IDS)'), 'Reset moet alle projecties herstellen');
assert.ok(multiReset.includes('resetForNewExample()'), 'Multi-OGN Reset moet ook pan/zoom en lokale ruimte herstellen');
assert.ok(multiReset.includes('state.multiOgnPlayStep = 0'), 'Multi-OGN Reset moet bij Play-stap nul beginnen');

assert.ok(!indexHtml.includes('id="spaceZoomControls"'), 'Main mag geen RuimteZoom-paneel bevatten');
assert.ok(!indexHtml.includes('data-space-toggle'), 'Main mag geen losse RuimteZoom-knop bevatten');
assert.match(documentation, /Config → Language Tree → Ruimte slepen/);
assert.match(documentation, /FIT verandert \*\*geen\*\* knoop/);
assert.match(documentation, /opgeslagen Config-snapshot/);
assert.match(documentation, /browserdatabase/);
assert.match(documentation, /Hij wist geen browseropslag/);
assert.equal(config.config.canvasLeftMarginPercent, 0, 'FIT-linkermarge moet na het afkorten van de as standaard 0% zijn');
assert.ok(source.includes('id="canvasLeftMarginPercentInput"'), 'Config mist Marge links');
assert.ok(source.includes('min="0" max="25"'), 'Marge links moet instelbaar zijn van 0–25%');
assert.ok(source.includes('configuredLeftMargin = frame.w * validCanvasLeftMarginPercent'), 'Stabiele West/Oost-FIT moet Marge links toepassen');
assert.ok(source.includes('configuredLeftMargin = bbox.width * validCanvasLeftMarginPercent'), 'Noord/Zuid-FIT moet Marge links toepassen');
assert.match(documentation, /Config → Algemeen → Marge links/);
assert.match(documentation, /standaard is dit 0%/);
assert.ok(source.includes('enforceTrimmedAxisMarginDefault();'), 'Bestaande browserstanden moeten eenmalig van de foutieve 8%-default naar 0% migreren');

console.log('FIT / RESET CONTRACT CHECK: OK (FIT alleen zichtvenster; RZ via Config; volledige startstand bewaart Config en data)');
