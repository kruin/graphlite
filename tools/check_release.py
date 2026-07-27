from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION = (ROOT / "VERSION.txt").read_text(encoding="utf-8").strip()
errors: list[str] = []


def read(rel: str) -> str:
    path = ROOT / rel
    return path.read_text(encoding="utf-8", errors="ignore") if path.is_file() else ""


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


required_files = [
    "index.html", "viewer.html", "viewer.js", "styles.css", "reset-cache.html", "sw.js",
    "structure-config.html", "structure-editor.html", "examples-input.html", "examples-editor.html",
    "examples-adverbs.html", "lexicon-config.html", "lexicon-editor.html", ".nojekyll",
    "README.md", "LEESMIJ.md", "PROJECT_STATE_CURRENT.md", "LAYOUT_RULES.md",
    "LINGUISTIC_ACTIONS.md", "DOCUMENTATION_RULES.md", "HANDOVER_FOR_COLLABORATORS.md",
    "ADVERB_ORIGIN_MECHANISMS.md", "LEXICON_USAGE_PROFILES_AND_DISAMBIGUATION.md",
    "LEXICON_USAGE_PROFILE_TEST.md", "SOURCE_CHANGES_V2.0.0-rc.38.md",
    "SOURCE_CHANGES_V2.0.0-rc.39.md", "SOURCE_CHANGES_V2.0.0-rc.40.md",
    "SOURCE_CHANGES_V2.0.0-rc.41.md", "RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md",
    "RC35_README_LAYOUT_TEST.md", "RC36_BASE_PROFILE_TEST.md", "RC37_PRECONFIG_TEST.md",
    "RC38_MOBILE_LAYOUT_TEST.md", "RC39_VIEWPORT_SWITCH_TEST.md",
    "RC40_LANDSCAPE_COMPOSITION_TEST.md", "RC41_RECURSIVE_LAYOUT_TEST.md",
    "OPN_STORAGE_FORMAT.md", "PRECONFIG_ARCHITECTURE.md", "projectie-master-spec.md",
    "docs/ADVERB_ORIGIN_MECHANISMS.md", "docs/OGN_BASE_PROFILE.md", "docs/PRECONFIG_ARCHITECTURE.md",
    "docs/LAYOUT_SPEC.md", "docs/RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md", "docs/RENDER_EXPLANATION.md",
    "docs/RENDER_EXPLANATION_EN.md", "docs/TALIGE_UITBREIDINGEN.md", "docs/SOCIAL_EXPORT.md",
    "images/readme/traditional-tree-problem-too-wide.png", "images/readme/traditional-tree-problem-unreadable.png",
    "images/readme/traditional-tree-flexible-wide.png", "images/readme/traditional-tree-flexible-narrow.png", "manifest.webmanifest",
    "maak-volledige-zip.bat", "start_local_viewer.bat", "start_local_viewer.py",
    "check_release.bat", "publish_checked.bat",
    "tools/check_release.py", "tools/check_local_start.py", "tools/check_config_tabs_and_menus.py",
    "tools/check_examples_roundtrip.py", "tools/check_log_slot_distance.py",
    "tools/check_lex_horizontal_projection.py", "tools/check_projection_cleanup.py",
    "tools/check_desktop_max_view.py", "tools/check_social_and_linguistic_export.py",
    "tools/check_linkedin_video_export.py", "tools/check_linkedin_video_runtime.js",
    "tools/check_play_reverse.py", "tools/check_release_zip_batch.py",
    "tools/check_opn_storage.py", "tools/check_lexicon_usage_profiles.py",
    "tools/check_feature_profiles.py", "tools/check_feature_profiles_runtime.js",
    "tools/check_mobile_layout_rc38.py", "tools/check_mobile_layout_runtime.js",
    "tools/check_viewport_switch_runtime.js", "tools/check_landscape_composition_runtime.js",
    "tools/check_recursive_box_fit_runtime.js",
    "local-mobile-test.js",
]
for rel in required_files:
    if not (ROOT / rel).is_file():
        errors.append(f"ontbreekt: {rel}")

