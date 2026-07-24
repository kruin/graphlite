from __future__ import annotations
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION = (ROOT / 'VERSION.txt').read_text(encoding='utf-8').strip()
errors: list[str] = []

required_files = [
    'index.html','viewer.html','viewer.js','styles.css','reset-cache.html','sw.js',
    'manifest.webmanifest','structure-config.html','examples-input.html','lexicon-config.html',
    '.nojekyll','PROJECT_STATE_CURRENT.md','LAYOUT_RULES.md','LINGUISTIC_ACTIONS.md',
    'SOV_NOTATION_OPTIONS.md','EENVOUDIGE_RELEASE_WERKWIJZE.md','publish_checked.bat',
    'check_release.bat','start-local-viewer.bat','README.md','SOURCE_CHANGES_V2.0.5.md',
    'LANGUAGE_MENU_TEST.md','EENVOUDIGE_RELEASE_WERKWIJZE_TEST.md',
    'RELEASE_MANIFEST_GIT_EXCLUSION_TEST.md','README_FIRST_VIEW_HALF_HEIGHT_TEST.md','RELEASE_MANIFEST.txt'
]
for rel in required_files:
    if not (ROOT / rel).is_file():
        errors.append(f'ontbreekt: {rel}')

index = (ROOT/'index.html').read_text(encoding='utf-8', errors='ignore')
js = (ROOT/'viewer.js').read_text(encoding='utf-8', errors='ignore')
css = (ROOT/'styles.css').read_text(encoding='utf-8', errors='ignore')

for rel in ['index.html','viewer.html','viewer.js','reset-cache.html','sw.js','manifest.webmanifest']:
    if VERSION not in (ROOT/rel).read_text(encoding='utf-8', errors='ignore'):
        errors.append(f'versie ontbreekt in {rel}')
if (ROOT/'index.html').read_bytes() != (ROOT/'viewer.html').read_bytes():
    errors.append('viewer.html verschilt van index.html')

# Main contract.
for token in [
    'id="mainSentenceMenu"','id="mainAdverbMenu"','id="mainViewMenu"',
    'id="mainInterfaceMenu"','id="sourceAxisMenu"','id="mainExtraMenu"',
    'id="mainLanguageMenu"','id="openHelpButton"','id="openConfigButton"',
    'id="growthProjectionImmediateInput"','data-source-axis="lex"',
    'data-source-axis="synt"','data-source-axis="log"'
]:
    if token not in index: errors.append(f'UI mist {token}')
if 'id="mainActionsMenu"' in index or '>Menu</summary>' in index:
    errors.append('algemene Menu-knop staat nog in Main')
if ('Kies Syntax of Functional' not in index and 'Choose Syntax or Functional' not in index) or "{ id: 'ft', label: 'Functional' }" not in js:
    errors.append('zichtbare viewnaam Functional ontbreekt')
if 'Syntax / FT' in index or '>FT<' in index:
    errors.append('oude zichtbare viewnaam FT staat nog in Main')

# Language contract.
for lang in ['English','Nederlands','Deutsch','Français','Español']:
    if lang not in index: errors.append(f'talenmenu mist {lang}')
if index.count('data-language-option=') != 15:
    errors.append('verwacht vijf talen in elk van drie talenmenu’s')
for token in [
    "const DEFAULT_LANGUAGE = 'en';",
    "{ id: 'de', label: 'Deutsch' }",
    "{ id: 'fr', label: 'Français' }",
    "{ id: 'es', label: 'Español' }",
    "localStorage.getItem('opengraph_language')",
    'The sentence examples are Dutch and illustrate Dutch sentence word order.',
    'De voorbeeldzinnen zijn Nederlands en tonen de Nederlandse woordvolgorde.',
    'Die Beispielsätze sind niederländisch',
    'Les phrases d’exemple sont néerlandaises',
    'Las frases de ejemplo están en neerlandés'
]:
    if token not in js and token not in index:
        errors.append(f'taalcontract mist {token!r}')
for menu_id in ['mainLanguageMenu','configLanguageMenu','helpLanguageMenu']:
    if f'id="{menu_id}"' not in index: errors.append(f'talenmenu ontbreekt: {menu_id}')
