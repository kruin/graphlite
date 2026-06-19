# OpenGraph Lite Viewer - English version v4504

This is the first maintained English-language version of the OpenGraph Lite Viewer documentation.

Dutch-specific linguistic material remains unchanged. Example sentences such as HOND BIJT MAN, VROUW HEEFT TRUI GEBREID and OMDAT HOND MAN BIJT are deliberately kept in Dutch, because they are part of the test material and the notation examples.

## Interface language

Use the UI language button in the top bar to switch the visible interface, configuration screen and help text. The button states the current UI language: `Taal: Nederlands` in Dutch mode and `UI: English` in English mode.

The current version translates the main viewer labels, the configuration screen, select-box options, mobile configuration sheet, main help/status texts and the Help carrousel. Future releases must keep the English version in step with the Dutch version.

## Main view

The main view stays minimal:

- Sentence selector
- Help
- Config
- English/Nederlands language toggle
- projection grid

The right-hand in-window control strip contains the projection choices: All, Source, LEX, SYN and LOG/FT. The SOV/SVO/OVS/OSV-!/VSO-!/VOS-! order button is visible only in the All view.

## JAN Open Notation

JAN is the open notation layer used here for language trees. The central tree contains freely placed nodes and branches. Word order and other readings are projected onto separate axes rather than forced into one traditional downward tree.

Current axes:

- LEX: west axis, surface order and local placement rules
- SYNTAX: east axis, syntax rules projected at source-node height
- LOGICAL / FT: south axis, logical or functional order

## LEX placement rules

For main clauses, the LEX axis shows local exchanges. The first phrase can move to slot 1 and the finite verb to slot 2. Old base positions remain visible as traces. Insertions such as GISTEREN are represented as insertion boxes on the LEX axis, not as direct new nodes in the central tree.

## Carrousel

The carrousel is a separate help module. It can run inside the Help screen or as a standalone folder extracted from the project zip. The spelling used in the project is carrousel.

The standalone module is:

carrousel/index.html
carrousel/index-en.html
carrousel/README.md
carrousel/carrousel.css
carrousel/carrousel.js
carrousel/slides.json
carrousel/slides/

## Documentation maintenance rule

From v4504 onward, when the user requests an English release, the English UI/help/docs should be updated together with the Dutch implementation. Dutch example sentences and Dutch-specific syntactic test data should remain unchanged unless explicitly requested.

## v4505 - OSV-!

Keep the OSV warning translated in every English release: OSV-! is not a base alternative. The box approach cannot produce OSV; correct LEX rendering requires an explicit movement rule.


## v4506 - LEX adverb insertion slots

Free LEX insertions for adverbs are now documented as slot types with different scope. The base rule remains: reserve slots between visible LEX boxes and place the slot on vertical overlap when such overlap exists. The adverb type then determines the precise placement.

- Time: `GISTEREN`, `MORGEN` - usually `VP-BETWEEN`, optionally `S-LEFT` when fronted.
- Frequency: `VAAK`, `SOMS`, `ALTIJD` - `VP-BETWEEN`.
- Negation: `NIET` - separate `NEG`/`V-NEAR` slot.
- Manner: `SNEL`, `HARD`, `ZACHTJES` - `V-NEAR` or `VP-RIGHT`.
- Sentence adverb: `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS` - high `S/VP` or `S-LEFT`.
- Focus: `ALLEEN`, `OOK`, `ZELFS` - beside the focused phrase.
- Degree: `HEEL`, `ERG`, `ZEER` - internal to `AP/AdvP/NP`, not a general between-box slot.

The central tree is not rewritten. In this phase, adverbs belong to the LEX render layer or to phrase-internal slots.

See also: `docs/LEX_ADVERB_INSERT_SLOTS_EN.md`.


## v4512 translation note

The Dutch linguistic test material remains Dutch. The lexicon now also records OVT/imperfect forms: `BEET` for `BIJT/BIJTEN` and `BREIDE` for `BREIT/BREIEN`; the VDW participles remain `GEBETEN` and `GEBREID`.

## v4512 - OSV-!, VSO-! and VOS-!

`VSO` and `VOS` are now marked like `OSV`: `VSO-!` and `VOS-!`. The exclamation mark means that the box approach cannot produce the order as a base alternative. Correct rendering on the LEX axis requires an explicit movement rule. Existing trees and existing flip behaviour remain unchanged.



## v4512 - Carrousel editor in Config

- Config bevat nu een apart blok **Carrousel** met `Open` en `Edit`.
- `Edit` opent `carrousel/editor.html`.
- De editor kan afbeeldingen toevoegen, verwijderen, vervangen, dupliceren, de volgorde wijzigen en Nederlandse/Engelse toelichting aanpassen.
- Exportmogelijkheden:
  - `slides.json`
  - zelfstandige `index.html`
  - complete modulezip `OpenGraph_Carrousel_Module_v4512_edited.zip`
- De geëxporteerde modulezip bevat een volledige `carrousel/`-map die later in de projectzip kan worden opgenomen.
- Engelse knoppen/tooltips en Engelstalige toelichting zijn mee bijgewerkt.
