from __future__ import annotations

import hashlib
import json
import re
import struct
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "publicatie-carrousel" / "index.html"
SLIDES = ROOT / "publicatie-carrousel" / "slides"
MANIFEST = ROOT / "publicatie-carrousel" / "derived-manifest.json"
README = ROOT / "PUBLICATIE_README.md"
EXPORT = ROOT / "tools" / "export_publication_carousel.js"
GREEDY_ENGINE = ROOT / "greedy-grow-engine.js"
VERSION = ROOT / "VERSION.txt"
EXPECTED_SIZE = (1080, 1080)
EXPECTED_NAMES = [
    "01-every-node-owns-grid-lines.png",
    "02-free-places-first.png",
    "03-one-node-at-a-time.png",
    "04-node-projection-west-south-east.png",
    "05-direct-placement-greedy-grow.png",
    "06-calculated-placement-language-tree.png",
    "07-core-first-examples-follow.png",
]


errors: list[str] = []


def read(path: Path) -> str:
    if not path.is_file():
        errors.append(f"ontbreekt: {path.relative_to(ROOT)}")
        return ""
    return path.read_text(encoding="utf-8", errors="strict")


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    try:
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
    except OSError as exc:
        errors.append(f"kan hash niet lezen: {path.relative_to(ROOT)} ({exc})")
        return ""
    return digest.hexdigest()


def png_size(path: Path) -> tuple[int, int] | None:
    try:
        with path.open("rb") as handle:
            header = handle.read(24)
    except OSError as exc:
        errors.append(f"kan PNG niet lezen: {path.relative_to(ROOT)} ({exc})")
        return None
    if len(header) != 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
        errors.append(f"ongeldige PNG-signatuur: {path.relative_to(ROOT)}")
        return None
    if header[12:16] != b"IHDR":
        errors.append(f"PNG mist IHDR als eerste chunk: {path.relative_to(ROOT)}")
        return None
    return struct.unpack(">II", header[16:24])


source = read(SOURCE)
readme = read(README)
export = read(EXPORT)
greedy_engine = read(GREEDY_ENGINE)
version = read(VERSION).strip()
manifest_source = read(MANIFEST)
visible_source = re.sub(r"<style\b.*?</style>|<script\b.*?</script>", "", source, flags=re.I | re.S)

manifest: dict[str, object] = {}
if manifest_source:
    try:
        parsed_manifest = json.loads(manifest_source)
    except json.JSONDecodeError as exc:
        errors.append(f"ongeldig afleidingsmanifest: {exc}")
    else:
        if isinstance(parsed_manifest, dict):
            manifest = parsed_manifest
        else:
            errors.append("afleidingsmanifest moet een JSON-object zijn")

if manifest:
    if manifest.get("schema") != "opengraph-publication-carousel-derived-v1":
        errors.append("afleidingsmanifest heeft een onbekend schema")
    if manifest.get("app_version") != version:
        errors.append("afleidingsmanifest hoort niet bij de actuele VERSION.txt")
    if manifest.get("generated_by") != "tools/export_publication_carousel.js":
        errors.append("afleidingsmanifest noemt niet de vaste carousel-exporter")

    expected_inputs = [
        "publicatie-carrousel/index.html",
        "greedy-grow-engine.js",
        "VERSION.txt",
        "tools/export_publication_carousel.js",
    ]
    raw_inputs = manifest.get("inputs")
    inputs = raw_inputs if isinstance(raw_inputs, list) else []
    input_paths = [entry.get("path") for entry in inputs if isinstance(entry, dict)]
    if input_paths != expected_inputs:
        errors.append(
            f"afleidingsmanifest heeft verkeerde bronvolgorde: {input_paths!r}"
        )
    else:
        for entry, relative in zip(inputs, expected_inputs, strict=True):
            assert isinstance(entry, dict)
            current_hash = sha256(ROOT / relative)
            if entry.get("sha256") != current_hash:
                errors.append(
                    f"carrouselbron gewijzigd zonder volledige herexport: {relative}"
                )

    expected_outputs = [f"publicatie-carrousel/slides/{name}" for name in EXPECTED_NAMES]
    raw_outputs = manifest.get("outputs")
    outputs = raw_outputs if isinstance(raw_outputs, list) else []
    output_paths = [entry.get("path") for entry in outputs if isinstance(entry, dict)]
    if output_paths != expected_outputs:
        errors.append(
            f"afleidingsmanifest heeft verkeerde uitvoervolgorde: {output_paths!r}"
        )
    else:
        for entry, relative in zip(outputs, expected_outputs, strict=True):
            assert isinstance(entry, dict)
            if (entry.get("width"), entry.get("height")) != EXPECTED_SIZE:
                errors.append(f"afleidingsmanifest heeft verkeerde afmetingen voor {relative}")
            current_hash = sha256(ROOT / relative)
            if entry.get("sha256") != current_hash:
                errors.append(
                    f"afgeleide PNG is handmatig gewijzigd of verouderd: {relative}"
                )

