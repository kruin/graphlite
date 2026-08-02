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
index = read("index.html")
documentation = read("DIRECT_PLACEMENT_CONFIG.md")
ui_standard = read("CONFIG_UI_EXPLANATION_STANDARD.md")
defaults = json.loads(read("config/default-config.json"))["config"]

for marker, label in [
    ("{ id: 'direct', nl: 'Direct · gedeeld', en: 'Direct · shared' }", "gedeelde Direct-Configtab"),
    ("function directMethodConfigScope()", "contextafhankelijke methode-Config"),
    ("function syncConfigMethodScope()", "afscherming van de Config-schil"),
    ("scopeNav.hidden = !!configMethodScope", "harde no-show van de toepassingsbalk in methode-Config"),
    ("const CONFIG_SCOPE_DEFINITIONS", "Config-hiërarchie Algemeen/Calculated/Direct"),
    ("const CONFIG_SCOPE_TABS", "no-show tabs per Configcontext"),
    ("function activateConfigScope(", "wisselen tussen Configcontexten"),
    ("data-config-scope-button", "zichtbare toepassingsbalk"),
    ("config-direct-method-only", "eigen body-status voor methode-Config"),
    ("activeConfigTab = 'direct'", "Direct als enig methodepaneel"),
    ("activeDirectConfigMenu = nextScope", "actieve methode als enig Configpaneel"),
    ('id="directTargetCountSelect"', "algemeen aantal knopen"),
    ('id="directIntervalSelect"', "algemene Play-snelheid"),
    ('id="greedyStrategySelect"', "Greedy-strategiekeuze"),
    ('id="greedyOrientationSelect"', "Greedy-oriëntatie"),
    ('id="randomSeedInput"', "Random-seed"),
    ('id="randomDistributionSelect"', "Random-model"),
    ('id="randomSpreadSelect"', "Random-spreiding"),
    ('id="randomMaxDimensionsSelect"', "Random-maximale afmetingen"),
    ('id="randomFixedColumnsInput"', "vaste Random-kolommen"),
    ('id="randomFixedRowsInput"', "vaste Random-rijen"),
    ('id="randomSpeedSelect"', "Random-snelheid"),
    ('id="randomIterationCountSelect"', "expliciet aantal Random-iteraties"),
    ('id="randomAxisImageModeSelect"', "expliciete impact op asbeeld"),
    ("function randomAxisPattern()", "deterministische iteratieanalyse"),
    ("function randomCompletedIterationCount", "alleen voltooide Random-rondes"),
    ("const RANDOM_MAX_DIMENSION_OPTIONS", "uitbreidbare Random-begrenzingsopties"),
    ("function randomPlacementDimensions(", "interface-afhankelijke Random-rechthoek"),
    ("maxColumns: dimensions.maxColumns", "maximale kolommen naar Random-engine"),
    ("maxRows: dimensions.maxRows", "maximale rijen naar Random-engine"),
    ("function randomSeedForIteration", "vaste seedreeks per iteratie"),
    ("function setRandomIteration", "wisselen naar een concrete iteratie"),
    ("function advanceRandomIteration", "volgende Random-iteratie"),
    ("directPlacementIterationBaseSeed", "startseed van de iteratieset"),
    ("directPlacementIterationIndex", "actieve iteratie-index"),
    ("advanceRandomIteration())", "Next over de iteratiegrens"),
    ("setRandomIteration(iteration.index - 1, { complete: true })", "Previous over de iteratiegrens"),
    ("const directCanPrevious", "Previous-knop over de iteratiegrens"),
    ("const directCanNext", "Next-knop over de iteratiegrens"),
    ("randomProgress.number < randomProgress.total", "Next beschikbaar vóór de laatste iteratie"),
    ("randomSeriesHistory(completedIterationCount", "geen toekomstige rondes in asbeeld"),
    ("randomSeriesHistory(state.directPlacementIterationIndex", "v0.1 gebruikt alleen eerdere rondes"),
    ("priorHitsX: mode.id === 'random' ? history.xCounts", "v0.1-historie naar actieve engine"),
    ("distribution: mode.id === 'random' ? config.distribution", "Random-model naar actieve engine"),
    ("configuredIterationCount: config.iterationCount", "ingesteld rondetotaal voor spotgewicht"),
    ("completedIterationCount,", "actueel aantal voltooide rondes"),
    ("observationsPerAxis: completedIterationCount * Math.max(0, general.targetCount - 1)", "progressieve projectie-hits per as"),
    ("axisPattern.axisImageMode === 'relative'", "relatieve spotnormalisatie"),
    (": axisPattern.configuredIterationCount", "bezettingsspot met vaste totaalnoemer"),
    ("data-hit-count", "hittelling per asspot"),
    ("data-cumulative-ratio", "monotone kleurverzwaring per hit"),
    ("PROJECTIE-HITS", "zichtbaar Nederlands hitlabel"),
    ("PROJECTION HITS", "zichtbaar Engels hitlabel"),
    ("directPlacementGeneral: normalizeDirectPlacementGeneral", "Configsnapshot algemene directe instellingen"),
    ("greedyGrowConfig: normalizeGreedyGrowConfig", "Configsnapshot Greedy"),
    ("randomPlacementConfig: normalizeRandomPlacementConfig", "Configsnapshot Random"),
    ("for (const key of ['directPlacementGeneral', 'directPlacementPresentation', 'greedyGrowConfig', 'randomPlacementConfig'])", "diepe projectconfig-merge met migratie"),
]:
    require(js, marker, label)

