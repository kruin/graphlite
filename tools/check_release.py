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
    ".editorconfig", ".gitattributes", ".gitignore",
    "structure-config.html", "structure-editor.html", "examples-input.html", "examples-editor.html",
    "examples-adverbs.html", "lexicon-config.html", "lexicon-editor.html", ".nojekyll",
    "README.md", "LEESMIJ.md", "PROJECT_STATE_CURRENT.md", "LAYOUT_RULES.md",
    "LINGUISTIC_ACTIONS.md", "DOCUMENTATION_RULES.md", "HANDOVER_FOR_COLLABORATORS.md",
    "ADVERB_ORIGIN_MECHANISMS.md", "LEXICON_USAGE_PROFILES_AND_DISAMBIGUATION.md",
    "LEXICON_USAGE_PROFILE_TEST.md", "SOURCE_CHANGES_V2.0.0-rc.38.md",
    "SOURCE_CHANGES_V2.0.0-rc.39.md", "SOURCE_CHANGES_V2.0.0-rc.40.md",
    "SOURCE_CHANGES_V2.0.0-rc.41.md", "SOURCE_CHANGES_V2.0.0-rc.42.md",
    "SOURCE_CHANGES_V2.0.0-rc.43.md", "SOURCE_CHANGES_V2.0.0-rc.44.md",
    "SOURCE_CHANGES_V2.0.0-rc.45.md",
    "MULTI_OGN_ANAPHOR.md", "multi-ogn-composition-engine.js", "utterance-kernel-engine.js",
    "UITING_EN_KERNZINNEN.md", "docs/UITING_EN_KERNZINNEN.md",
    "samples/uitingen-kernzinnen.v1.json", "tools/check_utterances.js",
    "tools/check_utterance_kernel_views.js",
    "samples/ik-zie-man-hij-draagt-hoed.multi-ogn.v1.opn",
    "PUBLICATIE_README.md", "RC44_PUBLICATION_CAROUSEL_TEST.md",
    "RC45_OGN_CORE_EXPLANATION_TEST.md", "GREEDY_GROW_RECONSTRUCTION.md",
    "greedy-grow.html", "greedy-grow.css", "greedy-grow-engine.js", "greedy-grow.js",
    "RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md", "OGN_CORE_PLACEMENT_ARCHITECTURE.md",
    "LINE_STYLE_AND_PLACEMENT_MODES.md", "RC45_LINE_STYLE_DIRECT_MODES_TEST.md",
    "DIRECT_PLACEMENT_CONFIG.md", "CONFIG_UI_EXPLANATION_STANDARD.md", "RC45_DIRECT_PLACEMENT_CONFIG_TEST.md",
    "RC35_README_LAYOUT_TEST.md", "RC36_BASE_PROFILE_TEST.md", "RC37_PRECONFIG_TEST.md",
    "RC38_MOBILE_LAYOUT_TEST.md", "RC39_VIEWPORT_SWITCH_TEST.md",
    "RC40_LANDSCAPE_COMPOSITION_TEST.md", "RC41_RECURSIVE_LAYOUT_TEST.md",
    "RC42_RESERVED_APPLICATIONS_TEST.md", "RC42_README_CAROUSEL_EDITOR_TEST.md",
    "RC43_CONFIG_README_PROJECT_TEST.md",
    "OPN_STORAGE_FORMAT.md", "PRECONFIG_ARCHITECTURE.md", "projectie-master-spec.md",
    "config/default-config.json", "config/user-config.json", "config/README.md",
    "docs/ADVERB_ORIGIN_MECHANISMS.md", "docs/OGN_BASE_PROFILE.md",
    "docs/GREEDY_GROW_RECONSTRUCTION.md",
    "docs/OGN_CORE_PLACEMENT_ARCHITECTURE.md", "docs/LINE_STYLE_AND_PLACEMENT_MODES.md",
    "docs/DIRECT_PLACEMENT_CONFIG.md", "docs/CONFIG_UI_EXPLANATION_STANDARD.md",
    "docs/MULTI_OGN_ANAPHOR.md",
    "docs/PRECONFIG_ARCHITECTURE.md",
    "docs/LAYOUT_SPEC.md", "docs/RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md", "docs/RENDER_EXPLANATION.md",
    "docs/RENDER_EXPLANATION_EN.md", "docs/TALIGE_UITBREIDINGEN.md", "docs/SOCIAL_EXPORT.md",
    "images/readme/traditional-tree-problem-too-wide.png", "images/readme/traditional-tree-problem-unreadable.png",
    "images/readme/traditional-tree-flexible-wide.png", "images/readme/traditional-tree-flexible-narrow.png", "manifest.webmanifest",
    "images/readme/ogn-free-grid.svg", "images/readme/ogn-sequential-write.svg",
    "images/readme/ogn-placement-strategies.svg", "images/readme/ogn-three-layers.svg",
    "maak-publicatie-carrousel.bat", "installeer-carrousel-tools.bat", "maak-volledige-zip.bat",
    "package.json", "package-lock.json",
    "start_local_viewer.bat", "start_local_viewer.py",
    "check_release.bat", "publish_checked.bat",
    "tools/check_release.py", "tools/normalize_text_files.py", "tools/check_text_normalization.py",
    "tools/check_local_start.py", "tools/check_config_tabs_and_menus.py",
    "tools/check_examples_roundtrip.py", "tools/check_log_slot_distance.py",
    "tools/check_lex_horizontal_projection.py", "tools/check_projection_cleanup.py",
    "tools/check_desktop_max_view.py", "tools/check_social_and_linguistic_export.py",
    "tools/check_linkedin_video_export.py", "tools/check_linkedin_video_runtime.js",
    "tools/check_play_reverse.py", "tools/check_release_zip_batch.py",
    "tools/check_opn_storage.py", "tools/check_lexicon_usage_profiles.py",
    "tools/check_feature_profiles.py", "tools/check_feature_profiles_runtime.js",
    "tools/check_readme_carousel_editor.py", "tools/check_readme_carousel_editor_runtime.js",
    "tools/check_readme_item_editor.py", "tools/check_readme_item_editor_runtime.js",
    "tools/check_project_config_layers.py", "tools/check_project_config_layers_runtime.js",
    "random-placement-engine.js", "tools/check_greedy_grow_reconstruction.js",
    "tools/check_random_placement.js", "tools/check_line_style_and_direct_modes.py",
    "tools/check_direct_placement_config.py",
    "tools/check_multi_ogn_anaphor.js", "tools/check_multi_ogn_anaphor_runtime.js",
    "tools/check_node_grid_invariant.py", "tools/check_lex_open_slots.js",
    "tools/check_mobile_layout_rc38.py", "tools/check_mobile_layout_runtime.js",
    "tools/check_viewport_switch_runtime.js", "tools/check_landscape_composition_runtime.js",
    "tools/check_recursive_box_fit_runtime.js",
    "tools/check_publication_carousel.py", "tools/check_publication_carousel_setup.py",
    "tools/check_publication_carousel_tooling.js", "tools/export_publication_carousel.js",
    "tools/build_publication_carousel_zip.py",
    "publicatie-carrousel/index.html", "publicatie-carrousel/derived-manifest.json",
    "publicatie-carrousel/slides/01-every-node-owns-grid-lines.png",
    "publicatie-carrousel/slides/02-free-places-first.png",
    "publicatie-carrousel/slides/03-one-node-at-a-time.png",
    "publicatie-carrousel/slides/04-node-projection-west-south-east.png",
    "publicatie-carrousel/slides/05-direct-placement-greedy-grow.png",
    "publicatie-carrousel/slides/06-calculated-placement-language-tree.png",
    "publicatie-carrousel/slides/07-core-first-examples-follow.png",
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
attributes = read(".gitattributes")
start_bat = read("start_local_viewer.bat")
debug_html = read("debug.html")
local_mobile = read("local-mobile-test.js")
server = read("server_nocache.py")
publication_readme = read("PUBLICATIE_README.md")

