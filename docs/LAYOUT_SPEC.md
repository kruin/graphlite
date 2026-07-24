
# Actuele architectuur — plaatsingsplan vóór rendering

De layout krijgt niet alleen de kernstructuur als input. Zij krijgt het volledige plaatsingsprobleem:

```text
structuur
+ lexicale insertiegroepen
+ plaatsingsregels
+ Wissels
+ actieve projecties
```

De berekening verloopt in deze volgorde:

```text
1. structurele hosts en subtree-afmetingen bepalen
2. insertiegroepen per host verzamelen en ordenen
3. landingsplaatsen, minor-ankers en minimale fysieke afstanden bepalen
4. gridruimte en Wissel-corridors reserveren
5. centrale boom in het resterende veld plaatsen
6. kernzin en lexicale waarden in de berekende posities invullen
7. projecties, traces en Wisselpaden vastleggen
8. growthSteps en SVG-renderlagen toekennen
9. renderen
```

De renderer is daarmee uitsluitend een teken- en zichtbaarheidslaag. Ook Play/Groei gebruikt de definitieve layout en laat daarvan steeds meer elementen zien. Een growthStep mag nooit nieuwe ruimte reserveren of bestaande coördinaten wijzigen.

## v4540 - Bijwoorden als externe LEX-slots

Bijwoordplaatsing blijft volledig op de LEX-as. `Boven S/NP/VP/V/PP/AP` betekent: plaats een extern LEX-slot verticaal net boven de gekozen syntactische hostbox. Het bijwoord wordt niet op de syntaxboom getekend en is geen projectie uit de basisboom. De host-subboom wordt lager gezet om ruimte te maken. Notatie: `LEX-ADV[..., axis=LEX, source=external, host=...]`.

## v4430 · LEX-renderlaag

Projectielijnen uit de boom eindigen op basisposities op dezelfde horizontale hoogte als de bronknoop. Lokale LEX-Wissels verplaatsen daarna naar de surface-slots.

# Layout-specificatie v4430

## v4430 · LEX-projectie blijft horizontaal

Voor elke bronknoop met een lexicaal item geldt nu:

```text
projectie: bronknoop(x,y) → LEX-bronpositie(xLEX,y)
```

De y-coördinaat op de LEX-as wordt dus uit de centrale boom overgenomen. De LEX-as mag daarna lokaal een **Wissel** tekenen naar een vrij slot, maar die Wissel is geen projectielijn vanuit de boom.

Renderlagen:

```text
1. centrale boom
2. LEX-bronposities horizontaal
3. lokale LEX-Wissels + traces
4. optionele projectiepanelen
```


---

# Layout-specificatie v4430

## v4430 · vrije LEX-slots en V2

De layout reserveert nu niet één maar twee vrije OPN-posities tussen root en boommateriaal:

```text
S / CLAUSE
slot 1 · vooropplaatsing/topicalisatie
slot 2 · V2/persoonsvorm
gewone tree-materialen
```

Dit is layout-ruimte, geen transformatie van de centrale boom. De LEX-render kan een bronpositie via **Wissel** naar zo’n vrij slot projecteren. De oude basisplek wordt als trace getekend.

---

## Algemene werkwijze

De layout werkt bottom-up:

```text
1. lees structure-config
2. bouw subtree-objecten
3. bereken per leaf een minimale box
4. combineer children recursief
5. zoek per child-subtree een vrije plaats
6. reserveer bezette cellen en HOR/VER-corridors
7. render nodes, boxen en edges
```

## Drie gescheiden volgordes

De viewer houdt drie volgordes uit elkaar:

```text
A. layout-volgorde
   bepaalt de x/y-posities

B. groei-volgorde
   bepaalt welke elementen zichtbaar worden in stap 0, 1, 2, ...

C. render-volgorde
   bepaalt de SVG-laagvolgorde: wat ligt achter/voor
```

Groei mag geen layout herberekenen. Render mag geen layout wijzigen.

