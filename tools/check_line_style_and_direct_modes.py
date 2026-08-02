from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


index = read("index.html")
viewer = read("viewer.html")
js = read("viewer.js")
css = read("styles.css")
engine = read("greedy-grow-engine.js")
random_engine = read("random-placement-engine.js")
default_config = json.loads(read("config/default-config.json"))["config"]
contract = read("LINE_STYLE_AND_PLACEMENT_MODES.md")

if index != viewer:
    errors.append("viewer.html verschilt van index.html")

for marker, label in [
    ('data-placement-mode="language-tree"', "prominente Language Tree-keuze"),
    ('data-placement-mode="greedy-grow"', "Greedy Grow-interfacekeuze"),
    ('data-placement-mode="random"', "Random-interfacekeuze"),
    ('class="placement-mode-option is-primary"', "visuele primaire status Language Tree"),
    ('src="greedy-grow-engine.js', "gedeelde directe engine vóór viewer"),
    ('src="random-placement-engine.js', "afzonderlijke Random-engine vóór viewer"),
    ('id="gridColorSelect"', "rasterkleurkeuze"),
    ('id="gridLineWeightSelect"', "rasterzwaartekeuze"),
    ('id="projectionLineWeightSelect"', "projectielijnzwaartekeuze"),
    ('id="boxLineWeightSelect"', "boxlijnzwaartekeuze"),
]:
    require(index, marker, label)

for engine_script in ('greedy-grow-engine.js', 'random-placement-engine.js'):
    if index.index(f'src="{engine_script}') > index.index('src="viewer.js'):
        errors.append(f"{engine_script} moet vóór viewer.js laden")

for marker, label in [
    ("function drawDirectPlacement()", "directe OGN-renderer"),
    ("function setPlacementMode(value)", "plaatsingsmodusschakelaar"),
    ("function toggleDirectPlacementPlayback()", "direct Play"),
    ("if (directPlacementActive()) drawDirectPlacement();", "directe renderroute"),
    ("Language Tree blijft de primaire berekende toepassing", "prominente Language Tree-status"),
    ("--og-grid-line-width", "runtime rasterzwaarte"),
    ("--og-projection-line-width", "runtime projectielijnzwaarte"),
    ("--og-box-line-width", "runtime boxlijnzwaarte"),
    ("projectionColorCss(state.lexProjectionColor", "instelbare LEX-kleur"),
]:
    require(js, marker, label)

for marker, label in [
    ("body.main-screen-active #graphSvg .grid-line", "laatste rasteroverride"),
    ("stroke: var(--og-grid-color) !important", "instelbare rasterkleur"),
    ("stroke-width: var(--og-projection-line-width) !important", "projectielijngewicht"),
    ("stroke-width: var(--og-box-line-width) !important", "boxlijngewicht"),
    (".placement-mode-option.is-primary", "prominente Language Tree-knop"),
    (".direct-placement-node", "directe OGN-knoopstijl"),
]:
    require(css, marker, label)

for marker, label in [
    ("OGNRandomPlacement", "afzonderlijke Random-engine"),
    ("function findRandomCandidate(state)", "directe Random-kandidaatselectie"),
    ("positionIsFree(state, candidate)", "harde vrije-rij/kolomfilter"),
]:
    require(random_engine, marker, label)

if "random: Object.freeze" in engine or "findRandomCandidate" in engine:
    errors.append("de historische Greedy-Grow-engine mag niet door Random worden gewijzigd")

expected_defaults = {
    "placementMode": "language-tree",
    "lexProjectionColor": "blue",
    "syntProjectionColor": "green",
    "logProjectionColor": "purple",
    "gridColor": "soft-slate",
    "gridLineWeight": "normal",
    "projectionLineWeight": "normal",
    "boxLineWeight": "normal",
}
for key, expected in expected_defaults.items():
    if default_config.get(key) != expected:
        errors.append(f"default-config {key} moet {expected!r} zijn, gevonden {default_config.get(key)!r}")

colors = [default_config.get(key) for key in ("lexProjectionColor", "syntProjectionColor", "logProjectionColor")]
if len(set(colors)) != 3:
    errors.append("LEX, SYNT en LOG moeten verschillende standaardkleuren hebben")

for marker, label in [
    ("Language Tree | calculated", "plaatsingshiërarchie in documentatie"),
    ("exact één afsluitende", "EOF/EOL-contract in documentatie"),
    ("random-placement-engine.js", "gescheiden Random-engine in documentatie"),
]:
    require(contract, marker, label)

if errors:
    print("LINE STYLE / DIRECT MODES CHECK: FOUT")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("LINE STYLE / DIRECT MODES CHECK: OK")
