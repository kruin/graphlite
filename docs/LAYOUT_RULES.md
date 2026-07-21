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

## Compacte bovenbalk

- De bovenbalk blijft één vaste rij en wordt niet hoger door projectie- of askeuzes.
- Direct zichtbaar: Zin, Bijwoord, View en Projectie.
- `Assen` verschijnt alleen wanneer `Bron` actief is.
- Taal, Help en Config staan in een tijdelijk `Menu` met volledige, leesbare knopnamen.
- Op smallere schermen mogen vaste veldlabels verdwijnen; de geselecteerde waarden en toegankelijke labels blijven aanwezig.
- Selects mogen tekst met ellipsis inkorten, maar de volledige opties blijven in de pulldown beschikbaar.
- Openen of sluiten van `Assen` of `Menu` mag de canvasmaat, viewBox, schaal of boompositie niet wijzigen.

## Projectiekeuze en Bronassen

- De projectiekeuze staat in de bovenbalk, buiten het SVG-canvas.
- De keuzevolgorde is `Alle → Bron → LEX → SYNT → LOG`.
- `Alle` toont de centrale view met alle named projections.
- `LEX`, `SYNT` en `LOG` tonen afzonderlijk één named projection op de vaste canonieke aspositie.
- `Bron` toont de centrale view en kan nul, één, twee of drie gekozen assen tonen.
- Bij Bron zijn LEX, SYNT en LOG onafhankelijk combineerbaar.
- De Bronassen-keuze staat in een tijdelijke compacte popover; er is geen permanente projectiebox in het canvas.
- Openen of sluiten van de popover verandert de canvasmaat niet.
- De taalactiebox verschijnt alleen wanneer LOG zichtbaar is.
- De taalactiebox mag de LOG-as niet verplaatsen.

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


## Stabiele projectie-viewport (v2.0.0-rc.6)

- `Alle`, `Bron`, `LEX`, `SYNT` en `LOG` delen één identieke viewBox.
- Een projectiewissel mag de centrale boom niet horizontaal of verticaal verplaatsen.
- Een projectiewissel mag de schaal niet wijzigen.
- De vaste viewBox is gebaseerd op de unie van de Syntax- en FT-layout.
- De wissel `Syntax ↔ FT` behoudt dezelfde viewport en handmatige pan/zoom.
- Groei mag geen afzonderlijke projectiespecifieke viewBox gebruiken.
- De tijdelijke Bronassen-popover sluit bij klik buiten het menu of met Escape.
