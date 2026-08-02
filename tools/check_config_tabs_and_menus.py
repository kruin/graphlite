from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


# Compact Config overview and the focused sections restored in rc.28.
for marker, label in [
    ("const CONFIG_TAB_DEFINITIONS = [", "tabdefinities"),
    ("{ id: 'preconfig', nl: 'Voorconfig', en: 'Pre-config' }", "tab Voorconfig"),
    ("{ id: 'features', nl: 'Toepassingen', en: 'Applications' }", "tab Toepassingen"),
    ("{ id: 'overview', nl: 'Overzicht', en: 'Overview' }", "tab Overzicht"),
    ("{ id: 'jan', nl: 'JaN · TODO', en: 'JaN · TODO' }", "tab JaN"),
    ("{ id: 'files', nl: 'Bestanden & export', en: 'Files & export' }", "tab Bestanden & export"),
    ("{ id: 'view', nl: 'Beeld', en: 'View' }", "tab Beeld"),
    ("{ id: 'log-lex', nl: 'LOG & LEX', en: 'LOG & LEX' }", "tab LOG & LEX"),
    ("{ id: 'advanced', nl: 'Geavanceerd', en: 'Advanced' }", "tab Geavanceerd"),
    ("let activeConfigTab = 'preconfig';", "Voorconfig standaard actief"),
    ("function activateConfigTab(tabId = 'preconfig'", "Voorconfig als tabfallback"),
    ("function setupConfigTabs()", "Config-opbouw"),
    ("return isMobileViewport() && !isPortraitGridFirstViewport() ? 'side' : 'stacked';", "werkende automatische README-indeling"),
    ("config-dashboard", "compact Config-dashboard"),
    ("data-config-jump=\"jan\"", "JaN-overzichtskaart"),
    ("panels.get('preconfig').appendChild(preconfigCard);", "voorconfigpaneel"),
    ("panels.get('features').appendChild(featuresCard);", "toepassingenpaneel"),
    ("panels.get('overview').appendChild(overviewCard);", "overzichtspaneel"),
    ("panels.get('jan').appendChild(janCard);", "JaN-paneel"),
    ("panels.get('files').append(projectConfigCard, readmeSlideFileCard, graphExportCard, opnCard, examplesCard);", "bestandssectie"),
    ("sidePanel.replaceChildren(scopeNav, tabList, saveSlot, ...panels.values());", "globale Config-save boven alle tabpanelen"),
    ("const CONFIG_ITEM_HELP = {", "instellingsuitleg"),
    ("Kiest de centrale Syntax- of Functional-view.", "uitleg centrale view"),
    ("een expliciete zinsplaats heeft voorrang", "uitleg lineaire plaatsingsprioriteit"),
]:
    require(JS, marker, label)

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
    ('id="mainViewOptions"', "Syntax/Functional-keuzelijst"),
    ('id="mainInterfaceOptions"', "Interface-keuzelijst"),
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
    "mainSentenceMenu", "mainAdverbMenu", "mainViewMenu", "mainInterfaceMenu",
    "sourceAxisMenu", "mainExtraMenu", "mainLanguageMenu", "openHelpButton", "openConfigButton",
]:
    require(INDEX, f'id="{menu_id}"', f"topmenu-item {menu_id}")

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

require(JS, "class: 'lex-space-reservation'", "enkele LEX-ruimtereservering")
require(CSS, ".lex-space-reservation {", "LEX-ruimtereservering CSS")

if errors:
    print("CONFIG/MENU CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("CONFIG/MENU CHECK: OK (Voorconfig, toepassingen, overzicht, JaN, Functional, interface en talen)")
