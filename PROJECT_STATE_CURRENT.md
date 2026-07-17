# PROJECT_STATE_CURRENT

Actuele status van de OpenGraph / GraphLite viewer.

## Versie

- Huidige stabiele release: v1.0.5.
- Doel: demo/viewer voor JAN / OPN / OpenGraph-taalbomen.
- Standaardweergave: hoofdscherm met volledige boom zichtbaar op desktop en mobiel.

## Hoofdregels

- LEX-as staat links/west.
- SYNT-as staat rechts/oost.
- LOG/FT-as staat onder/zuid.
- De LOG/FT-as behoudt zijn eigen, oorspronkelijke SVG-hoogte.
- De SOV/VSO/etc-taalactiebox mag de LOG/FT-as niet verplaatsen.
- Projectieboxen staan rechts van de SYNT-as, nooit eroverheen.
- De standaardfit toont de volledige boom, inclusief assen, projectieboxen en taalactiebox.

## UI-status

- Play-balk bevat stap terug, Play, stap vooruit, Groei aan/uit en Reset.
- Bovenbalk gebruikt compacte keuzevelden.
- Mobile gebruikt lichte viewerachtergrond.
- Cache-reset verloopt via reset-cache.html en cache-bust-query.

## Taalactiebox

- De SOV/VSO/etc-knopgroep is de eerste taalactiebox.
- De box is verplaatsbaar wanneer Config dit toestaat.
- Defaultpositie: links naast het begin van de LOG/FT-as, uitgelijnd op de oorspronkelijke LOG/FT-hoogte.
- De box bevat `‹ SOV ›`.
- Geen LOG-label in de box.

## Standaardcontrole

Voor iedere projectzip:

```bat
node --check viewer.js
```

Daarna zip-integriteit controleren.

## v1.0.5 aanvulling

- Master/user-profiel is verwijderd. Er is één viewer-codebase.
- Config → Boom bevat geen publicatieprofiel en geen mobile-testselectie.
- Mobile-test op desktop loopt lokaal via `local-mobile-test.js`, niet via Config.
- `local-mobile-test.js` wordt lokaal geladen op `localhost`, `127.0.0.1` of `file:`.
- `local-mobile-test.js` staat in `.gitignore` en hoort niet mee naar GitHub.
- URL-test blijft beschikbaar: `?viewport=mobile-portrait`, `?viewport=mobile-landscape`, `?viewport=desktop`.
- Publicatie blijft handmatig naar `https://github.com/kruin/graphlite`; de gebruikersversie staat op `https://kruin.github.io/graphlite/`.

## v1.0.5 aanvulling

- Mobile portrait/landscape test lokaal gestabiliseerd.
- Zoom/pinch-state wordt gereset bij orientationchange zodat portrait niet bevriest na landscape-zoom.
- Canvas pan/zoom staat standaard aan.
