from __future__ import annotations
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VERSION=(ROOT/'VERSION.txt').read_text(encoding='utf-8').strip()
errors=[]
for rel in ['index.html','viewer.html','viewer.js','styles.css','reset-cache.html','sw.js','structure-config.html','examples-input.html','examples-adverbs.html','lexicon-config.html','.nojekyll','README.md','LEESMIJ.md','PROJECT_STATE_CURRENT.md','LAYOUT_RULES.md','LINGUISTIC_ACTIONS.md','SOV_NOTATION_OPTIONS.md','OPN_STORAGE_FORMAT.md','projectie-master-spec.md','SOURCE_CHANGES_V2.0.0-rc.23.md','docs/TALIGE_UITBREIDINGEN.md','docs/SOCIAL_EXPORT.md','images/readme/traditional-sentence-tree-examples.svg','images/readme/log-minor-spacing.svg','images/readme/play-log-space-lex.svg','tools/check_log_slot_distance.py','tools/check_lex_horizontal_projection.py','tools/check_projection_cleanup.py','tools/check_play_reverse.py','tools/check_desktop_max_view.py','tools/check_config_tabs_and_menus.py','tools/check_social_and_linguistic_export.py']:
    if not (ROOT/rel).is_file(): errors.append(f'ontbreekt: {rel}')
index=(ROOT/'index.html').read_text(encoding='utf-8',errors='ignore')
js=(ROOT/'viewer.js').read_text(encoding='utf-8',errors='ignore')
css=(ROOT/'styles.css').read_text(encoding='utf-8',errors='ignore')
for rel in ['index.html','viewer.html','viewer.js','reset-cache.html','sw.js']:
    if VERSION not in (ROOT/rel).read_text(encoding='utf-8',errors='ignore'): errors.append(f'versie ontbreekt in {rel}')
if (ROOT/'index.html').read_bytes()!=(ROOT/'viewer.html').read_bytes(): errors.append('viewer.html verschilt van index.html')
for f in ['id="mainSentenceMenu"','id="mainAdverbMenu"','id="mainViewMenu"','id="sourceAxisMenu"','id="mainExtraMenu"','id="mainSentenceOptions"','id="mainAdverbOptions"','id="mainViewOptions"','id="sourceAxisSummaryLabel"','data-source-axis="lex"','data-source-axis="synt"','data-source-axis="log"','data-language-toggle','id="openHelpButton"','id="openConfigButton"','Venstervulling']:
    if f not in index: errors.append(f'UI mist {f}')
if 'id="mainActionsMenu"' in index or '>Menu</summary>' in index:
    errors.append('algemene Menu-knop staat nog in Main')
if '>NL/EN</button>' not in index:
    errors.append('topmenu mist zichtbare optie NL/EN')
top_menu=re.search(r'<nav class="main-top-menu".*?</nav>',index,re.S)
if not top_menu:
    errors.append('zichtbare topmenubalk ontbreekt')
else:
    block=top_menu.group(0)
    required=['mainSentenceMenu','mainAdverbMenu','mainViewMenu','sourceAxisMenu','mainExtraMenu','data-language-toggle','openHelpButton','openConfigButton']
    for item in required:
        if item not in block: errors.append(f'topmenu mist {item}')
    if block.count('<details') != 5:
        errors.append('topmenu moet vijf directe keuze-items bevatten')
canvas=re.search(r'<section id="canvasWrap".*?</section>',index,re.S)
if canvas and ('mainSouthModeButton' in canvas.group(0) or 'language-action-box' in canvas.group(0)): errors.append('SOV staat nog in canvas')
if 'id="southBoxDraggableInput"' in index: errors.append('oude SOV-dragoptie staat nog in Config')
for f in ["projection: 'axes'","const parsed = raw ? JSON.parse(raw) : SOURCE_AXIS_IDS;","function activeProjectionAxisSet()","function applyProjectionAxes(","applyProjectionAxes(SOURCE_AXIS_IDS); resetForNewExample(); render();","function renderMainChoiceMenus()","function buildOpnDocument(","schema: 'data-metadata-paradata'","function applyOpnDocument(","lex_insertions:","applyExampleAdverbDefaults();","function buildLogicalSlotSequence(","function logicalSlotDistance(","function activeLogicalSlotSequence(","function logicalLexPlan(","function horizontalLexProjectionEnabled()","function logicalPlacementMovementForItem(","function appliedLogicalPlacementForItem(","stage: 'combined'","const topicOccupied = topicIndex >= 0","const v2Occupied = v2Index >= 0","d: `M ${startX} ${p.py} H ${endX}`","d: `M ${sourceX} ${item.sourceTopY} V ${y}`","class: 'graph-sentence-heading'","'data-north-axis-clearance': '64'","const ADVERB_FALLBACK_ROWS = [","...ADVERB_FALLBACK_ROWS.map(","if (activeLogConfig().exampleControlsLayout)","const exampleMayControlLayout = activeLogConfig().exampleControlsLayout","position_source: logicalAuthorityEnabled() ? 'LOG'","projection_origin: activeLogConfig().lexProjectionOrigin","placement_mode: activeLogConfig().lexPlacementMode","example_controls_layout: !!activeLogConfig().exampleControlsLayout","play_phases: logLexPlayPhases()","play_space_mode: activeLogConfig().playSpaceMode"]:
    if f not in js: errors.append(f'JS mist {f!r}')
