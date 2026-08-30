from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


# Config contexts are hard-separated: General, Language Tree and Direct.
for marker, label in [
    ("const CONFIG_TAB_DEFINITIONS = [", "tabdefinities"),
    ("{ id: 'general-ui', nl: 'Interface & weergave', en: 'Interface & display' }", "algemene interfacetab"),
    ("{ id: 'preconfig', nl: 'Voorconfig', en: 'Pre-config' }", "tab Voorconfig"),
    ("{ id: 'features', nl: 'Uitbreidingen', en: 'Extensions' }", "Language-Tree-uitbreidingen"),
    ("{ id: 'overview', nl: 'Overzicht', en: 'Overview' }", "tab Overzicht"),
    ("{ id: 'jan', nl: 'JaN · TODO', en: 'JaN · TODO' }", "tab JaN"),
    ("{ id: 'files', nl: 'Bestanden & export', en: 'Files & export' }", "tab Bestanden & export"),
    ("{ id: 'view', nl: 'Boom & projecties', en: 'Tree & projections' }", "Language-Tree-beeldtab"),
    ("{ id: 'log-lex', nl: 'LOG & LEX', en: 'LOG & LEX' }", "tab LOG & LEX"),
    ("{ id: 'examples', nl: 'Voorbeelden', en: 'Examples' }", "Language-Tree-voorbeelden"),
    ("{ id: 'advanced', nl: 'Compatibiliteit', en: 'Compatibility' }", "Language-Tree-compatibiliteit"),
    ("const CONFIG_SCOPE_DEFINITIONS = Object.freeze([", "Configcontexten"),
    ("{ id: 'direct-shared', groupNl: 'Direct', groupEn: 'Direct', nl: 'Gedeeld', en: 'Shared' }", "Direct Gedeeld-context"),
    ("general: Object.freeze(['general-ui', 'readme-carousels', 'overview', 'files'])", "uitsluitend algemene tabs"),
    ("'language-tree': Object.freeze(['preconfig', 'features', 'view', 'log-lex', 'examples', 'jan', 'advanced'])", "uitsluitend Language-Tree-tabs"),
    ("'direct-shared': Object.freeze(['direct'])", "gedeelde Direct-tab"),
    ("let activeConfigTab = 'general-ui';", "Algemeen standaard actief"),
    ("function activateConfigTab(tabId = 'general-ui'", "Algemeen als tabfallback"),
    ("function setupConfigTabs()", "Config-opbouw"),
    ("return isMobileViewport() && !isPortraitGridFirstViewport() ? 'side' : 'stacked';", "werkende automatische README-indeling"),
    ("config-dashboard", "compact Config-dashboard"),
    ("panels.get('general-ui').appendChild(generalUiCard);", "algemeen interfacepaneel"),
    ("panels.get('preconfig').appendChild(preconfigCard);", "voorconfigpaneel"),
    ("panels.get('features').appendChild(featuresCard);", "uitbreidingenpaneel"),
    ("panels.get('overview').appendChild(overviewCard);", "overzichtspaneel"),
    ("panels.get('jan').appendChild(janCard);", "JaN-paneel"),
    ("panels.get('files').append(projectConfigCard, readmeSlideFileCard, graphExportCard, opnCard);", "algemene bestandssectie zonder voorbeelden"),
    ("panels.get('examples').appendChild(examplesCard);", "afzonderlijke Language-Tree-voorbeelden"),
    ("setConfigScreen(true, validPlacementMode(state.placementMode));", "Config opent in actieve toepassingscontext"),
    ("sidePanel.replaceChildren(scopeNav, tabList, saveSlot, ...panels.values());", "globale Config-save boven alle tabpanelen"),
    ("const CONFIG_ITEM_HELP = {", "instellingsuitleg"),
    ("Kiest de centrale Syntax- of Functies-view.", "uitleg centrale view"),
    ("een expliciete zinsplaats heeft voorrang", "uitleg lineaire plaatsingsprioriteit"),
]:
    require(JS, marker, label)

if "generalTopMenuField" in JS:
    errors.append("Language-Tree-menu-indeling wordt nog naar Algemeen verplaatst")
if "general: Object.freeze(['preconfig'" in JS or "general: Object.freeze(['direct'" in JS:
    errors.append("Algemeen bevat nog een toepassingsconfigtab")

for marker, label in [
    ("body.config-screen-active .config-tab-list", "tabbalk"),
    ("body.config-screen-active .config-tab-panel.active", "actief tabpaneel"),
    (".config-dashboard {", "dashboard-CSS"),
    ("body.config-screen-active .config-item-help", "uitleg-CSS"),
    ("body.main-screen-active .main-top-menu", "tweerijig topmenu"),
    ("body.help-screen-active .help-screen.help-tree-screen", "halve-hoogte LEESMIJ-layout"),
]:
    require(CSS, marker, label)