## Groei-presentatie

v4430 voegt een presentatie-laag toe bovenop de bestaande layout.

Principe:

```text
1. bereken volledige layout
2. bereken per element een growthStep
3. render alleen elementen met growthStep <= huidige stap
```

Bottom-up node-step:

```text
leaf                 = stap 1
parent van leaf      = stap 2
hogere subtree       = stap 3, 4, ...
root S/CLAUSE        = laatste structure-stap
OPN-slot 1           = root + 1
LEX-projectie/assen  = root + 2   [alleen Assen-view]
```

Voor `HOND BIJT MAN` betekent dit conceptueel:

```text
0. raster/titels
1. HOND, BIJT, MAN
2. NP(HOND), V(BIJT), NP(MAN)
3. VP(...)
4. S(...)
5. OPN-slot 1
6. LEX-projectie + SYNTAX-paneel
```

De exacte volgorde tussen even diepe nodes wordt alleen voor render-zichtbaarheid geordend: boven→beneden, links→rechts. De groei zelf is niet bedoeld als grammaticale bewering over woordvolgorde.

## Stap 3: render-volgorde

Render is alleen de tekenlaag. De x/y-posities zijn dan al berekend.

De render-volgorde is vanaf v4406 expliciet en blijft in v4430 gelden:

```text
1. grid
2. subtree-box rects
   - grootste box eerst
   - bij gelijke grootte: boven naar beneden
   - daarna: links naar rechts
   - daarna: oorspronkelijke layoutvolgorde
3. subtree-box captions
4. takken/lijnen
5. OPN-slot
6. node-shapes
   - boven naar beneden
   - links naar rechts
7. node-labels
   - zelfde volgorde als node-shapes, maar altijd bovenop
```

Belangrijk: leaf-nodes zoals `HOND`, `BIJT`, `MAN` zijn geen subtree-boxen. Zij worden als node-shapes en node-labels getekend in stap 6 en 7. Daardoor verdwijnen labels niet achter cirkels of boxen.

## Geen containment-layout

De layout mag niet simpelweg alle children naast elkaar in een parent-box zetten. Child-subtrees worden als zelfstandige boxen geplaatst op vrije posities.

## Layout order

```text
left-first  = eerste kandidaat zoekt links, daarna alternerend verder
right-first = eerste kandidaat zoekt rechts, daarna alternerend verder
```

Geldt voor syntax en functioneel.

## Flipdoel per vertakking

Elke vertakking kan apart beslissen welke child-subtree eerst wordt geplaatst.

Menu:

```text
Flipdoel:
- doel: compact · auto per vertakking
- doel: align subj/agens + obj/patiens
- globaal: normaal
- globaal: flip alle vertakkingen

Top S/CLAUSE:
- auto
- normaal
- flip

VP / ARG-STRUCT:
- auto
- normaal
- flip

Overig:
- auto
- normaal
- flip
```

## Doel 1: compact

`auto-compact` probeert per vertakking beide volgordes:

```text
normaal: child1 child2 ...
flip:    ... child2 child1
```

Daarna kiest de layout de kandidaat met de kleinste boxscore:

```text
area eerst
dan hoogte
dan breedte
```

De grammatica verandert niet. Alleen de plaatsingsvolgorde van complete subtree-boxes verandert.

## Doel 2: align

`auto-align` gebruikt dezelfde per-vertakking test, maar geeft extra voordeel aan layouts waarin equivalente verticale corridors dichter bij elkaar komen. Richtparen:

```text
syntax:      NP-subj ↔ subject, NP-obj ↔ object
functioneel: ARG1/AGENS ↔ subject, ARG2/PATIENS ↔ object
```

Dit is een layoutdoel, geen semantische wijziging.

## Handmatige override

Per branchklasse kan de gebruiker `auto`, `normaal` of `flip` afdwingen. De branchklassen zijn:

```text
Top S/CLAUSE      = startvertakking
VP / ARG-STRUCT   = middenvertakking
Overig            = alle andere vertakkingen
```

