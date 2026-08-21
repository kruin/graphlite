# LEX-plaatsingsregels · v2.0.0-rc.45

## Logische lagen, één zichtbare stap

LEX lost twee lagen op voordat het traject wordt getekend:

```text
1. plaatsingsplanning uit LOG-majors/minors
2. een eventueel expliciet topic-/V1-/V2-doel
```

De planning alleen verplaatst niets. Per bronwoord verschijnt uitsluitend bij
een expliciete regel hoogstens één rechtstreekse verplaatsing naar het doel.
De voorbeeldzin is de verwachte surface-uitkomst en levert geen
basiscoördinaten.

## Bronbasis en planning

- LOG-slots plannen beschikbare LEX-rijen.
- Een bijwoord-minor bezet dezelfde relatieve rij als op LOG.
- Een major met meerdere sources, bijvoorbeeld `pv` en `vdw`, gebruikt
  opeenvolgende rijen binnen de majorzone.
- De bronprojectielijn is altijd horizontaal en blijft op de bronhoogte.
- Zonder expliciete Wissel blijft het bronwoord daar staan en verschijnt geen
  trace.

## Wissels

Een expliciete regel maakt zo nodig een Wissel:

- `Comp` gebruikt slot 0;
- topic/vooropplaatsing gebruikt slot 1;
- V2/persoonsvorm gebruikt slot 2;
- een verplaatst item laat één trace op de horizontale bronrij.

In de ongemarkeerde hoofdzin `HOND BIJT MAN` is slot 2 de vrije LEX-gridrij
tussen de behouden bronhoogten van HOND en MAN. De renderer berekent die
hoogte als het midden van beide bronrijen. Alleen BIJT bezet dat doel; HOND en
MAN behouden hun eigen y-coördinaat en krijgen geen trace.

Er is geen tweede pijl of LOG-tussentrace. De centrale Syntax- of Functional-graph en
de LOG-sequentie veranderen niet.

## Bijwoorden

Een bijwoord is geen vrij LEX-hostslot meer. Het is eerst een LOG-minor.
Alleen een expliciete regel zoals `fronted-v2` maakt een LEX-verplaatsing. Een
scopehost is semantische metadata.

## Gemarkeerde majorvolgorden

`OSV-!`, `VSO-!` en `VOS-!` geven aan dat de huidige regelset nog een
expliciete Wissel nodig heeft voor een volledig surface-resultaat.
