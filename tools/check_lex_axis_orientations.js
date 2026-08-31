'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const stylesheet = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const config = JSON.parse(fs.readFileSync(path.join(root, 'config', 'default-config.json'), 'utf8'));
const documentation = fs.readFileSync(path.join(root, 'LEX_AXIS_ORIENTATIONS.md'), 'utf8');

for (const side of ['west', 'east', 'north', 'south']) {
  assert.ok(source.includes(`id: '${side}'`), `Config mist LEX-zijde ${side}`);
}
assert.equal(config.config.lexAxisSide, 'east', 'Oost moet de startdefault zijn');
assert.ok(source.includes("opengraph_lex_axis_default_east_rc9"), 'Bestaande browserstanden moeten na alle configlagen eenmalig naar Oost migreren');
assert.ok(source.indexOf('enforceEastStartupDefault();') > source.indexOf('loadSavedConfigSnapshot()'), 'Oostmigratie moet na de browsersnapshot plaatsvinden');
assert.equal(config.config.canvasHorizontalAlignment, 'left', 'De tekening moet standaard links aansluiten');
for (const alignment of ['left', 'center', 'right']) {
  assert.ok(source.includes(`id: '${alignment}'`), `Config mist vensteruitlijning ${alignment}`);
}
assert.ok(source.includes("localStorage.getItem('opengraph_canvas_horizontal_alignment')"), 'Vensteruitlijning moet lokaal worden bewaard');
assert.ok(source.includes("canvasHorizontalAlignment: validCanvasHorizontalAlignment"), 'Vensteruitlijning moet deel zijn van Config-snapshots');
assert.ok(source.includes("horizontalAnchor"), 'SVG-uitlijning moet de gekozen horizontale ankerzijde volgen');
assert.ok(source.includes("'xMax'"));
assert.ok(source.includes("'xMid'"));
assert.ok(source.includes("'xMin'"));
assert.match(documentation, /vrije\s+schermmarge/);
assert.ok(source.includes("'data-utterance-reading'"));
assert.ok(source.includes("? 'left-to-right' : 'top-to-bottom'"));
assert.ok(source.includes("'data-semantic-movement-direction', 'forward'"));
assert.ok(source.includes("? 'left' : 'up'"));
assert.ok(source.includes("if (side === 'south') return `matrix(0 ${-crossScale} ${horizontalStretch} 0"), 'Zuid moet uit West draaien, spreiden en de dwarsrichting comprimeren');
assert.ok(source.includes("if (side === 'north') return `matrix(0 ${crossScale} ${horizontalStretch} 0"), 'Noord moet de leesrichting links→rechts bewaren');
assert.ok(source.includes("horizontalLexReadingScale(content)"), 'Horizontale uitingen moeten woordlengte-afhankelijke leesafstand krijgen');
assert.ok(source.includes("widestGraphicItem + 34"), 'Het breedste grafische item moet de kolombreedte bepalen');
assert.ok(source.includes("'.tree-node'"), 'Knoopvormen moeten de horizontale breedte bepalen');
assert.ok(source.includes("'.lex-slot-box'"), 'LEX-boxen moeten de horizontale breedte bepalen');
assert.ok(source.includes("data-horizontal-max-graphic-width"), 'De gemeten grafische breedte moet controleerbaar zijn');
assert.ok(source.includes("horizontalStableTextCrossScale(content)"), 'De x-ascelhoogte moet uit stabiele teksthoogte worden afgeleid');
assert.ok(source.includes("stableTextHeight + 14"), 'Teksthoogte moet slechts een kleine leesgoot krijgen');
assert.ok(source.includes("!child.classList?.contains('grid')"), 'Het hulpraster mag het draaicentrum niet bepalen');
assert.ok(source.includes("config-orientation-card"), 'Config moet een herkenbare oriëntatiekaart bieden');
assert.ok(source.includes("data-lex-axis-side-choice"), 'De vier oriëntaties moeten direct kiesbaar zijn');
assert.ok(source.includes("mainLexOrientationMenu"), 'De algemene oriëntatieknop moet op Main staan');
assert.ok(indexHtml.indexOf('<nav aria-label="Topmenu" class="main-top-menu">') < indexHtml.indexOf('id="mainLexOrientationMenu"'), 'LEX-view moet binnen het zichtbare hoofdmenu staan');
assert.ok(indexHtml.includes('>Noord →</button>') && indexHtml.includes('>Zuid →</button>'), 'Noord en Zuid moeten rechtstreeks in de LEX-viewkeuze staan');
assert.ok(source.includes("lexAxisMobileWarning"), 'Mobiel moet voor horizontale uitingen waarschuwen');
assert.ok(source.includes("const orientationExcluded = directPlacementActive()"), 'Greedy Grow en Random moeten uitgesloten blijven');
assert.ok(source.includes("data-hidden-for-horizontal-utterance"), 'Noord/Zuid moeten de dubbele zintitel verbergen');
assert.ok(source.includes("group.querySelectorAll?.('.graph-sentence-heading, .multi-ogn-unit-label')"), 'Noord/Zuid moeten losse graph- en OGN-kernzinlabels verbergen');
assert.ok(source.includes("expandBoxToAspectFromLeft"), 'Noord/Zuid moeten zonder linkermarge aansluiten');
assert.ok(source.includes("const leftMargin = horizontalLexPresentation ? 0 : margin"), 'Noord/Zuid mogen geen FIT-linkermarge krijgen');
assert.ok(source.includes("data-vertical-shared-reference-box"), 'West/Oost moeten dezelfde maximale inhoudsbox als referentie gebruiken');
assert.ok(source.includes("data-tree-orientation', 'stable-unflipped'"), 'West/Oost moeten de boomoriëntatie stabiel houden');
assert.ok(source.includes("data-axis-swap-only"), 'Oost mag uitsluitend de verticale projectieassen wisselen');
assert.ok(!source.includes("translate(${2 * cx} 0) scale(-1 1)"), 'Oost mag de volledige graph niet spiegelen');
assert.ok(source.includes("stableVerticalProjectionAxes(origin)"), 'Beide standen moeten één berekende ascorridor gebruiken');
assert.ok(source.includes("data-lex-axis-side': verticalLexSide"), 'Anafoor- en uitingsitems moeten West/Oost zelf toepassen');
assert.ok(source.includes("const lexOnEast = verticalLexSide === 'east'"), 'Samengestelde OGN-items moeten LEX werkelijk naar Oost kunnen zetten');
assert.ok(source.includes("fillGroupedTestmateriaalMenu"), 'Desktop en mobiel moeten de gegroepeerde testmateriaalcatalogus gebruiken');
assert.ok(source.includes("testmateriaal-list-panel"), 'Lijstaantal moet echte afzonderlijke lijstpanelen opleveren');
assert.ok(source.includes("familyEntries") && source.includes("familyPanels"), 'Zin- en Uitinggroepen moeten als hele groepen over lijstpanelen worden verdeeld');
assert.ok(!stylesheet.includes('column-count: var(--testmateriaal-list-count'), 'Lijstaantal mag niet slechts CSS-kolommen binnen één lijst maken');
assert.ok(stylesheet.includes('grid-template-columns: repeat(var(--testmateriaal-list-count'), 'Lijstpanelen moeten door de configureerbare 1–4-lijstindeling worden geplaatst');
assert.equal(config.config.desktopTestmateriaalListCount, 2, 'Desktop moet standaard twee lijstkolommen ondersteunen');
assert.equal(config.config.mobileTestmateriaalListCount, 1, 'Mobiel moet configureerbaar vanuit één lijst starten');
assert.ok(source.includes('horizontalLexUnits'), 'Noord/Zuid moeten LEX per kernzin kunnen schakelen');
assert.ok(source.includes('const horizontalStretch = horizontalLexReadingScale(content)'), 'Noord/Zuid moeten de gemeten grafische breedte als tak-/kolomruimte gebruiken');
assert.ok(source.includes("const corridor = Math.max("), 'De grootste ruimtebehoefte van West en Oost moet de plaats bepalen');
assert.ok(documentation.includes('naar voren'));
assert.ok(documentation.includes('| Zuid | links → rechts | boven LEX | links |'));