## v4430 · Render van de LEX-as

De LEX-as heeft nu een expliciete oppervlaktestap: alle lexicale tokens worden eerst op basis van voorbeeldzinvolgorde geplaatst. Daarna tekent de renderlaag vrije slots, Wissel-pijlen en traces. Bronlayout of recursieve boomlayout mag de zichtbare LEX-tokenvolgorde niet veranderen.

## v4430 · lokale Wissel-laag

In de assenweergave zijn projectie en Wissel gescheiden. Projectielijnen lopen van de centrale bronknoop naar het gevulde LEX-slot. De Wissel zelf is een lokale laag op de LEX-as: van trace-slot naar vrij/gevuld slot. Traces worden dus niet in de boom geplaatst.


## v4430 · dynamische pixelprojectie

De vrije boomlayout berekent nog steeds discrete HOR/VER-gridposities. Daarna wordt pas naar SVG-pixels geprojecteerd. Die projectie is nu instelbaar:

```text
cellX groter  → bredere takken / meer HOR-ruimte
cellY kleiner → minder verticale hoogte
fontScale     → grotere labels zonder layoutcoördinaten te wijzigen
```

De optie `Venster: automatisch passend` verandert alleen de SVG-viewBox. Zij herberekent de boom niet.



### v4430 LEX-verplaatsingsregels

1. Projecteer elke bronknoop eerst horizontaal naar de LEX-as.
2. Verplaats alleen wanneer een expliciete regel een vrij slot vult: 0=Comp, 1=topic/vooropplaatsing, 2=V2/PV.
3. Niet-verplaatste knopen blijven op hun basisprojectie en krijgen geen trace.
4. Alleen de verplaatste knoop laat op de oude basispositie een trace achter.


## v4430 takvolgorde

De standaardtakvolgorde is grammaticaal/normaal: `S → NP VP` en `VP → NP V`. De eerste child wordt links en hoger geplaatst; de tweede child rechts en lager. Hierdoor ligt de basisprojectie op de LEX-as in de verwachte volgorde: subject hoog, object daaronder, V/PV onderaan. Alleen expliciete vrije-slotregels zoals V2 of topicalisatie veroorzaken een Wissel en een trace.

## Groei-volgorde v4535

Groei-volgorde is een presentatievolgorde, geen layoutvolgorde. De layout wordt volledig vooraf berekend. Daarna krijgen alle knopen een `growthStep`.

De `growthStep` wordt bepaald door:

1. bottom-up hoogte in de boom;
2. bij gelijke hoogte: ruimtelijke positie boven-naar-beneden;
3. daarna links-naar-rechts;
4. daarna oorspronkelijke layoutvolgorde als laatste tie-breaker.

Hierdoor verschijnen leaves niet meer allemaal tegelijk. Dit maakt zichtbaar of bijvoorbeeld `HOND`, `MAN` en `BIJT` in een bepaalde presentatievolgorde worden getoond.


## v4535 · stapsgewijze LEX-Wissels

- De boomgroei blijft deterministisch: binnen een groeilaag wordt gerenderd van boven naar beneden en daarna van links naar rechts.
- Flip/layout wijzigt de berekende posities; daardoor kan de groeivolgorde indirect veranderen, maar de renderregel blijft ruimtelijk: boven → beneden, links → rechts.
- In Assen verschijnt de LEX-as nu stapsgewijs: eerst de horizontale basisprojectie, daarna per stap één lokale Wissel met trace, daarna pas het volledige resultaat met projectiepanelen.
- Verplaatsingen blijven lokaal op de LEX-as; er komen geen verplaatsingslijnen vanuit de boom.


## v4535 - beweeglijke boom/LEX-view

- Boom en LEX-as zijn niet meer vast in het canvas.
- Sleep in het SVG-canvas om de view te verplaatsen.
- Ctrl + muiswiel zoomt rond de cursor.
- Shift + muiswiel pant horizontaal.
- FIT herstelt de automatische view.


