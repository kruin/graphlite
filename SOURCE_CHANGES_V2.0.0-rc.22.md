# Source changes · v2.0.0-rc.22

## LEX vrij van S/CLAUSE

De westas gebruikt nu `westLexAxisX()`. De functie trekt van de linkerzijde
van de buitenste centrale box drie afzonderlijke grootheden af:

```text
LEX-laag links/rechts + vaste vrijstrook + centrale box
```

`LEX_RENDER_RIGHT_REACH=220` reserveert bijwoordgroepen, brontraces en vier
gestaffelde Wissels. `LEX_TREE_CLEARANCE=48` blijft daarna leeg. De oude
ondergrens `Math.max(120, …)` is verwijderd, omdat die bij brede bomen de as
weer richting S/CLAUSE kon trekken. Dezelfde geometrie wordt gebruikt door de
gewone projectie, de stabiele Play-framebox en de MAX-framebox.

## Beperkte meerwoordige eenheden

De parser accepteert optioneel een zevende fallbackwaarde en
`data-word` in `examples-adverbs.html`. Daardoor blijft de zichtbare eenheid
heel in plaats van dat alleen het eerste woord wordt afgeleid.

Toegevoegd:

- `MISSCHIEN WEL` — `MODALITEIT`, standaard `S–O`;
- `AF EN TOE` — `FREQUENTIE`, standaard `O–V`;
- `OP DIT MOMENT` — `TIJD`, standaard `O–V`;
- `MET VEEL AANDACHT` — `WIJZE`, standaard `O–V`.

Elke groep vormt voorlopig één LOG-minor en één LEX-eenheid. De interne
syntaxis wordt niet stilzwijgend ingevuld; die afbakening staat in
`docs/TALIGE_UITBREIDINGEN.md`.

## Zelfstandige graph-export

De Bestanden-tab bevat een nieuwe exportkaart:

- SVG: clone van de actuele graph met eigen `viewBox`, witte achtergrond,
  CSS-variabelen, ingebedde lokale stylesheets en inline berekende
  SVG-presentatie als `file://` de stylesheetregels afschermt;
- PNG: browserrender van die zelfstandige SVG naar 1200 × 627;
- WebM: automatische frame-opname van alle Play-stappen via
  `canvas.captureStream(30)` en `MediaRecorder`.

De video gebruikt een constant beeldkader en herstelt na afloop projectie,
zichtbare assen, Play-stap, handmatig zichtvenster en MAX-fit. Alle uitvoer is
lokaal; de viewer publiceert zelf niets.

## Controle

- `tools/check_projection_cleanup.py` vereist exact 25 ingebouwde
  bijwoordvoorbeelden en bewaakt de 48-eenheden-goot.
- `tools/check_social_and_linguistic_export.py` bewaakt vier groepen,
  documentatie en SVG/PNG/WebM-markers.
- De DOM-rendertest controleert Syntax en FT geometrisch, telt 26
  dropdownkeuzes en maakt een zelfstandige SVG met ingebedde vormgeving.
