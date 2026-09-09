from __future__ import annotations

import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "public-phase-1.html").read_text(encoding="utf-8")
SOURCES = (ROOT / "CARROUSEL_BRONNEN.md").read_text(encoding="utf-8")


def fail(message: str) -> None:
    raise SystemExit(f"AFLEVERINGSCARROUSEL: FOUT: {message}")


if HTML.count('data-example-slide') != 7:
    fail("aflevering 1 bevat niet precies zeven carrouselbeelden")
if HTML.count('class="source-line"') != 7:
    fail("niet ieder carrouselbeeld heeft een zichtbare bronregel")

required_markers = (
    "Wat is OGN?",
    "OGN Free Placement",
    "OGN Projection",
    "OGN Calculated Placement",
    "Geen LEX-as",
    "Dezelfde zeven stappen als in de LEESMIJ",
)
for marker in required_markers:
    if marker not in HTML:
        fail(f"HTML-markering ontbreekt: {marker}")

for forbidden in ("HOND", "BIJT", "MAN", "Mp-wh-checking", "Syntax Tree of simple sentence", "LEX · OOST"):
    if forbidden in HTML:
        fail(f"aflevering 1 loopt vooruit op latere taalinhoud: {forbidden}")

for number, name in enumerate((
    "every-node-owns-grid-lines",
    "free-places-first",
    "one-node-at-a-time",
    "node-projection-west-south-east",
    "direct-placement-greedy-grow",
    "calculated-placement-language-tree",
    "core-first-examples-follow",
), start=1):
    relative = f"publicatie-carrousel/slides/{number:02d}-{name}.png"
    if relative not in HTML or not (ROOT / relative).is_file():
        fail(f"canoniek carrouselbeeld ontbreekt: {relative}")

expected_hashes = {
    "images/sources/syntax-tree-simple-sentence-vlouie.png": "886adc6e9821e3088e6bbde11ffb041c35e7c2ef48e6cba1200edddf63f6f79a",
    "images/sources/mp-wh-checking-nlacara.svg": "a6e03981445e408ac899d58cca23ef7ed15c84671e5849790768ee0ad37b56f6",
}
for relative, expected in expected_hashes.items():
    path = ROOT / relative
    if not path.is_file():
        fail(f"bronbeeld ontbreekt: {relative}")
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if actual != expected:
        fail(f"bronbeeld is gewijzigd zonder bijgewerkte attributie: {relative}")
    if expected not in SOURCES:
        fail(f"checksum ontbreekt in bronregister: {relative}")

print("AFLEVERINGSCARROUSEL: OK (7 OGN-slides; geen voortijdige taalinhoud; zichtbare bronregel per slide)")