index = read("index.html")
viewer = read("viewer.html")
js = read("viewer.js")
css = read("styles.css")
readme = read("README.md")
leesmij = read("LEESMIJ.md")
structure = read("structure-config.html")
examples = read("examples-input.html")
lexicon = read("lexicon-config.html")
publish_bat = read("publish_checked.bat")
start_bat = read("start_local_viewer.bat")
debug_html = read("debug.html")
local_mobile = read("local-mobile-test.js")

# Version identity and the paired entry pages.
if not VERSION or VERSION != "v2.0.0-rc.41":
    errors.append(f"VERSION.txt moet v2.0.0-rc.41 bevatten, gevonden: {VERSION!r}")
for rel in ["index.html", "viewer.html", "viewer.js", "reset-cache.html", "sw.js"]:
    if VERSION not in read(rel):
        errors.append(f"versie ontbreekt in {rel}")
if index != viewer:
    errors.append("viewer.html verschilt van index.html")

# Unique HTML ids.
class IdCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for key, value in attrs:
            if key == "id" and value:
                self.ids.append(value)

for rel in ["index.html", "viewer.html"]:
    collector = IdCollector()
    collector.feed(read(rel))
    duplicates = sorted({item for item in collector.ids if collector.ids.count(item) > 1})
    if duplicates:
        errors.append(f"dubbele HTML-id's in {rel}: {', '.join(duplicates)}")

# Main menu: five base choices plus the optional Adverb choice on row 1,
# Language/README/Config on row 2.
nav_match = re.search(r'<nav[^>]*class="[^"]*main-top-menu[^"]*"[^>]*>.*?</nav>', index, flags=re.S)
if not nav_match:
    errors.append("main-top-menu ontbreekt")
else:
    nav = nav_match.group(0)
    for item in [
        "mainSentenceMenu", "mainAdverbMenu", "mainViewMenu", "mainInterfaceMenu",
        "sourceAxisMenu", "mainExtraMenu", "mainLanguageMenu", "openHelpButton", "openConfigButton",
    ]:
        require(nav, f'id="{item}"', f"topmenu-item {item}")
    if nav.count("<details") != 7:
        errors.append("topmenu moet zeven directe choice-details bevatten")
    require(nav, 'data-feature="adverbs" hidden="" id="mainAdverbMenu"', "optioneel verborgen Bijwoordmenu")

# Functional naming, interface selector, languages and English default.
for marker, label in [
    ("const DEFAULT_LANGUAGE = 'en';", "English als standaardtaal"),
    ("const LANGUAGE_OPTIONS = [", "talenlijst"),
    ("id: 'en', label: 'English'", "English"),
    ("id: 'nl', label: 'Nederlands'", "Nederlands"),
    ("id: 'de', label: 'Deutsch'", "Deutsch"),
    ("id: 'fr', label: 'Français'", "Français"),
    ("id: 'es', label: 'Español'", "Español"),
    ("The sentence examples are Dutch and illustrate Dutch sentence word order.", "Nederlandse zinsnotitie EN"),
    ("De voorbeeldzinnen zijn Nederlands en tonen de Nederlandse woordvolgorde.", "Nederlandse zinsnotitie NL"),
    ("id=\"mainInterfaceMenu\"", "Interface-menu"),
    ("{ id: 'ft', label: 'Functional', labelEn: 'Functional' }", "Functional-view"),
]:
    source = index if marker.startswith("id=\"") else js
    require(source, marker, label)
for stale in ["data-language-toggle", ">NL/EN</button>", "Syntax/FT", "Syntax / FT", ">FT<"]:
    if stale in index:
        errors.append(f"oude zichtbare UI-term staat nog in index.html: {stale}")

# README/LEESMIJ with a user-resizable topic/text split.
for marker, label in [
    ("help-panel-resizer", "sleepbare README-scheidingslijn"),
    ("--help-nav-size", "verstelbare README-paneelmaat"),
    ("cursor: col-resize", "horizontale resize"),
    ("cursor: row-resize", "verticale resize"),
    ("body.help-screen-active .help-topic-stage", "scrollbaar tekstvlak"),
]:
    require(css, marker, label)
