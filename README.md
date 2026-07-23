# OpenGraph Lite Viewer v2.0.0-rc.24

Demo/viewer voor JaN / OPN / OpenGraph-taalstructuren.

## Start

```text
index.html
```

Of lokaal:

```bat
start-local-viewer.bat
```

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.24
```

## Centrale views en projecties

```text
Views:       Syntax, FT
Projecties:  LEX west, SYNT oost, LOG zuid
Default:     LEX + SYNT + LOG zichtbaar
```

LOG is geen centrale view. LOG-volgorde wijzigt uitsluitend de zuidprojectie.

## Topmenu

```text
Rij 1: Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde
Rij 2: NL/EN · LEESMIJ/README · Config
```

## Responsieve maximale view

Met `Boomruimte: Auto` volgt de grid-layout continu het werkelijk beschikbare canvas:

- portrait wordt smaller en hoger;
- landscape wordt breder en lager;
- desktop volgt de actuele vensterverhouding;
- viewBox en raster krijgen dezelfde schermverhouding;
- Syntax, FT en alle projectiecombinaties behouden dezelfde positie en schaal binnen die viewport.

De volledige graph plus gekozen assen wordt zo groot mogelijk weergegeven zonder clipping.

## Interface

`Interface` en `Config → Boom → Interface` bieden Automatisch, Desktop, Mobiel staand en Mobiel liggend. Automatisch kiest op telefoon zelf de passende stand en herfit na oriëntatiewissel.

## Raster

Het raster staat standaard aan via:

```text
Config → Boom → Weergave → Raster zichtbaar
```

## Groei en projecties

Met **Projecties groeien direct mee** verschijnt bij iedere nieuw gerenderde bronknoop meteen de geldige gekozen LEX-, SYNT- en/of LOG-projectie. LEX-Wissels volgen pas na de structurele knoopgroei.

## Publicatie en reset

`publish_checked.bat` opent na een geslaagde push automatisch eenmaal per versie de resetpagina van GitHub Pages.

## Controle

```bat
node --check viewer.js
check_release.bat
```

## Raster op mobile

Op compacte schermen eindigt het raster bij de centrale boom en de uiteinden van de zichtbare projectielijnen. Handmatige interfacekeuzes veranderen deze inhoudsgrens niet.

## Mobile landscape

Automatisch herkent een liggende telefoon via de korte viewportzijde en touch/coarse-pointer. Het landscapeprofiel maakt de graph platter en breder en voert na draaien opnieuw FIT uit.
## TODO

- Niet-binaire, meertakkige bomen.
- JaN (Just another Notation): `S:np-VP`, niet `S:NP-VP`.
- Werknotatie in onderzoek: `S+ np-VP`; eerst voor binaire bomen, later voor meertakkigheid.
- Flip van het verbale cluster: `heeft gebeten` ↔ `gebeten heeft`.

