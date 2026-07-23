from __future__ import annotations
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VERSION=(ROOT/'VERSION.txt').read_text(encoding='utf-8').strip()
errors=[]
for rel in ['index.html','viewer.html','viewer.js','styles.css','reset-cache.html','sw.js','structure-config.html','examples-input.html','lexicon-config.html','.nojekyll','PROJECT_STATE_CURRENT.md','LAYOUT_RULES.md','LINGUISTIC_ACTIONS.md','SOV_NOTATION_OPTIONS.md']:
    if not (ROOT/rel).is_file(): errors.append(f'ontbreekt: {rel}')
index=(ROOT/'index.html').read_text(encoding='utf-8',errors='ignore')
js=(ROOT/'viewer.js').read_text(encoding='utf-8',errors='ignore')
css=(ROOT/'styles.css').read_text(encoding='utf-8',errors='ignore')
for rel in ['index.html','viewer.html','viewer.js','reset-cache.html','sw.js']:
    if VERSION not in (ROOT/rel).read_text(encoding='utf-8',errors='ignore'): errors.append(f'versie ontbreekt in {rel}')
if (ROOT/'index.html').read_bytes()!=(ROOT/'viewer.html').read_bytes(): errors.append('viewer.html verschilt van index.html')
for f in ['id="mainSentenceMenu"','id="mainAdverbMenu"','id="mainViewMenu"','id="mainInterfaceMenu"','id="viewportModeSelect"','id="sourceAxisMenu"','id="mainExtraMenu"','id="mainSentenceOptions"','id="mainAdverbOptions"','id="mainViewOptions"','id="sourceAxisSummaryLabel"','data-source-axis="lex"','data-source-axis="synt"','data-source-axis="log"','data-language-toggle','id="openHelpButton"','id="openConfigButton"','id="growthProjectionImmediateInput"']:
    if f not in index: errors.append(f'UI mist {f}')
if 'id="mainActionsMenu"' in index or '>Menu</summary>' in index:
    errors.append('algemene Menu-knop staat nog in Main')
if '>NL/EN</button>' not in index:
    errors.append('topmenu mist zichtbare optie NL/EN')

if '>LEESMIJ</button>' not in index:
    errors.append('Nederlandse topmenu-optie LEESMIJ ontbreekt')
if "en ? 'README' : 'LEESMIJ'" not in js:
    errors.append('taalwissel README/LEESMIJ ontbreekt')
if 'data-help-topic-button="todo"' not in index or 'data-help-topic="todo"' not in index:
    errors.append('TODO ontbreekt in ingebouwde LEESMIJ/README')

for required in ['id="config-overview"','id="config-basic"','id="config-jan"','id="config-tree"','id="config-lex"','id="config-projections"','id="config-examples"','id="config-advanced"','data-config-target="config-basic"','← Terug naar: Main']:
    if required not in index: errors.append(f'Config redesign mist {required}')
if 'JaN (Just another Notation)' not in index or 'S:np-VP' not in index or 'S:NP-VP' not in index:
    errors.append('JaN TODO/notatie ontbreekt of is onvolledig')
if '>JaN<' not in index and 'OpenGraph · JaN · Open Notation' not in index:
    errors.append('werknaam JaN ontbreekt in zichtbare UI')
readme=(ROOT/'README.md').read_text(encoding='utf-8',errors='ignore')
for todo_item in ['Niet-binaire, meertakkige bomen','S:np-VP','S+ np-VP','heeft gebeten']:
    if todo_item not in readme:
        errors.append(f'README TODO mist {todo_item}')
top_menu=re.search(r'<nav[^>]*class=["\'][^"\']*\bmain-top-menu\b[^"\']*["\'][^>]*>.*?</nav>',index,re.S)
if not top_menu:
    errors.append('zichtbare topmenubalk ontbreekt')
