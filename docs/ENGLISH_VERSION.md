# OpenGraph Lite Viewer - English version v4504

This is the first maintained English-language version of the OpenGraph Lite Viewer documentation.

Dutch-specific linguistic material remains unchanged. Example sentences such as HOND BIJT MAN, VROUW HEEFT TRUI GEBREID and OMDAT HOND MAN BIJT are deliberately kept in Dutch, because they are part of the test material and the notation examples.

## Interface language

Use the UI language button in the top bar to switch the visible interface, configuration screen and help text. The button states the current UI language: `Nederlands` in Dutch mode and `English` in English mode.


## Main view

The main view stays minimal:

- Sentence selector
- Help
- Config
- English/Nederlands language toggle
- projection grid

The right-hand in-window control strip contains the projection choices: All, Source, LEX, SYN and LOG. The SOV/SVO/OVS/OSV-!/VSO-!/VOS-! order button is visible only in the All view.

## JaN Open Notation

JaN is the open notation layer used here for language trees. The central tree contains freely placed nodes and branches. Word order and other readings are projected onto separate axes rather than forced into one traditional downward tree.

Current axes:

- LEX: west axis, surface order and local placement rules
- SYNTAX: east axis, syntax rules projected at source-node height
- LOG: south axis, logical S-O-V order projection
- Functional: functional/thematic view next to the standard syntax-tree view

## LEX placement rules

For main clauses, the LEX axis shows local exchanges. The first phrase can move to slot 1 and the finite verb to slot 2. Old base positions remain visible as traces. Insertions such as GISTEREN are represented as insertion boxes above syntax boxes, not as direct new nodes in the central tree.



The standalone module is:


## Documentation maintenance rule

From v4504 onward, when the user requests an English release, the English UI/help/docs should be updated together with the Dutch implementation. Dutch example sentences and Dutch-specific syntactic test data should remain unchanged unless explicitly requested.

## v4505 - OSV-!

Keep the OSV warning translated in every English release: OSV-! is not a base alternative. The box approach cannot produce OSV; correct LEX rendering requires an explicit movement rule.


## v4506 - LEX adverb insertion slots

Free LEX insertions for adverbs are now documented as slot types with different scope. The base rule remains: reserve slots between visible LEX boxes and place the slot on vertical overlap when such overlap exists. The adverb type then determines the precise placement.

- Time: `GISTEREN`, `MORGEN` - usually `VP-HOST`, optionally `S-HOST` when fronted.
- Frequency: `VAAK`, `SOMS`, `ALTIJD` - `VP-HOST`.
- Negation: `NIET` - separate `NEG`/`V-HOST` slot.
- Manner: `SNEL`, `HARD`, `ZACHTJES` - `V-HOST` or `VP-RIGHT`.
- Sentence adverb: `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS` - high `S/VP-HOST` or `S-HOST`.
- Focus: `ALLEEN`, `OOK`, `ZELFS` - beside the focused phrase.
- Degree: `HEEL`, `ERG`, `ZEER` - internal to `AP/AdvP/NP`, not a general host box above a syntax box.

The central tree is not rewritten. In this phase, adverbs belong to the LEX render layer or to phrase-internal slots.

See also: `docs/LEX_ADVERB_INSERT_SLOTS_EN.md`.


## v4535 translation note

The Dutch linguistic test material remains Dutch. The lexicon now also records OVT/imperfect forms: `BEET` for `BIJT/BIJTEN` and `BREIDE` for `BREIT/BREIEN`; the VDW participles remain `GEBETEN` and `GEBREID`.

## v4535 - OSV-!, VSO-! and VOS-!

`VSO` and `VOS` are now marked like `OSV`: `VSO-!` and `VOS-!`. The exclamation mark means that the box approach cannot produce the order as a base alternative. Correct rendering above syntax boxes requires an explicit movement rule. Existing trees and existing flip behaviour remain unchanged.




- De editor kan afbeeldingen toevoegen, verwijderen, vervangen, dupliceren, de volgorde wijzigen en Nederlandse/Engelse toelichting aanpassen.
- Exportmogelijkheden:
  - `slides.json`
  - zelfstandige `index.html`
- Engelse knoppen/tooltips en Engelstalige toelichting zijn mee bijgewerkt.



