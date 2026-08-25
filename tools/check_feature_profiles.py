from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
VIEWER = (ROOT / "viewer.html").read_text(encoding="utf-8")
EXAMPLES = (ROOT / "examples-input.html").read_text(encoding="utf-8")
EXAMPLES_EDITOR = (ROOT / "examples-editor.html").read_text(encoding="utf-8")
LEXICON = (ROOT / "lexicon-config.html").read_text(encoding="utf-8")
LEXICON_EDITOR = (ROOT / "lexicon-editor.html").read_text(encoding="utf-8")
STRUCTURE = (ROOT / "structure-config.html").read_text(encoding="utf-8")
STRUCTURE_EDITOR = (ROOT / "structure-editor.html").read_text(encoding="utf-8")
DOCS_HOME = (ROOT / "docs" / "docs-home.html").read_text(encoding="utf-8")
BASE_DOC = (ROOT / "docs" / "OGN_BASE_PROFILE.md").read_text(encoding="utf-8")
PRECONFIG_DOC = (ROOT / "docs" / "PRECONFIG_ARCHITECTURE.md").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


# Central feature catalog and base-by-default state.
for marker, label in [
    ("const INSERTION_AXIS_DEFINITIONS = Object.freeze({", "centrale insertie-asdefinities"),
    ("lex: Object.freeze({ id: 'lex'", "LEX-insertieschakelaar"),
    ("synt: Object.freeze({ id: 'synt'", "SYNT-insertieschakelaar"),
    ("log: Object.freeze({ id: 'log'", "LOG-insertieschakelaar"),
    ("preconfig: { insertion: { ...DEFAULT_INSERTION_AXES } }", "voorconfigstaat"),
    ("const FEATURE_DEFINITIONS = Object.freeze({", "centrale featurecatalogus"),
    ("id: 'adverbs'", "feature-id Bijwoorden"),
    ("insertionAxes: Object.freeze(['lex', 'log'])", "Bijwoorden vereist LEX+LOG"),
    ("defaultEnabled: false", "Bijwoorden standaard uit"),
    ("const RESERVED_APPLICATION_DEFINITIONS = Object.freeze([", "aparte reserveringscatalogus"),
    ("id: 'emphasis'", "reservering Nadruk"),
    ("id: 'incomplete-sentence'", "reservering Onaffe zin"),
    ("example: 'juist díe trui'", "voorbeeld Nadruk"),
    ("features: { ...DEFAULT_FEATURES }", "featurestaat"),
    ("let activeConfigTab = 'general-ui';", "Algemeen als starttab"),
    ("{ id: 'preconfig', nl: 'Voorconfig', en: 'Pre-config' }", "Config-voorconfigtab"),
    ("{ id: 'features', nl: 'Uitbreidingen', en: 'Extensions' }", "Language-Tree-uitbreidingentab"),
    ("'language-tree': Object.freeze(['preconfig', 'features', 'view', 'log-lex', 'examples', 'jan', 'advanced'])", "Voorconfig en uitbreidingen uitsluitend onder Language Tree"),
    ('id="insertionAxis${axis.label}Input"', "dynamische insertiecheckboxes"),
    ("id=\"insertionLexLogPresetButton\"", "LEX+LOG-preset"),
    ("id=\"featureAdverbsInput\"", "Bijwoorden-checkbox"),
    ('data-reserved-application="${application.id}" disabled', "uitgeschakelde toepassingreserveringen"),
    ('id="reservedApplicationsHeading"', "kop gereserveerde toepassingen"),
    ("Gereserveerd · nog niet actief", "zichtbare reserveringsstatus"),
    ("async function setInsertionAxes(", "centrale insertieschakelaar"),
    ("async function setFeatureEnabled(", "centrale featureschakelaar"),
    ("function resetAdverbFeatureState()", "feature-reset"),
]:
    require(JS, marker, label)

feature_catalog = re.search(
    r"const FEATURE_DEFINITIONS = Object\.freeze\(\{(.*?)\n  \}\);\n.*?const RESERVED_APPLICATION_DEFINITIONS",
    JS,
    flags=re.S,
)
if not feature_catalog:
    errors.append("actieve featurecatalogus kon niet afzonderlijk worden gelezen")
else:
    for reserved_id in ["emphasis", "incomplete-sentence"]:
        if reserved_id in feature_catalog.group(1):
            errors.append(f"gereserveerde toepassing staat actief in FEATURE_DEFINITIONS: {reserved_id}")

reserved_catalog = re.search(
    r"const RESERVED_APPLICATION_DEFINITIONS = Object\.freeze\(\[(.*?)\n  \]\);\n  const DEFAULT_FEATURES",
    JS,
    flags=re.S,
)
if not reserved_catalog:
    errors.append("reserveringscatalogus kon niet afzonderlijk worden gelezen")
else:
    if reserved_catalog.group(1).count("id: '") != 2:
        errors.append("reserveringscatalogus bevat niet exact twee toepassingen")
    if "question-sentence" in reserved_catalog.group(1):
        errors.append("Vraagzin staat nog ten onrechte als toepassing gereserveerd")
    for forbidden in ["defaultEnabled", "insertionAxes", "layoutDemand"]:
        if forbidden in reserved_catalog.group(1):
            errors.append(f"reserveringscatalogus activeert al featuregedrag: {forbidden}")

