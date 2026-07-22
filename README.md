# OpenGraph Lite Viewer v2.0.0-rc.17

Demo/viewer voor JAN / OPN / OpenGraph-taalstructuren.

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
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.17
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
Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde · NL/EN · Help · Config
```

## Interface en mobile full view

`Interface` en `Config → Boom → Interface` bieden Automatisch, Desktop, Mobiel staand en Mobiel liggend. Automatisch kiest op telefoon zelf de passende mobile-interface. De viewer gebruikt daar de volledige beschikbare ruimte onder de bediening.

## Raster

Het raster is standaard zichtbaar. De instelling staat direct op:

```text
Config → Boom → Weergave → Raster zichtbaar
```

Het raster eindigt bij de uiterste eindpunten van de zichtbare projectie-stippellijnen. De rastergrens verandert de viewBox niet.

## Publicatie en reset

`publish_checked.bat` opent na een geslaagde push automatisch eenmaal per versie de resetpagina van GitHub Pages.

## Controle

```bat
node --check viewer.js
check_release.bat
```

## rc.16-correcties

Raster is standaard zichtbaar, ook binnen de boom. In Config staat `Raster zichtbaar` direct in de vaste bovenbalk. Het mobile topmenu toont alle acht opties in twee rijen: vijf items boven en vier onder.

## Topmenu-indeling rc.17

```text
Rij 1: Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde
Rij 2: NL/EN · Help · Config
```

De indeling is vast op desktop en mobile; zij gebruikt geen vrije wrapping.