if "data-direct-config-menu" in js:
    errors.append("methode-Config bevat nog een Algemeen/Greedy/Random-submenu")
if "randomIterationImpactStatus" in js or ".random-iteration-impact" in css:
    errors.append("Random-config toont nog niet-bewerkbare berekende uitvoer")

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
    if greedy_html.count('config-control-explanation') != 2:
        errors.append("Greedy-paneel legt niet ieder eigen Configveld direct uit")
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
    if len(re.findall(r'<select\b', random_html)) != 7 or len(re.findall(r'<input\b', random_html)) != 3:
        errors.append("Random-paneel bevat niet exact zeven keuzes en drie getalvelden")
    if random_html.count('config-control-explanation') != 10:
        errors.append("Random-paneel legt niet ieder zichtbaar/conditioneel Configveld direct uit")
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
    ("body.config-screen-active.config-direct-method-only .config-scope-nav", "toepassingsbalk verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only #configLanguageMenu", "taalmenu verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only #openHelpFromConfigButton", "README-knop verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only .config-topbar > div", "algemene Configuitleg verborgen"),
    ("body.config-screen-active.config-direct-method-only #downloadConfigLogButton", "configlogknop verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only .toolbar", "viewerwerkbalk verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only .status-panel", "runstatus verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only .main-play-reset-bar", "Play-balk verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only .config-save-field legend", "savekop verborgen in methode-Config"),
    ("body.config-screen-active.config-direct-method-only #configSaveStatus", "save-uitleg verborgen in methode-Config"),
    (".direct-axis-hit-axis-west", "WEST-hitas"),
    (".direct-axis-hit-axis-south", "SOUTH-hitas"),
    (".direct-axis-hit-spot", "cumulatieve asspot"),
    (".direct-axis-hit-west", "WEST-hitkleur"),
    (".direct-axis-hit-south", "SOUTH-hitkleur"),
    (".config-scope-nav", "Config-hiërarchie"),
    (".config-control-explanation", "inklapbare Config-uitleg"),
    (".random-fixed-grid-fields[hidden]", "conditionele vaste gridmaten"),
]:
    require(css, marker, label)

for marker, label in [
    ("const SPREADS", "Random-spreidingsprofielen"),
    ("const DISTRIBUTIONS", "functionele Random-modellen"),
    ("'impure-repeat-v0.1'", "Onzuiver uniform v0.1"),
    ("repeatMixture: 0.2", "vaste milde v0.1-herhaalmix"),
    ("function weightedCoordinateChoice", "gewogen v0.1-coördinatenkeuze"),
    ("available: Object.freeze", "volledige beschikbare ruimte als profiel"),
    ("function freeCoordinates", "lineaire vrije-coördinatenkeuze"),
    ("placementArea", "vaste begrensde Random-rechthoek"),
    ("max_columns", "maximale kolommen in Random-snapshot"),
    ("max_rows", "maximale rijen in Random-snapshot"),
    ("spread: state.spread", "spreiding in Random-snapshot"),
]:
    require(engine, marker, label)

