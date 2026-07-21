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
for f in ['id="mainSentenceMenu"','id="mainAdverbMenu"','id="mainViewMenu"','id="sourceAxisMenu"','id="mainExtraMenu"','id="mainSentenceOptions"','id="mainAdverbOptions"','id="mainViewOptions"','id="sourceAxisSummaryLabel"','data-source-axis="lex"','data-source-axis="synt"','data-source-axis="log"','data-language-toggle','id="openHelpButton"','id="openConfigButton"']:
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
for f in ["projection: 'axes'","const parsed = raw ? JSON.parse(raw) : SOURCE_AXIS_IDS;","function activeProjectionAxisSet()","function applyProjectionAxes(","applyProjectionAxes(SOURCE_AXIS_IDS); resetForNewExample(); render();","function renderMainChoiceMenus()"]:
    if f not in js: errors.append(f'JS mist {f!r}')
for f in ['.main-top-menu','.top-menu-popover','.main-control-select-compat','lichte belijning; alleen named projections krijgen nadruk']:
    if f not in css: errors.append(f'CSS mist {f}')
for f in ['stroke-width: .72 !important','stroke-width: 1.42 !important','stroke-width: .50 !important']:
    if f not in css: errors.append(f'lijnhiërarchie mist {f}')
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
for p in ROOT.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'ongeldige JSON {p.relative_to(ROOT)}: {e}')
if errors:
    print('RELEASE CHECK: FOUT'); [print('-',e) for e in errors]; sys.exit(1)
print(f'RELEASE CHECK: OK ({VERSION})')
