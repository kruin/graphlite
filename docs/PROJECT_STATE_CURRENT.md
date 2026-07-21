# PROJECT_STATE_CURRENT

Actuele status van de OpenGraph / GraphLite viewer.

## Versie

- Huidige stabiele release: v1.0.9.
- Doel: demo/viewer voor JAN / OPN / OpenGraph-taalbomen.
- Standaardweergave: Syntax tree.
- Standaard alternatieve weergave: Functional structure.

## Open Graph Notation

Open Graph Notation tekent taalstructuren op een open raster.

Tree notation is een toepassing van die notatie: in de syntaxboom staat elke knoop op een eigen kruispunt van horizontale en verticale gridlijnen.

## Views

```text
Syntax tree              centrale syntactische boom
Functional structure     functionele structuur met CLAUSE, AGENS, PRED, PATIENS
```

## Projectie-assen

```text
LEX    links/west: zichtbare woordvolgorde en lexicale plaatsing
SYNT   rechts/oost: syntactische regels en categorieprojectie
LOG    onder/zuid: logische S-O-V-projectie
```

## Hoofdregels

- De LOG-as behoudt zijn eigen SVG-hoogte.
- De SOV/VSO/etc-taalactiebox mag de LOG-as niet verplaatsen.
- Projectieboxen staan rechts van de SYNT-as, nooit eroverheen.
- De standaardfit toont de volledige boom, inclusief LEX, SYNT, LOG, projectieboxen en taalactiebox.
- Syntax tree en Functional structure zijn views op dezelfde voorbeeldzin.

## UI-status

- Hoofdmenu bevat een View-keuze.
- Play-balk bevat stap terug, Play, stap vooruit, Groei aan/uit en Reset.
- Bovenbalk gebruikt compacte keuzevelden.
- Mobile gebruikt lichte viewerachtergrond.
- Cache-reset verloopt via `reset-cache.html` en cache-bust-query.

## Taalactiebox

- De SOV/VSO/etc-knopgroep is de eerste taalactiebox.
- De box is verplaatsbaar wanneer Config dit toestaat.
- Defaultpositie: links naast het begin van de LOG-as, uitgelijnd op de oorspronkelijke LOG-hoogte.
- De box bevat `‹ SOV ›`.

## Mobile-test

- Mobile-test op desktop loopt lokaal via `local-mobile-test.js`, niet via Config.
- `local-mobile-test.js` wordt lokaal geladen op `localhost`, `127.0.0.1` of `file:`.
- `local-mobile-test.js` staat in `.gitignore` en hoort niet mee naar GitHub.
- URL-test blijft beschikbaar: `?viewport=mobile-portrait`, `?viewport=mobile-landscape`, `?viewport=desktop`.
- Publicatie blijft handmatig naar `https://github.com/kruin/graphlite`; de gebruikersversie staat op `https://kruin.github.io/graphlite/`.

## Documentatie

- Projectdocumentatie beschrijft de actuele werking.
- Help gebruikt een boomnavigatie: links de onderwerpboom, rechts één geopend onderwerp.
- Help reserveert een carouselruimte voor Open Graph Notation en tree notation als toepassing.
- Historiek, changelog en ontwerpstappen horen niet in helpteksten of leidende projectdocumentatie.
- Zie `DOCUMENTATION_RULES.md`.

## Standaardcontrole

Voor iedere projectzip:

```bat
node --check viewer.js
```

Daarna zip-integriteit controleren.
