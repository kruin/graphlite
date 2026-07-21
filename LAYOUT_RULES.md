# LAYOUT_RULES

Harde layoutregels voor OpenGraph / GraphLite.

## Gridregel

- Elke bronknoop heeft een eigen kruispunt.
- In de strikte boomtoepassing staat elke knoop op een eigen horizontale gridlijn.
- In de strikte boomtoepassing staat elke knoop op een eigen verticale gridlijn.
- Het grid ondersteunt projecties; rasterlijnen blijven visueel terughoudend.

## Projectiemechanisme

- Een projectie vertrekt vanuit een bronknoop.
- De bronknoop blijft staan.
- De projectie eindigt op een projectiemerker op een veronderstelde as.
- Horizontale projecties kunnen naar een west-as lopen.
- Zuidelijke projecties kunnen naar een zuid-as lopen.
- Algemene assen krijgen pas inhoud via named projections.

## Volgordelijk schrijven

Open Graph kan als dynamisch schrijfproces worden getoond:

```text
bronknopen één voor één
projectie zodra bronknoop beschikbaar is
projectiemerker op as
```

Voor boomtoepassingen geldt:

```text
pass 1: boxen bottom-up berekenen
pass 2: top-down renderen
```

De centrale graph transformeert niet door projecties of as-verplaatsingen.

## Named projections

```text
LEX    links/west: lexicale items, plaatsingsslots, projectiemerkers
SYNT   rechts/oost: syntactische regels en categorieprojectie
LOG    onder/zuid: S-O-V-logische volgordeprojectie
```

LEX en de LEX-projectielijnen blijven blauw. SYNT en LOG gebruiken eigen instelbare kleuren.

## LOG-as

- De LOG-as heeft een oorspronkelijke SVG-hoogte.
- Die hoogte blijft stabiel bij plaatsing van de SOV-box en andere HTML-overlays.
- HTML-overlays passen zich aan de as aan.
- LOG toont de logische projectie met S-O-V / S-V-O / V-S-O enzovoort.

## LEX-as en lege plekken

LEX projecteert bronknopen eerst naar blauwe projectiemerkers. Verplaatsingen op de LEX-as worden pas actief nadat alle centrale knopen zijn geplaatst.

Lege plekken:

```text
Comp-slot                ruimte voor voegwoord/complementizer
vooropplaatsing/topic    ruimte voor eerste zinsdeel
V2/PV-slot               ruimte voor persoonsvorm
bijwoordslot             ruimte voor externe LEX-insertie
trace                    markering van oude basisprojectiemerker
```

Ruimte ontstaat door vrije rijen, verlengde takken of het lager plaatsen van een host-subboom.

## Views

```text
Syntax tree              standaardweergave
Functional structure     standaard alternatieve weergave
```

## Projecties-blok

- Het blok heet `Projecties`.
- Het blok verschijnt na afgeronde Play.
- Reset of een nieuwe Play verbergt het blok.
- In het blok staat `Alle` als eerste keuze.
- `Alle` toont de centrale view met alle named projections.
- `Bron` toont de centrale bronview zonder projectie-assen; terug naar `Alle` toont alle projectie-assen opnieuw.
- `LEX`, `SYNT` en `LOG` tonen afzonderlijk één named projection op de vaste canonieke aspositie.
- De Projecties-box heeft een stabiele schermpositie en is verplaatsbaar wanneer Config dit toestaat.
- De taalactiebox is verplaatsbaar wanneer Config dit toestaat.

Volgorde:

```text
Alle → Bron → LEX → SYNT → LOG
```

## Belijning

- Rasterlijnen zijn minimaal.
- Boomlijnen en boxranden zijn terughoudend.
- Projectielijnen dragen de nadruk.
- LEX-projectielijnen zijn blauw.
- SYNT- en LOG-projectielijnen volgen de kleurinstelling in Config.

## Stabiele centrale view

- De centrale boom gebruikt dezelfde celmaten in `Bron`, `Alle`, `LEX`, `SYNT` en `LOG`.
- Wisselen tussen afzonderlijke projecties mag de centrale boom niet herschalen of verplaatsen.
- Projecties worden als overlays toegevoegd op vaste posities rond dezelfde centrale graph.


## Stabiele projectie-viewport (v2.0.0-rc.4)

- `Alle`, `Bron`, `LEX`, `SYNT` en `LOG` delen één identieke viewBox.
- Een projectiewissel mag de centrale boom niet horizontaal of verticaal verplaatsen.
- Een projectiewissel mag de schaal niet wijzigen.
- De vaste viewBox is gebaseerd op de unie van de Syntax- en FT-layout.
- De wissel `Syntax ↔ FT` behoudt dezelfde viewport en handmatige pan/zoom.
- Groei mag geen afzonderlijke projectiespecifieke viewBox gebruiken.