for marker, label in [
    ("function registerHelpPanelResizer()", "README-resizerlogica"),
    ("sessionStorage.setItem(storageKey", "sessiebehoud paneelmaat"),
    ("ArrowUp", "toetsenbordbediening"),
]:
    require(js, marker, label)
require(index, 'id="helpPanelResizer"', "README-resizer in HTML")
for marker in ['data-help-topic="opengraph"', 'data-help-topic="jan-todo"', 'data-help-topic="adverb-origins"']:
    require(index, marker, f"LEESMIJ-onderwerp {marker}")
require(js, "if (stage) stage.scrollTop = 0;", "README-item start bovenaan")

# Local portrait/landscape simulation must survive the later MAX rules and use
# the version of the loaded viewer instead of a historical hardcoded value.
require(
    css,
    "body.viewport-mobile-test.main-screen-active.main-window-max .app-shell",
    "MAX-veilige lokale viewportbegrenzing",
)
require(local_mobile, "window.__OPENGRAPH_EXPECTED_VERSION__", "actuele lokale viewportversie")
if "v2.0.0-rc.13" in local_mobile:
    errors.append("local-mobile-test.js bevat nog de oude hardgecodeerde rc.13")

# Landscape uses a lower/wider contain fit with non-overlapping menu, SVG and
# Play zones. The physical viewport remains authoritative under forced desktop.
for marker, label in [
    ("function isHandheldLandscapeViewport()", "landscape-handhelddetectie"),
    ("label: 'MAX mobiel landschap'", "lagere/bredere landscape-layout"),
    ("const svgRect = els.svg?.getBoundingClientRect?.();", "werkelijke SVG-aspectratio"),
]:
    require(js, marker, label)
for marker, label in [
    ("body.viewport-handheld-landscape.main-screen-active #graphSvg", "gereserveerde landscape-SVG-zone"),
    ("body.viewport-handheld-landscape.main-screen-active .main-play-reset-bar", "gereserveerde landscape-Play-zone"),
    ("body.viewport-handheld-landscape.main-screen-active.main-window-max .workspace", "schermvullende landscape-workspace"),
]:
    require(css, marker, label)


# First README item: two problem trees followed by two graphically motivated apparent solutions.
for marker, label in [
    ('traditional-tree-problem-too-wide.png', 'te brede probleemboom'),
    ('traditional-tree-problem-unreadable.png', 'onleesbare probleemboom'),
    ('traditional-tree-flexible-wide.png', 'brede grafische schijnoplossing'),
    ('traditional-tree-flexible-narrow.png', 'smalle grafische schijnoplossing'),
    ('data-readme-shape="wide"', 'brede carouselvorm'),
    ('data-readme-shape="narrow"', 'smalle carouselvorm'),
    ('MISSCHIEN WEL', 'lager geplaatst voorbeeldlabel'),
]:
    require(index, marker, label)
if index.count('data-readme-slide=""') != 4:
    errors.append('eerste README-item moet twee probleembomen en twee grafische schijnoplossingen bevatten')
if (ROOT / 'images/readme/traditional-sentence-tree-examples.svg').exists():
    errors.append('oude afbeelding met drie traditionele bomen bestaat nog')
require(js, "carousel.dataset.activeShape", 'vormafhankelijke README-carousel')
require(index, '<h3>Probleembomen</h3>', 'titel Probleembomen')
require(index, 'grafisch gemotiveerde schijnoplossing', 'schijnoplossingstekst')
require(index, 'syntactische structuur en lexicale woordvolgorde', 'eigenlijke probleemformulering')
require(index, 'Die aanpak volgt in het volgende item.', 'verwijzing naar OGN-item')

# OGN problem, JaN contract and placement-plan-first architecture.
ogn_markers = [
    "central branching under S = structural relations",
    "LEX projection           = linear sentence word order",
    "The same central structure can therefore support different surface strings",
    "S:np-VP", "S+ np-VP", "heeft gebeten", "gebeten heeft",
    "Placement plan before rendering",
    "The renderer does not choose new positions or reserve new space",
]
for marker in ogn_markers:
    if marker not in readme and marker not in leesmij and marker not in index:
        errors.append(f"OGN/JaN-documentatie mist {marker!r}")