actual_names = sorted(path.name for path in SLIDES.glob("*.png")) if SLIDES.is_dir() else []
if actual_names != EXPECTED_NAMES:
    errors.append(
        "slideset wijkt af; verwacht "
        f"{EXPECTED_NAMES!r}, gevonden {actual_names!r}"
    )

for index, name in enumerate(EXPECTED_NAMES, start=1):
    path = SLIDES / name
    if not path.is_file():
        errors.append(f"ontbreekt: {path.relative_to(ROOT)}")
        continue
    size = png_size(path)
    if size != EXPECTED_SIZE:
        errors.append(
            f"{path.relative_to(ROOT)} moet 1080 × 1080 zijn, gevonden {size}"
        )
    if path.stat().st_size < 25_000:
        errors.append(f"verdacht kleine slide: {path.relative_to(ROOT)}")
    require(readme, f"publicatie-carrousel/slides/{name}", f"uploadvolgorde slide {index}")
    require(export, f"'{name}'", f"exportnaam slide {index}")

slide_numbers = re.findall(r'<section class="slide(?: [^"]*)?" data-slide="([1-7])"', source)
if slide_numbers != [str(number) for number in range(1, 8)]:
    errors.append(f"HTML-slidevolgorde moet 1..7 zijn, gevonden {slide_numbers!r}")

carousel_node_sets = re.findall(
    r'(<g\b[^>]*data-ogn-node-set="([^"]+)"[^>]*>.*?</g>)',
    source,
    flags=re.S,
)
expected_carousel_node_sets = {
    "carousel-slide-2",
    "carousel-slide-4",
    "carousel-slide-6-language-tree",
}
found_carousel_node_sets = {set_id for _group, set_id in carousel_node_sets}
if found_carousel_node_sets != expected_carousel_node_sets:
    errors.append(
        "controleerbare carrousel-knoopsets wijken af; verwacht "
        f"{sorted(expected_carousel_node_sets)!r}, gevonden {sorted(found_carousel_node_sets)!r}"
    )
for group, set_id in carousel_node_sets:
    positions = [
        (int(x), int(y))
        for x, y in re.findall(r'<circle\b[^>]*cx="(\d+)"[^>]*cy="(\d+)"', group)
    ]
    if not positions:
        errors.append(f"{set_id} bevat geen controleerbare knoopposities")
        continue
    if len({x for x, _y in positions}) != len(positions):
        errors.append(f"{set_id} bevat verticaal gridlijnhergebruik")
    if len({y for _x, y in positions}) != len(positions):
        errors.append(f"{set_id} bevat horizontaal gridlijnhergebruik")

