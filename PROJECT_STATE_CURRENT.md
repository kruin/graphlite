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


## JAN-casing / SYNT-isolatie

- `SYN` is hernoemd naar `SYNT`.
- De SYNT-knop toont nu een geïsoleerde syntaxregelprojectie, zonder LEX- of LOG-laag.
- Config bevat `JAN-casing`: uit / alleen regelnotatie / regelnotatie + taklengte.
- In compacte JAN-notatie geldt: onderkast = korte tak, bovenkast = lange tak, regelvolgorde = links/rechts.


## v1.0 config-tabs en hoofdviews
- Config is tabbed: Layout, LEX/bijwoord, Voorbeelden, Regels en Bestanden/docs.
- Het oude projectieblok met LEX/SYNT/LOG-knoppen is uit het hoofdscherm gehaald.
- Het hoofdscherm gebruikt een klein view-blok naast de SOV-box: `SYNT` of `FT`.
- LEX, SYNT en LOG/FT blijven vaste assen rond de gekozen centrale view.

## v1.0 config-reorganisatie

- Config gebruikt meerdere tabs als hoofdstructuur.
- Standaard wordt gewerkt met niet-uitgeklapte details: lange regelsets blijven gesloten totdat de gebruiker ze opent.
- Bijwoordslots en takverlenging staan bij LEX / bijwoord; JAN-casing en SYNT-regels staan bij JAN / SYNT.
## Config-status

- Config werkt met tabs.
- Projectie-instellingen staan geïsoleerd in de tab `Projectie`.
- `Hoofdscherm`, `Layout`, `JAN / SYNT`, `LEX / bijwoord`, `Voorbeelden`, `Regels` en `Bestanden / docs` tonen geen projectieblok meer.

## v1.0 config-isolatie hoofdscherm

- `Hoofdscherm` is een geïsoleerde config-tab.
- Hoofdscherm-opties staan niet meer in Layout of Projectie.
- `Hoofdvenster` en `Taalactiebox verplaatsbaar` staan bij Hoofdscherm.
- `Layout` bevat alleen ruimtelijke layout-keuzes zoals boomruimte en vrije rijen.
