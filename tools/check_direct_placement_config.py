from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


js = read("viewer.js")
css = read("styles.css")
engine = read("random-placement-engine.js")
documentation = read("DIRECT_PLACEMENT_CONFIG.md")
defaults = json.loads(read("config/default-config.json"))["config"]

for marker, label in [
    ("{ id: 'direct', nl: 'Direct', en: 'Direct placement' }", "eigen Config-tab Direct"),
    ("function directMethodConfigScope()", "contextafhankelijke methode-Config"),
    ("function syncConfigMethodScope()", "afscherming van de Config-schil"),
    ("config-direct-method-only", "eigen body-status voor methode-Config"),
    ("activeConfigTab = 'direct'", "Direct als enig methodepaneel"),
    ("activeDirectConfigMenu = nextScope", "actieve methode als enig Configpaneel"),
    ('id="directTargetCountSelect"', "algemeen aantal knopen"),
    ('id="directIntervalSelect"', "algemene Play-snelheid"),
    ('id="greedyStrategySelect"', "Greedy-strategiekeuze"),
    ('id="greedyOrientationSelect"', "Greedy-oriëntatie"),
    ('id="randomSeedInput"', "Random-seed"),
    ('id="randomSpreadSelect"', "Random-spreiding"),
    ('id="randomIterationCountSelect"', "expliciet aantal Random-iteraties"),
    ('id="randomAxisImageModeSelect"', "expliciete impact op asbeeld"),
    ('id="randomIterationImpactStatus"', "berekende iteratie-impact"),
    ("function randomAxisPattern()", "deterministische iteratieanalyse"),
    ("observationsPerAxis: config.iterationCount * Math.max(0, general.targetCount - 1)", "waarnemingen per as"),
    ("axisPattern.axisImageMode === 'occupancy'", "bezettingskans met iteratienoemer"),
    (": axisPattern.maxCount", "relatieve patroonnoemer"),
    ("directPlacementGeneral: normalizeDirectPlacementGeneral", "Configsnapshot algemene directe instellingen"),
    ("greedyGrowConfig: normalizeGreedyGrowConfig", "Configsnapshot Greedy"),
    ("randomPlacementConfig: normalizeRandomPlacementConfig", "Configsnapshot Random"),
    ("for (const key of ['directPlacementGeneral', 'directPlacementPresentation', 'greedyGrowConfig', 'randomPlacementConfig'])", "diepe projectconfig-merge met migratie"),
]:
    require(js, marker, label)

if "data-direct-config-menu" in js:
    errors.append("methode-Config bevat nog een Algemeen/Greedy/Random-submenu")

greedy_panel = re.search(
    r'<section id="direct-config-panel-greedy".*?</section>',
    js,
    flags=re.S,
)
if not greedy_panel:
    errors.append("afzonderlijk Greedy-paneel ontbreekt")
else:
    greedy_html = greedy_panel.group(0)
    if len(re.findall(r'<select\b', greedy_html)) != 2 or re.search(r'<(?:input|button|p)\b', greedy_html):
        errors.append("Greedy-paneel bevat meer dan zijn twee eigen Configvelden")
    for stale in [
        "directTargetCountSelect", "directIntervalSelect", "directShowPathInput",
        "directShowNumbersInput", "directShowMetricsInput", "directNodeSizeSelect",
        "directGridMarginSelect", "randomSeedInput", "randomIterationCountSelect",
    ]:
        if stale in greedy_html:
            errors.append(f"Greedy-paneel bevat methodevreemde optie: {stale}")

random_panel = re.search(
    r'<section id="direct-config-panel-random".*?</section>',
    js,
    flags=re.S,
)
if not random_panel:
    errors.append("afzonderlijk Random-paneel ontbreekt")
else:
    random_html = random_panel.group(0)
    if len(re.findall(r'<select\b', random_html)) != 4 or len(re.findall(r'<input\b', random_html)) != 1:
        errors.append("Random-paneel bevat niet exact zijn vijf eigen Configvelden")
    if re.search(r'<(?:button|p)\b', random_html):
        errors.append("Random-paneel bevat uitleg of actieknoppen naast de eigen Config")
    for stale in [
        "directTargetCountSelect", "directIntervalSelect", "directShowPathInput",
        "directShowNumbersInput", "directShowMetricsInput", "directNodeSizeSelect",
        "directGridMarginSelect", "greedyStrategySelect", "greedyOrientationSelect",
    ]:
        if stale in random_html:
            errors.append(f"Random-paneel bevat niet-Random-optie: {stale}")

for stale in [
    "showGreedyGrowButton", "showRandomPlacementButton",
    "resetGreedyGrowConfigButton", "resetRandomPlacementConfigButton",
    "directConfigStatus",
]:
    if stale in js:
        errors.append(f"methodepanelen bevatten nog niet-eigen bediening/status: {stale}")

for marker, label in [
    (".direct-config-method-panel[hidden]", "één methodepaneel tegelijk"),
    ("body.config-screen-active.config-direct-method-only .config-tab-list", "hoofdtabbladen verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only #configLanguageMenu", "taalmenu verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only #openHelpFromConfigButton", "README-knop verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only .config-topbar > div", "algemene Configuitleg verborgen"),
    ("body.config-screen-active.config-direct-method-only #downloadConfigLogButton", "configlogknop verborgen in methode-Config"),
    (".direct-axis-pattern-west", "west-asfrequenties"),
    (".direct-axis-pattern-south", "zuid-asfrequenties"),
]:
    require(css, marker, label)

for marker, label in [
    ("const SPREADS", "Random-spreidingsprofielen"),
    ("function freeCoordinates", "lineaire vrije-coördinatenkeuze"),
    ("spread: state.spread", "spreiding in Random-snapshot"),
]:
    require(engine, marker, label)

expected = {
    "directPlacementGeneral": {
        "targetCount": 31,
        "intervalMs": 650,
        "showPath": True,
        "showNumbers": True,
        "showMetrics": True,
        "nodeSize": "normal",
        "gridMargin": "normal",
    },
    "greedyGrowConfig": {
        "strategy": "compact-four-arm",
        "orientation": "original",
    },
    "randomPlacementConfig": {
        "seed": 20260802,
        "seedPolicy": "advance",
        "spread": "compact",
        "iterationCount": 10,
        "axisImageMode": "occupancy",
    },
}
for key, value in expected.items():
    if defaults.get(key) != value:
        errors.append(f"default-config {key} wijkt af: {defaults.get(key)!r}")

for marker, label in [
    ("Hoe vaak", "uitleg aantal iteraties"),
    ("telling ÷ iteraties", "uitleg asbeeldimpact"),
    ("statistisch niet zinvol", "uitleg waarom Greedy niet wordt herhaald"),
    ("west- en zuidas", "uitleg van beide marginale aspatronen"),
    ("config/default-config.json", "configlaagcontract"),
]:
    require(documentation, marker, label)

if errors:
    print("DIRECT PLACEMENT CONFIG CHECK: FOUT")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("DIRECT PLACEMENT CONFIG CHECK: OK")