for f in ['Lees mij / README','data-help-topic-button="readme"','data-help-topic="readme"','Boom, gek','images/readme/traditional-sentence-tree-examples.svg','data-readme-carousel-controls','data-readme-external-window']:
    if f not in index: errors.append(f'README-intro mist {f!r}')
if index.count('data-readme-slide') != 1:
    errors.append('README-intro moet in rc.23 exact het eerste beeld tonen')
for stale_image in ['images/readme/log-minor-spacing.svg','images/readme/play-log-space-lex.svg']:
    if stale_image in index: errors.append(f'README-intro toont te vroeg later beeld {stale_image}')
for f in ["function registerReadmeCarousel()","if (slides.length < 2)","function registerReadmeExternalWindows()","window.open(","if (open) setHelpTopic('readme')"]:
    if f not in js: errors.append(f'README-carrouselgedrag mist {f!r}')
for f in ["function logLexPlayPhases()","const logStep = phaseStep('LOG')","const spaceStep = phaseStep('SPACE')","const lexBaseStep = phaseStep('LEX')","spaceOnly: true","1/3 LOG","2/3 ruimte","3/3 horizontale LEX-projectie"]:
    if f not in js: errors.append(f'Play-fasering mist {f!r}')
if "state.projectionBlockUnlocked = maxStep > 0 && state.growthStep >= maxStep;" not in js:
    errors.append('Play-min ontgrendelt de eindlaag niet reversibel')
for f in ["{ id: 'max', label: 'MAX · groot letterbeeld / lage boom · standaard' }","{ id: 'max', label: 'MAX · volledig venster benut · standaard' }","layoutDensity: 'max'","viewFitMode: 'max'","function computeMaximumContentFitBox()","state.maximumContentFit"]:
    if f not in js: errors.append(f'desktop-MAX mist {f!r}')
for f in ['body.main-screen-active.main-window-max .workspace','font-size: .88rem !important']:
    if f not in css: errors.append(f'desktop-MAX CSS mist {f!r}')
if '.lex-space-reservation' not in css:
    errors.append('sobere LEX-ruimtestap mist CSS')
if 'vrije LEX-rij' in js:
    errors.append('oude herhaalde vrije-LEX-labels staan nog in de renderer')
for f in ["const CONFIG_TAB_DEFINITIONS = [","function setupConfigTabs()","function activateConfigTab(","dataset.configTabButton","config-max-callout"]:
    if f not in js: errors.append(f'Config-tabbladen missen {f!r}')
for f in ['body.config-screen-active .config-tab-list','body.config-screen-active .config-tab-panel.active','body.main-screen-active .top-menu-item[open]']:
    if f not in css: errors.append(f'UI-laag/tab-CSS mist {f!r}')
if 'body.help-screen-active .help-screen.help-tree-screen' not in css or 'display: grid !important' not in css:
    errors.append('directe links/rechts-README-layout ontbreekt')
for f in ['id="logInsertionIntervalSelect"','id="mobileLogInsertionIntervalSelect"']:
    if f not in index: errors.append(f'LOG-intervalbediening mist {f}')
structure=(ROOT/'structure-config.html').read_text(encoding='utf-8',errors='ignore')
for f in ['id="opengraph-log-config"','data-authority="LOG"','data-position-unit="slot"','data-lex-position-source="LOG"','data-lex-projection-origin="SOURCE-Y"','data-lex-placement-mode="horizontal-then-move"','data-example-controls-layout="false"','data-play-phases="LOG SPACE LEX"','data-play-space-mode="reserve-empty-lex-rows"','class="log-major-config"','class="log-interval-config"','class="log-class-config"','data-category="MODALITEIT" data-interval="S-O"','data-category="FREQUENTIE" data-interval="O-V"']:
    if f not in structure: errors.append(f'LOG-config mist {f}')
structure_editor=(ROOT/'structure-editor.html').read_text(encoding='utf-8',errors='ignore')
for f in ['id="logText"','const defaultLogSection','${els.log.value.trim() || defaultLogSection}']:
    if f not in structure_editor: errors.append(f'structure-editor LOG-round-trip mist {f}')
for editor_name in ['examples-editor.html','lexicon-editor.html']:
    editor=(ROOT/editor_name).read_text(encoding='utf-8',errors='ignore')
    for f in ['normalizeLexInsertions','data-log-interval=','data-log-after=','data-log-before=','aria-label="LOG-minors"']:
        if f not in editor: errors.append(f'{editor_name} LOG-minor-round-trip mist {f}')
for f in ['id="configDownloadOpnButton"','id="configFileInput"','id="mobileDownloadOpnButton"','id="mobileFileInput"']:
    if f not in index: errors.append(f'OPN-bediening mist {f}')
