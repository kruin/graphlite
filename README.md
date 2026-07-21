# OpenGraph Lite Viewer v2.0.0-rc.6

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
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.6
```

Cache-reset:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.6
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
