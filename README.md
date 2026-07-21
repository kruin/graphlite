# OpenGraph Lite Viewer v2.0.0-rc.4

OpenGraph Lite Viewer is een demo/viewer voor **JAN / OPN / OpenGraph-taalstructuren**.

Open Graph Notation staat op zichzelf. De notatie beschrijft bronknopen op een open grid en projecties vanuit die bronknopen naar veronderstelde assen. Toepassingen, zoals een taalboom, gebruiken dit algemene mechanisme.

## Start

Lokaal:

```text
index.html
```

Of met lokale server:

```bat
start-local-viewer.bat
```

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.4
```

Cache-reset:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.4
```

## Open Graph Notation

Kernbegrippen:

```text
Gridregel
Projectiemechanisme
Volgordelijk schrijven
Projectiemerker
```

De **Gridregel** geeft elke bronknoop een eigen kruispunt. In de strikte boomtoepassing staat elke knoop als enige op zijn horizontale én verticale gridlijn.

Het **projectiemechanisme** verbindt een bronknoop met een positie op een veronderstelde as. De bronknoop blijft staan. De positie op de as heet een **projectiemerker**.

```text
west-as   horizontale projectie naar links
zuid-as   zuidelijke projectie onder het grid
```

In de algemene notatie zijn die assen nog niet taalkundig ingevuld.

Open Graph Notation is volgordelijk te lezen: bronknopen verschijnen één voor één; zodra een bronknoop beschikbaar is, kan zijn projectie worden geschreven. Bij boomtoepassingen is de layout tweepass: eerst worden boxen bottom-up uitgerekend, daarna top-down gerenderd. Het resultaat is statisch: de centrale graph transformeert niet door projecties of as-verplaatsingen.

## Named projections in de taaltoepassing

```text
LEX    westelijke named projection: lexicale items, plaatsingsslots en projectiemerkers
SYNT   named projection voor syntactische categorieën en regels
LOG    zuidelijke named projection: selectie van S, O en V
```

LEX en de LEX-projectielijnen blijven blauw. SYNT en LOG hebben eigen instelbare projectiekleuren in Config. LOG-kleurwijzigingen werken direct; met Ja · bewaar config wordt een lokale snapshot opgeslagen.

## Views

```text
Syntax tree              standaardweergave
Functional structure     standaard alternatieve weergave
```

De **Syntax tree** toont categorieën zoals S, NP, VP, V en N.

De **Functional structure** toont rollen zoals CLAUSE, AGENS, PRED en PATIENS.

## LEX-verplaatsingen

Verplaatsingen op assen worden pas actief nadat alle centrale bronknopen zijn geplaatst. Voor LEX gebruiken ze vooraf aangebrachte lege plekken:

```text
Comp-slot                voegwoord / complementizer, bijvoorbeeld OMDAT
vooropplaatsing/topic    eerste zinsdeel
V2/PV-slot               persoonsvormpositie
bijwoordslot             externe LEX-insertie boven een hostbox
trace                    oude basispositie na wissel
```

Ruimte voor zulke plekken kan ontstaan door een vrije rij, een verlengde tak of door de host-subboom lager te plaatsen.

## Projecties en config

Na afgeronde Play verschijnt de box **Projecties**. `Alle` toont de centrale view met alle named projections. `Bron` toont de centrale bronview zonder projectie-assen. LEX, SYNT en LOG tonen elk één afzonderlijke named projection op dezelfde canonieke aspositie die zij in `Alle` gebruiken. De Projecties-box en taalactiebox zijn verplaatsbaar; dubbelklik op lege ruimte reset de positie.

Config-wijzigingen worden direct toegepast. Gebruik **Ja · bewaar config** voor een lokale snapshot, **Nee** om de laatst bewaarde snapshot te herstellen en **Download lokaal config-log** om de lokale wijzigingen als tekstbestand te bewaren.

## Publiceren

Gebruik:

```bat
publish_checked.bat
```

Deze voert minimaal uit:

```bat
node --check viewer.js
```

## Projectieweergave

`Bron`, `Alle`, `LEX`, `SYNT` en `LOG` tonen dezelfde centrale graph met dezelfde schaal en positie. Alleen de projectie-overlay wisselt.