else:
    block=top_menu.group(0)
    required=['mainSentenceMenu','mainAdverbMenu','mainViewMenu','mainInterfaceMenu','sourceAxisMenu','mainExtraMenu','data-language-toggle','openHelpButton','openConfigButton']
    for item in required:
        if item not in block: errors.append(f'topmenu mist {item}')
    if block.count('<details') != 6:
        errors.append('topmenu moet zes directe keuze-items bevatten')
canvas=re.search(r'<section id="canvasWrap".*?</section>',index,re.S)
if canvas and ('mainSouthModeButton' in canvas.group(0) or 'language-action-box' in canvas.group(0)): errors.append('SOV staat nog in canvas')
if 'id="southBoxDraggableInput"' in index: errors.append('oude SOV-dragoptie staat nog in Config')
for f in ["projection: 'axes'","const parsed = raw ? JSON.parse(raw) : SOURCE_AXIS_IDS;","function activeProjectionAxisSet()","function applyProjectionAxes(","applyProjectionAxes(SOURCE_AXIS_IDS); resetForNewExample(); render();","function renderMainChoiceMenus()","function setViewportMode(","function viewportGridProfile()","function projectionSpacingProfile()","cellXScale: 0.70 + 0.86 * t + 0.34 * landscapeBoost","cellYScale: Math.max(0.56, 1.17 - 0.44 * t - 0.15 * landscapeBoost)","expandBoxToAspect(padded, canvasAspectRatio())","function projectionStableFrameBox()","function stableProjectionViewBox()","function physicalViewportMetrics()","actual-compact-landscape","window.visualViewport?.addEventListener('resize'","scheduleViewportRefit(420)","growthProjectionImmediate: true","function projectionSourceVisible(","function executedLexMovementCount(","growthPlan,\n        executedMovementCount: executedLexMovementCount(growthPlan)"]:
    if f not in js: errors.append(f'JS mist {f!r}')
for f in ['.main-top-menu','.top-menu-popover','.main-control-select-compat','lichte belijning; alleen named projections krijgen nadruk','viewport-mobile-natural','top-menu-interface-popover']:
    if f not in css: errors.append(f'CSS mist {f}')

if 'Math.max(2180' in js or 'Math.max(1120' in js:
    errors.append('oude overgrote projectie-fitbox staat nog in viewer.js')
for f in ['stroke-width: .72 !important','stroke-width: 1.42 !important','stroke-width: .50 !important']:
    if f not in css: errors.append(f'lijnhiërarchie mist {f}')
if 'class="main-projection-field"' in index: errors.append('oude zichtbare projectieselect staat nog in Main')

if not re.search(r'<input[^>]*id=["\']growthProjectionImmediateInput["\'][^>]*checked|<input[^>]*checked[^>]*id=["\']growthProjectionImmediateInput["\']', index):
    errors.append('directe projectiegroei is niet standaard aangevinkt')
if "return ['axes', 'source', 'lex', 'synt', 'log'].includes(projection);" not in js:
    errors.append('groei werkt niet in alle projectiestanden')
if "state.growthProjectionImmediate === false" not in js:
    errors.append('vertraagde compatibiliteitsmodus ontbreekt')
if 'Standaard zijn alle assen zichtbaar.' not in index: errors.append('default alle assen niet vermeld')

if 'Kies Syntax of Functional' not in index or "{ id: 'ft', label: 'Functional' }" not in js or "state.centerMode === 'ft' ? 'Functional' : 'Syntax'" not in js:
    errors.append('zichtbare viewnaam Functional ontbreekt')
if 'Syntax / FT' in index or '>FT<' in index:
    errors.append('oude zichtbare viewnaam FT staat nog in Main')
for required_help in ['config-item-help','config-action-help-list','config-toggle-title']:
    if required_help not in index and required_help not in css:
        errors.append(f'Config-toelichting mist {required_help}')
for bad in ['LOG/Functional','Functional/LOG']:
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
for p in ROOT.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'ongeldige JSON {p.relative_to(ROOT)}: {e}')
if errors:
    print('RELEASE CHECK: FOUT'); [print('-',e) for e in errors]; sys.exit(1)
print(f'RELEASE CHECK: OK ({VERSION})')
