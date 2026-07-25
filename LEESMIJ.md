# OpenGraph Lite Viewer v2.0.0-rc.23

OpenGraph Lite Viewer is een demo/viewer voor JAN-, OPN- en
OpenGraph-taalstructuren. Deze versie gebruikt de volledige v1.0.16-bronset als
functionele basis.

Engelse documentatie: [`README.md`](README.md).

## Projectiecontract

```text
bronknoop → horizontale LEX-projectie → één rechtstreekse verplaatsing naar het bepaalde LEX-doel
```

`S`, `O` en `V` zijn majors. Een bijwoord is een minor in een configureerbaar
LOG-interval. Iedere minor vergroot de afstand tussen de begrenzende majors met
één vast slot. LOG bepaalt de neutrale doelrij, maar nooit de oorsprong van de
projectie: iedere lexicale bron projecteert eerst horizontaal op zijn
bronhoogte. Een expliciete topic- of V2-regel mag dat neutrale doel vóór het
tekenen vervangen. Daardoor toont de viewer per bronwoord hoogstens één
LEX-verplaatsing en één brontrace, zonder LOG-tussentrace. De voorbeeldzin
bepaalt de layout niet. Zie `projectie-master-spec.md`.

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
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.23
```

Cache-reset:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.23
```

## Desktopweergave

De leesbare weergave over het volledige venster is de standaard. Deze staat
direct bovenaan onder `Config → Beeld`:

```text
Boomruimte   = MAX · groot letterbeeld / lage boom
Venstervulling = MAX · volledig venster benut
```

MAX past alleen de werkelijk getekende boom en projecties in alle beschikbare
desktopruimte. Het onzichtbare stabiliteitskader, raster en hulplabels maken
de graph en tekst dus niet meer kunstmatig klein. Tijdens de gefaseerde
Play-volgorde blijft hetzelfde MAX-kader stabiel.

## Config-tabbladen

Config is verdeeld over vier tabbladen:

1. `Beeld`: MAX, Syntax/FT, boomlayout en projectiekleuren;
2. `LOG & LEX`: LOG-minors, intervalkeuze, LEX-volgorde en regels;
3. `Bestanden`: Config bewaren/herstellen, OPN import/export en voorbeelden;
4. `Geavanceerd`: oude takverlenging en plaatsing van menu’s.

`Venstervulling` betekent hoe de boom het beschikbare appvenster gebruikt.
Het is dus geen tweede venster.

## Publiceren op sociale media

Onder `Config → Bestanden → Graph publiceren` staan drie lokale exports:

- `Graph als SVG`: een zelfstandig vectorbestand van de volledige actuele
  graph;
- `LinkedIn-PNG`: een witte afbeelding van 1200 × 627 voor een beeldpost;
- `Play als WebM`: een automatische opname van de volledige gefaseerde
  Play-reeks in 1200 × 627.

LinkedIn accepteert momenteel PNG en native WebM-video. Houd het
browservenster actief totdat de Play-opname is gedownload. Upload het
`.webm`-bestand via de Video-actie van LinkedIn, niet als document. Zie
[`docs/SOCIAL_EXPORT.md`](docs/SOCIAL_EXPORT.md).

## Lees mij / README

De knop `Lees mij / README` opent onmiddellijk op de intro `Boom, gek`.
Onderwerpnavigatie staat links; intro en actieve tekst staan direct in het
rechter paneel.

De intro toont nu alleen het eerste beeld met traditionele voorbeeldbomen.
De carrouselcode blijft gereed voor latere specificatiebeelden, maar bij één
beeld worden geen bedieningsknoppen getoond.

De externe voorbeeldzoekopdracht opent in een apart browservenster. Na het
sluiten van dat venster staat de app nog open.

## Play-volgorde

Na de opbouw van de centrale boom toont Play het projectieproces in drie
afzonderlijke fasen:

```text
1. LOG-as tekenen en majors/minors plaatsen
2. LOG-afgeleide ruimte op de LEX-as reserveren
3. lexicale bronnen horizontaal naar LEX projecteren en iedere bron eenmaal
   naar het bepaalde doel verplaatsen
```