for marker, label in [
    ('id="mainSentenceOptions"', "Zin-keuzelijst"),
    ('id="mainAdverbOptions"', "Bijwoord-keuzelijst"),
    ('data-feature="adverbs" hidden="" id="mainAdverbMenu"', "Bijwoordmenu standaard verborgen"),
    ('id="mainViewOptions"', "Syntax/Functies-keuzelijst"),
    ('id="mainLanguageMenu"', "vijftalig menu"),
    ('data-language-option="en"', "English taaloptie"),
    ('data-language-option="nl"', "Nederlandse taaloptie"),
    ('data-language-option="de"', "Duitse taaloptie"),
    ('data-language-option="fr"', "Franse taaloptie"),
    ('data-language-option="es"', "Spaanse taaloptie"),
    ('id="downloadGraphPngButton"', "LinkedIn-PNG"),
    ('id="recordPlayWebmButton"', "Play-video"),
    ('id="downloadGraphSvgButton"', "SVG-export"),
]:
    require(INDEX, marker, label)

# The semantic top bar has six choices on row 1 and three actions on row 2.
for menu_id in [
    "mainSentenceMenu", "mainAdverbMenu", "mainViewMenu",
    "sourceAxisMenu", "mainExtraMenu", "mainLanguageMenu", "openHelpButton", "openConfigButton",
]:
    require(INDEX, f'id="{menu_id}"', f"topmenu-item {menu_id}")

require(JS, 'id="configViewportModeSelect"', "Interface-keuze in Config")
if 'id="mainInterfaceMenu"' in INDEX:
    errors.append("Interface-keuze staat nog in het hoofdmenu")

if "Syntax/FT" in INDEX or "Syntax / FT" in INDEX or ">FT<" in INDEX:
    errors.append("zichtbare oude FT-naam staat nog in index.html")
if "data-language-toggle" in INDEX:
    errors.append("oude NL/EN-toggle staat nog in index.html")
if "vrije LEX-rij" in JS:
    errors.append("oude herhaalde tekst 'vrije LEX-rij' staat nog in viewer.js")
if "isActualCompactScreen" in JS:
    errors.append("niet-bestaande schermhelper isActualCompactScreen staat nog in viewer.js")

# Export order stays LinkedIn, Play, SVG.
png_index = INDEX.find('id="downloadGraphPngButton"')
video_index = INDEX.find('id="recordPlayWebmButton"')
svg_index = INDEX.find('id="downloadGraphSvgButton"')
if min(png_index, video_index, svg_index) < 0 or not (png_index < video_index < svg_index):
    errors.append("exportacties staan niet in de volgorde LinkedIn, Play, SVG")

for marker, label in [
    ('id="sentenceTypeSelect"', "aparte Config-keuze voor zinsoort"),
    ('data-help-topic-button="lex-free-positions"', "Help-onderwerp voor actief LEX-profiel"),
    ('data-help-topic="lex-free-positions"', "volledige Help-uitleg voor actief LEX-profiel"),
    ('data-help-topic-button="lex-movement-direction"', "Help-onderwerp voor Wissels omhoog"),
    ('data-help-topic="lex-movement-direction"', "volledige uitleg van Wissels omhoog"),
    ('data-help-topic-button="sentence-types"', "Help-onderwerp voor zinsoorten"),
    ('data-help-topic="sentence-types"', "volledige uitleg van zinsoorten"),
    ('Generieke vrije plekken vóór, na of tussen', "zichtbare no-showgrens in Config"),
    ('Wissels omlaag zijn no-show', "zichtbare downward-grens in Config"),
    ('Vraagzin · ja/nee', "actieve ja/nee-vraagzin"),
    ('Dat-zin', "actieve dat-zin"),
]:
    require(INDEX, marker, label)
for marker, label in [
    ("const SENTENCE_TYPES = Object.freeze([", "centrale zinsoortdefinities"),
    ("function sentenceTypeForExample", "zinsoortnormalisatie"),
    ("rule === 'vraagzin-v1'", "vraagzinregel"),
    ("rule === 'bijzin-dat'", "dat-zinregel"),
    ("const DEFERRED_LEX_OPEN_SLOT_PLACEMENTS", "uitgestelde vóór/na/tussen-voorraad"),
    ("if (!(toY < fromY - 1)) return;", "harde upward-only renderergrens"),
    ("sentence_type: sentenceTypeForExample(ex)", "zinsoort in OPN-export"),
]:
    require(JS, marker, label)
if 'id="lexOpenSlotCountSelect"' in INDEX or 'id="lexOpenSlotPlacementSelect"' in INDEX:
    errors.append("uitgestelde vrije-positieconfig is nog zichtbaar")
for stale in ["lex-space-reservation", "spaceOnly", "showSpaceStep", "spaceStep"]:
    if stale in JS or stale in CSS:
        errors.append(f"verwijderde tijdelijke LEX-ruimte-indicator staat nog in bron: {stale}")

if errors:
    print("CONFIG/MENU CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("CONFIG/MENU CHECK: OK (Algemeen, Language Tree en Direct strikt gescheiden; interface en talen intact)")