for marker, label in [
    ("Every node owns its grid lines.", "kernstelling"),
    ("One horizontal grid line and one vertical grid line belong to the node.", "gridlijnbezit"),
    ("No other node may use either line.", "geen gedeelde knooplijnen"),
    ("A ≠ B → no grid-line reuse", "leesbare A-ongelijk-B-invariant"),
    ("A position is free when both grid lines are free.", "vrije gridpositie"),
    ("Writing a node occupies one horizontal line and one vertical line.", "bezetting door knoop"),
    ("After writing a node, both of its grid lines are occupied.", "bijgewerkte lijnbezetting"),
    ("Three nodes occupy different interior rows and columns; the bottom row is empty", "gridvoorbeeld met lege onderrij"),
    ("Three nodes on separate interior rows and columns; bottom row empty", "afzonderlijke knooprijen"),
    ("Three free positions on different rows and columns", "vrije posities op afzonderlijke gridlijnen"),
    ("Write one node. Update the grid. Repeat.", "sequentieel schrijven"),
    ("Nodes project to three axes.", "projectie van knopen"),
    ("WEST · SOUTH · EAST", "drie benoemde projectieassen"),
    ("Each node stays on its grid position.", "knoop blijft op gridpositie"),
    ("Direct placement · Greedy Grow", "direct voorbeeld Greedy Grow"),
    ("The numbered path is the actual engine order.", "afgeleide Greedy-volgorde"),
    ("Calculated placement · Language Tree", "berekend voorbeeld Language Tree"),
    ("HOND BIJT MAN · final stage", "laatste stadium HOND BIJT MAN"),
    ("LEX · WEST", "LEX-as aan westzijde"),
    ("1 · HOND", "verplaatst HOND op LEX-as"),
    ("2 · BIJT", "verplaatst BIJT op LEX-as"),
    ("3 · MAN", "verplaatst MAN op LEX-as"),
    ("Core first. Examples follow.", "feedbackoproep"),
    ("GitHub · kruin/graphlite · Greedy Grow", "GitHub bij direct voorbeeld"),
    ("GitHub · kruin/graphlite · Language Tree", "GitHub bij berekend voorbeeld"),
    ("v2.0.0-rc.45", "carrouselversie"),
    ("?slide=1", "exportquery begin"),
    ("?slide=7", "exportquery einde"),
]:
    require(source, marker, label)

first_two_match = re.search(
    r'(<section class="slide slide-dark" data-slide="1".*?</section>\s*'
    r'<section class="slide" data-slide="2".*?</section>)',
    source,
    flags=re.S,
)
first_two = first_two_match.group(1) if first_two_match else ""
if not first_two_match:
    errors.append("slides 1 en 2 konden niet als één OGN-definitieblok worden gelezen")
for forbidden in [
    "tree",
    "word order",
    "language",
    "linguistic",
    "projection",
    "application",
    "purpose",
    "goal",
]:
    if re.search(rf"\b{re.escape(forbidden)}\b", first_two, flags=re.I):
        errors.append(f"slides 1 en 2 bevatten verboden contextterm: {forbidden!r}")

slide_two_match = re.search(
    r'<section class="slide" data-slide="2".*?</section>',
    source,
    flags=re.S,
)
slide_two = slide_two_match.group(0) if slide_two_match else ""
grid_group_match = re.search(
    r'<g stroke="#d7e0eb" stroke-width="2">(.*?)</g>',
    slide_two,
    flags=re.S,
)
grid_paths = re.findall(r'<path d="([^"]+)"', grid_group_match.group(1)) if grid_group_match else []
grid_columns = [int(value) for value in re.findall(r'M(\d+) \d+V\d+', grid_paths[0])] if len(grid_paths) >= 1 else []
grid_rows = [int(value) for value in re.findall(r'M\d+ (\d+)H\d+', grid_paths[1])] if len(grid_paths) >= 2 else []
if len(grid_columns) < 3 or len(grid_rows) < 3:
    errors.append("de gridrijen en -kolommen van slide 2 konden niet worden gelezen")

node_group_match = re.search(
    r'<g[^>]*aria-label="Three nodes on separate interior rows and columns; bottom row empty".*?</g>',
    slide_two,
    flags=re.S,
)
node_positions = re.findall(r'<circle\b[^>]*cx="(\d+)"[^>]*cy="(\d+)"', node_group_match.group(0)) if node_group_match else []
if len(node_positions) != 3:
    errors.append(f"slide 2 moet exact drie knopen tonen, gevonden {len(node_positions)}")
else:
    node_coordinates = [(int(x), int(y)) for x, y in node_positions]
    if len({x for x, _y in node_coordinates}) != 3 or len({y for _x, y in node_coordinates}) != 3:
        errors.append("A, B en C van slide 2 moeten elk een andere rij en kolom gebruiken")
    if grid_rows and any(y == max(grid_rows) for _x, y in node_coordinates):
        errors.append("de onderste gridrij van slide 2 moet vrij van knopen blijven")
    if grid_columns and grid_rows and not all(x in grid_columns and y in grid_rows for x, y in node_coordinates):
        errors.append("alle knopen van slide 2 moeten een gedeclareerde gridrij en -kolom gebruiken")