if 'language-option-list' not in css or 'language-sentence-note' not in css:
    errors.append('talenmenu-opmaak ontbreekt')

# README first-view contract.
for token in [
    'v2.0.6: README/LEESMIJ first view on mobile portrait',
    'grid-template-rows: minmax(0, 1fr) minmax(0, 1fr)',
    'body.viewport-mobile-portrait-test.help-screen-active .help-tree-screen',
    "if (stage) stage.scrollTop = 0;"
]:
    if token not in css and token not in js:
        errors.append(f'LEESMIJ-eerste-view mist {token!r}')
if not (ROOT/'README_FIRST_VIEW_HALF_HEIGHT_TEST.md').is_file():
    errors.append('ontbreekt: README_FIRST_VIEW_HALF_HEIGHT_TEST.md')

# Fixed two-row top menu: six choices, then language/readme/config.
top = re.search(r'<nav[^>]*class=["\'][^"\']*\bmain-top-menu\b[^"\']*["\'][^>]*>.*?</nav>', index, re.S)
if not top:
    errors.append('zichtbare topmenubalk ontbreekt')
else:
    block=top.group(0)
    if block.count('<details') != 7:
        errors.append('topmenu moet zeven details-keuzes bevatten: zes op rij 1 en taal op rij 2')
    for item in ['mainSentenceMenu','mainAdverbMenu','mainViewMenu','mainInterfaceMenu','sourceAxisMenu','mainExtraMenu','mainLanguageMenu','openHelpButton','openConfigButton']:
        if item not in block: errors.append(f'topmenu mist {item}')

# Config and JaN contract.
for token in ['id="config-overview"','id="config-basic"','id="config-jan"','id="config-tree"','id="config-lex"','id="config-projections"','id="config-examples"','id="config-advanced"','S:np-VP','S:NP-VP','S+ np-VP']:
    if token not in index: errors.append(f'Config/JaN mist {token}')
for token in ['config-item-help','config-action-help-list','config-toggle-title']:
    if token not in index and token not in css: errors.append(f'Config-toelichting mist {token}')

# Existing layout/growth safety contract.
for token in [
    "projection: 'axes'",'function activeProjectionAxisSet()','function setViewportMode(',
    'function viewportGridProfile()','function projectionStableFrameBox()',
    'function stableProjectionViewBox()','function physicalViewportMetrics()',
    'actual-compact-landscape',"window.visualViewport?.addEventListener('resize'",
    'growthProjectionImmediate: true','function projectionSourceVisible(',
    'function executedLexMovementCount('
]:
    if token not in js: errors.append(f'JS mist {token!r}')
if not re.search(r'<input[^>]*id=["\']growthProjectionImmediateInput["\'][^>]*checked|<input[^>]*checked[^>]*id=["\']growthProjectionImmediateInput["\']', index):
    errors.append('directe projectiegroei is niet standaard aangevinkt')
for token in ['stroke-width: .72 !important','stroke-width: 1.42 !important','stroke-width: .50 !important']:
    if token not in css: errors.append(f'lijnhiërarchie mist {token}')

# Simple direct release workflow.
removed_scripts=['graphlite_safe_update.bat','prepare_release_clone.bat','promote_release_clone.bat','recover_git_bundle.bat']
for rel in removed_scripts:
    if (ROOT/rel).exists(): errors.append(f'verwijderd releasescript staat nog in bron: {rel}')
bat=(ROOT/'publish_checked.bat').read_text(encoding='utf-8', errors='ignore')
for token in ['call check_release.bat','Geef commit message','git commit -m','git push -u origin','automatic_reset','reset-cache.html?ogv=%APP_VERSION%','pause >nul']:
    if token.lower() not in bat.lower(): errors.append(f'publish_checked.bat mist {token}')
