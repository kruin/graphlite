from __future__ import annotations
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
VERSION = (ROOT/'VERSION.txt').read_text(encoding='utf-8').strip()
errors=[]
required=['index.html','viewer.html','viewer.js','styles.css','reset-cache.html','sw.js','structure-config.html','examples-input.html','lexicon-config.html','.nojekyll','PROJECT_STATE_CURRENT.md','LAYOUT_RULES.md','LINGUISTIC_ACTIONS.md']
for rel in required:
    if not (ROOT/rel).is_file(): errors.append(f'ontbreekt: {rel}')
checks={
'index.html':[VERSION,f'data-version="{VERSION}"',f'viewer.js?{VERSION}'],
'viewer.html':[VERSION,f'data-version="{VERSION}"',f'viewer.js?{VERSION}'],
'viewer.js':[f"const VERSION = '{VERSION}';", "{ id: 'syntax'", "{ id: 'ft'"],
'reset-cache.html':[f"const VERSION = '{VERSION}';"],
'sw.js':[f"'{VERSION}-cleanup'", f"'ogv', '{VERSION}'"],
}
for rel,needles in checks.items():
    p=ROOT/rel
    if not p.exists(): continue
    text=p.read_text(encoding='utf-8',errors='ignore')
    for needle in needles:
        if needle not in text: errors.append(f'versie/viewcontrole: {rel} mist {needle!r}')
if (ROOT/'index.html').read_bytes() != (ROOT/'viewer.html').read_bytes(): errors.append('viewer.html verschilt van index.html')
index=(ROOT/'index.html').read_text(encoding='utf-8')
js=(ROOT/'viewer.js').read_text(encoding='utf-8')
if index.find('mainViewSelect')<0: errors.append('View-menu ontbreekt')
if js.find("{ id: 'syntax'") > js.find("{ id: 'ft'"): errors.append('FT staat niet als tweede view na Syntax')
if "{ id: 'functional', label:" in js: errors.append('oude centrale view-id functional is nog actief')
if "state.centerMode === 'functional'" in js: errors.append('oude centerMode functional is nog actief')
if "central_opn === 'ft' || payload.central_opn === 'functional'" not in js: errors.append('compatibiliteitsmigratie functional naar ft ontbreekt')

# v2.0.0-rc.4: projectie- en centrale viewwissels mogen de viewport niet resetten.
required_js_fragments = [
    'function stableProjectionViewBox()',
    "['axes', 'source', 'lex', 'synt', 'log'].includes(state.projection)",
    'return stableProjectionViewBox();',
    'return expanded;',
    "return 'Groei n.v.t.';",
    "snapshot.centerMode === 'ft' || snapshot.centerMode === 'functional'"
]
for fragment in required_js_fragments:
    if fragment not in js: errors.append(f'stabiele-viewcontrole mist {fragment!r}')
stable_view_match = re.search(r'function stableProjectionViewBox\(\) \{(.*?)\n  \}', js, re.S)
if not stable_view_match:
    errors.append('stableProjectionViewBox-blok ontbreekt')
elif 'expandBoxToAspect' in stable_view_match.group(1):
    errors.append('stabiele projectie-viewBox hangt nog af van wisselende canvas-aspectratio')
if "if (next !== state.projection) resetManualViewBox();" in js:
    errors.append('projectiewissel reset nog handmatige viewport')
if "state.centerMode = (value === 'ft' || value === 'functional') ? 'ft' : 'syntax';\n      resetManualViewBox();" in js:
    errors.append('Syntax/FT-wissel reset nog handmatige viewport')


css = (ROOT/'styles.css').read_text(encoding='utf-8',errors='ignore')
for fragment in ('width: 7.4rem !important;', 'height: 2.05rem !important;', 'white-space: nowrap !important;'):
    if fragment not in css: errors.append(f'vaste Play-balkhoogte mist {fragment!r}')

for forbidden in ('LOG' + '/' + 'FT','FT' + '/' + 'LOG'):
    for p in ROOT.rglob('*'):
        if p.is_file() and p.suffix.lower() in {'.html','.js','.css','.md','.txt','.bat','.py'}:
            if forbidden in p.read_text(encoding='utf-8',errors='ignore'):
                errors.append(f'verboden gecombineerde term in {p.relative_to(ROOT)}: {forbidden}')
attr=re.compile(r'(?:href|src)=["\']([^"\'#?]+)')
for p in ROOT.rglob('*.html'):
    text=p.read_text(encoding='utf-8',errors='ignore')
    for target in attr.findall(text):
        if target.startswith(('http:','https:','mailto:','data:','javascript:','/')): continue
        resolved=(p.parent/target).resolve()
        try: resolved.relative_to(ROOT.resolve())
        except ValueError: continue
        if not resolved.exists(): errors.append(f'gebroken link: {p.relative_to(ROOT)} -> {target}')
for p in ROOT.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'ongeldige JSON {p.relative_to(ROOT)}: {e}')
if errors:
    print('RELEASE CHECK: FOUT')
    for e in errors: print('-',e)
    sys.exit(1)
print(f'RELEASE CHECK: OK ({VERSION})')
