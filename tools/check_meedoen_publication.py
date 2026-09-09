from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def read(relative: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        errors.append(f"ontbreekt: {relative}")
        return ""
    return path.read_text(encoding="utf-8")


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


index = read("index.html")
viewer = read("viewer.html")
meedoen = read("MEEDOEN.md")
episodes = read("AFLEVERINGEN_PUBLICEREN.md")
planning = read("AFLEVERINGEN_PLANNING.md")
readme = read("README.md")
leesmij = read("LEESMIJ.md")
phases = read("PUBLICATION_PHASES.md")

if index != viewer:
    errors.append("index.html en viewer.html bevatten niet dezelfde ingebouwde LEESMIJ-bron")

for source_name, source in (("index.html", index), ("viewer.html", viewer)):
    require(source, 'data-help-topic-button="contributing"', f"{source_name} Meedoen-navigatie")
    require(source, 'data-help-topic="contributing"', f"{source_name} Meedoen-item")
    require(source, "Publiceren begint in de LEESMIJ", f"{source_name} publiceren-vanuit-LEESMIJ")
    panel_match = re.search(
        r'<article class="help-topic-panel" data-help-topic="contributing">(.*?)</article>',
        source,
        flags=re.DOTALL,
    )
    if not panel_match:
        errors.append(f"{source_name} Meedoen-item is niet afgebakend")
        continue
    panel = panel_match.group(1)
    slides = re.findall(r'<figure class="readme-carousel-slide[^>]*data-readme-slide=""', panel)
    if len(slides) != 4:
        errors.append(f"{source_name} Meedoen-carrousel bevat {len(slides)} in plaats van 4 slides")
    for asset in (
        "images/readme/meedoen-bekijken.svg",
        "images/readme/meedoen-melden.svg",
        "images/readme/meedoen-testmateriaal.svg",
        "images/readme/meedoen-aflevering.svg",
    ):
        require(panel, asset, f"{source_name} Meedoen-carrousel")
        if not (ROOT / asset).is_file():
            errors.append(f"Meedoen-carrouselbeeld ontbreekt: {asset}")

for marker in (
    "## 1. Alleen bekijken en reageren",
    "## 2. De volledige viewer lokaal testen",
    "## 3. Testmateriaal voorstellen of corrigeren",
    "## 4. Code of documentatie aanpassen",
    "## 5. Een aflevering helpen maken",
    "SOURCE_BUILD.txt",
    "Automatische controles vervangen geen visueel akkoord",
):
    require(meedoen, marker, "MEEDOEN.md")

for marker in (
    "LEESMIJ-item + eigen carrousel",
    "## Afleveringssjabloon",
    "## Voorlopige reeks",
    "Concept",
    "Testklaar",
    "Goedgekeurd",
    "Gepubliceerd",
    "1080 × 1080",
    "Publiceer zinnen en testmateriaal niet als één grote batch",
    "Noem een aflevering nooit goedgekeurd op basis van alleen automatische tests",
):
    require(episodes, marker, "AFLEVERINGEN_PUBLICEREN.md")

for marker in (
    "D−7",
    "D+7",
    "## Eén bron, één verhaal",
    "volgorde van vertakking",
    "volgorde van de uiting",
    "Zwaartekracht",
    "kopieën",
    "## Aflevering 1 — OGN-kern",
    "## Aflevering 2 — Language Tree en Hond bijt man",
    "## Aflevering 3 — Volgorde van vertakking versus volgorde van de uiting",
    "## Aflevering 4 — Transformatie-kerstboom",
    "## Aflevering 5 — LEX, SYN en LOG",
    "## Aflevering 6 — Uiting, Anafoor en Flip",
    "## Aflevering 7 — Volledige app en meedoen",
    "01-every-node-owns-grid-lines.png",
):
    require(planning, marker, "AFLEVERINGEN_PLANNING.md")

for source_name, source in (("README.md", readme), ("LEESMIJ.md", leesmij)):
    require(source, "MEEDOEN.md", f"{source_name} instaplink")
    require(source, "AFLEVERINGEN_PUBLICEREN.md", f"{source_name} afleveringslink")
    require(source, "AFLEVERINGEN_PLANNING.md", f"{source_name} planningslink")

for source_name, source in (("index.html", index), ("viewer.html", viewer)):
    require(source, "AFLEVERINGEN_PLANNING.md", f"{source_name} planningslink")
    require(source, "volgorde van vertakking", f"{source_name} formele boomdiagnose")
    require(source, "volgorde van de uiting", f"{source_name} formele uitingsdiagnose")

for title in (
    "OGN-kern",
    "Hond bijt man",
    "Vertakking en uiting",
    "Transformatie-kerstboom",
    "LEX, SYN en LOG",
    "Uiting, Anafoor en Flip",
    "Volledige app",
):
    require(phases, title, "bestaande publicatiefasering")
    require(episodes, title, "afleveringsreeks")

if errors:
    print("MEEDOEN / AFLEVERINGEN CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("MEEDOEN / AFLEVERINGEN CHECK: OK (één LEESMIJ-item + carrousel per aflevering)")
