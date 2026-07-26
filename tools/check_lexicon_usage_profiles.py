from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []

class Collector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.entries: dict[str, dict] = {}
        self.constructions: dict[str, dict] = {}
        self.examples: dict[str, list[dict]] = {}
        self._entry: str | None = None
        self._construction: str | None = None
        self._example: str | None = None

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {k: (v or '') for k, v in attrs_list}
        classes = set(attrs.get('class', '').split())
        if 'lexicon-entry' in classes:
            self._entry = attrs.get('data-id', '')
            self.entries[self._entry] = {'attrs': attrs, 'profiles': []}
        elif 'usage-profile' in classes and self._entry:
            self.entries[self._entry]['profiles'].append(attrs)
        elif 'lexicon-construction' in classes:
            self._construction = attrs.get('data-id', '')
            self.constructions[self._construction] = {'attrs': attrs, 'profiles': []}
        elif 'construction-profile' in classes and self._construction:
            self.constructions[self._construction]['profiles'].append(attrs)
        elif 'example-input' in classes:
            self._example = attrs.get('data-id', '')
            self.examples[self._example] = []
        elif 'lex-insertion' in classes and self._example:
            self.examples[self._example].append(attrs)

    def handle_endtag(self, tag: str) -> None:
        if tag == 'article':
            self._example = None

collector = Collector()
collector.feed((ROOT / 'lexicon-config.html').read_text(encoding='utf-8'))
collector.feed((ROOT / 'examples-input.html').read_text(encoding='utf-8'))

for lemma, minimum in [('misschien', 2), ('wel', 3), ('vaak', 1)]:
    profiles = collector.entries.get(lemma, {}).get('profiles', [])
    if len(profiles) < minimum:
        errors.append(f'{lemma}: verwacht minstens {minimum} gebruiksprofielen, gevonden {len(profiles)}')

construction = collector.constructions.get('misschien-wel')
if not construction:
    errors.append('constructie misschien-wel ontbreekt')
else:
    if construction['attrs'].get('data-visible-slots') != '1':
        errors.append('misschien-wel moet één zichtbaar LEX-slot gebruiken')
    ids = {p.get('data-id') for p in construction['profiles']}
    expected = {'mixed-modal-particle', 'group-modal-log', 'group-lexical-particle'}
    if ids != expected:
        errors.append(f'constructieprofielen fout: {sorted(ids)}')
    origins = {p.get('data-origin') for p in construction['profiles']}
    if origins != {'LOG', 'LEX', 'LOG+LEX'}:
        errors.append(f'constructieorigins fout: {sorted(origins)}')

for example_id in [
    'de-hond-heeft-de-man-misschien-wel-vaak-gebeten',
    'omdat-de-hond-de-man-misschien-wel-vaak-gebeten-heeft',
]:
    insertions = collector.examples.get(example_id, [])
    by_id = {i.get('data-id'): i for i in insertions}
    mixed = by_id.get('misschien-wel', {})
    often = by_id.get('vaak', {})
    if mixed.get('data-analysis-status') != 'ask':
        errors.append(f'{example_id}: misschien-wel moet gebruikerskeuze vragen')
    if mixed.get('data-origin') != 'LOG+LEX':
        errors.append(f'{example_id}: voorlopig profiel moet LOG+LEX zijn')
    candidates = set(mixed.get('data-candidate-profiles', '').split())
    if len(candidates) != 3:
        errors.append(f'{example_id}: verwacht drie kandidaatprofielen')
    if often.get('data-usage-profile') != 'frequency-event' or often.get('data-origin') != 'LOG':
        errors.append(f'{example_id}: vaak moet opgelost LOG-profiel frequency-event gebruiken')

viewer = (ROOT / 'viewer.js').read_text(encoding='utf-8')
for marker in [
    'function seedLexiconUsageFallbacks()',
    "filter(spec => normalizeInsertionOrigin(spec.origin) !== 'LEX')",
    'function activeLexPlacementSequence(',
    'function renderLexAmbiguityPrompt()',
    "localStorage.setItem(LEX_ANALYSIS_STORAGE_KEY",
    "function insertionChoiceKey(spec = {}, example = state.example)",
]:
    if marker not in viewer:
        errors.append(f'viewer mist {marker}')

# The LOG sequence and full LEX placement sequence must remain distinct.
logical = re.search(r'function activeLogicalInsertionSpecs\(\).*?\n  \}', viewer, re.S)
placement = re.search(r'function activeLexPlacementInsertionSpecs\(\).*?\n  \}', viewer, re.S)
if not logical or "!== 'LEX'" not in logical.group(0):
    errors.append('LOG-sequentie filtert directe LEX-profielen niet')
if not placement or '.filter(' in placement.group(0).split('.map(', 1)[0]:
    errors.append('LEX-plaatsingssequentie mag directe LEX-profielen niet filteren')

for editor_name, markers in {
    'examples-editor.html': ['data-usage-profile=', 'data-origin=', 'candidateProfiles', 'ambiguityAffects'],
    'lexicon-editor.html': ['profilesInput', 'constructionsInput', 'class="usage-profile"', 'class="construction-profile"'],
}.items():
    text = (ROOT / editor_name).read_text(encoding='utf-8')
    for marker in markers:
        if marker not in text:
            errors.append(f'{editor_name} mist round-tripmarker {marker}')

if errors:
    print('LEXICON USAGE PROFILE CHECK: FOUT')
    for error in errors:
        print('-', error)
    sys.exit(1)
print('LEXICON USAGE PROFILE CHECK: OK (lemma, construction, sentence choice, LOG/LEX split)')