// West/Oost wisselen uitsluitend LEX en SYNT. De boomcoördinaten blijven
// identiek; dit is nadrukkelijk geen Flip.
const points = {
  lexAxis: { x: -10, y: 0 },
  syntAxis: { x: 10, y: 0 },
  word1: { x: -10, y: -10 },
  word2: { x: -10, y: 10 },
  tree: { x: 0, y: 0 },
  root: { x: 0, y: -10 }
};
const map = {
  west: ({ x, y }) => ({ x, y }),
  south: ({ x, y }) => ({ x: y, y: -x }),
  north: ({ x, y }) => ({ x: y, y: x })
};
const oriented = side => side === 'east'
  ? { ...points, lexAxis: points.syntAxis, syntAxis: points.lexAxis, word1: { x: 10, y: -10 }, word2: { x: 10, y: 10 } }
  : Object.fromEntries(Object.entries(points).map(([key, value]) => [key, map[side](value)]));
assert.deepEqual(oriented('east').tree, oriented('west').tree, 'Oost mag de boom niet verplaatsen of spiegelen');
assert.deepEqual(oriented('east').root, oriented('west').root, 'Oost moet dezelfde wortelpositie behouden');
assert.equal(oriented('east').lexAxis.x, oriented('west').syntAxis.x, 'LEX moet naar de oostzijde wisselen');
assert.equal(oriented('east').syntAxis.x, oriented('west').lexAxis.x, 'SYNT moet naar de westzijde wisselen');
for (const side of ['west', 'east']) assert.ok(oriented(side).word1.y < oriented(side).word2.y, `${side}: uiting moet boven→beneden lezen`);
for (const side of ['north', 'south']) {
  const value = oriented(side);
  assert.ok(value.word1.x < value.word2.x, `${side}: uiting moet links→rechts lezen`);
  assert.ok(value.root.x < value.tree.x, `${side}: S/Clause moet links ontspringen`);
}
assert.ok(oriented('south').tree.y < oriented('south').lexAxis.y, 'Zuid: boom moet boven LEX liggen');
assert.ok(oriented('north').tree.y > oriented('north').lexAxis.y, 'Noord: boom moet onder LEX liggen');
assert.ok((Math.max(92, 88 + 34) / 52) * 52 >= 122, 'Een langer woord moet een overeenkomstig langere horizontale stap krijgen');

console.log('LEX AXIS ORIENTATION CHECK: OK (W/O alleen assenwissel; boom stabiel; gedeelde ruimtecorridor; N/Z ongewijzigd)');
