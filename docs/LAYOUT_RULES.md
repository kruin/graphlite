# LAYOUT_RULES

Harde layoutregels voor OpenGraph / GraphLite.

## Grid

- Tree notation is een toepassing van Open Graph Notation.
- In de syntaxboom staat elke knoop op een eigen horizontale gridlijn.
- In de syntaxboom staat elke knoop op een eigen verticale gridlijn.
- Elke knoop heeft daardoor een eigen kruispunt.
- Het grid blijft bruikbaar voor projecties en views naast de boom.

## Assen

```text
LEX    links van de boom
SYNT   rechts van de boom
LOG    onder de boom
```

Assen zijn layout-ankers, geen bijproduct van HTML-overlayknoppen.

## LOG-as

- De LOG-as heeft een oorspronkelijke SVG-hoogte.
- Die hoogte blijft stabiel bij plaatsing van de SOV-box en andere HTML-overlays.
- HTML-overlays passen zich aan de as aan.
- LOG toont de logische projectie met S-O-V / S-V-O / V-S-O enzovoort.

## Views

```text
Syntax tree              standaardweergave
Functional structure     standaard alternatieve weergave
```

De Syntax tree gebruikt de centrale boomruimte.

De Functional structure toont de functionele structuur met rollen zoals:

```text
CLAUSE
AGENS
PRED
PATIENS
```

## Projectiebox rechts

Projectieboxen volgen deze volgorde:

```text
boom → SYNT-as → kleine marge → projectiebox
```

Niet toegestaan:

```text
projectiebox over SYNT-as
projectiebox extreem ver rechts van de SYNT-as
```

## SOV-taalactiebox

- Staat default links naast het begin van de LOG-as.
- Is verticaal gecentreerd op de oorspronkelijke LOG-as-hoogte.
- Bevat `‹ SOV ›`.
- Is compacter dan de projectieboxen, maar met voldoende padding rond de knoppen.
- Mag verplaatsbaar zijn via Config.
- Drag-positie mag nooit de berekening van de LOG-as beïnvloeden.

## Fitbox / grid

- Standaard: volledige boom zichtbaar.
- Geldt voor desktop en mobiel.
- Fitbox omvat:
  - boom;
  - LEX-as;
  - SYNT-as;
  - LOG-as;
  - projectiebox rechts;
  - SOV-taalactiebox;
  - onderste LOG-elementen.
- Vermijd overbodig grid links van LEX en rechts van projectiebox/SOV-box.

## Mobile

- Viewer blijft licht, ook als OS/browser in dark mode staat.
- Mobile-test is lokaal bereikbaar via `local-mobile-test.js`, niet via Config.
- De testweergave emuleert alleen viewport/layout; boomdata, LEX, SYNT, LOG en views blijven gelijk.
- Lokale portrait-test gebruikt body-class `viewport-mobile-portrait-test`.
- De onderbalk blijft binnen het telefoonframe; het SVG-zoomgebied krijgt de resterende hoogte.
