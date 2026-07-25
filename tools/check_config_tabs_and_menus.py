from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


for marker, label in [
    ("const CONFIG_TAB_DEFINITIONS = [", "tabdefinities"),
    ("{ id: 'files', nl: 'Opslaan & exporteren', en: 'Save & export' }", "eerste tab Opslaan & exporteren"),
    ("{ id: 'view', nl: 'Beeld', en: 'View' }", "tab Beeld"),
    ("{ id: 'log-lex', nl: 'LOG & LEX', en: 'LOG & LEX' }", "tab LOG & LEX"),
    ("{ id: 'advanced', nl: 'Geavanceerd', en: 'Advanced' }", "tab Geavanceerd"),
    ("let activeConfigTab = 'files';", "Opslaan & exporteren standaard actief"),
    ("function activateConfigTab(tabId = 'files'", "Opslaan & exporteren als tabfallback"),
    ("function setupConfigTabs()", "Config-opbouw"),
    ("function activateConfigTab(", "tabactivatie"),
    ("setupConfigTabs();", "Config-opbouw bij initialisatie"),
    ("config-max-callout", "zichtbare MAX-kaart"),
    ("els.layoutDensitySelect, els.viewFitSelect, els.freeSlotCountSelect", "primaire beeldkeuzes"),
    ("panels.get('files').append(graphExportCard, opnCard, saveCard, examplesCard);", "save-tab begint met publiceren"),
]:
    require(JS, marker, label)

for marker, label in [
    ("body.config-screen-active .config-tab-list", "tabbalk"),
    ("body.config-screen-active .config-tab-panel.active", "actief tabpaneel"),
    ('body.config-screen-active .config-tab-button[data-config-tab-button="files"]', "prominente save-tab"),
    ('body.config-screen-active [data-config-tab-panel="files"] > [data-config-card="graph-export"]', "exportkaart over volle breedte"),
    ("body.config-screen-active #layoutDensitySelect", "MAX-opmaak Boomruimte"),
    ("body.config-screen-active #viewFitSelect", "MAX-opmaak Venstervulling"),
    ("body.main-screen-active .main-topbar {\n  z-index: 2000 !important;", "topmenu boven Play"),
    ("body.main-screen-active .top-menu-item[open]", "geopend menu boven siblings"),
]:
    require(CSS, marker, label)

for marker, label in [
    ('id="mainSentenceOptions"', "Zin-keuzelijst"),
    ('id="mainAdverbOptions"', "Bijwoord-keuzelijst"),
    ('id="mainViewOptions"', "Syntax/FT-keuzelijst"),
    ('<span>Venstervulling</span><select id="viewFitSelect"', "duidelijke Venstervulling"),
    ('class="config-save-menu-kicker">DIRECT OPSLAAN OF DELEN', "prominente save-kop"),
    ('<h2>Opslaan, exporteren en delen</h2>', "duidelijke exporttitel"),
]:
    require(INDEX, marker, label)

files_index = JS.find("{ id: 'files', nl: 'Opslaan & exporteren', en: 'Save & export' }")
view_index = JS.find("{ id: 'view', nl: 'Beeld', en: 'View' }")
if files_index < 0 or view_index < 0 or files_index > view_index:
    errors.append("Opslaan & exporteren is niet het eerste Config-tabblad")

png_index = INDEX.find('id="downloadGraphPngButton"')
video_index = INDEX.find('id="recordPlayWebmButton"')
svg_index = INDEX.find('id="downloadGraphSvgButton"')
if min(png_index, video_index, svg_index) < 0 or not (png_index < video_index < svg_index):
    errors.append("exportacties staan niet in de volgorde LinkedIn, Play, SVG")

if "vrije LEX-rij" in JS:
    errors.append("oude herhaalde tekst 'vrije LEX-rij' staat nog in viewer.js")
require(JS, "class: 'lex-space-reservation'", "enkele LEX-ruimtereservering")
require(CSS, ".lex-space-reservation {", "LEX-ruimtereservering CSS")

if errors:
    print("CONFIG/MENU CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("CONFIG/MENU CHECK: OK")
