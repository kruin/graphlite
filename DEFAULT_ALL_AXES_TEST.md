# DEFAULT_ALL_AXES_TEST — v2.0.0-rc.9

## Gecontroleerd

- `state.projection` start als `axes`.
- `sourceAxes` valt zonder rc.9-localStorage terug op `LEX + SYNT + LOG`.
- De drie Projecties-knoppen zijn in de HTML als ingedrukt gemarkeerd.
- `Projecties → Geen` schakelt naar de bron zonder assen.
- `Projecties → Alle` schakelt naar LEX + SYNT + LOG.
- Main Reset, mobile Reset en Config Reset herstellen alle assen.
- Een config-snapshot uit een oudere versie migreert de projectiestand naar alle assen en behoudt overige instellingen.
- Syntax blijft eerste centrale view; Functional blijft tweede centrale view.
- SOV/LOG-volgorde staat onder `Menu → Extra`, niet in het canvas.
- `index.html` en `viewer.html` zijn identiek.
- Alle HTML-id's zijn uniek.
- `node --check viewer.js`: geslaagd.
- `tools/check_release.py`: geslaagd.
- JSON-validatie: geslaagd.
- zip-integriteit: geslaagd.

## Browserbeperking

Een volledige Chromium-navigatietest kon in deze container niet worden uitgevoerd. Zowel HTTP op `127.0.0.1` als `file://` werd door Chromium geblokkeerd met `ERR_BLOCKED_BY_ADMINISTRATOR`. Daarom worden geen visuele browsertestresultaten geclaimd.