# Every runtime entry point that can create adverb data has an explicit guard.
for marker, label in [
    ("if (!featureEnabled('adverbs') || !insertionAxisEnabled('lex')) return [];", "LEX-insertie vereist LEX-voorconfig"),
    ("if (!insertionAxisEnabled('log')) return [];", "LOG-minor vereist LOG-voorconfig"),
    ("if (!featureEnabled('adverbs')) return NO_ADVERB_OPTION;", "actieve bijwoordoptie"),
    ("if (!featureEnabled('adverbs')) return null;", "actieve bijwoorddata"),
    ("return featureEnabled('adverbs')\n      && !!state.useExampleLexInsertions", "voorbeeldinserties"),
    ("if (!featureEnabled('adverbs')) return;", "lexiconprofielen-loader"),
    ("ADVERB_OPTIONS = [NO_ADVERB_OPTION];", "lege bijwoordopties"),
    ("if (!featureEnabled('adverbs')) return 0;", "LEX-insertietelling"),
    ("ALL_EXAMPLES.filter(example => !exampleRequiresAdverbs(example))", "basisvoorbeeldfilter"),
]:
    require(JS, marker, label)

# Profile-safe storage and imports/exports.
for marker, label in [
    ("profile: adverbsEnabled ? 'custom' : 'base'", "OPN-profielmetadata"),
    ("extras: adverbsEnabled ? ['adverbs'] : []", "OPN-extralijst"),
    ("preconfig: insertionPreconfigSnapshot()", "OPN-voorconfigmetadata"),
    ("...(adverbsEnabled ? {\n              free_slot_count:", "optionele LEX-exportvelden"),
    ("...(adverbsEnabled ? { insertion_interval:", "optioneel LOG-exportveld"),
    ("function opnDocumentRequiresAdverbs(", "OPN-featuredetectie"),
    ("function opnDocumentRequiredInsertionAxes(", "OPN-insertiedetectie"),
    ("requires insertion on", "geblokkeerde voorconfig-import"),
    ("requires the disabled Adverbs application", "geblokkeerde feature-import"),
    ("...(featureEnabled('adverbs') ? {\n        lexFreeSlotCount:", "optionele Config-velden"),
]:
    require(JS, marker, label)

# Feature UI and documentation are hidden in the base markup.
for marker, label in [
    ('id="mainAdverbMenu"', "hoofdmenu Bijwoorden"),
    ('data-feature="adverbs" hidden="" id="mainAdverbMenu"', "verborgen hoofdmenu"),
    ('data-help-topic="adverbs" hidden=""', "verborgen Help-onderwerp"),
    ('class="lex-adverb-insert-field" data-feature="adverbs" hidden=""', "verborgen Config-functionaliteit"),
]:
    require(VIEWER, marker, label)

# Standalone sources/editors honor profile=base.
for source, markers, label in [
    (EXAMPLES, ["get('profile') === 'base'", "card.querySelector('.lex-insertion')"], "voorbeeldbron"),
    (EXAMPLES_EDITOR, ["const BASE_PROFILE", "filter(card=>!BASE_PROFILE"], "voorbeeldeditor"),
    (LEXICON, ["get('profile') === 'base'", "[data-kind=\"adv\"]"], "lexiconconfig"),
    (LEXICON_EDITOR, ["const BASE_PROFILE", "function restrictBaseProfileData()"], "lexiconeditor"),
    (STRUCTURE, ["get('profile') !== 'base'", 'data-feature="adverbs"'], "structuurconfig"),
    (STRUCTURE_EDITOR, ["const BASE_PROFILE", "function logSectionForProfile(html)"], "structuureditor"),
]:
    for marker in markers:
        require(source, marker, f"{label}: profielmarker")

# The source contains 19 utterances; the two insertion examples are excluded in base.
example_count = EXAMPLES.count('class="example-input"')
insertion_cards = len(re.findall(r'<article class="example-input"(?:(?!</article>).)*class="lex-insertion"', EXAMPLES, flags=re.S))
if example_count != 19:
    errors.append(f"verwacht 19 bronuitingen, gevonden {example_count}")
if insertion_cards != 2:
    errors.append(f"verwacht 2 featurevoorbeelden, gevonden {insertion_cards}")

for marker, label in [
    ('data-profile-section="base"', "basisdocumentatiesectie"),
    ('data-profile-section="extras"', "volledige documentatiesectie"),
    ("get('profile') === 'base'", "documentatieprofiel"),
]:
    require(DOCS_HOME, marker, label)
for marker in ["OGN Basis", "metadata.profile = base", "metadata.extras  = []"]:
    require(BASE_DOC, marker, "basisprofiel-documentatie")
for marker in ["Voorconfig", "LEX + LOG", "Verplaatsing per as", "Bron-naar-doel-koppelingen"]:
    require(PRECONFIG_DOC, marker, "voorconfig-documentatie")

if errors:
    print("FEATURE PROFILE CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("FEATURE PROFILE CHECK: OK (Bijwoorden actief contract; 2 toepassingen uitsluitend gereserveerd; Vraagzin is zinsoort)")