for marker, label in [
    ('data-help-topic-button="direct-random"', "Help-item voor Random-config en iteratie"),
    ('data-help-topic="direct-random"', "Helptekst voor Random-config en iteratie"),
    ("<strong>Seed</strong> is de reproduceerbare startcode", "Help-uitleg seed"),
    ("Een groot getal geeft niet meer toeval", "Help-uitleg grote seed"),
    ("<strong>Random-model</strong>", "Help-uitleg Random-model"),
    ("Onzuiver uniform v0.1", "Help-uitleg v0.1"),
    ("Ergens in beschikbare ruimte", "Help-uitleg nieuwe Random-standaard"),
    ("<strong>Gridgrootte</strong>", "Help-uitleg gridgrootte"),
    ("<strong>Snelheid</strong>", "Help-uitleg snelheid"),
    ("Na een vensterdraai of resize neemt Reset", "Help-uitleg herberekening na resize"),
    ("Projectie-hits verschijnen pas na een voltooide ronde", "Help-uitleg retrospectieve hits"),
    ("die spot donkerder en zwaarder", "Help-uitleg herhaalde hit"),
    ("Er worden dus geen toekomstige rondes vooraf getekend", "Help verbiedt toekomstige asplanning"),
    ("<strong>Voorspelling:</strong>", "Help bevat Random-voorspelling"),
    ("Play loopt automatisch door", "Help-uitleg iteratie-Play"),
    ("Next schrijft één volgende knoop", "Help-uitleg Next over iteraties"),
]:
    require(index, marker, label)

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
        "distribution": "uniform-v1.0",
        "spread": "available",
        "maxDimensions": "interface",
        "fixedColumns": 48,
        "fixedRows": 48,
        "iterationCount": 10,
        "axisImageMode": "occupancy",
    },
}
for key, value in expected.items():
    if defaults.get(key) != value:
        errors.append(f"default-config {key} wijkt af: {defaults.get(key)!r}")

for marker, label in [
    ("Hoe vaak", "uitleg aantal iteraties"),
    ("Config: Algemeen en per toepassing", "toepassingsgerichte Config-hiërarchie"),
    ("no-show", "no-show-contract"),
    ("Seed is geen hoeveelheid toeval", "seed versus toeval"),
    ("Onzuiver uniform v0.1", "v0.1-modelcontract"),
    ("P(c) = 0,80 / F", "v0.1-kansformule"),
    ("v0.2 · instelbare herhaalsterkte", "voorspeld v0.2-contract"),
    ("v0.3 · instelbaar geheugenvenster", "voorspeld v0.3-contract"),
    ("Plaatsing = Ergens in beschikbare ruimte", "documentatie nieuwe plaatsingsstandaard"),
    ("Gridgrootte = Interface", "documentatie standaardbegrenzing"),
    ("Compact", "bestaande compacte optie blijft open"),
    ("Gebalanceerd", "bestaande gebalanceerde optie blijft open"),
    ("Ruim", "bestaande ruime optie blijft open"),
    ("Opgeslagen bestaande keuzes", "geen geforceerde configmigratie"),
    ("hittelling ÷ ingesteld totaal rondes", "uitleg asbeeldimpact"),
    ("**Play** loopt knoop voor knoop", "uitleg iteratiebediening"),
    ("Config toont uitsluitend functionele, bewerkbare", "geen berekende uitvoer in Config"),
    ("statistisch niet zinvol", "uitleg waarom Greedy niet wordt herhaald"),
    ("west- en zuidas", "uitleg van beide marginale aspatronen"),
    ("### Projectie-hits op de assen", "normatief hitspotcontract"),
    ("### Voorspelling voor uniforme Random", "normatieve voorspelling"),
    ("(N - 1) / (C - 1)", "verwachte SOUTH-hitkans"),
    ("(N - 1) / (R - 1)", "verwachte WEST-hitkans"),
    ("config/default-config.json", "configlaagcontract"),
]:
    require(documentation, marker, label)

for marker, label in [
    ("Iedere instelling die de gebruiker kan veranderen", "projectbrede Config-uitlegregel"),
    ("wat de instelling nadrukkelijk **niet** verandert", "verplicht niet-effect"),
    ("Een groter getal", "seed is geen hoeveelheid toeval"),
    ("Snelheid", "seed/snelheid-scheiding"),
    ("Meld bij het openen van een bestaand project", "werkwijze bij bestaande projecten"),
]:
    require(ui_standard, marker, label)

for stale in [
    "axisPattern.iterationCount",
    "direct-axis-pattern-west",
    "direct-axis-pattern-south",
    "runIndex < config.iterationCount",
]:
    if stale in js or stale in css:
        errors.append(f"oude voorafberekende asweergave staat nog actief: {stale}")

if errors:
    print("DIRECT PLACEMENT CONFIG CHECK: FOUT")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("DIRECT PLACEMENT CONFIG CHECK: OK")
