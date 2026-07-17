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

## v1.0.3 UI-regels

- Main-topbar blijft smal: geen Boomruimte/Hoofdvenster boven het grid.
- Boomruimte en Hoofdvenster staan onder Config → Boom.
- Mobile toont zinnen en bijwoorden als pulldown-only.
- SYNT-isolatie toont regels op bronhoogte; de boom is alleen hoogteanker en wordt niet als tweede boom getoond.

## v1.0.3 mobile-test

- Mobile-weergaven moeten op desktop testbaar zijn zonder browser-devtools.
- `mobile-portrait` gebruikt een telefoonframe van ongeveer 390×844.
- `mobile-landscape` gebruikt een telefoonframe van ongeveer 844×390.
- De testweergave mag alleen de viewport/layout emuleren; de boomdata, LEX, SYNT, LOG en FT blijven ongewijzigd.
- Config → Boom is de plaats voor deze testweergave, niet het hoofdvenster.

## v1.0.5 mobile-test

- Lokale portrait-test gebruikt body-class `viewport-mobile-portrait-test`; dit vervangt niet de echte mobile mediaquery, maar emuleert die op desktop.
- De onderbalk blijft binnen het telefoonframe; het SVG-zoomgebied krijgt de resterende hoogte.
