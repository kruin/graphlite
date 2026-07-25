# OpenGraph Lite Viewer v2.0.0-rc.23

OpenGraph Lite Viewer is een demo/viewer voor JAN-, OPN- en
OpenGraph-taalstructuren. Bronknopen projecteren horizontaal naar LEX; LOG
levert daarna doelrijen voor plaatsing langs de as.

Engelse documentatie: [`README.md`](README.md).

## Projectiecontract

```text
bronknoop → horizontale LEX-projectie → één rechtstreekse verplaatsing naar het bepaalde LEX-doel
```

`S`, `O` en `V` zijn majors. Een bijwoord-minor bezet een configureerbaar
LOG-interval en vergroot de afstand tussen zijn begrenzende majors met één vast
slot. Iedere lexicale bron projecteert eerst op zijn bronhoogte. LOG bepaalt
de neutrale doelrij, nooit het projectieanker. Een expliciete topic-/V2-regel
mag die rij vóór het tekenen vervangen, zodat ieder bronwoord hoogstens één
zichtbare verplaatsing en één brontrace heeft. De voorbeeldzin valideert het
resultaat en levert geen layoutcoördinaten.

## Play-volgorde

Na de opbouw van de centrale boom gebruikt Play drie afzonderlijke fasen:

```text
1. LOG-as
2. LOG-afgeleide ruimte op LEX reserveren
3. lexicale bronnen horizontaal projecteren en elk eenmaal naar het doel verplaatsen
```

SYNT en de overige projectiepanelen verschijnen in de laatste stap.
De vorige-stapknop voert dit proces exact omgekeerd uit; de laatste
projectielaag verdwijnt onmiddellijk bij de eerste stap terug.

## Carrousel en externe link

De intro toont voorlopig alleen het eerste beeld met traditionele bomen.
De carrouselbediening blijft gereed voor latere specificatiebeelden en blijft
verborgen zolang er één beeld is.

De voorbeeldzoekopdracht opent in een apart browservenster. Na het sluiten
daarvan blijft de app open.

## Social-export en beperkte groepen

`Config → Bestanden → Graph publiceren` exporteert een zelfstandige SVG, een
LinkedIn-PNG van 1200 × 627 of een WebM-opname van de volledige Play.
LinkedIn accepteert WebM als native video. Zie `SOCIAL_EXPORT.md`.

De bijwoordlijst bevat nu ook `MISSCHIEN WEL`, `AF EN TOE`,
`OP DIT MOMENT` en `MET VEEL AANDACHT`. Iedere volledige groep geldt
voorlopig als één LOG-minor; de interne syntaxis volgt pas na afzonderlijke
specificatie. Zie `TALIGE_UITBREIDINGEN.md`.

## Start

```text
index.html
start-local-viewer.bat
```

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.23
```

## Centrale views en named projections

```text
centraal: Syntax, FT
west:     LEX
oost:     SYNT
zuid:     LOG
```

LOG is een named projection op de zuidas en geen centrale view. LEX, SYNT en
LOG zijn standaard zichtbaar en delen één stabiel viewport.

## OPN-opslag

`.opn` is het primaire round-trip documentformaat en scheidt metadata, data en
optionele paradata. Zie `OPN_STORAGE_FORMAT.md`.

## Controle

```bat
node --check viewer.js
check_release.bat
```
