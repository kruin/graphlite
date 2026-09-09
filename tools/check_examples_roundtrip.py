from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "viewer.js").read_text(encoding="utf-8")
EXAMPLES_HTML = (ROOT / "examples-input.html").read_text(encoding="utf-8")
LEXICON_HTML = (ROOT / "lexicon-config.html").read_text(encoding="utf-8")

for marker in (
    "function activeFunctionalRoleProfile()",
    "function functionalRoleDisplayLabel(role)",
    "functionalRoleDisplayLabel(profile.subject)",
    "functionalRoleDisplayLabel(profile.object)",
    "return stringRulesForSpec(functionalSpec(), 'functional')",
):
    if marker not in SOURCE:
        raise SystemExit(f"dynamische functionele CLAUSE ontbreekt: {marker}")
for marker in (
    'data-id="muziek-ontroert-anna"',
    'data-thematic-role="stimulus"',
    'data-thematic-role="experiencer"',
):
    if marker not in EXAMPLES_HTML:
        raise SystemExit(f"functionele HTML-input ontbreekt: {marker}")
for marker in ('data-id="muziek"', 'data-id="ontroert"', 'experiencer'):
    if marker not in LEXICON_HTML:
        raise SystemExit(f"functioneel lexiconitem ontbreekt: {marker}")


def extract_balanced(start: int, opening: str, closing: str) -> str:
    if SOURCE[start] != opening:
        raise ValueError(f"verwacht {opening!r} op positie {start}")
    depth = 0
    quote = None
    escaped = False
    for index in range(start, len(SOURCE)):
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
        elif char == opening:
            depth += 1
        elif char == closing:
            depth -= 1
            if depth == 0:
                return SOURCE[start:index + 1]
    raise ValueError(f"onafgesloten {opening}{closing}-blok")


def extract_function(name: str) -> str:
    marker = f"function {name}("
    start = SOURCE.index(marker)
    brace = SOURCE.index("{", start)
    body = extract_balanced(brace, "{", "}")
    return SOURCE[start:brace] + body


array_start = SOURCE.index("let EXAMPLES = ") + len("let EXAMPLES = ")
examples_array = extract_balanced(array_start, "[", "]")
import_function = extract_function("importedExampleFromData")
movement_functions = "\n".join(
    extract_function(name)
    for name in (
        "isMainV2Rule",
        "isQuestionV1Rule",
        "isFiniteVerbForV2",
        "topicMovementForItem",
        "movementForItem",
    )
)