for rel in ["PROJECT_STATE_CURRENT.md", "LAYOUT_RULES.md", "LINGUISTIC_ACTIONS.md", "DOCUMENTATION_RULES.md", "HANDOVER_FOR_COLLABORATORS.md"]:
    text = read(rel)
    for marker in ["S:np-VP", "LEX", "plaatsingsplan"]:
        if marker.lower() not in text.lower():
            errors.append(f"{rel} mist actuele OGN/JaN-contractterm {marker!r}")

# Config overview, explanatory help and unchanged save semantics.
for marker, label in [
    ("let activeConfigTab = 'preconfig';", "Config start op Voorconfig"),
    ("{ id: 'preconfig', nl: 'Voorconfig', en: 'Pre-config' }", "Config-voorconfigsectie"),
    ("{ id: 'features', nl: 'Toepassingen', en: 'Applications' }", "Config-toepassingensectie"),
    ("const INSERTION_AXIS_DEFINITIONS = Object.freeze({", "insertie per as"),
    ("insertionAxes: Object.freeze(['lex', 'log'])", "Bijwoorden vereist LEX + LOG"),
    ("defaultEnabled: false", "Bijwoorden standaard uit"),
    ("layoutDemand: Object.freeze({ lexContent: 'wide-insertion' })", "abstracte layout-demand"),
    ("{ id: 'jan', nl: 'JaN · TODO', en: 'JaN · TODO' }", "JaN-configsectie"),
    ("config-dashboard", "Config-overzichtskaarten"),
    ("const CONFIG_ITEM_HELP = {", "Config-uitleg per instelling"),
    ("Ja · bewaar config", "save-werkwijze Ja"),
    ("Nee · herstel laatst bewaarde config", "save-werkwijze Nee"),
]:
    source = js if marker not in {"Ja · bewaar config", "Nee · herstel laatst bewaarde config"} else index
    require(source, marker, label)

# rc.41: recursive intrinsic subtree measurement and complete handheld fit.
for marker, label in [
    ("const SUBTREE_MEASURE_POLICY = Object.freeze({", "centrale subtree-meetpolicy"),
    ("function measureSubtreeBoxes(layout, origin)", "recursieve subtree-meetpass"),
    ("data-measure-mode': 'recursive-content'", "meetdiagnose op subtree-box"),
    ("function activeLexRenderLeftReach()", "toepassingsgestuurde LEX-reikwijdte"),
    ("Math.max(eastAxisRight, syntaxRuleRight, functionalRuleRight)", "volledige SYNT-regelboxfit"),
]:
    require(js, marker, label)
for rel in [
    "RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md",
    "docs/RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md",
]:
    text = read(rel)
    for marker in [
        "layout-demand",
        "LOG-majors",
        "requiredWidth/requiredHeight",
        "structurele grid-envelop",
        "geen algemene constraint- of collision-solver",
    ]:
        require(text, marker, f"{rel} contractterm")
for marker, label in [
    ('data-help-topic="recursive-layout"', "ingebouwde README-uitleg over rc.41"),
    ("not yet a general collision or repacking solver", "Engelse begrenzing recursieve boxmeting"),
    ("nog geen algemene botsings- of herplaatsingssolver", "Nederlandse begrenzing recursieve boxmeting"),
]:
    require(index, marker, label)
for marker, label in [
    ("Datum: 2026-07-28", "datum handmatig akkoord"),
    ("Akkoord rc.41: ja", "vastgelegd handmatig akkoord"),
    ("Blokkerende herstelpunten: geen opgegeven", "resultaat handmatig akkoord"),
    ("Voorconfig en toepassingen", "controle voorconfig en toepassingen"),
    ("README en bediening", "controle README en bediening"),
]:
    require(read("RC41_RECURSIVE_LAYOUT_TEST.md"), marker, label)
if "Akkoord rc.41: ja / nee" in read("RC41_RECURSIVE_LAYOUT_TEST.md"):
    errors.append("RC41-akkoordlijst bevat nog de voorlopige keuze 'ja / nee'")
