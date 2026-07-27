# LEX-plaatsingsregels · v2.0.0-rc.41

## Logische lagen, één zichtbare stap

LEX lost twee lagen op voordat het traject wordt getekend:

```text
1. neutrale basis uit LOG-majors/minors
2. een eventueel expliciet topic-/V2-doel
```

Daarna verschijnt per bronwoord hoogstens één rechtstreekse verplaatsing naar
het bepaalde einddoel. De voorbeeldzin is de verwachte surface-uitkomst en
levert geen basiscoördinaten.

## Neutrale basis

- LOG-slots bepalen de LEX-rijen.
- Een bijwoord-minor bezet dezelfde relatieve rij als op LOG.
- Een major met meerdere sources, bijvoorbeeld `pv` en `vdw`, gebruikt
  opeenvolgende rijen binnen de majorzone.
- De bronprojectielijn is altijd horizontaal en blijft op de bronhoogte.

## Wissels

Een expliciete regel vervangt zo nodig het neutrale doel:

- `Comp` gebruikt slot 0;
- topic/vooropplaatsing gebruikt slot 1;
- V2/persoonsvorm gebruikt slot 2;
- een verplaatst item laat één trace op de horizontale bronrij.

Er is geen tweede pijl of LOG-tussentrace. De centrale Syntax- of Functional-graph en
de LOG-sequentie veranderen niet.

## Bijwoorden

Een bijwoord is geen vrij LEX-hostslot meer. Het is eerst een LOG-minor.
Alleen een expliciete regel zoals `fronted-v2` vervangt het neutrale
LEX-einddoel. Een scopehost is semantische metadata.

## Gemarkeerde majorvolgorden

`OSV-!`, `VSO-!` en `VOS-!` geven aan dat de huidige regelset nog een
expliciete Wissel nodig heeft voor een volledig surface-resultaat.