node_test = f"""
const EXAMPLES = {examples_array};
const TENSE_IDS = new Set(['ott', 'ovt', 'vtt', 'vvt']);
const state = {{ example: EXAMPLES[0] }};
function escapeHtml(value) {{ return String(value); }}
function activeAdverbIsFronted() {{ return false; }}
{import_function}
{movement_functions}
if (EXAMPLES.length !== 12) throw new Error(`fallback count ${{EXAMPLES.length}}`);
for (const id of ['jan-wast-zichzelf', 'jan-slaat-jek-omdat-die-hem-beet', 'ken-uzelf']) {{
  const utterance = EXAMPLES.find(item => item.id === id);
  if (!utterance || utterance.utteranceKernels?.length !== 2) {{
    throw new Error(`uitingfallback ontbreekt: ${{id}}`);
  }}
}}
const question = EXAMPLES.find(item => item.id === 'bijt-hond-man-vraag');
if (!question || question.sentenceType !== 'polar-question' || question.lexRule !== 'vraagzin-v1') {{
  throw new Error('actieve ja/nee-vraagzin ontbreekt');
}}
const datClause = EXAMPLES.find(item => item.id === 'dat-hond-man-bijt');
if (!datClause || datClause.sentenceType !== 'subordinate-dat' || datClause.lexItems[0]?.slot !== 'comp') {{
  throw new Error('actieve dat-zin met Comp ontbreekt');
}}
state.example = question;
if (movementForItem(question.lexItems[0], 0, question.lexItems)?.slot !== 'v1') {{
  throw new Error('vraagzin verplaatst het predicaat niet naar V1');
}}
if (movementForItem(question.lexItems[1], 1, question.lexItems) !== null) {{
  throw new Error('vraagzin verplaatst het subject ten onrechte');
}}
state.example = datClause;
if (datClause.lexItems.some((item, index) => movementForItem(item, index, datClause.lexItems))) {{
  throw new Error('dat-zin voert ten onrechte een Wissel uit');
}}
const mainClause = EXAMPLES.find(item => item.id === 'hond-bijt-man');
state.example = mainClause;
const mainSubjectMove = movementForItem(mainClause.lexItems[0], 0, mainClause.lexItems);
if (mainSubjectMove !== null) {{
  throw new Error('gewone subject-initiële HOND krijgt ten onrechte een Wissel');
}}
if (movementForItem(mainClause.lexItems[1], 1, mainClause.lexItems)?.slot !== 'v2') {{
  throw new Error('hoofdzin verplaatst het predicaat niet naar V2');
}}
if (movementForItem(mainClause.lexItems[2], 2, mainClause.lexItems) !== null) {{
  throw new Error('MAN krijgt ten onrechte een Wissel');
}}
const psychClause = EXAMPLES.find(item => item.id === 'muziek-ontroert-anna');
if (!psychClause || psychClause.sentence !== 'DE MUZIEK ONTROERT ANNA') {{
  throw new Error('functionele Stimulus/Experiencer-test ontbreekt');
}}
if (psychClause.lexItems.map(item => item.source).join(',') !== 'subject,predicate,object') {{
  throw new Error('syntax/LEX-bronnen van psychologisch predicaat zijn gewijzigd');
}}
if (psychClause.lexItems[0]?.thematicRole !== 'stimulus' || psychClause.lexItems[2]?.thematicRole !== 'experiencer') {{
  throw new Error('Stimulus/Experiencer-rollen ontbreken');
}}
state.example = psychClause;
if (movementForItem(psychClause.lexItems[1], 1, psychClause.lexItems)?.slot !== 'v2') {{
  throw new Error('ONTROERT wordt niet volgens dezelfde hoofdzin-V2-regel gerealiseerd');
}}
if (EXAMPLES.some(item => item.id === 'trui-breit-vrouw-topic')) {{
  throw new Error('verwarrende zichtbare testcase TRUI BREIT VROUW is niet verwijderd');
}}
const wanted = ['de-hond-bijt-de-man-misschien-wel-vaak'];
for (const id of wanted) {{
  const example = EXAMPLES.find(item => item.id === id);
  if (!example) throw new Error(`ontbreekt: ${{id}}`);
  if (!Array.isArray(example.lexInsertions) || example.lexInsertions.length !== 2) {{
    throw new Error(`verkeerd aantal inserties: ${{id}}`);
  }}
  const stored = {{
    id: example.id,
    title: example.title,
    phase: example.phase,
    sentence: example.sentence,
    sentence_html: example.sentenceHtml,
    subject_default: example.subjectDefault,
    object_default: example.objectDefault,
    predicate: example.predicate,
    sentence_type: example.sentenceType,
    lex_rule: example.lexRule,
    lex_insertions: JSON.parse(JSON.stringify(example.lexInsertions)),
    lex_items: JSON.parse(JSON.stringify(example.lexItems))
  }};
  const restored = importedExampleFromData(stored);
  if (!restored || restored.id !== id || restored.lexInsertions.length !== 2) {{
    throw new Error(`round-trip mislukt: ${{id}}`);
  }}
  const words = restored.lexInsertions.map(item => item.text).join('|');
  if (words !== 'MISSCHIEN WEL|VAAK') throw new Error(`verkeerde inserties: ${{id}}`);
  const categories = restored.lexInsertions.map(item => item.category).join('|');
  if (categories !== 'MODALITEIT|FREQUENTIE') throw new Error(`verkeerde klassen: ${{id}}`);
  if (restored.lexInsertions.some(item => item.logInterval || item.logAfter || item.logBefore)) {{
    throw new Error(`oude voorbeeldpositie bestuurt LOG nog: ${{id}}`);
  }}
}}
const falling = EXAMPLES.find(item => item.id === 'hond-valt');
if (!falling || falling.tenseFamily !== 'vallen' || falling.lexItems.some(item => item.source === 'object')) {{
  throw new Error('minimale ZIJN-perfectumfamilie ontbreekt');
}}
for (const id of ['hond-beet-man', 'hond-heeft-man-gebeten', 'omdat-de-hond-de-man-heeft-gebeten']) {{
  if (EXAMPLES.some(item => item.id === id)) throw new Error(`los tijdsdubbel staat nog in fallback: ${{id}}`);
}}
console.log('EXAMPLES ROUNDTRIP: OK (12 minimale fallbackitems; tijdsfamilies; ZIJN-perfectum; Stimulus/Experiencer-CLAUSE; 4 zinsoorten; lineaire multi-inserties)');
"""

with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as handle:
    handle.write(node_test)
    test_path = Path(handle.name)
try:
    subprocess.run(["node", str(test_path)], check=True)
finally:
    test_path.unlink(missing_ok=True)