# Deterministic Git/worktree line endings and exactly one terminal EOL.
for marker, label in [
    (".gitignore text eol=lf", "Gitignore-LF-beleid"),
    ("*.py text eol=lf", "Python-LF-beleid"),
    ("*.bat text eol=crlf", "Windows-BAT-CRLF-beleid"),
    ("*.png binary", "binaire PNG-afbakening"),
]:
    require(attributes, marker, label)
require(publish_bat, "normalize_text_files.py --write", "automatische publicatienormalisatie")
require(publish_bat, "git add --renormalize -- .", "Git-renormalisatie vóór commit")
require(read("check_release.bat"), "normalize_text_files.py", "tekstnormalisatie in releasecheck")
require(read("check_release.bat"), "check_text_normalization.py", "EOF/EOL-regressie in releasecheck")
editor_config = read(".editorconfig")
require(editor_config, "insert_final_newline = true", "editor-finale-EOL-beleid")
require(editor_config, "[*.{bat,cmd,ps1}]", "editor-Windows-scriptbeleid")

# Version identity and the paired entry pages.
if not VERSION or VERSION != "v2.0.0-rc.45":
    errors.append(f"VERSION.txt moet v2.0.0-rc.45 bevatten, gevonden: {VERSION!r}")
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
require(js, "stage.scrollTop = 0;", "README-item start bovenaan")
for marker, label in [
    ('href="greedy-grow.html"', "ingebouwde Greedy Grow-link"),
    ("Greedy Grow · geaccepteerde reconstructie", "Nederlandse Greedy-status"),
    ("Greedy Grow · accepted reconstruction", "Engelse Greedy-status"),
]:
    require(index, marker, label)