Het doel is de LOG-afgeleide rij, tenzij een expliciete topic-/V2-regel die rij
vervangt. SYNT en de overige projectiepanelen verschijnen in de laatste stap.
De knop voor de vorige stap keert exact dezelfde volgorde om: eerst verdwijnt
de laatste projectielaag, daarna volgen de LEX-verplaatsingen, de LEX-ruimte,
LOG en ten slotte de centrale boom.

## Centrale views

```text
1. Syntax
2. FT
```

Syntax toont de syntactische boom. FT toont de functionele structuur van
dezelfde voorbeeldzin. LOG is geen centrale view.

## Named projections

```text
LEX    westas
SYNT   oostas
LOG    zuidas
```

Standaard zijn LEX, SYNT en LOG zichtbaar. Iedere projectie kan afzonderlijk
worden uitgezet. `Geen` toont alleen de centrale Syntax- of FT-view; `Alle` en
Reset herstellen alle projecties. Projectiewissels veranderen de centrale
graph, viewport en schaal niet.

Bijwoordinserties gebeuren eerst als minors op de LOG-as en muteren Syntax en FT
niet. Bronitems van majors projecteren recht verticaal naar LOG en worden niet
naar het midden getrokken; minors staan op een compacte eigen rij. Bronknopen
projecteren eerst horizontaal naar LEX. LOG levert het neutrale doel; een
expliciete topic-/V2-regel kan dit vóór het tekenen vervangen, waarna één
rechtstreekse zichtbare verplaatsing volgt.

De actieve zin staat boven de graph. Daaronder blijft ruimte vrij voor een
mogelijke latere noord-as.

## Beperkte meerwoordige bijwoordelijke eenheden

De bijwoordlijst bevat nu bewust vier beperkte meerwoordige eenheden:
`MISSCHIEN WEL`, `AF EN TOE`, `OP DIT MOMENT` en
`MET VEEL AANDACHT`. Iedere volledige groep geldt voorlopig als één LOG-minor
en één LEX-eenheid; de interne syntaxis wordt nog niet uitgewerkt. De set
illustreert modaliteit, frequentie, tijd en wijze, maar is geen volledige
inventaris van bijwoordelijke bepalingen. Zie
[`docs/TALIGE_UITBREIDINGEN.md`](docs/TALIGE_UITBREIDINGEN.md).

## Topmenu

```text
Zin · Bijwoord · Syntax/FT · Projecties · LOG-volgorde · NL/EN · Lees mij / README · Config
```

Er is geen algemene knop `Menu` en er zijn geen geneste submenu’s. Keuze-items
openen rechtstreeks hun eigen brede paneel.

## OPN-opslag

`.opn` is het primaire round-trip documentformaat. Het document scheidt:

```text
metadata    documentidentiteit, formaat en generator

data        graph, projecties en analysekeuzes

paradata    optionele workspace en lokale sessie-events
```

Paradata kan bij export worden weggelaten. Oudere JSON-bestanden blijven als
migratieformaat leesbaar; Legacy JSON-export blijft tijdelijk beschikbaar voor
debugging. Zie `OPN_STORAGE_FORMAT.md`.

## Versiebron

`VERSION.txt` is leidend voor HTML, JavaScript, service worker, cachequery,
publicatiescript en zipnaam.

## Controle

```bat
node --check viewer.js
check_release.bat
```

## Voorbeeldset en bestandsbediening (rc.18)

- De viewer bevat 14 voorbeeldzinnen, inclusief twee voorbeelden met meerdere
  LOG-minors.
- Bij automatische plaatsing is de klasseconfiguratie leidend:
  `MODALITEIT → S-O` en `FREQUENTIE → O-V`. De volgorde in de voorbeeldzin
  en oude positiehints kunnen dit niet overschrijven.
- `Opslaan als .opn` downloadt de huidige analyse.
- `Importeer .opn` opent een eerder geëxporteerd document.
- Paradata is optioneel.
