# OpenGraph Lite Viewer v2.0.0-rc.18

OpenGraph Lite Viewer is een demo/viewer voor JAN / OPN / OpenGraph-taalstructuren. Deze versie gebruikt de volledige v1.0.16-bronset als basis.

## Start

```text
index.html
```

Of:

```bat
start-local-viewer.bat
```

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.18
```

Cache-reset:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.18
```

## Centrale views

```text
1. Syntax
2. FT
```

Syntax toont de syntactische boom. FT is de tweede centrale view en toont de functionele structuur met onder meer CLAUSE, PRED, AGENS en PATIENS.

## Named projections

```text
LEX    westas
SYNT   oostas
LOG    zuidas
```

LOG is geen centrale view. De SOV/SVO/etc-actie wijzigt alleen de LOG-projectie.

## Projecties en plaatsing

De Projectie-keuze staat in de bovenbalk met `Alle`, `Bron`, `LEX`, `SYNT`, `LOG`. Bij Bron kunnen LEX, SYNT en LOG afzonderlijk of gecombineerd zichtbaar zijn. De centrale graph transformeert niet en de viewport blijft gelijk.
De bovenbalk is compact: Zin, Bijwoord, View en Projectie blijven direct zichtbaar; `Assen` verschijnt alleen bij Bron. Taal, Help en Config staan onder één leesbaar `Menu`.

LEX-Wissels en bijwoordinserties gebeuren op de LEX-as en muteren Syntax en FT niet.

## Versiebron

`VERSION.txt` is leidend voor HTML, JavaScript, service worker, cachequery, publicatiescript en zipnaam.

## Controle

```bat
check_release.bat
```


## v2.0.0-rc.18

De Main-bovenbalk gebruikt `Zin`, `Bijwoord`, `Syntax`/`FT` en `Projecties` als smalle koppen met brede uitklappen. Er is geen Bron-tabblad. Standaard zijn LEX, SYNT en LOG zichtbaar; `Geen` toont alleen de bron. SOV staat onder `Menu → Extra`.

## Publicatie en cache-reset

`publish_checked.bat` opent na een geslaagde push automatisch eenmaal per versie de GitHub Pages-resetpagina. Er verschijnt geen bevestigingsvraag. Zonder push of bij een pushfout wordt geen reset gestart.

## Raster

Raster is standaard zichtbaar (`Config → Raster`). Het raster loopt tot de uiterste eindpunten van de projectie-stippellijnen; projectieboxen kunnen buiten die rastergrens staan.