for rel, marker in [
    ("greedy-grow.html", "+1 · plaats direct"),
    ("greedy-grow-engine.js", "future_plan_stored: false"),
    ("GREEDY_GROW_RECONSTRUCTION.md", "samples/no_limit_96_demo.json"),
]:
    require(read(rel), marker, f"Greedy Grow-reconstructie {rel}")
require(read("check_release.bat"), "check_greedy_grow_reconstruction.js", "Greedy-regressie in releaseflow")
require(read("check_release.bat"), "check_random_placement.js", "Random-regressie in releaseflow")
require(read("check_release.bat"), "check_direct_placement_config.py", "directe Config-regressie in releaseflow")
require(read("check_release.bat"), "check_multi_ogn_anaphor.js", "multi-OGN-regressie in releaseflow")
runtime_multi_ogn = read("tools/check_multi_ogn_anaphor_runtime.js")
for marker, label in [
    ("await page.click('#mainViewSummary');", "browsertest opent eerst het hoofdmenu"),
    ("#mainViewMenu[open] [data-placement-mode=\"multi-ogn-anaphor\"]", "browsertest kiest zichtbare modus"),
    (":scope > .node-shape-layer > .node-shape[data-node-id]", "browsertest gebruikt actuele knooplaag"),
    ('[data-config-scope-button="general"]', "browsertest opent algemene config voor export"),
    ('[data-config-tab-button="files"]', "browsertest opent zichtbare bestandentab voor export"),
    ("#configDownloadOpnButton", "browsertest gebruikt zichtbare OPN-knop"),
    ("path.resolve(os.tmpdir()", "runtime-screenshot buiten Git-projectmap"),
]:
    require(runtime_multi_ogn, marker, label)

for marker, label in [
    ('data-placement-mode="multi-ogn-anaphor"', "multi-OGN-keuze in Main"),
    ('data-help-topic="multi-ogn-anaphor"', "multi-OGN-Help"),
    ("multi-ogn-composition-engine.js", "multi-OGN-engine geladen"),
]:
    require(index, marker, label)
for marker, label in [
    ("function drawMultiOgnAnaphor()", "multi-OGN-renderer"),
    ("function buildMultiOgnOpnDocument(", "multi-OGN-OPN-export"),
    ("function validateImportedMultiOgnComposition(", "multi-OGN-importvalidatie"),
    ("'data-directed': 'false'", "ongerichte coreferentie"),
]:
    require(js, marker, label)

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


# First README item: OGN Core before every specialized application.
intro_match = re.search(
    r'<article class="help-topic-panel readme-intro-panel is-active" '
    r'data-help-topic="readme">(.*?)</article>',
    index,
    flags=re.S,
)
intro = intro_match.group(1) if intro_match else ""
if not intro_match:
    errors.append("actief README-startitem ontbreekt")
for marker, label in [
    ("Open Graph Notation begint met vrije plaatsing", "Nederlandse OGN-kernstart"),
    ("Open Graph Notation starts with free placement", "Engelse OGN-kernstart"),
    ("ogn-free-grid.svg", "beeld vrije gridplaatsen"),
    ("ogn-sequential-write.svg", "beeld sequentieel schrijven"),
    ("ogn-placement-strategies.svg", "beeld zoekvolgorden"),
    ("ogn-three-layers.svg", "beeld drie OGN-lagen"),
    ("Every node owns its horizontal and vertical grid line", "gridbezit"),
    ("zoekstrategie", "Nederlandse zoekstrategie in de OGN-kern"),
    ("search strategy", "Engelse zoekstrategie in de OGN-kern"),
    ("1 · OGN Free Placement", "vrije plaatsing als eerste laag"),
    ("2 · OGN Projection", "projectie als tweede laag"),
    ("3 · OGN Calculated Placement", "berekende plaatsing als derde laag"),
]:
    require(intro, marker, label)
if "traditional-tree-" in intro:
    errors.append("eerste README-item mag niet met traditionele taalbomen beginnen")
for forbidden in ["Two-Pass Language Tree", "LEX", "SYNT", "LOG", "Random Placement"]:
    if re.search(rf"\b{re.escape(forbidden)}\b", intro, flags=re.I):
        errors.append(f"eerste README-item loopt vooruit op niet-geïntroduceerde context: {forbidden!r}")
if intro.count('data-readme-slide=""') != 4:
    errors.append("eerste README-item moet exact vier OGN-kernbeelden bevatten")