free_group_match = re.search(
    r'<g aria-label="Three free positions on different rows and columns".*?</g>',
    slide_two,
    flags=re.S,
)
free_positions = re.findall(r'<circle\b[^>]*cx="(\d+)"[^>]*cy="(\d+)"', free_group_match.group(0)) if free_group_match else []
if len(free_positions) != 3:
    errors.append(f"slide 2 moet exact drie gestippelde vrije posities tonen, gevonden {len(free_positions)}")
else:
    free_coordinates = [(int(x), int(y)) for x, y in free_positions]
    if len({x for x, _y in free_coordinates}) != 3 or len({y for _x, y in free_coordinates}) != 3:
        errors.append("de drie gestippelde vrije posities van slide 2 moeten elk een andere rij en kolom gebruiken")
    if grid_columns and grid_rows and not all(x in grid_columns and y in grid_rows for x, y in free_coordinates):
        errors.append("alle gestippelde vrije posities moeten een gedeclareerde gridrij en -kolom gebruiken")
    if node_positions:
        node_x = {int(x) for x, _y in node_positions}
        node_y = {int(y) for _x, y in node_positions}
        if any(x in node_x or y in node_y for x, y in free_coordinates):
            errors.append("een gestippelde vrije positie van slide 2 gebruikt een al bezette rij of kolom")

slide_five_match = re.search(
    r'<section class="slide" data-slide="5".*?</section>',
    source,
    flags=re.S,
)
slide_five = slide_five_match.group(0) if slide_five_match else ""
if not slide_five_match:
    errors.append("slide 5 kon niet worden gelezen")
else:
    for marker in [
        'id="greedyGrowDerivedSvg"',
        'data-greedy-engine="greedy-grow-engine.js"',
        "Dots · 0–11",
        "Runs · 12 · 31 · 96",
        "GitHub · kruin/graphlite · Greedy Grow",
    ]:
        require(slide_five, marker, "afgeleide Greedy Grow-slide")
    if re.search(r"\bTO DO\b|specification pending", slide_five, flags=re.I):
        errors.append("slide 5 bevat nog de oude open Greedy-status")

slide_six_match = re.search(
    r'<section class="slide" data-slide="6".*?</section>',
    source,
    flags=re.S,
)
slide_six = slide_six_match.group(0) if slide_six_match else ""
if not slide_six_match:
    errors.append("slide 6 kon niet worden gelezen")
else:
    for marker in [
        "Calculated placement · Language Tree",
        "HOND BIJT MAN · final stage",
        "LEX · WEST",
        "t[HOND]",
        "t[BIJT]",
        "t[MAN]",
        "GitHub · kruin/graphlite · Language Tree",
    ]:
        require(slide_six, marker, "Language Tree-voorbeeld in laatste stadium")

example_github_links = re.findall(
    r'<a class="example-github" href="https://github\.com/kruin/graphlite"',
    source,
)
if len(example_github_links) != 2:
    errors.append(
        "ieder plaatsingsvoorbeeld moet exact één GitHub-link hebben; "
        f"gevonden {len(example_github_links)}"
    )

slides_one_to_five_match = re.search(
    r'<section class="slide slide-dark" data-slide="1".*?'
    r'</section>\s*<section class="slide" data-slide="6"',
    visible_source,
    flags=re.S,
)
slides_one_to_five = slides_one_to_five_match.group(0) if slides_one_to_five_match else ""
for forbidden in ["language tree", "linguistic", "Two-Pass", "LEX", "SYNT", "LOG"]:
    if re.search(rf"\b{re.escape(forbidden)}\b", slides_one_to_five, flags=re.I):
        errors.append(f"slides 1–5 lopen vooruit op het Language Tree-voorbeeld: {forbidden!r}")
if re.search(r"\bRandom Placement\b", visible_source, flags=re.I):
    errors.append("de carrousel introduceert opnieuw Random Placement")

for forbidden_phrase in ["source node", "source stays", "placed source", "source placement"]:
    if re.search(rf"\b{re.escape(forbidden_phrase)}\b", visible_source, flags=re.I):
        errors.append(f"carrousel gebruikt nog 'source' waar 'node' is vereist: {forbidden_phrase!r}")

