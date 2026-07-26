# COMPACT_TOPBAR_TEST

Release: `v2.0.0-rc.9`

## Gecontroleerd

- `node --check viewer.js`: geslaagd.
- `tools/check_release.py`: geslaagd.
- `index.html` en `viewer.html`: byte-identiek.
- Vereiste bovenbalk-ID's aanwezig en uniek.
- `mainActionsMenu` bevat Taal, Help en Config.
- `sourceAxisMenu` verschijnt programmatisch alleen bij `Bron`.
- CSS is zonder parsefouten ingelezen.
- Alle JSON-bestanden zijn geldig.
- De vaste viewportcode is niet gewijzigd.

## Visuele browsercontrole

Een lokale Chromium-render kon in deze container niet worden uitgevoerd: lokale en `file:`-navigatie worden administratief geblokkeerd (`ERR_BLOCKED_BY_ADMINISTRATOR`). Daarom moet de definitieve visuele controle lokaal gebeuren op desktop en telefoon.

## Te controleren bij lokale test

1. Bovenbalk blijft één rij bij normale desktop- en telefoonbreedte.
2. `Assen` verschijnt alleen na keuze `Bron`.
3. `Menu` toont NL/EN, Help en Config volledig leesbaar.
4. Openen/sluiten van `Assen` en `Menu` verandert de boompositie niet.
5. Syntax en Functional behouden dezelfde viewport bij alle projectiekeuzes.
