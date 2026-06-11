# Layout-specificatie v4408

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

v4408 voegt een presentatie-laag toe bovenop de bestaande layout.

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

De render-volgorde is vanaf v4406 expliciet en blijft in v4408 gelden:

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