approval_markers = {
    "README.md": "manually approved by the user on 28 July",
    "docs/README.md": "manually approved by the user on 28 July",
    "LEESMIJ.md": "op 28 juli 2026 handmatig door de gebruiker",
    "docs/LEESMIJ.md": "op 28 juli 2026 handmatig door de gebruiker",
    "PROJECT_STATE_CURRENT.md": "op 28 juli 2026 handmatig door de gebruiker",
    "docs/PROJECT_STATE_CURRENT.md": "op 28 juli 2026 handmatig door de gebruiker",
    "HANDOVER_FOR_COLLABORATORS.md": "op 28 juli 2026 handmatig",
    "docs/HANDOVER_FOR_COLLABORATORS.md": "op 28 juli 2026 handmatig",
    "docs/RELEASE_NOTES.md": "op 28 juli 2026 handmatig door de gebruiker goedgekeurd",
    "docs/docs-home.html": "rc.41 is op 28 juli 2026 handmatig door de gebruiker goedgekeurd",
}
for rel, marker in approval_markers.items():
    require(read(rel), marker, f"{rel} vastgelegde rc.41-goedkeuring")
for rel in ["DOCUMENTATION_RULES.md", "docs/DOCUMENTATION_RULES.md"]:
    text = read(rel)
    for marker in [
        "Geïmplementeerd gedrag",
        "Automatische garantie",
        "Handmatig oordeel",
        "Vervolgvoorstel",
    ]:
        require(text, marker, f"{rel} verduidelijkingsregel")

# Explicit sentence landing metadata outranks a broad class default in auto mode.
for marker, label in [
    ("An explicit sentence-instance landing instruction outranks", "plaatsingsprioriteit commentaar"),
    ("const explicit = String(spec.logInterval || spec.logicalInterval || '').trim();", "expliciet LOG-interval"),
    ("linear.includes('post-object')", "post-object-positie"),
    ("return classIntervals[category] || classIntervals.DEFAULT || 'S-O';", "klassefallback"),
]:
    require(js, marker, label)

# rc.27 lexicon/profile work must remain intact.
for marker, label in [
    ('class="usage-profile"', "gebruiksprofielen"),
    ('class="lexicon-construction"', "meerwoordconstructies"),
    ('data-visible-slots="1"', "één zichtbaar constructieslot"),
]:
    require(lexicon, marker, label)
for marker, label in [
    ("function seedLexiconUsageFallbacks()", "lexiconprofiel-fallbacks"),
    ("function resolvedInsertionAnalysis(", "zinsinstantieanalyse"),
    ("function renderLexAmbiguityPrompt()", "gebruikersvraag"),
    ("normalizeInsertionOrigin(spec.origin) !== 'LEX'", "LOG/LEX-bronscheiding"),
    ("function activeLexPlacementSequence(", "gezamenlijk LEX-plaatsingsplan"),
]:
    require(js, marker, label)
for marker in ["data-analysis-status=\"ask\"", "data-origin=\"LOG+LEX\"", "data-usage-profile=\"frequency-event\""]:
    require(examples, marker, f"zinsinstantieprofiel {marker}")

# Origin mechanisms are explicitly documented and separated.
for rel in ["ADVERB_ORIGIN_MECHANISMS.md", "docs/ADVERB_ORIGIN_MECHANISMS.md", "LEXICON_USAGE_PROFILES_AND_DISAMBIGUATION.md"]:
    text = read(rel)
    for marker in ["origin=LOG", "origin=LEX", "LOG+LEX"]:
        if marker not in text:
            errors.append(f"{rel} mist bronmechanisme {marker}")

# Return navigation in standalone editors/config pages.
for rel in [
    "examples-editor.html", "lexicon-editor.html", "structure-editor.html", "structure-config.html",
    "examples-input.html", "examples-adverbs.html", "lexicon-config.html",
]:
    text = read(rel)
    if "Terug naar: Config" not in text or "Terug naar: Main" not in text:
        errors.append(f"{rel} mist consequente terugnavigatie")

# Local start: exact source version, mandatory reset and stale-server guard.
if (ROOT / "start-local-viewer.bat").exists():
    errors.append("verwarrende tweede start-BAT bestaat nog: start-local-viewer.bat")
if (ROOT / "startlocalviewer.bat").exists():
    errors.append("overbodige tweede start-BAT bestaat nog: startlocalviewer.bat")

