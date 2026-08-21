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
    "'Plaats LOG → LEX'",
    "stage: 'combined'",
    "alleen een expliciete Wissel mag verplaatsen",
    "zowel HOND als MAN exact staan",
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
        "projectedFreeV2GapY",
        "projectedV2SlotY",
        "projectedStationarySourceY",
        "projectedLexItemY",
    )
)

placement_functions = "\n".join(
    extract_function(name)
    for name in (
        "isMainV2Rule",
        "isFiniteVerbForV2",
        "topicMovementForItem",
        "lexMovementRank",
        "movementForItem",
    )
)

node_test = f"""
const placementContract = (() => {{
  const state = {{ example: {{ lexRule: 'hoofdzininvariant' }} }};
  function activeAdverbIsFronted() {{ return false; }}
  function activeLexItems() {{ return items; }}
  function frontedPostV2Index() {{ return 0; }}

  {placement_functions}

  const items = [
    {{ id: 'hond', label: 'HOND', source: 'subject', role: 'subject' }},
    {{ id: 'bijt', label: 'BIJT', source: 'predicate', role: 'predicate' }},
    {{ id: 'man', label: 'MAN', source: 'object', role: 'object' }}
  ];
  const movements = items.map((item, index) => movementForItem(item, index, items));
  if (movements[0] !== null) {{
    throw new Error(`HOND moet op de recursief berekende bronplaats blijven, kreeg ${{movements[0]?.slot}}`);
  }}
  if (movements[1]?.slot !== 'v2') {{
    throw new Error(`alleen BIJT moet naar de vrije LEX-gridrij, kreeg ${{movements[1]?.slot || 'geen'}}`);
  }}
  if (movements[2] !== null) {{
    throw new Error(`MAN moet op de recursief berekende bronplaats blijven, kreeg ${{movements[2]?.slot}}`);
  }}
  return 'HOND vast; BIJT → V2; MAN vast';
}})();

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
function activeAdverbIsFronted() {{ return false; }}
function isMainV2Rule() {{ return true; }}
function showTopicSlot(items) {{
  return items.some((entry, index) => movementForItem(entry, index, items)?.slot === 'topic');
}}
function projectedLexRootY() {{ return 100; }}
function v2SlotY() {{ return 164; }}
function movementForItem(item) {{
  return item.source === 'predicate'
    ? {{ kind: 'v2', slot: 'v2', caption: 'Wissel V2', trace: 't[V]' }}
    : null;
}}
function lexSlotIndex() {{ return '2'; }}
function projectedTopicSlotY() {{ return 160; }}
function projectedPostV2SlotY() {{ return 200; }}

{functions}

const item = {{ id: 'bijt', label: 'BIJT', source: 'predicate', role: 'predicate' }};
const items = [item];
state.example.lexItems = items;
const sourceMap = new Map([
  ['subject', {{ px: 620, py: 320 }}],
  ['predicate', {{ px: 700, py: 680 }}],
  ['object', {{ px: 780, py: 520 }}]
]);
const y0 = 100;

const projectionY = projectionAnchorY(item, 0, y0, sourceMap, items);
if (projectionY !== 680) throw new Error(`BIJT moet horizontaal op bronhoogte 680 starten, kreeg ${{projectionY}}`);
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

const freeV2Y = projectedFreeV2GapY(sourceMap, trio);
if (freeV2Y !== 420 || projectedV2SlotY(y0, sourceMap, trio) !== 420) {{
  throw new Error(`vrije V2-rij moet exact tussen HOND 320 en MAN 520 liggen, kreeg ${{freeV2Y}}`);
}}
const horizontal = projectedLexItemY(item, 1, y0, sourceMap, trio, {{ executedMovementCount: 0 }});
const afterMove = projectedLexItemY(item, 1, y0, sourceMap, trio, {{ executedMovementCount: 1 }});
const finalY = projectedLexItemY(item, 1, y0, sourceMap, trio);
if (horizontal !== 680) throw new Error(`fase LEX moet BIJT eerst op bronhoogte 680 tonen, kreeg ${{horizontal}}`);
if (afterMove !== 420 || finalY !== 420) throw new Error(`BIJT moet in één stap naar de vrije V2-rij 420 gaan, kreeg ${{afterMove}}/${{finalY}}`);

const hond = trio[0];
const man = trio[2];
const hondProjectionY = projectionAnchorY(hond, 0, y0, sourceMap, trio);
const hondFinalY = projectedLexItemY(hond, 0, y0, sourceMap, trio);
const manProjectionY = projectionAnchorY(man, 2, y0, sourceMap, trio);
const manFinalY = projectedLexItemY(man, 2, y0, sourceMap, trio);
if (hondProjectionY !== 320 || hondFinalY !== 320) {{
  throw new Error(`HOND moet exact op bronhoogte 320 blijven, kreeg ${{hondProjectionY}}/${{hondFinalY}}`);
}}
if (manProjectionY !== 520 || manFinalY !== 520) {{
  throw new Error(`MAN moet exact op bronhoogte 520 blijven, kreeg ${{manProjectionY}}/${{manFinalY}}`);
}}
if (logicalPlacementMovementForItem(hond, 0, trio) !== null
    || logicalPlacementMovementForItem(man, 2, trio) !== null) {{
  throw new Error('LOG-reservering mag HOND en MAN geen zichtbare verplaatsingsopdracht geven');
}}

console.log(`HORIZONTALE LEX CHECK: OK (${{placementContract}}` + ')');
"""

with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as handle:
    handle.write(node_test)
    test_path = Path(handle.name)

try:
    subprocess.run(["node", str(test_path)], check=True)
finally:
    test_path.unlink(missing_ok=True)
