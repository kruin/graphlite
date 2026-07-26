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

node_test = f"""
const EXAMPLES = {examples_array};
function escapeHtml(value) {{ return String(value); }}
{import_function}
if (EXAMPLES.length !== 14) throw new Error(`fallback count ${{EXAMPLES.length}}`);
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
console.log('EXAMPLES ROUNDTRIP: OK (14 voorbeelden; zinsgebonden lineaire multi-inserties)');
"""

with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as handle:
    handle.write(node_test)
    test_path = Path(handle.name)
try:
    subprocess.run(["node", str(test_path)], check=True)
finally:
    test_path.unlink(missing_ok=True)