for marker, label in [
    ('if not exist "VERSION.txt" goto :not_extracted', "controle op volledig uitpakken"),
    ('py.exe -3 start_local_viewer.py', "Python-launcher via py.exe"),
    ('python.exe start_local_viewer.py', "Python-launcher via python.exe"),
    ("Pak de gedownloade ZIP eerst volledig uit", "zichtbare uitpakinstructie"),
]:
    require(start_bat, marker, label)
if "Invoke-WebRequest" in start_bat:
    errors.append("start_local_viewer.bat gebruikt nog de foutgevoelige PowerShell-probe")
if "for /f" in start_bat.lower():
    errors.append("start_local_viewer.bat bevat nog complexe FOR-probelogica")
local_launcher = read("start_local_viewer.py")
for marker, label in [
    ("from server_nocache import probe_server_state", "gedeelde Python-probe"),
    ('creationflags"] = getattr(subprocess, "CREATE_NEW_CONSOLE", 0)', "zichtbaar Windows-servervenster"),
    ("/reset-cache.html?", "verplichte reset-cache-URL"),
    ("Sluit het oude venster", "diagnose verkeerde serverversie"),
]:
    require(local_launcher, marker, label)
for stale in ['v4537', 'v2.0.0-rc.24']:
    if stale in start_bat or stale in debug_html:
        errors.append(f"oude lokale startversie staat nog in actieve start/debugbestanden: {stale}")

# Publishing: checked commit/push and cache reset only once after a successful push.
for marker, label in [
    ("call check_release.bat", "releasecontrole vóór publiceren"),
    ("git commit -m", "commitstap"),
    ("git push -u origin", "pushstap"),
    ('if "%DID_PUSH%"=="1" call :open_reset_after_push', "reset alleen na succesvolle push"),
    (":open_reset_after_push", "veilige reset-subroutine"),
    ('start "" "%USER_RESET_URL%"', "browseropening met ingevulde reset-URL"),
    ("opengraph-reset-%APP_VERSION%.flag", "eenmalige resetmarker per versie"),
    ("pause", "zichtbare eindmelding"),
]:
    require(publish_bat, marker, label)
if re.search(
    r'if\s+"%DID_PUSH%"=="1"\s*\(\s*set\s+"USER_RESET_URL=',
    publish_bat,
    flags=re.I | re.S,
):
    errors.append("publish_checked.bat zet reset-URL nog in hetzelfde CMD-haakjesblok")
if re.search(r"\bgit\s+pull\b", publish_bat, flags=re.I):
    errors.append("publish_checked.bat mag geen git pull uitvoeren")

# Core runtime/storage/export contracts preserved from rc.27.
for marker, label in [
    ("function buildOpnDocument(", "OPN-export"),
    ("function applyOpnDocument(", "OPN-import"),
    ("schema: 'data-metadata-paradata'", "OPN metadata/data/paradata"),
    ("function logLexPlayPhases()", "LOG/ruimte/LEX-Play"),
    ("function downloadGraphSvg(", "SVG-export"),
    ("async function downloadGraphPng(", "LinkedIn-PNG"),
    ("async function recordPlayWebm(", "Play-video"),
    ("PLAY_VIDEO_FRAME_RATE = 30", "vaste 30 fps"),
]:
    require(js, marker, label)
if "state.projectionBlockUnlocked = maxStep > 0 && state.growthStep >= maxStep;" not in js:
    errors.append("Play-reverse/eindlaagcontract ontbreekt")

# Example inventory.
tbody = re.search(r"<tbody>(.*?)</tbody>", read("examples-adverbs.html"), flags=re.S)
if not tbody or len(re.findall(r"<tr\b", tbody.group(1))) != 25:
    errors.append("bijwoordtabel moet exact 25 voorbeelden bevatten")
if examples.count('class="example-input"') != 14:
    errors.append("voorbeeldset moet exact 14 zinnen bevatten")
for phrase in ["MISSCHIEN WEL", "VAAK", "GEBETEN HEEFT"]:
    if phrase not in examples and phrase not in js:
        errors.append(f"voorbeelddata mist {phrase}")

