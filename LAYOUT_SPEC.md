# Layout-specificatie v4405

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

## Geen containment-layout

De layout mag niet simpelweg alle children naast elkaar in een parent-box zetten. Child-subtrees worden als zelfstandige boxen geplaatst op vrije posities.

## Layout order

```text
left-first  = eerste kandidaat zoekt links, daarna alternerend verder
right-first = eerste kandidaat zoekt rechts, daarna alternerend verder
```

Geldt voor syntax en functioneel.

## Flipdoel per vertakking

Vanaf v4405 is flip geen alleen-globale instelling meer. Elke vertakking kan apart beslissen welke child-subtree eerst wordt geplaatst.

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
VP / ARG-STRUCT   = centrale verbale/argumentstructuur
Overig            = alle andere vertakkingen
```

## Syntax

Standaard:

```text
S → NP VP
VP → NP V
V → predicate
```

Perfectum kan in structure-config worden gezet als:

```text
VP → NP VP
VP → pv vdw
```

## Functioneel

Standaard:

```text
CLAUSE
├─ PRED
│  └─ predicate
└─ ARG-STRUCT
   ├─ ARG1
   │  └─ NP
   │     └─ subject
   └─ ARG2
      └─ NP
         └─ object
```

Hierdoor zijn `PRED` en `ARG-STRUCT` zelfstandige subtree-boxes. De structuur kan vrijer worden geplaatst dan bij `CLAUSE → AGENS PRED PATIENS`.
