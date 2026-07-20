# PROJECT_STATE_CURRENT

Actuele status van de OpenGraph / GraphLite viewer.

## Versie

- Huidige stabiele release: v1.0.7.
- Doel: demo/viewer voor JAN / OPN / OpenGraph-taalbomen.
- Standaardweergave: hoofdscherm met volledige boom zichtbaar op desktop en mobiel.

## Hoofdregels

- LEX-as staat links/west.
- SYNT-as staat rechts/oost.
- LOG-as staat onder/zuid.
- De zuidas is uitsluitend LOG: logische S-O-V-volgordeprojectie.
- FT is géén onderdeel van de LOG-as.
- FT is de functionele view naast de standaard syntaxboom-view.
- De LOG-as behoudt zijn eigen, oorspronkelijke SVG-hoogte.
- De SOV/VSO/etc-taalactiebox mag de LOG-as niet verplaatsen.
- Projectieboxen staan rechts van de SYNT-as, nooit eroverheen.
- De standaardfit toont de volledige boom, inclusief LEX, SYNT, LOG, projectieboxen en taalactiebox.

## Views

- Standaard syntaxboom-view: centrale OPN-syntaxboom.
- FT-view: functionele/thematische structuur met rollen zoals AGENS, PATIENS en PRED.
- LOG-view: geïsoleerde logische S-O-V-projectie; toont geen FT-regel-as.
- LEX-view: lexicale volgorde en LEX-plaatsingsregels.
- SYNT-view: geïsoleerde syntaxregels op bronhoogte.

## UI-status

- Play-balk bevat stap terug, Play, stap vooruit, Groei aan/uit en Reset.
- Bovenbalk gebruikt compacte keuzevelden.
- Mobile gebruikt lichte viewerachtergrond.
- Cache-reset verloopt via reset-cache.html en cache-bust-query.

## Taalactiebox

- De SOV/VSO/etc-knopgroep is de eerste taalactiebox.
- De box is verplaatsbaar wanneer Config dit toestaat.
- Defaultpositie: links naast het begin van de LOG-as, uitgelijnd op de oorspronkelijke LOG-hoogte.
- De box bevat `‹ SOV ›`.
- Geen LOG-label in de box.

## Mobile-test

- Master/user-profiel is verwijderd. Er is één viewer-codebase.
- Mobile-test op desktop loopt lokaal via `local-mobile-test.js`, niet via Config.
- `local-mobile-test.js` wordt lokaal geladen op `localhost`, `127.0.0.1` of `file:`.
- `local-mobile-test.js` staat in `.gitignore` en hoort niet mee naar GitHub.
- URL-test blijft beschikbaar: `?viewport=mobile-portrait`, `?viewport=mobile-landscape`, `?viewport=desktop`.
- Publicatie blijft handmatig naar `https://github.com/kruin/graphlite`; de gebruikersversie staat op `https://kruin.github.io/graphlite/`.

## Standaardcontrole

Voor iedere projectzip:

```bat
node --check viewer.js
```

Daarna zip-integriteit controleren.

## v1.0.7 — View-keuze syntaxboom / functional structure

- Hoofdmenu krijgt een compacte `View`-keuze.
- Standaard: syntax tree / syntaxboom.
- Alternatief: functional structure met `CLAUSE`, `PRED`, `AGENS` en `PATIENS`.
- FT blijft een view naast de syntaxboom-view, niet een onderdeel van de LOG-zuidas.
- LOG blijft de zuidas voor de logische S-O-V-projectie.
