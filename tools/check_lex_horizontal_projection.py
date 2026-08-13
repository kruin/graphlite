from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "viewer.js").read_text(encoding="utf-8")


def extract_function(name: str) -> str:
    marker = f"function {name}("
    start = SOURCE.index(marker)
    brace = SOURCE.index(") {", start) + 2
    depth = 0
    quote = None
    escaped = False
    for index in range(brace, len(SOURCE)):
        char = SOURCE[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in {"'", '"', "`"}:
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return SOURCE[start:index + 1]
    raise ValueError(f"onafgesloten functie: {name}")


required_source = [
    "d: `M ${startX} ${p.py} H ${endX}`",
    "'horizontale bronprojectie'",
    "stage: 'combined'",
    "reservation-only-no-movement",
    "alleen een expliciete Wissel mag verplaatsen",
]
for marker in required_source:
    if marker not in SOURCE:
        raise SystemExit(f"HORIZONTALE LEX CHECK: FOUT — viewer.js mist {marker!r}")
if "V ${oldY} H ${endX}" in SOURCE:
    raise SystemExit("HORIZONTALE LEX CHECK: FOUT — oude orthogonale bronlijn is nog actief")


functions = "\n".join(
    extract_function(name)
    for name in (
        "horizontalLexProjectionEnabled",
        "lexMovementRank",
        "logicalPlacementMovementForItem",
        "orderedLexMovements",
        "movementOrderIndex",
        "appliedMovementForItem",
        "appliedLogicalPlacementForItem",
        "baseLexY",
        "projectionAnchorY",
        "projectedLexItemY",
    )
)

node_test = f"""
const state = {{ example: {{ lexItems: [] }} }};
const config = {{
  authority: 'LOG',
  lexPositionSource: 'LOG',
  lexProjectionOrigin: 'SOURCE-Y',
  lexPlacementMode: 'horizontal-then-move'
}};
function activeLogConfig() {{ return config; }}
function logicalAuthorityEnabled() {{ return true; }}
function logicalLexPlan(items) {{
  return {{ byIndex: new Map(items.map((_item, index) => [index, 2])) }};
}}
function logicalLexBaseOriginY() {{ return 140; }}
function logLexSlotPixels() {{ return 64; }}
function lexSlotBaseOffset() {{ return 0; }}
function basisSourceIndex(_item, index) {{ return index; }}
function projectedCompSlotY(y0) {{ return y0; }}
function compSlotY(y0) {{ return y0; }}
function lexWordOrderY(index, y0) {{ return y0 + index * 64; }}
function movementForItem(item) {{
  return item.source === 'predicate'
    ? {{ kind: 'v2', slot: 'v2', caption: 'Wissel V2', trace: 't[V]' }}
    : null;
}}
function lexSlotIndex() {{ return '2'; }}
function projectedTopicSlotY() {{ return 160; }}
function projectedV2SlotY() {{ return 180; }}
function projectedPostV2SlotY() {{ return 200; }}

{functions}

const item = {{ id: 'bijt', label: 'BIJT', source: 'predicate', role: 'predicate' }};
const items = [item];
state.example.lexItems = items;
const sourceMap = new Map([
  ['subject', {{ px: 620, py: 320 }}],
  ['predicate', {{ px: 700, py: 420 }}],
  ['object', {{ px: 780, py: 520 }}]
]);
const y0 = 100;

const projectionY = projectionAnchorY(item, 0, y0, sourceMap, items);
if (projectionY !== 420) throw new Error(`BIJT moet horizontaal op bronhoogte 420 starten, kreeg ${{projectionY}}`);
const logicalY = baseLexY(item, 0, y0, sourceMap, items);
if (logicalY !== 268) throw new Error(`LOG-doelrij moet 268 zijn, kreeg ${{logicalY}}`);

const moves = orderedLexMovements(items);
if (moves.length !== 1 || moves[0].stage !== 'combined') {{
  throw new Error(`verkeerde verplaatsingsvolgorde: ${{moves.map(move => move.stage).join('|')}}`);
}}
const trio = [
  {{ id: 'hond', label: 'HOND', source: 'subject', role: 'subject' }},
  item,
  {{ id: 'man', label: 'MAN', source: 'object', role: 'object' }}
];
const trioMoves = orderedLexMovements(trio);
if (trioMoves.length !== 1 || trioMoves[0].item !== item || trioMoves[0].stage !== 'combined') {{
  throw new Error(`HOND BIJT MAN mag alleen BIJT verplaatsen, kreeg ${{trioMoves.map(move => move.item.label).join('|')}}`);
}}

const horizontal = projectedLexItemY(item, 0, y0, sourceMap, items, {{ executedMovementCount: 0 }});
const afterMove = projectedLexItemY(item, 0, y0, sourceMap, items, {{ executedMovementCount: 1 }});
const finalY = projectedLexItemY(item, 0, y0, sourceMap, items);
if (horizontal !== 420) throw new Error(`fase LEX moet BIJT laag op 420 tonen, kreeg ${{horizontal}}`);
if (afterMove !== 180 || finalY !== 180) throw new Error(`BIJT moet in één stap rechtstreeks naar V2 180 gaan, kreeg ${{afterMove}}/${{finalY}}`);

const man = trio[2];
const manProjectionY = projectionAnchorY(man, 2, y0, sourceMap, trio);
const manReservedY = baseLexY(man, 2, y0, sourceMap, trio);
const manFinalY = projectedLexItemY(man, 2, y0, sourceMap, trio);
if (manProjectionY !== 520 || manFinalY !== 520) {{
  throw new Error(`MAN moet exact op bronhoogte 520 blijven, kreeg ${{manProjectionY}}/${{manFinalY}}`);
}}
if (manReservedY === manFinalY) {{
  throw new Error('testopzet moet bewijzen dat LOG-reservering en zichtbare MAN-hoogte afzonderlijk zijn');
}}
if (logicalPlacementMovementForItem(man, 2, trio) !== null) {{
  throw new Error('LOG-reservering mag voor MAN geen zichtbare verplaatsingsopdracht opleveren');
}}

console.log('HORIZONTALE LEX CHECK: OK (BIJT 420 → V2 180; MAN blijft bronhoogte 520; reservering verplaatst niets)');
"""

with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as handle:
    handle.write(node_test)
    test_path = Path(handle.name)

try:
    subprocess.run(["node", str(test_path)], check=True)
finally:
    test_path.unlink(missing_ok=True)