for f in ['id="downloadGraphSvgButton"','id="downloadGraphPngButton"','id="recordPlayWebmButton"','id="graphExportStatus"']:
    if f not in index: errors.append(f'graph/social-exportbediening mist {f}')
for f in ['function standaloneSvgText(','function inlineStandaloneSvgPresentation(','function downloadGraphSvg(','async function downloadGraphPng(','async function recordPlayWebm(','canvas.captureStream(30)',"'video/webm;codecs=vp9'"]:
    if f not in js: errors.append(f'graph/social-export mist {f!r}')
adverb_examples=(ROOT/'examples-adverbs.html').read_text(encoding='utf-8',errors='ignore')
tbody=re.search(r'<tbody>(.*?)</tbody>',adverb_examples,re.S)
if not tbody or len(re.findall(r'<tr\b',tbody.group(1))) != 25:
    errors.append('bijwoordtabel moet exact 25 voorbeelden bevatten')
for phrase in ['MISSCHIEN WEL','AF EN TOE','OP DIT MOMENT','MET VEEL AANDACHT']:
    if phrase not in js or phrase not in adverb_examples:
        errors.append(f'meerwoordige bijwoordelijke eenheid ontbreekt: {phrase}')
example_input=(ROOT/'examples-input.html').read_text(encoding='utf-8',errors='ignore')
if example_input.count('class="example-input"') != 14:
    errors.append('voorbeeldset moet exact 14 zinnen uit v2.0.10 bevatten')
for example_id in ['de-hond-heeft-de-man-misschien-wel-vaak-gebeten','omdat-de-hond-de-man-misschien-wel-vaak-gebeten-heeft']:
    match=re.search(rf'<article class="example-input" data-id="{re.escape(example_id)}".*?</article>',example_input,re.S)
    if not match:
        errors.append(f'meervoudig LEX-voorbeeld ontbreekt: {example_id}')
        continue
    block=match.group(0)
    for marker in ['data-category="MODALITEIT"','data-category="FREQUENTIE"']:
        if marker not in block: errors.append(f'{example_id} mist klassemarker {marker}')
    for stale in ['data-log-interval=','data-log-after=','data-log-before=']:
        if stale in block: errors.append(f'{example_id} bevat nog oude voorbeeldpositie {stale}')
for f in ['.main-top-menu','.top-menu-popover','.main-control-select-compat','lichte belijning; alleen named projections krijgen nadruk']:
    if f not in css: errors.append(f'CSS mist {f}')
for f in ['stroke-width: .72 !important','stroke-width: 1.42 !important','stroke-width: .50 !important']:
    if f not in css: errors.append(f'lijnhiërarchie mist {f}')
readme=(ROOT/'README.md').read_text(encoding='utf-8',errors='ignore')
leesmij=(ROOT/'LEESMIJ.md').read_text(encoding='utf-8',errors='ignore')
if 'Dutch documentation' not in readme or 'Play sequence' not in readme:
    errors.append('README.md is niet de actuele Engelse versie')
if 'Engelse documentatie' not in leesmij or 'Play-volgorde' not in leesmij:
    errors.append('LEESMIJ.md is niet de actuele Nederlandse versie')
if 'class="main-projection-field"' in index: errors.append('oude zichtbare projectieselect staat nog in Main')
if 'Standaard zijn alle assen zichtbaar.' not in index: errors.append('default alle assen niet vermeld')
for bad in ['LOG/FT','FT/LOG']:
    for p in ROOT.rglob('*'):
        if p.name == 'check_release.py':
            continue
        if p.is_file() and p.suffix.lower() in {'.html','.js','.css','.md','.txt','.py','.bat'} and bad in p.read_text(encoding='utf-8',errors='ignore'):
            errors.append(f'verboden term {bad} in {p.relative_to(ROOT)}')
attr=re.compile(r'(?:href|src)=["\']([^"\'#?]+)')
for p in ROOT.rglob('*.html'):
    for target in attr.findall(p.read_text(encoding='utf-8',errors='ignore')):
        if target.startswith(('http:','https:','mailto:','data:','javascript:','/')): continue
        r=(p.parent/target).resolve()
        try: r.relative_to(ROOT.resolve())
        except ValueError: continue
        if not r.exists(): errors.append(f'gebroken link {p.relative_to(ROOT)} -> {target}')
for p in list(ROOT.rglob('*.json')) + list(ROOT.rglob('*.opn')):
    try:
        doc=json.loads(p.read_text(encoding='utf-8'))
        if p.suffix.lower()=='.opn':
            if doc.get('document_type')!='opengraph-document': errors.append(f'ongeldig OPN-documenttype {p.relative_to(ROOT)}')
            if doc.get('metadata',{}).get('schema')!='data-metadata-paradata': errors.append(f'OPN-scheiding ontbreekt {p.relative_to(ROOT)}')
    except Exception as e: errors.append(f'ongeldige JSON/OPN {p.relative_to(ROOT)}: {e}')
if errors:
    print('RELEASE CHECK: FOUT'); [print('-',e) for e in errors]; sys.exit(1)
print(f'RELEASE CHECK: OK ({VERSION})')
