# LAYOUT_RULES

Harde layoutregels voor OpenGraph / GraphLite.

## Assen

- LEX-as: links van de boom.
- SYNT-as: rechts van de boom.
- LOG/FT-as: onder de boom.
- Assen zijn layout-ankers, geen bijproduct van HTML-overlayknoppen.

## LOG/FT-as

- De LOG/FT-as heeft een oorspronkelijke SVG-hoogte.
- Die hoogte mag niet veranderen door plaatsing van de SOV-box of andere HTML-overlays.
- HTML-overlays moeten zich aan de as aanpassen, niet andersom.

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

- Staat default links naast het begin van de LOG/FT-as.
- Is verticaal gecentreerd op de oorspronkelijke LOG/FT-as-hoogte.
- Bevat `‹ SOV ›`.
- Heeft geen `LOG`-kop.
- Is compacter dan de projectieboxen, maar met voldoende padding rond de knoppen.
- Mag verplaatsbaar zijn via Config.
- Drag-positie mag nooit de berekening van de LOG/FT-as beïnvloeden.

## Fitbox / grid

- Standaard: volledige boom zichtbaar.
- Geldt voor desktop en mobiel.
- Fitbox omvat:
  - boom;
  - LEX-as;
  - SYNT-as;
  - LOG/FT-as;
  - projectiebox rechts;
  - SOV-taalactiebox;
  - onderste LOG/FT-elementen.
- Vermijd overbodig grid links van LEX en rechts van projectiebox/SOV-box.

## Mobile

- Viewer blijft licht, ook als OS/browser in dark mode staat.
- Mobile mag niet automatisch een oudere service-worker of oude asset-cache blijven tonen.
