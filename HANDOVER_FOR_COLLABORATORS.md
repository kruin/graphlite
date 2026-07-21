# HANDOVER_FOR_COLLABORATORS

Overdracht voor mensen die verder willen werken aan OpenGraph Lite Viewer v2.0.0-rc.4.

## Wat is dit?

OpenGraph Lite Viewer is een demo/viewer voor Open Graph Notation in taalstructuren.

Open Graph Notation staat op zichzelf. Zij gebruikt een gridregel en een projectiemechanisme. De taaltoepassing gebruikt named projections zoals LEX, SYNT en LOG.

## Kernbegrippen

```text
Gridregel                 elke bronknoop op eigen kruispunt
Projectiemechanisme       bronknoop naar projectiemerker op veronderstelde as
Projectiemerker           punt op een as, ontstaan door projectie
West-as                   algemene richting voor horizontale projectie
Zuid-as                   algemene richting voor zuidelijke projectie
Named projection          projectie met naam en eigen selectieregels
```

## Taaltoepassing

Views:

```text
Syntax tree
Functional structure
```

Named projections:

```text
LEX    woordvolgorde, plaatsingsslots, projectiemerkers
SYNT   syntactische regels
LOG    S-O-V-logische volgorde
```

LEX en de LEX-projectielijnen blijven blauw. SYNT en LOG zijn instelbaar in Config.

## Dynamiek

Open Graph kan volgordelijk worden getoond:

```text
1. bronknopen verschijnen één voor één
2. projecties verschijnen zodra de bronknoop beschikbaar is
3. as-verplaatsingen worden pas actief nadat alle centrale knopen zijn geplaatst
```

Bij boomtoepassingen is de layout tweepass:

```text
bottom-up boxberekening
top-down rendering
```

De centrale graph transformeert niet door projecties of as-verplaatsingen.

## LEX-verplaatsingen

LEX-verplaatsingen gebruiken gereserveerde lege plekken:

```text
Comp
vooropplaatsing/topic
V2/PV
bijwoordslot
trace
```

Ruimte kan ontstaan door vrije rijen, verlengde takken of het lager plaatsen van een host-subboom.

## Werkwijze voor wijzigingen

1. Werk vanaf de nieuwste projectzip.
2. Wijzig appbestanden.
3. Controleer minimaal:

```bat
node --check viewer.js
```

4. Maak een nieuwe versiezip.
5. Meld gewijzigde onderdelen en uitgevoerde controles.

## Publiceren

Gebruik lokaal:

```bat
publish_checked.bat
```

Handmatige publicatie:

```text
https://github.com/kruin/graphlite
https://kruin.github.io/graphlite/
```

Niet uploaden naar GitHub Pages:

```text
OpenGraph_Lite_Viewer_v*.zip
local-mobile-test.js
local-mobile-test.html
```

## Stabiele projectieweergave

Bij wijzigingen aan `LEX`, `SYNT`, `LOG`, `Alle` of `Bron`: behoud dezelfde schaal en positie van de centrale boom. Alleen de projectie-overlay mag veranderen.
