from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "viewer.js").read_text(encoding="utf-8")


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
const state = {{ example: EXAMPLES[0] }};
function escapeHtml(value) {{ return String(value); }}
function activeAdverbIsFronted() {{ return false; }}
{import_function}
{movement_functions}
if (EXAMPLES.length !== 19) throw new Error(`fallback count ${{EXAMPLES.length}}`);
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
if (movementForItem(mainClause.lexItems[0], 0, mainClause.lexItems) !== null) {{
  throw new Error('gewone subject-initiële HOND krijgt ten onrechte TOPIC');
}}
if (movementForItem(mainClause.lexItems[1], 1, mainClause.lexItems)?.slot !== 'v2') {{
  throw new Error('hoofdzin verplaatst het predicaat niet naar V2');
}}
if (movementForItem(mainClause.lexItems[2], 2, mainClause.lexItems) !== null) {{
  throw new Error('MAN krijgt ten onrechte een Wissel');
}}
const topicClause = EXAMPLES.find(item => item.id === 'trui-breit-vrouw-topic');
state.example = topicClause;
if (movementForItem(topicClause.lexItems[0], 0, topicClause.lexItems)?.slot !== 'topic') {{
  throw new Error('expliciet vooropgeplaatste TRUI krijgt geen TOPIC-doel');
}}
const wanted = [
  'de-hond-heeft-de-man-misschien-wel-vaak-gebeten',
  'omdat-de-hond-de-man-misschien-wel-vaak-gebeten-heeft'
];
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
console.log('EXAMPLES ROUNDTRIP: OK (19 uitingen; 4 zinsoorten; 3 kernzinanalyses; V1/V2/TOPIC-contract; lineaire multi-inserties)');
"""

with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as handle:
    handle.write(node_test)
    test_path = Path(handle.name)
try:
    subprocess.run(["node", str(test_path)], check=True)
finally:
    test_path.unlink(missing_ok=True)
