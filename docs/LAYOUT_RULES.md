# LAYOUT_RULES

Harde layoutregels voor OpenGraph / GraphLite.

## Assen

- LEX-as: links van de boom.
- SYNT-as: rechts van de boom.
- LOG-as: onder de boom.
- De zuidas is alleen LOG.
- FT is geen as en mag niet als gecombineerd zuidaslabel worden getekend.
- Assen zijn layout-ankers, geen bijproduct van HTML-overlayknoppen.

## LOG-as

- De LOG-as heeft een oorspronkelijke SVG-hoogte.
- Die hoogte mag niet veranderen door plaatsing van de SOV-box of andere HTML-overlays.
- HTML-overlays moeten zich aan de as aanpassen, niet andersom.
- LOG toont de logische projectie met S-O-V / S-V-O / V-S-O enzovoort.

## FT-view

- FT is de functionele view naast de standaard syntaxboom-view.
- FT toont rollen zoals AGENS, PATIENS en PRED.
- FT mag LOG voeden als rolbron, maar wordt niet als onderdeel van de LOG-as getoond.
- In LOG-view mag geen FT-regel-as naast of boven de zuidas verschijnen.

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
- Heeft geen `LOG`-kop.
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
- Mobile mag niet automatisch een oudere service-worker of oude asset-cache blijven tonen.
- Mobile-test is lokaal bereikbaar via `local-mobile-test.js`, niet via Config.
- De testweergave mag alleen de viewport/layout emuleren; boomdata, LEX, SYNT, LOG en FT blijven ongewijzigd.
- Lokale portrait-test gebruikt body-class `viewport-mobile-portrait-test`; dit vervangt niet de echte mobile mediaquery, maar emuleert die op desktop.
- De onderbalk blijft binnen het telefoonframe; het SVG-zoomgebied krijgt de resterende hoogte.

## v1.0.7 — View-keuze syntaxboom / functional structure

- Hoofdmenu krijgt een compacte `View`-keuze.
- Standaard: syntax tree / syntaxboom.
- Alternatief: functional structure met `CLAUSE`, `PRED`, `AGENS` en `PATIENS`.
- FT blijft een view naast de syntaxboom-view, niet een onderdeel van de LOG-zuidas.
- LOG blijft de zuidas voor de logische S-O-V-projectie.
