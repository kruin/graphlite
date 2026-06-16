# OpenGraph Lite Viewer - English version v4500

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

The right-hand in-window control strip contains the projection choices: All, Source, LEX, SYN and LOG/FT. The SOV/SVO/OVS/OSV/VSO/VOS order button is visible only in the All view.

## JAN Open Notation

JAN is the open notation layer used here for language trees. The central tree contains freely placed nodes and branches. Word order and other readings are projected onto separate axes rather than forced into one traditional downward tree.

Current axes:

- LEX: west axis, surface order and local placement rules
- SYNTAX: east axis, syntax rules projected at source-node height
- LOGICAL / FT: south axis, logical or functional order

## LEX placement rules

For main clauses, the LEX axis shows local exchanges. The first phrase can move to slot 1 and the finite verb to slot 2. Old base positions remain visible as traces. Insertions such as VANDAAG are represented as insertion boxes on the LEX axis, not as direct new nodes in the central tree.

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

From v4500 onward, when the user requests an English release, the English UI/help/docs should be updated together with the Dutch implementation. Dutch example sentences and Dutch-specific syntactic test data should remain unchanged unless explicitly requested.
