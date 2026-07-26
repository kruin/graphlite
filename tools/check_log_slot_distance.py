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


functions = "\n".join(
    extract_function(name)
    for name in (
        "normalizeInsertionOrigin",
        "resolveLogicalInsertionBoundary",
        "buildLogicalSlotSequence",
        "logicalSlotDistance",
        "normalizedAdverbCategory",
        "inferredLogIntervalId",
        "activeLogicalInsertionSpecs",
        "logicalRoleForLexItem",
        "logicalLexPlan",
    )
)

node_test = f"""
{functions}

let configuredInterval = 'auto';
let testSpecs = [];
let activeSequence = [];
let testConfig = {{
  exampleControlsLayout: false,
  minorWidth: 1,
  intervals: [
    {{ id: 'S-O', after: 'S', before: 'O' }},
    {{ id: 'O-V', after: 'O', before: 'V' }}
  ],
  classIntervals: {{
    DEFAULT: 'S-O',
    MODALITEIT: 'S-O',
    FREQUENTIE: 'O-V'
  }}
}};
function validLogInsertionInterval() {{ return configuredInterval; }}
function activeLogConfig() {{ return testConfig; }}
function activeAdverbData() {{ return null; }}
function insertionAxisEnabled(axis) {{ return axis === 'log'; }}
function activeLexInsertionSpecs() {{ return testSpecs; }}
function activeLogicalSlotSequence() {{ return activeSequence; }}
function activeLexPlacementSequence() {{ return activeSequence; }}
function insertionContentForSpec(spec) {{
  return {{ text: spec.text || spec.id || 'ADV', label: spec.text || spec.id || 'ADV' }};
}}

const majors = ['S', 'O', 'V'];
const intervals = [
  {{ id: 'S-O', after: 'S', before: 'O' }},
  {{ id: 'O-V', after: 'O', before: 'V' }}
];

const base = buildLogicalSlotSequence(majors, [], intervals);
if (logicalSlotDistance(base, 'S', 'O') !== 1) throw new Error('basisafstand S-O moet 1 zijn');

const one = buildLogicalSlotSequence(majors, [
  {{ id: 'm1', short: 'm1', logInterval: 'S-O', width: 1, order: 1 }}
], intervals);
if (one.map(item => item.short).join('-') !== 'S-m1-O-V') throw new Error('één minor staat niet tussen S en O');
if (logicalSlotDistance(one, 'S', 'O') !== 2) throw new Error('één minor moet S-O vergroten van 1 naar 2');

const two = buildLogicalSlotSequence(majors, [
  {{ id: 'm1', short: 'm1', logInterval: 'S-O', width: 1, order: 1 }},
  {{ id: 'm2', short: 'm2', logInterval: 'S-O', width: 1, order: 2 }}
], intervals);
if (two.map(item => item.short).join('-') !== 'S-m1-m2-O-V') throw new Error('minorvolgorde is niet stabiel');
if (logicalSlotDistance(two, 'S', 'O') !== 3) throw new Error('twee minors moeten S-O vergroten van 1 naar 3');

const ov = buildLogicalSlotSequence(majors, [
  {{ id: 'm1', short: 'm1', logInterval: 'O-V', width: 1, order: 1 }}
], intervals);
if (logicalSlotDistance(ov, 'O', 'V') !== 2) throw new Error('O-V-minor moet O-V vergroten van 1 naar 2');
if (logicalSlotDistance(ov, 'S', 'O') !== 1) throw new Error('O-V-minor mag S-O niet vergroten');

testSpecs = [
  {{
    id: 'misschien-wel',
    text: 'MISSCHIEN WEL',
    category: 'MODALITEIT',
    linear: 'post-object-pre-vcluster',
    logInterval: 'O-V',
    logAfter: 'O',
    logBefore: 'V',
    order: 1
  }},
  {{
    id: 'vaak',
    text: 'VAAK',
    category: 'FREQUENTIE',
    linear: 'post-object-pre-vcluster',
    logInterval: 'O-V',
    logAfter: 'O',
    logBefore: 'V',
    order: 2
  }}
];
const explicitDrivenSpecs = activeLogicalInsertionSpecs();
if (explicitDrivenSpecs.map(item => item.logInterval).join('|') !== 'O-V|O-V') {{
  throw new Error('expliciete zinsplaats moet in auto-modus voorrang hebben op brede klasse-defaults');
}}
if (explicitDrivenSpecs.some(item => item.intervalDef)) {{
  throw new Error('exampleControlsLayout=false mag geen eigen intervalgrenzen afdwingen');
}}
const explicitDriven = buildLogicalSlotSequence(majors, explicitDrivenSpecs, intervals);
if (explicitDriven.map(item => item.short).join('-') !== 'S-O-m1-m2-V') {{
  throw new Error('expliciete post-object-volgorde moet S-O-m1-m2-V zijn');
}}
activeSequence = explicitDriven;
const lexItems = [
  {{ label: 'DE HOND', source: 'subject', role: 'subject' }},
  {{ label: 'DE MAN', source: 'object', role: 'object' }},
  {{ label: 'GEBETEN', source: 'vdw', role: 'participle' }},
  {{ label: 'HEEFT', source: 'pv', role: 'aux' }}
];
const lexPlan = logicalLexPlan(lexItems, majors);
if (lexItems.map((_item, index) => lexPlan.byIndex.get(index)).join('|') !== '0|1|4|5') {{
  throw new Error('LEX-majorrijen moeten met post-object-minors 0|1|4|5 zijn');
}}
if (lexPlan.minorRows.map(item => `${{item.word}}@${{item.row}}`).join('|') !== 'MISSCHIEN WEL@2|VAAK@3') {{
  throw new Error('LEX-minorrijen moeten MISSCHIEN WEL@2 en VAAK@3 zijn');
}}

testConfig.exampleControlsLayout = true;
const exampleDrivenSpecs = activeLogicalInsertionSpecs();
if (exampleDrivenSpecs.map(item => item.logInterval).join('|') !== 'O-V|O-V') {{
  throw new Error('voorbeeldhints moeten alleen bij exampleControlsLayout=true actief zijn');
}}
if (exampleDrivenSpecs.some(item => !item.intervalDef)) {{
  throw new Error('actieve voorbeeldgrenzen ontbreken');
}}

configuredInterval = 'S-O';
const manualSpecs = activeLogicalInsertionSpecs();
if (manualSpecs.map(item => item.logInterval).join('|') !== 'S-O|S-O') {{
  throw new Error('expliciete Config-keuze moet voorrang hebben');
}}
if (manualSpecs.some(item => item.intervalDef)) {{
  throw new Error('voorbeeldgrenzen mogen een expliciete Config-keuze niet terugdraaien');
}}

console.log('LOG SLOT DISTANCE: OK (afstand, expliciete zinsplaats, klassefallback en overrides)');
"""

with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as handle:
    handle.write(node_test)
    test_path = Path(handle.name)

try:
    subprocess.run(["node", str(test_path)], check=True)
finally:
    test_path.unlink(missing_ok=True)