if (ROOT / 'images/readme/traditional-sentence-tree-examples.svg').exists():
    errors.append('oude afbeelding met drie traditionele bomen bestaat nog')
require(js, "carousel.dataset.activeShape", 'vormafhankelijke README-carousel')

# OGN Core, JaN contract and placement-plan-first architecture.
ogn_markers = [
    "current occupancy",
    "free positions",
    "search strategy",
    "OGN Free Placement",
    "OGN Projection",
    "OGN Calculated Placement",
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
for rel in [
    "OGN_CORE_PLACEMENT_ARCHITECTURE.md",
    "docs/OGN_CORE_PLACEMENT_ARCHITECTURE.md",
]:
    text = read(rel)
    for marker in [
        "OGN Free Placement",
        "OGN Projection",
        "OGN Calculated Placement",
        "horizontale en verticale gridlijn",
        "Greedy Grow",
        "zoekstrategie",
        "centrale gridpunt",
        "omtrekkende beweging",
        "tie-breaks",
        "Two-Pass Language Tree",
        "Greedy Grow hoort hier niet onder",
        "A ≠ B  ⇒  x(A) ≠ x(B)  én  y(A) ≠ y(B)",
        "twee verschillende knopen mogen nooit dezelfde verticale",
        "fallbackknoop",
        "gridlijnhergebruik",
    ]:
        require(text, marker, f"{rel} OGN-kerncontract")
for rel in [
    "README.md", "LEESMIJ.md", "docs/README.md", "docs/LEESMIJ.md",
    "LAYOUT_RULES.md", "docs/LAYOUT_SPEC.md",
    "RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md",
    "docs/RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md",
    "PUBLICATIE_README.md", "SOURCE_BASE.md",
]:
    text = read(rel)
    if "A ≠ B" not in text or "x(A) ≠ x(B)" not in text or "y(A) ≠ y(B)" not in text:
        errors.append(f"{rel} mist de leesbare harde A-ongelijk-B-invariant")
for rel in ["index.html", "viewer.html"]:
    text = read(rel)
    for marker in ["Harde regel — A ≠ B", "Hard rule — A ≠ B", "geen fallbackknoop", "no fallback node"]:
        require(text, marker, f"{rel} ingebedde OGN-invariant")
require(
    read("images/readme/ogn-free-grid.svg"),
    "Three nodes occupy separate horizontal and vertical grid lines.",
    "README-gridvoorbeeld met afzonderlijke lijnen",
)
for marker, label in [
    ("function nodeGridLineConflicts(layout)", "centrale OGN-gridconflictdetectie"),
    ("function assertUniqueNodeGridLines(layout", "harde OGN-gridinvariant"),
    ("A != B vereist x(A) != x(B) en y(A) != y(B)", "leesbare A-ongelijk-B-foutmelding"),
    ("assertUniqueNodeGridLines(layout, 'renderlaag')", "renderlaag faalt gesloten"),
    ("assertUniqueNodeGridLines(layout, `OPN-export ${view}`)", "OPN-exportvalidatie"),
]:
    require(js, marker, label)
require(read("check_release.bat"), "check_node_grid_invariant.py", "statische knoopgridcontrole in releaseflow")
require(read("check_release.bat"), "check_lex_open_slots.js", "actief LEX-profiel in releaseflow")
for rel in ["LEX_MOVEMENT_RULES.md", "docs/LEX_MOVEMENT_RULES.md"]:
    lex_contract = read(rel)
    for marker in [
        "Het actieve LEX-profiel bevat voorlopig precies drie mechanismen",
        "Bronhoogte is de enige richtingsreferentie",
        "Generieke lege posities",
        "Zinsoort stuurt de clausale regel",
        "Vraagzin · ja/nee",
        "Heavy NP Shift",
        "morfologische Lowering",
    ]:
        require(lex_contract, marker, f"{rel} volledig LEX-gebruikerscontract")
for rel in ["index.html", "viewer.html"]:
    help_source = read(rel)
    for marker in [
        'data-help-topic="lex-free-positions"',
        'data-help-topic="lex-movement-direction"',
        'data-help-topic="sentence-types"',
        "Generieke vrije plekken vóór, na of tussen",
        "Wissels omlaag zijn no-show",
        "Vraagzin · ja/nee",
    ]:
        require(help_source, marker, f"{rel} LEX-Help en Config-uitleg")
for marker, label in [
    ("const DEFERRED_LEX_OPEN_SLOT_PLACEMENTS", "uitgestelde vóór/na/tussen-voorraad"),
    ("return targetY < sourceY ? targetY : sourceY", "harde upward-grens vanaf bronhoogte"),
    ("const SENTENCE_TYPES = Object.freeze([", "centrale zinsoortcatalogus"),
    ("sentence_type: sentenceTypeForExample(ex)", "zinsoort in OPN-export"),
]:
    require(js, marker, label)
if 'id="lexOpenSlotCountSelect"' in index or 'id="lexOpenSlotPlacementSelect"' in index:
    errors.append("generieke vóór/na/tussen-bediening is nog zichtbaar in Config")
deferred_placement_terms = [
    "inter" + "section",
    "kruis" + "punt",
    "kruis" + "ing",
    "dia" + "gonal",
    "diag" + "onaal",
]
for path in ROOT.rglob("*"):
    if (
        not path.is_file()
        or ".git" in path.parts
        or "__pycache__" in path.parts
        or "node_modules" in path.parts
    ):
        continue
    if path.suffix.lower() not in {".css", ".html", ".js", ".json", ".md", ".py", ".svg", ".txt"}:
        continue
    rel = path.relative_to(ROOT).as_posix()
    text = path.read_text(encoding="utf-8", errors="ignore")
    for term in deferred_placement_terms:
        if re.search(rf"\b{re.escape(term)}", text, flags=re.I):
            errors.append(f"{rel} loopt vooruit op een uitgesteld plaatsingsonderwerp")

# Config overview, explanatory help and unchanged save semantics.
for marker, label in [
    ("let activeConfigTab = 'general-ui';", "Config start op Algemeen"),
    ("{ id: 'preconfig', nl: 'Voorconfig', en: 'Pre-config' }", "Config-voorconfigsectie"),
    ("{ id: 'features', nl: 'Uitbreidingen', en: 'Extensions' }", "Language-Tree-uitbreidingen"),
    ("general: Object.freeze(['general-ui', 'readme-carousels', 'overview', 'files'])", "toepassingsvrije algemene Config"),
    ("'language-tree': Object.freeze(['preconfig', 'features', 'view', 'log-lex', 'examples', 'jan', 'advanced'])", "afzonderlijke Language-Tree-Config"),
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

# rc.43: complete README-topic editing, one save bar and layered project Config.
for marker, label in [
    ("readmeTopicEdits: {}", "LEESMIJ-itemoverschrijvingen"),
    ("function sanitizeReadmeTopicHtml(", "veilige LEESMIJ-HTML"),
    ('id="readmeTopicVisibilitySelect"', "LEESMIJ Tonen ja/nee"),
    ('id="readmeTopicLabelNlInput"', "LEESMIJ-navigatietitel NL"),
    ('id="readmeTopicLabelEnInput"', "LEESMIJ-navigatietitel EN"),
    ('id="readmeTopicHtmlNlInput"', "LEESMIJ-itemtekst NL"),
    ('id="readmeTopicHtmlEnInput"', "LEESMIJ-itemtekst EN"),
    ("function insertReadmeSlideFile()", "lokale afbeelding naar LEESMIJ-slide"),
    ("MAX_README_EMBEDDED_IMAGE_BYTES = 1250000", "LEESMIJ-bestandslimiet"),
    ("config-global-save-card", "globale Config-savekaart"),
    ("sidePanel.replaceChildren(scopeNav, tabList, saveSlot, ...panels.values())", "Config-save op ieder tabblad en toepassingscontext"),
    ("PROJECT_DEFAULT_CONFIG_PATH = 'config/default-config.json'", "project-standaardconfig"),
    ("PROJECT_USER_CONFIG_PATH = 'config/user-config.json'", "project-user-config"),
    ("function mergeProjectConfigSnapshots(", "projectconfig-overschrijving"),
    ("mergeProjectConfigSnapshots(merged || {}, userSnapshot)", "user-config na standaardconfig"),
    ("projectConfigStatus.browserLoaded = loadSavedConfigSnapshot()", "browser-Config als laatste laag"),
    ("filename: PROJECT_USER_CONFIG_PATH", "exact schrijfdoel user-config"),
]:
    require(js, marker, label)
for marker, label in [
    (".readme-topic-fields", "LEESMIJ-itemvelden"),
    (".readme-slide-file-grid", "LEESMIJ-bestandsinvoer"),
    (".config-global-save-card", "globale Config-savevormgeving"),
    (".project-config-precedence", "projectconfigvormgeving"),
]:
    require(css, marker, label)
for marker, label in [
    ("'config/user-config.json': ROOT / 'config' / 'user-config.json'", "lokale allowlist user-config"),
    ("document.get('version') != APP_VERSION", "lokale user-configversievalidatie"),
    ("document.get('enabled') is not True", "lokale actieve user-configvalidatie"),
]:
    require(server, marker, label)

project_config_documents = {}
for rel, kind in [
    ("config/default-config.json", "default"),
    ("config/user-config.json", "user"),
]:
    try:
        document = json.loads(read(rel))
        project_config_documents[rel] = document
    except Exception as exc:
        errors.append(f"ongeldige projectconfig {rel}: {exc}")
        continue
    if document.get("schema") != "opengraph-project-config":
        errors.append(f"{rel} mist schema opengraph-project-config")
    if document.get("version") != VERSION:
        errors.append(f"{rel} versie wijkt af van VERSION.txt")
    if document.get("kind") != kind:
        errors.append(f"{rel} kind moet {kind!r} zijn")
    if not isinstance(document.get("enabled"), bool):
        errors.append(f"{rel} enabled moet true of false zijn")
    if not isinstance(document.get("config"), dict):
        errors.append(f"{rel} mist config-object")
if project_config_documents.get("config/default-config.json", {}).get("enabled") is not True:
    errors.append("config/default-config.json moet actief zijn")
user_config = project_config_documents.get("config/user-config.json", {})
if user_config.get("enabled") is False and user_config.get("config") != {}:
    errors.append("uitgeschakelde config/user-config.json moet een lege placeholder zijn")

for marker, label in [
    ("default-config.json", "standaardconfig-uitleg"),
    ("user-config.json", "user-config-uitleg"),
    ("ingebouwde code-defaults", "volledige config-laadvolgorde"),
    ("lokaal bewaarde browser-Config", "browser-Config als laatste laag"),
]:
    require(read("config/README.md"), marker, label)
for marker, label in [
    ("## Direct plaatsbare carrousel", "direct plaatsbare publicatiecarrousel"),
    ("## Plaatsen op Reddit", "Reddit-gallerywerkwijze"),
    ("## Alt-teksten per slide", "alt-tekst per publicatieslide"),
    ("1080 × 1080", "publicatieslide-afmetingen"),
    ("publicatie-carrousel/index.html", "bewerkbare publicatiebron"),
    ("publicatie-carrousel/derived-manifest.json", "afleidingsmanifest"),
    ("maak-publicatie-carrousel.bat", "volledige carrouselafleiding"),
    ("installeer-carrousel-tools.bat", "eenmalige Windows-installatie"),
    ("Node.js 18 of hoger", "ondersteunde lokale Node-versie"),
    ("Alleen publiceren", "werkwijze zonder lokale herbouw"),
    ("maak-volledige-zip.bat", "carrousel terug in volledige projectzip"),
    ("## LinkedIn · Nederlands", "LinkedIn-publicatietekst"),
    ("## Reddit", "Reddit-publicatietekst"),
    ("## Facebook", "Facebook-publicatietekst"),
    ("## YouTube", "YouTube-publicatietekst"),
    ("## Bluesky / Mastodon / X", "korte social-publicatietekst"),
    ("## GitHub-releasebeschrijving", "GitHub-releasebeschrijving"),
    ("https://kruin.github.io/graphlite/", "ingevulde live-URL"),
    ("https://github.com/kruin/graphlite", "GitHub bij beide voorbeelden"),
    ("v2.0.0-rc.45", "versiegebonden publicatietekst"),
    ("directe plaatsing", "directe OGN-plaatsing in platformteksten"),
    ("Greedy Grow", "Greedy Grow-publicatieuitleg"),
    ("geaccepteerde reconstructie", "geaccepteerde Greedy-specificatie"),
    ("12/31/96-demo's", "exacte bewaarde Greedy-demo's"),
    ("Slide 5", "Greedy-carrouselafleiding op slide 5"),
    ("zoekstrategie", "zoekstrategie in platformteksten"),
    ("geen bewezen wereldwijd optimum", "begrensde Greedy-optimaliteitsclaim"),
    ("Direct — Greedy Grow", "direct voorbeeld zonder soortuitleg"),
    ("Calculated — Language Tree", "berekend Language Tree-voorbeeld"),
    ("HOND BIJT MAN", "voorbeeldzin op berekende slide"),
    ("LEX-as", "verplaatste woorden op LEX-as"),
]:
    require(publication_readme, marker, label)
for marker, label in [
    ('href="publicatie-carrousel/index.html"', "ingebouwde link naar publicatiecarrousel"),
    ("zeven kant-en-klare vierkante PNG-slides", "ingebouwde Nederlandse publicatie-uitleg"),
    ("seven ready-to-upload square PNG slides", "ingebouwde Engelse publicatie-uitleg"),
    ("rc.45 is op 2 augustus 2026 handmatig goedgekeurd", "actueel Nederlands akkoord"),
    ("rc.45 was manually approved on 2 August 2026", "actueel Engels akkoord"),
]:
    require(index, marker, label)

# rc.42: recursive intrinsic subtree measurement and complete handheld fit.
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
    ('data-help-topic="recursive-layout"', "ingebouwde README-uitleg over rc.42"),
    ("not yet a general collision or repacking solver", "Engelse begrenzing recursieve boxmeting"),
    ("nog geen algemene botsings- of herplaatsingssolver", "Nederlandse begrenzing recursieve boxmeting"),
]:
    require(index, marker, label)
for marker, label in [
    ("Datum: 2026-07-28", "datum handmatig akkoord"),
    ("Akkoord rc.41: ja", "vastgelegd handmatig akkoord rc.41"),
    ("Blokkerende herstelpunten: geen opgegeven", "resultaat handmatig akkoord"),
    ("Voorconfig en toepassingen", "controle voorconfig en toepassingen"),
    ("README en bediening", "controle README en bediening"),
]:
    require(read("RC41_RECURSIVE_LAYOUT_TEST.md"), marker, label)
if "Akkoord rc.41: ja / nee" in read("RC41_RECURSIVE_LAYOUT_TEST.md"):
    errors.append("RC41-akkoordlijst bevat nog de voorlopige keuze 'ja / nee'")
for rel, markers in {
    "RC42_RESERVED_APPLICATIONS_TEST.md": [
        "Akkoord rc.42: ja / nee",
        "Vraagzin",
        "juist díe trui",
        "Onaffe zin",
    ],
    "RC42_README_CAROUSEL_EDITOR_TEST.md": [
        "Akkoord rc.42: ja / nee",
        "LEESMIJ-carousels",
        "alt-tekst",
        "Ja · bewaar config",
    ],
    "RC43_CONFIG_README_PROJECT_TEST.md": [
        "Akkoord rc.43: ja / nee",
        "Tonen ja/nee",
        "config/default-config.json",
        "config/user-config.json",
        "PUBLICATIE_README.md",
        "browser-Config als laatste laag",
    ],
    "RC44_PUBLICATION_CAROUSEL_TEST.md": [
        "Akkoord rc.44: ja / nee",
        "1080 × 1080",
        "01 → 07",
        "Reddit-proefplaatsing",
        "PUBLICATION CAROUSEL CHECK: OK",
    ],
    "RC45_OGN_CORE_EXPLANATION_TEST.md": [
        "Akkoord rc.45: ja",
        "Datum akkoord: 2026-08-02",
        "vrije gridposities",
        "Greedy Grow",
        "zoekstrategie",
        "greedy-grow-engine.js",
        "12/31/96-demo's",
        "wereldwijd optimum",
        "derived-manifest.json",
        "geen carrouselzip is rechtstreeks aangepast",
        "RELEASE CHECK: OK",
    ],
}.items():
    for marker in markers:
        require(read(rel), marker, f"{rel} handmatige controle")
approval_markers = {
    "README.md": "rc.45 was manually approved on 2 August 2026",
    "docs/README.md": "rc.45 was manually approved on 2 August 2026",
    "LEESMIJ.md": "rc.45 is op 2 augustus 2026 handmatig goedgekeurd",
    "docs/LEESMIJ.md": "rc.45 is op 2 augustus 2026 handmatig goedgekeurd",
    "PROJECT_STATE_CURRENT.md": "rc.45 is op 2 augustus 2026 handmatig goedgekeurd",
    "docs/PROJECT_STATE_CURRENT.md": "rc.45 is op 2 augustus 2026 handmatig goedgekeurd",
    "HANDOVER_FOR_COLLABORATORS.md": "rc.45 is op 2 augustus 2026 handmatig goedgekeurd",
    "docs/HANDOVER_FOR_COLLABORATORS.md": "rc.45 is op 2 augustus 2026 handmatig goedgekeurd",
    "docs/RELEASE_NOTES.md": "## v2.0.0-rc.45 — OGN-kern vóór toepassingen",
    "docs/docs-home.html": "rc.45 is op 2 augustus 2026 handmatig goedgekeurd",
}
for rel, marker in approval_markers.items():
    require(read(rel), marker, f"{rel} vastgelegd rc.45-akkoord")
for rel in ["DOCUMENTATION_RULES.md", "docs/DOCUMENTATION_RULES.md"]:
    text = read(rel)
    for marker in [
        "Geïmplementeerd gedrag",
        "Automatische garantie",
        "Handmatig oordeel",
        "Vervolgvoorstel",
        "code-defaults → default-config → user-config → browser-Config",
        "PUBLICATIE_README.md",
        "exact zeven slides van 1080 × 1080 pixels",
        "platform- en communityinstellingen blijven bepalend",
        "OGN Free Placement",
        "OGN Projection",
        "OGN Calculated Placement",
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
    ('if not exist "SOURCE_BUILD.txt" goto :not_extracted', "controle op actuele bronstand"),
    ('py.exe -3 start_local_viewer.py', "Python-launcher via py.exe"),
    ('python.exe start_local_viewer.py', "Python-launcher via python.exe"),
    ("Pak de gedownloade ZIP eerst volledig uit", "zichtbare uitpakinstructie"),
]:
    require(start_bat, marker, label)
require(publish_bat, "SOURCE_BUILD.txt", "publicatiecontrole op bronstand")
if "Invoke-WebRequest" in start_bat:
    errors.append("start_local_viewer.bat gebruikt nog de foutgevoelige PowerShell-probe")
if "for /f" in start_bat.lower():
    errors.append("start_local_viewer.bat bevat nog complexe FOR-probelogica")
local_launcher = read("start_local_viewer.py")
for marker, label in [
    ("from server_nocache import probe_server_state", "gedeelde Python-probe"),
    ("SOURCE_BUILD_FILE", "unieke lokale bronstand"),
    ("andere OpenGraph-bron", "diagnose andere bron bij hetzelfde versienummer"),
    ('creationflags"] = getattr(subprocess, "CREATE_NEW_CONSOLE", 0)', "zichtbaar Windows-servervenster"),
    ("/reset-cache.html?", "verplichte reset-cache-URL"),
    ("Sluit het oude venster", "diagnose verkeerde serverversie"),
]:
    require(local_launcher, marker, label)
source_build = read("SOURCE_BUILD.txt").strip()
if source_build != "v2.0.0-rc.45-mobile-space-zoom-controls-production-20260827.33":
    errors.append(f"onverwachte of lege SOURCE_BUILD.txt: {source_build!r}")

leesmij = read("LEESMIJ.md")
readme = read("README.md")
for marker in (
    "## Begin hier: van boom naar uiting",
    "Tree Build reserveert verplaatsingsruimte",
    "HOND | blijft op HOND-hoogte; geen pijl",
    "Alle verplaatsingspijlen blijven uitsluitend op",
):
    require(leesmij, marker, "gereorganiseerde LEESMIJ")
for marker in (
    "## Start here: from tree to utterance",
    "Tree Build reserves movement space",
    "HOND and MAN remain on their source rows without arrows",
):
    require(readme, marker, "reorganized README")
for stale in ['v4537', 'v2.0.0-rc.24']:
    if stale in start_bat or stale in debug_html:
        errors.append(f"oude lokale startversie staat nog in actieve start/debugbestanden: {stale}")

# Publishing: checked commit/push and cache reset only once after a successful push.
for marker, label in [
    ("call check_release.bat", "releasecontrole vóór publiceren"),
    ("call :ensure_playwright_runtime", "Playwright-preflight vóór releasecontrole"),
    (":ensure_playwright_runtime", "Playwright-preflightsubroutine"),
    ("chromium.executablePath()", "controle op geïnstalleerde Chromium-browser"),
    ('choice /C JN /N /M "Nu eenmalig installeren? [J/N]: "', "expliciete installatiekeuze"),
    ('call "%~dp0installeer-carrousel-tools.bat"', "bestaande reproduceerbare installer"),
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
if examples.count('class="example-input"') != 20:
    errors.append("voorbeeldset moet exact 20 uitingen bevatten")
if 'data-id="trui-breit-vrouw-topic"' in examples or '"id": "trui-breit-vrouw-topic"' in js:
    errors.append("verwarrende zichtbare testcase TRUI BREIT VROUW moet ontbreken")
for marker in ('data-animacy="inanimate"', 'data-requires-animate-subject="true"'):
    require(read("lexicon-config.html"), marker, "selectiebeperking BREIEN")
for utterance_id in [
    "jan-wast-zichzelf",
    "jan-slaat-jek-omdat-die-hem-beet",
    "ken-uzelf",
]:
    require(examples, f'data-id="{utterance_id}"', f"uiting {utterance_id}")
for phrase in ["MISSCHIEN WEL", "VAAK", "GEBETEN HEEFT"]:
    if phrase not in examples and phrase not in js:
        errors.append(f"voorbeelddata mist {phrase}")

# JSON and OPN validation.
for path in list(ROOT.rglob("*.json")) + list(ROOT.rglob("*.opn")):
    if "node_modules" in path.parts:
        continue
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
    if "node_modules" in path.parts:
        continue
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
    "OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source.zip",
    "OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source (1).zip",
    "graphlite_full_source.zip",
    "graphlite_full_source.tmp.12345.zip",
    "graphlite_full_source.zip.sha256",
]:
    if not is_generated_release_archive(generated_name):
        errors.append(f"release-archieffilter herkent niet: {generated_name}")


def manifest_file(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    parts = rel.parts
    if ".git" in parts or "__pycache__" in parts or "node_modules" in parts:
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
