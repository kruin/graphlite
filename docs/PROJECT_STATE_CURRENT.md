# PROJECT_STATE_CURRENT

Actuele status van de OpenGraph / GraphLite viewer.

## Versie

- Huidige stabiele release: v1.0.
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