if re.search(r'(?mi)^\s*git\s+pull\b', bat): errors.append('publish_checked.bat voert git pull uit')
if re.search(r'(?mi)^\s*git\s+push\b.*(?:--force|-f\b)', bat): errors.append('publish_checked.bat voert force-push uit')
workflow=(ROOT/'EENVOUDIGE_RELEASE_WERKWIJZE.md').read_text(encoding='utf-8', errors='ignore')
for token in [r'C:\git\graphlite','publish_checked.bat','start-local-viewer.bat','reset-cache.html','geen `graphlite-next`','geen `git pull`']:
    if token.lower() not in workflow.lower(): errors.append(f'eenvoudige releasewerkwijze mist {token}')

# Docs copies.
for rel in ['README.md','EENVOUDIGE_RELEASE_WERKWIJZE.md','PROJECT_STATE_CURRENT.md','HANDOVER_FOR_COLLABORATORS.md']:
    doc=ROOT/'docs'/rel
    if not doc.is_file(): errors.append(f'docskopie ontbreekt: docs/{rel}')
    elif (ROOT/rel).read_bytes()!=doc.read_bytes(): errors.append(f'docskopie wijkt af: docs/{rel}')

# Links and JSON.
attr=re.compile(r'(?:href|src)=["\']([^"\'#?]+)')
for p in ROOT.rglob('*.html'):
    for target in attr.findall(p.read_text(encoding='utf-8', errors='ignore')):
        if target.startswith(('http:','https:','mailto:','data:','javascript:','/')): continue
        resolved=(p.parent/target).resolve()
        try: resolved.relative_to(ROOT.resolve())
        except ValueError: continue
        if not resolved.exists(): errors.append(f'gebroken link {p.relative_to(ROOT)} -> {target}')
for p in ROOT.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as exc: errors.append(f'ongeldige JSON {p.relative_to(ROOT)}: {exc}')

# The checker itself must keep repository metadata outside the product manifest.
checker_source = (ROOT/'tools/check_release.py').read_text(encoding='utf-8', errors='ignore')
for token in [
    "EXCLUDED_RELEASE_DIRS = {'.git', '__pycache__'}",
    "entry.startswith('.git/')",
    "if is_release_file(path)"
]:
    if token not in checker_source:
        errors.append(f'manifest-.git-uitsluiting mist {token!r}')

# Manifest is the sorted product-source file list, including itself.
# Repository metadata and local runtime artifacts are deliberately outside the
# release manifest. This lets the same check run both in an extracted source
# folder and inside C:\\git\\graphlite without ever scanning .git.
EXCLUDED_RELEASE_DIRS = {'.git', '__pycache__'}
EXCLUDED_RELEASE_NAMES = {'.DS_Store', 'Thumbs.db'}

def is_release_file(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    if any(part in EXCLUDED_RELEASE_DIRS for part in rel.parts):
        return False
    name = path.name
    if name in EXCLUDED_RELEASE_NAMES or name.endswith(('.pyc', '.pyo')):
        return False
    if re.fullmatch(r'OpenGraph_Lite_Viewer_v.*_full_source\.zip(?:\.sha256)?', name, re.I):
        return False
    if re.fullmatch(r'(?:opengraph-)?local-config-log.*\.txt', name, re.I):
        return False
    return path.is_file()

manifest = [
    line.strip().replace('\\', '/')
    for line in (ROOT/'RELEASE_MANIFEST.txt').read_text(encoding='utf-8').splitlines()
    if line.strip()
]
if any(entry == '.git' or entry.startswith('.git/') for entry in manifest):
    errors.append('manifest mag geen .git-bestanden bevatten; herstel RELEASE_MANIFEST.txt uit de bronzip')
actual = sorted(
    str(path.relative_to(ROOT)).replace('\\', '/')
    for path in ROOT.rglob('*')
    if is_release_file(path)
)
if manifest != actual:
    missing=sorted(set(actual)-set(manifest))
    extra=sorted(set(manifest)-set(actual))
    if missing: errors.append('manifest mist: '+', '.join(missing[:8]))
    if extra: errors.append('manifest bevat niet-bestaand: '+', '.join(extra[:8]))
    if not missing and not extra: errors.append('manifest is niet alfabetisch gesorteerd')

if errors:
    print('RELEASE CHECK: FOUT')
    for error in errors: print('-',error)
    sys.exit(1)
print(f'RELEASE CHECK: OK ({VERSION})')