script_sources = re.findall(r'<script[^>]+src=["\']([^"\']+)', source, flags=re.I)
if script_sources != ["../greedy-grow-engine.js"]:
    errors.append(
        "carrouselbron moet uitsluitend de lokale Greedy-engine laden; gevonden "
        f"{script_sources!r}"
    )
if re.search(r'src=["\']https?://', source, flags=re.I):
    errors.append("carrouselbron mag geen externe asset laden")
if re.search(r"@import\s+", source, flags=re.I):
    errors.append("carrouselbron mag geen CSS-import gebruiken")

for marker, label in [
    ("## Direct plaatsbare carrousel", "directe carrouseluitleg"),
    ("## Plaatsen op Reddit", "Reddit-stappen"),
    ("## Alt-teksten per slide", "alt-teksten"),
    ("1080 × 1080", "afmetingen"),
    ("01 → 07", "uploadvolgorde"),
    ("gallery post", "gallerybeperking"),
    ("Niet iedere community", "communitybeperking"),
    ("15484546290068-Community-settings", "officiële communitylink"),
    ("360060422572-How-do-I-post-and-comment-on-Reddit", "officiële postlink"),
    ("v2.0.0-rc.45", "README-versie"),
]:
    require(readme, marker, label)

for marker, label in [
    ("Direct — Greedy Grow", "direct voorbeeld in publicatietekst"),
    ("Calculated — Language Tree", "berekend voorbeeld in publicatietekst"),
    ("HOND BIJT MAN", "Language Tree-voorbeeldzin"),
    ("LEX-as", "verplaatste woorden op LEX-as"),
    ("https://github.com/kruin/graphlite", "GitHub-verwijzing"),
]:
    require(readme, marker, label)
if re.search(r"\bRandom Placement\b", readme, flags=re.I):
    errors.append("PUBLICATIE_README introduceert opnieuw Random Placement")

deferred_placement_terms = [
    "inter" + "section",
    "kruis" + "punt",
    "kruis" + "ing",
    "dia" + "gonal",
    "diag" + "onaal",
]
for label, text in [
    ("carrouselbron", visible_source),
    ("PUBLICATIE_README", readme),
]:
    for term in deferred_placement_terms:
        if re.search(rf"\b{re.escape(term)}", text, flags=re.I):
            errors.append(f"{label} loopt vooruit op een uitgesteld plaatsingsonderwerp")

alt_items = re.findall(r"^\d+\. \*\*[^:]+:\*\*", readme, flags=re.M)
if len(alt_items) != 7:
    errors.append(f"PUBLICATIE_README moet zeven genummerde alt-teksten bevatten, gevonden {len(alt_items)}")

for marker, label in [
    ("viewport: { width: 1080, height: 1080 }", "exportviewport"),
    ("Math.round(bounds.width) !== 1080", "breedtecontrole export"),
    ("Math.round(bounds.height) !== 1080", "hoogtecontrole export"),
    ("slideNames.length", "export van complete slideset"),
    ("animations: 'disabled'", "deterministische screenshot"),
    ("derived-manifest.json", "afleidingsmanifest export"),
    ("createHash('sha256')", "SHA-256-afleidingsbewijs"),
    ("const greedyEngine =", "Greedy-engine als manifestbron"),
    ("derivedGreedyNodes !== 12", "runtimecontrole afgeleide Greedy-slide"),
]:
    require(export, marker, label)

for marker, label in [
    ("compactReferenceCandidate", "vierarmige Greedy-bron"),
    ("future_plan_stored: false", "geen toekomstig Greedy-plan"),
    ("placement_mode: 'direct-one-at-a-time'", "directe Greedy-stappen"),
]:
    require(greedy_engine, marker, label)

if errors:
    print("PUBLICATION CAROUSEL CHECK: FOUT")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("PUBLICATION CAROUSEL CHECK: OK")
print("- 7 slides")
print("- 1080 × 1080 PNG")
print("- bron-, exporter- en PNG-hashes bewijzen de actuele afleiding")
print("- HTML-bron, exportscript, uploadvolgorde en alt-teksten aanwezig")
