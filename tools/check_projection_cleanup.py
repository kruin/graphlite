from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")

errors: list[str] = []

fallback = re.search(
    r"const ADVERB_FALLBACK_ROWS = \[(.*?)\n  \];",
    JS,
    re.S,
)
fallback_count = len(re.findall(r"^\s+\['adv-", fallback.group(1), re.M)) if fallback else 0
if fallback_count != 25:
    errors.append(f"ingebouwde bijwoordlijst moet exact 25 voorbeelden bevatten: {fallback_count}")
if "...ADVERB_FALLBACK_ROWS.map(" not in JS:
    errors.append("bijwoordfallback wordt niet direct in ADVERB_OPTIONS geladen")

required_js = [
    "stage: 'combined'",
    "Language-Tree-regel mag een bronwoord werkelijk verplaatsen",
    "reservation-only-no-movement",
    "const topicOccupied = topicIndex >= 0",
    "const v2Occupied = v2Index >= 0",
    "class: 'lex-wissel-movement'",
    "class: 'graph-sentence-heading'",
    "'data-north-axis-clearance': '64'",
    "d: `M ${sourceX} ${item.sourceTopY} V ${y}`",
    "const LEX_RENDER_RIGHT_REACH = 180",
    "const LEX_TREE_CLEARANCE = 6",
    "function activeLexRenderRightReach()",
    "function measureSubtreeBoxes(layout, origin)",
    "function stableEastProjectionAxisX(origin)",
    "function westLexAxisX(layoutOrBox, origin)",
    "return treeBoxLeft - activeLexRenderRightReach() - LEX_TREE_CLEARANCE",
    "'data-render-right-reach': activeLexRenderRightReach()",
]
for marker in required_js:
    if marker not in JS:
        errors.append(f"viewer.js mist {marker!r}")

if "V ${y - 12} H ${cx}" in JS:
    errors.append("oude geknikte LOG-projectie is nog aanwezig")
if "Math.max(120, leftTreePx - 168)" in JS:
    errors.append("oude LEX-klem kan de S/CLAUSE-vrijstrook nog overschrijven")
if "querySelectorAll('[data-readme-slide]')" not in JS:
    errors.append("generieke README-slideafhandeling ontbreekt")
if INDEX.count("data-readme-slide") != 4:
    errors.append("de README-intro moet twee probleembomen en twee oplossingsbomen bevatten")

required_css = [
    ".lex-trace-tick",
    ".lex-wissel-step-label",
    ".graph-sentence-box",
    ".graph-sentence-text",
]
for marker in required_css:
    if marker not in CSS:
        errors.append(f"styles.css mist {marker!r}")
if ".lex-trace-slot" in CSS or "class: 'lex-trace-slot'" in JS:
    errors.append("grote oude LEX-tracevakken zijn nog aanwezig")

if errors:
    print("PROJECTIE-OPRUIMCHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print(
    "PROJECTIE-OPRUIMCHECK: OK "
    f"({fallback_count + 1} bijwoordkeuzes; 4 introbeelden; directe LOG; "
    "gecombineerde LEX met recursieve boxmeting en 6 SVG-eenheden basisvrijstrook)"
)