# JSON and OPN validation.
for path in list(ROOT.rglob("*.json")) + list(ROOT.rglob("*.opn")):
    try:
        doc = json.loads(path.read_text(encoding="utf-8"))
        if path.suffix.lower() == ".opn":
            if doc.get("document_type") != "opengraph-document":
                errors.append(f"ongeldig OPN-documenttype: {path.relative_to(ROOT)}")
            if doc.get("metadata", {}).get("schema") != "data-metadata-paradata":
                errors.append(f"OPN-scheiding ontbreekt: {path.relative_to(ROOT)}")
    except Exception as exc:
        errors.append(f"ongeldige JSON/OPN {path.relative_to(ROOT)}: {exc}")

# Local HTML links.
attr = re.compile(r'(?:href|src)=["\']([^"\'#?]+)')
for path in ROOT.rglob("*.html"):
    for target in attr.findall(path.read_text(encoding="utf-8", errors="ignore")):
        if target.startswith(("http:", "https:", "mailto:", "data:", "javascript:", "/")):
            continue
        resolved = (path.parent / target).resolve()
        try:
            resolved.relative_to(ROOT.resolve())
        except ValueError:
            continue
        if not resolved.exists():
            errors.append(f"gebroken link {path.relative_to(ROOT)} -> {target}")

# Exact release manifest. .git, caches, generated archives/logs and the manifest
# itself are never product-source entries.
GENERATED_RELEASE_ARCHIVE_RE = re.compile(
    r".+_full_source.*\.zip(?:\.sha256)?$",
    flags=re.I,
)


def is_generated_release_archive(name: str) -> bool:
    """Recognise normal, renamed-download and temporary full-source archives."""
    return bool(GENERATED_RELEASE_ARCHIVE_RE.fullmatch(name))


# Browser downloads can add " (1)" before .zip. That local copy must behave
# exactly like the canonical release archive and never become product source.
for generated_name in [
    "OpenGraph_Lite_Viewer_v2.0.0-rc.41_full_source.zip",
    "OpenGraph_Lite_Viewer_v2.0.0-rc.41_full_source (1).zip",
    "graphlite_full_source.zip",
    "graphlite_full_source.tmp.12345.zip",
    "graphlite_full_source.zip.sha256",
]:
    if not is_generated_release_archive(generated_name):
        errors.append(f"release-archieffilter herkent niet: {generated_name}")


def manifest_file(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    parts = rel.parts
    if ".git" in parts or "__pycache__" in parts:
        return False
    name = path.name
    lower = name.lower()
    if name == "RELEASE_MANIFEST.txt" or lower.endswith((".pyc", ".pyo", ".ds_store")):
        return False
    if is_generated_release_archive(name):
        return False
    if re.fullmatch(r"(?:opengraph-)?local-config-log.*\.txt", name, flags=re.I):
        return False
    return path.is_file()

actual_manifest = sorted(path.relative_to(ROOT).as_posix() for path in ROOT.rglob("*") if manifest_file(path))
manifest_path = ROOT / "RELEASE_MANIFEST.txt"
manifest_entries = []
if not manifest_path.is_file():
    errors.append("RELEASE_MANIFEST.txt ontbreekt")
else:
    manifest_entries = sorted(line.strip().replace("\\", "/") for line in manifest_path.read_text(encoding="utf-8").splitlines() if line.strip())
    forbidden = [item for item in manifest_entries if item == ".git" or item.startswith(".git/")]
    if forbidden:
        errors.append("manifest bevat interne .git-bestanden")
    missing = sorted(set(actual_manifest) - set(manifest_entries))
    extra = sorted(set(manifest_entries) - set(actual_manifest))
    if missing:
        errors.append("manifest mist: " + ", ".join(missing[:12]) + (" …" if len(missing) > 12 else ""))
    if extra:
        errors.append("manifest bevat niet-bestaand: " + ", ".join(extra[:12]) + (" …" if len(extra) > 12 else ""))

if errors:
    print("RELEASE CHECK: FOUT")
    for error in errors:
        print("-", error)
    sys.exit(1)

print(f"RELEASE CHECK: OK ({VERSION})")
