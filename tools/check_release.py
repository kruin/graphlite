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
    "LEXICON_USAGE_PROFILE_TEST.md", "SOURCE_CHANGES_V2.0.0-rc.37.md",
    "RC35_README_LAYOUT_TEST.md", "RC36_BASE_PROFILE_TEST.md", "RC37_PRECONFIG_TEST.md",
    "OPN_STORAGE_FORMAT.md", "PRECONFIG_ARCHITECTURE.md", "projectie-master-spec.md",
    "docs/ADVERB_ORIGIN_MECHANISMS.md", "docs/OGN_BASE_PROFILE.md", "docs/PRECONFIG_ARCHITECTURE.md",
    "docs/LAYOUT_SPEC.md", "docs/RENDER_EXPLANATION.md",
    "docs/RENDER_EXPLANATION_EN.md", "docs/TALIGE_UITBREIDINGEN.md", "docs/SOCIAL_EXPORT.md",
    "images/readme/traditional-tree-problem-too-wide.png", "images/readme/traditional-tree-problem-unreadable.png",
    "images/readme/traditional-tree-flexible-wide.png", "images/readme/traditional-tree-flexible-narrow.png", "manifest.webmanifest",
    "maak-volledige-zip.bat", "start_local_viewer.bat", "check_release.bat", "publish_checked.bat",
    "tools/check_release.py", "tools/check_config_tabs_and_menus.py",
    "tools/check_examples_roundtrip.py", "tools/check_log_slot_distance.py",
    "tools/check_lex_horizontal_projection.py", "tools/check_projection_cleanup.py",
    "tools/check_desktop_max_view.py", "tools/check_social_and_linguistic_export.py",
    "tools/check_linkedin_video_export.py", "tools/check_linkedin_video_runtime.js",
    "tools/check_play_reverse.py", "tools/check_release_zip_batch.py",
    "tools/check_opn_storage.py", "tools/check_lexicon_usage_profiles.py",
    "tools/check_feature_profiles.py", "tools/check_feature_profiles_runtime.js",
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

# Version identity and the paired entry pages.
if not VERSION or VERSION != "v2.0.0-rc.37":
    errors.append(f"VERSION.txt moet v2.0.0-rc.37 bevatten, gevonden: {VERSION!r}")
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
    ("{ id: 'jan', nl: 'JaN · TODO', en: 'JaN · TODO' }", "JaN-configsectie"),
    ("config-dashboard", "Config-overzichtskaarten"),
    ("const CONFIG_ITEM_HELP = {", "Config-uitleg per instelling"),
    ("Ja · bewaar config", "save-werkwijze Ja"),
    ("Nee · herstel laatst bewaarde config", "save-werkwijze Nee"),
]:
    source = js if marker not in {"Ja · bewaar config", "Nee · herstel laatst bewaarde config"} else index
    require(source, marker, label)

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

for marker, label in [
    ('set /p OG_APP_VERSION=<"VERSION.txt"', "lokale versie uit VERSION.txt"),
    ('VERSION.txt?nocache=', "serverversiecontrole"),
    ('reset-cache.html?ogv=', "verplichte reset-cache-start"),
    ('nocache=!OG_NONCE!', "unieke lokale cache-bust"),
    ('OG_PROBE_STATE', "controle op oude server"),
    ('Bronmap    : %CD%', "zichtbare bronmap"),
]:
    require(start_bat, marker, label)
for stale in ['v4537', 'v2.0.0-rc.24']:
    if stale in start_bat or stale in debug_html:
        errors.append(f"oude lokale startversie staat nog in actieve start/debugbestanden: {stale}")

# Publishing: checked commit/push and cache reset only once after a successful push.
for marker, label in [
    ("call check_release.bat", "releasecontrole vóór publiceren"),
    ("git commit -m", "commitstap"),
    ("git push -u origin", "pushstap"),
    ("if \"%DID_PUSH%\"==\"1\"", "reset alleen na succesvolle push"),
    ("opengraph-reset-%APP_VERSION%.flag", "eenmalige resetmarker per versie"),
    ("pause", "zichtbare eindmelding"),
]:
    require(publish_bat, marker, label)
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
def manifest_file(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    parts = rel.parts
    if ".git" in parts or "__pycache__" in parts:
        return False
    name = path.name
    lower = name.lower()
    if name == "RELEASE_MANIFEST.txt" or lower.endswith((".pyc", ".pyo", ".ds_store")):
        return False
    if re.fullmatch(r"OpenGraph_Lite_Viewer_v.*_full_source\.zip(?:\.sha256)?", name, flags=re.I):
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