### NOORD-as (PM)

Naast west/LEX, oost/SYNTAX en zuid/LOGICAL is ook een NOORD-as mogelijk. Die is genoteerd als uitbreiding, maar nog niet gebruikt.

## v4504 · strak passend raster rond boom + assen

- In het hoofdscherm volgt de SVG-viewBox nu exact de getekende boom plus projectie-assen.
- Het raster wordt dynamisch opnieuw opgebouwd binnen dezelfde fit-box; lege rastervelden rondom worden niet meer meegetekend.
- Hulplabels en het raster zelf tellen niet meer mee bij FIT.
- In Config blijft de ruimere aspect-fit beschikbaar voor beheer en vergelijking.


### v4504 — Main-bediening in boomvenster

- Main behoudt een vaste topbalk met alleen Zin en Config.
- De ZUID-volgorde staat nu als zichtbare pijlbediening onder in het boomvenster.
- In portrait staat de Play-balk onder het grid met Reset direct ernaast; de Assen/LOG-balk sluit daaronder aan.
- In landscape staat Play verticaal rechts in het boomvenster, met Reset en Assen/LOG eronder.

## v4505 - OSV-! en LEX-rendering

OSV-! is bewust gemarkeerd met een uitroepteken. De box-aanpak kan nooit OSV opleveren als basisalternatief: de VP blijft object en werkwoord als subtree groeperen. Een pure flip van boxen is dan onvoldoende.

Voor een correcte zichtbare LEX-as moet altijd een expliciete verplaatsingsregel werken. OSV-! is dus geen basis-layout of taalkundig alternatief, maar een waarschuwing/testlabel bij een onmogelijke boxvariant. De andere volgordes en bestaande flips blijven hierdoor ongemoeid.



## v4506 - LEX-bijwoordslots

Vrije LEX-inserts voor bijwoorden zijn nu gedocumenteerd als slottypen met verschillende scope. De basisregel blijft: reserveer slots tussen zichtbare LEX-boxen en plaats het slot op verticale overlap als die bestaat. Daarna bepaalt het bijwoordtype de exacte plaatsing.

- Tijd: `GISTEREN`, `MORGEN` - meestal `VP-BETWEEN`, eventueel `S-LEFT` bij vooropplaatsing.
- Frequentie: `VAAK`, `SOMS`, `ALTIJD` - `VP-BETWEEN`.
- Negatie: `NIET` - apart `NEG`/`V-NEAR` slot.
- Wijze: `SNEL`, `HARD`, `ZACHTJES` - `V-NEAR` of `VP-RIGHT`.
- Zinsbijwoord: `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS` - hoog `S/VP` of `S-LEFT`.
- Focus: `ALLEEN`, `OOK`, `ZELFS` - bij de gefocuste phrase.
- Graad: `HEEL`, `ERG`, `ZEER` - intern in `AP/AdvP/NP`, dus geen algemene hostloze bijwoordpositie.

De centrale boom wordt niet herschreven. Bijwoorden horen in deze fase in de LEX-renderlaag of in phrase-interne slots.

Zie ook: `docs/LEX_ADVERB_INSERT_SLOTS.md`.

## v4535 - OSV-!, VSO-! en VOS-!

`VSO` en `VOS` worden nu net als `OSV` gemarkeerd: `VSO-!` en `VOS-!`. Het uitroepteken betekent dat de box-aanpak deze volgorde niet als basisalternatief kan opleveren. Voor correcte rendering op de LEX-as is een expliciete verplaatsingsregel nodig. Bestaande bomen en bestaande flips blijven ongemoeid.



## v4535 - LEX slot 0 boven S

Slot 0 op de LEX-as staat in de gecombineerde Assen-weergave weer boven de centrale S/CLAUSE-root. Bronknopen blijven op hun eigen hoogte; alleen de lokale LEX-systeemslots starten hoger.
