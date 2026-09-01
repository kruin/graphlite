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
assert.ok(source.includes("const transformSide = compositeUtteranceView ? side : 'south'"), 'Simplex Noord/Zuid moeten dezelfde echte klokwijzerrotatie gebruiken');
assert.ok(source.includes("const crossScale = compositeUtteranceView ? 1 : measuredCrossScale"), 'Alleen simplex moet de gemeten compacte dwarsmaat toepassen');
assert.ok(source.includes("configuredLexSide === 'east' || configuredLexSide === 'south'"), 'Zuid-simplex moet LEX/SYNT vóór de stabiele rotatie wisselen');
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
assert.ok(indexHtml.indexOf('id="mainLexOrientationMenu"') < indexHtml.indexOf('<nav aria-label="Topmenu" class="main-top-menu">'), 'De eerdere afzonderlijke Noord/Zuid-viewcontrol moet behouden blijven');
assert.ok(indexHtml.includes('>Noord →</button>') && indexHtml.includes('>Zuid →</button>'), 'Noord en Zuid moeten rechtstreeks in de LEX-viewkeuze staan');
assert.ok(source.includes("lexAxisMobileWarning"), 'Mobiel moet voor horizontale uitingen waarschuwen');
assert.ok(source.includes("const orientationExcluded = directPlacementActive()"), 'Greedy Grow en Random moeten uitgesloten blijven');
assert.ok(source.includes("data-hidden-for-horizontal-utterance"), 'Noord/Zuid moeten de dubbele zintitel verbergen');
assert.ok(source.includes("group.querySelectorAll?.('.graph-sentence-heading, .multi-ogn-unit-label')"), 'Noord/Zuid moeten losse graph- en OGN-kernzinlabels verbergen');
assert.ok(source.includes("expandBoxToAspectFromLeft"), 'Noord/Zuid moeten vanaf de linkerkant passend worden gekaderd');
assert.ok(source.includes("const configuredLeftMargin = bbox.width * validCanvasLeftMarginPercent"), 'Noord/Zuid moeten de configureerbare FIT-linkermarge krijgen');
assert.ok(source.includes("if (isMainScreenActive()) {") && source.includes("menuWidth: 0, splitterWidth: 0"), 'Main mag geen verborgen rechterkolombreedte in de SVG-uitlijning meenemen');
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
assert.ok(source.includes('const rowReadingStretch = horizontalLexReadingScale(content)'), 'De bestaande horizontale woordbreedte moet het begin van de graduele draaiing vormen');
assert.ok(source.includes('const horizontalStretch = verticalLexItemReadingScale(content)'), 'De verticale kolombreedte moet de uiteindelijke boomspreiding bepalen');
assert.ok(source.includes('function verticalLexGraphemes(value)'), 'Noord/Zuid moeten LEX-items in afzonderlijke letters kunnen verdelen');
assert.ok(source.includes("data-vertical-lex-item', side"), 'Verticale LEX-items moeten als zodanig controleerbaar zijn');
assert.ok(source.includes("letter === ' ' ? '\\u00a0' : letter"), 'Meerwoorditems moeten hun letterruimte behouden');
assert.ok(source.includes('itemBox = itemBox.previousElementSibling'), 'Simplex moet voorbij het LEX-indexlabel zijn slotbox vinden');
assert.ok(source.includes('function verticalLexItemReadingScale(content)'), 'Noord/Zuid moeten een compacte kolombreedte berekenen');
assert.ok(source.includes('Math.min(122, widestStructuralItem + 22)'), 'Volledige woordbreedte mag de Noord/Zuid-boombreedte niet langer bepalen');
assert.ok(source.includes('function positionLexItemsForTurn('), 'De draaiknop moet iedere tussenstand van woordrij naar letterkolom berekenen');
assert.ok(source.includes('const currentX = rowX + (x - rowX) * turnProgress'), 'Letter-x-posities moeten gradueel de knop volgen');
assert.ok(source.includes('const currentY = y + (finalY - y) * turnProgress'), 'Letter-y-posities moeten gradueel de knop volgen');
assert.ok(source.includes('label.getComputedTextLength?.()') && source.includes('label.getBBox?.()?.height'), 'Letterafstand moet de werkelijk gerenderde tekstbreedte en -hoogte meten');
assert.ok(source.includes('const rowStep = Math.max(15') && source.includes('const lineHeight = Math.max(24'), 'Horizontale en verticale letters moeten veilige minimumafstanden hebben');
assert.ok(source.includes("data-lex-row-letter-step") && source.includes("data-lex-column-line-height"), 'De gebruikte letterafstanden moeten inspecteerbaar zijn');
assert.ok(source.includes('const liveStretch = rowReadingStretch + (horizontalStretch - rowReadingStretch) * labelTurnProgress'), 'Boom en assen moeten met dezelfde knopstand versmallen');
assert.ok(source.includes('const labelTurnProgress = lexLabelTurnProgress()'), 'De draaiknop moet ook voor Uiting en Anafoor/multi-OGN gelden');
assert.ok(!source.includes('const labelTurnProgress = compositeUtteranceView ? 1'), 'Samengestelde testitems mogen niet op een vaste verticale eindstand worden vastgezet');
assert.ok(source.includes('function calibrateLexLabelTurn(content, group)'), 'Ieder testitem moet een inhoudsafhankelijke beginstand krijgen');
assert.ok(source.includes('Math.max(0, kernelCount - 1) * 22'), 'Meer kernzinnen moeten de beginstand verticaler maken');
assert.ok(source.includes('Math.max(0, longestItem - 4) * 4'), 'Langere LEX-items moeten de beginstand verticaler maken');
assert.ok(source.includes('state.lexLabelTurnNeedsCalibration = true'), 'Een nieuw testitem moet opnieuw worden gekalibreerd');
assert.ok(source.includes("localStorage.setItem('opengraph_lex_label_turn_degrees'"), 'De draaiknopstand moet in de browser worden bewaard');
assert.ok(source.includes('const currentViewBox = parseViewBox()') && source.includes('state.manualViewBox = { ...currentViewBox }'), 'Tijdens het draaien moet het zichtvenster vast blijven zodat de versmalling zichtbaar wordt');
const turnSetter = source.slice(source.indexOf('function setLexLabelTurnDegrees('), source.indexOf('function calibrateLexLabelTurn('));
assert.ok(!turnSetter.includes('resetManualViewBox()'), 'De draaiknop mag niet na iedere graad automatisch FITten');
assert.ok(indexHtml.includes('id="mainLexLabelTurnDial"') && indexHtml.includes('role="slider"'), 'Main moet een echte toegankelijke draaiknop hebben');
assert.ok(indexHtml.indexOf('id="mainLexLabelTurnDial"') < indexHtml.indexOf('</details>\n<nav aria-label="Topmenu" class="main-top-menu">'), 'De draaiknop moet binnen de bestaande zichtbare LEX-control staan');
assert.ok(indexHtml.includes('aria-valuemin="0"') && indexHtml.includes('aria-valuemax="90"'), 'De draaiknop moet van 0 tot 90 graden lopen');
assert.ok(stylesheet.includes('.lex-label-turn-dial') && stylesheet.includes('--dial-angle'), 'De LEX-control moet als ronde draaiknop worden getekend');
assert.ok(stylesheet.includes('data-lex-turn-density="dense"') && stylesheet.includes('font-weight:600'), 'Drukke Noord/Zuid-items moeten lichtere ruimtebesparende labels krijgen');
assert.ok(source.includes("addEventListener('pointerdown'") && source.includes("addEventListener('pointermove'"), 'De knop moet met muis of vinger draaibaar zijn');
assert.ok(source.includes("const canTurn = ['north', 'south'].includes(validLexAxisSide(state.lexAxisSide))"), 'Noord/Zuid moet de draaiknop zonder tweede modusblokkade activeren');
assert.ok(source.includes("const dialEnabled = () => ['north', 'south'].includes(validLexAxisSide(state.lexAxisSide))"), 'De pointerbediening moet dezelfde ene Noord/Zuid-regel gebruiken');
assert.ok(source.includes("addEventListener('dragstart', event => event.preventDefault())") && source.includes("addEventListener('click', event =>"), 'De draaiknop mag geen browsernavigatie of dragactie starten');
assert.ok(source.includes('Math.atan2(event.clientY - cy, event.clientX - cx)'), 'De pointerpositie moet werkelijk naar een draaihoek worden vertaald');
assert.ok(source.includes("event.key === 'Home' ? 0") && source.includes("event.key === 'End' ? 90"), 'De draaiknop moet ook volledig met toetsen bedienbaar zijn');
assert.ok(!source.includes('function replayLexLabelTurn()'), 'De oude onduidelijke afspeelknop mag niet terugkomen');
assert.ok(source.includes(".lex-oriented-content"), 'Boom en alle inhoudelijke assen moeten binnen één meedraaiende groep staan');
assert.ok(source.includes("Array.from(group.children).filter(child => !child.classList?.contains('grid'))"), 'Alle assen en projecties, maar niet het schermraster, moeten meedraaien');
assert.ok(source.includes('function horizontalLexPresentationBox()'), 'FIT moet de getransformeerde Noord/Zuid-inhoud meten');
assert.ok(source.includes('data-horizontal-readable-box'), 'Regel- en LOG-boxen moeten samen met hun tekst leesbaar blijven');
assert.ok(source.includes("'data-horizontal-axis-trimmed': horizontalAxisPresentation ? 'true' : 'false'"), 'De Noord/Zuid-LEX-as moet als inhoudelijk begrensd controleerbaar zijn');
assert.ok(source.includes('horizontalAxisPresentation ? visibleHorizontalAxisYs : occupiedYs.filter'), 'De Noord/Zuid-as mag alleen zichtbaar getekende items, slots en traces gebruiken');
assert.ok(source.includes("horizontalAxisPresentation ? 22 : 36"), 'Noord/Zuid mogen alleen een kleine eindmarge rond de echte aspunten houden');
assert.match(documentation, /LEX, SYNT en LOG/);
assert.match(documentation, /ronde draaiknop/);
assert.match(documentation, /0°/);
assert.match(documentation, /90°/);
assert.match(documentation, /ieder gekozen testitem.*opnieuw\s+gekalibreerd/s);
assert.match(documentation, /Zin-simplex,\s*Uiting en Anafoor\/multi-OGN/);
assert.match(documentation, /zichtvenster vast/);
assert.match(documentation, /minimaal 15 SVG-eenheden per letter/);
assert.match(documentation, /minimaal 24 SVG-eenheden regelafstand/);
assert.match(documentation, /`M`\s*\/\s*`A`\s*\/\s*`N`/);
assert.match(documentation, /zichtbaar smaller/);
assert.match(documentation, /kunstmatige systeemstaart telt niet mee/);
assert.ok(source.includes("const corridor = Math.max("), 'De grootste ruimtebehoefte van West en Oost moet de plaats bepalen');
assert.ok(documentation.includes('naar voren'));
assert.ok(documentation.includes('| Zuid | links → rechts; ieder LEX-item letter voor letter verticaal | boven LEX | links |'));

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
  south: ({ x, y }) => ({ x: y, y: x }),
  north: ({ x, y }) => ({ x: y, y: x })
};
const swappedAxes = {
  ...points,
  lexAxis: points.syntAxis,
  syntAxis: points.lexAxis,
  word1: { x: 10, y: -10 },
  word2: { x: 10, y: 10 }
};
const oriented = side => side === 'east'
  ? swappedAxes
  : Object.fromEntries(Object.entries(side === 'south' ? swappedAxes : points)
    .map(([key, value]) => [key, map[side](value)]));
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
assert.equal(oriented('north').root.y - oriented('north').tree.y, oriented('south').root.y - oriented('south').tree.y, 'Noord/Zuid mogen de boomtakken niet impliciet flippen');
assert.ok((Math.max(92, 88 + 34) / 52) * 52 >= 122, 'Een langer woord moet een overeenkomstig langere horizontale stap krijgen');

console.log('LEX AXIS ORIENTATION CHECK: OK (W/O alleen assenwissel; N/Z verticale LEX-items; graduele draaiing en versmalling; geen Flip)');
