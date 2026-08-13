# LEX-plaatsingsregels · v2.0.0-rc.45

## Reservering en zichtbare verplaatsing zijn gescheiden

LEX houdt twee verschillende handelingen uit elkaar:

```text
1. LOG-majors/minors plannen mogelijke LEX-plaatsen;
2. een expliciete topic-/V2-/post-V2-regel kan een bronknoop verplaatsen.
```

De planning alleen is nooit een verplaatsingsopdracht. Een bronwoord zonder
expliciete regel blijft exact op de horizontale hoogte van zijn bronknoop. Een
bronwoord met zo'n regel krijgt hoogstens één rechtstreekse Wissel en één
trace. De voorbeeldzin levert geen basiscoördinaten.

## Tijdelijke LEX-ruimte-indicator

- LOG-slots bepalen de geplande LEX-plaatsen.
- Een bijwoord-minor bezet dezelfde relatieve rij als op LOG.
- Een major met meerdere sources, bijvoorbeeld `pv` en `vdw`, gebruikt
  opeenvolgende rijen binnen de majorzone.
- De bronprojectielijn is altijd horizontaal en blijft op de bronhoogte.
- De doorschijnende verdikking met twee dwarskapjes in Play-fase `2/3` loopt
  van de eerste tot de laatste geplande plaats. Dit is alleen een tijdelijke
  viewerindicator; zij verplaatst geen knoop en is geen OGN-element.

## Wissels

Alleen een expliciete regel activeert een zichtbare Wissel:

- `Comp` gebruikt slot 0;
- topic/vooropplaatsing gebruikt slot 1;
- V2/persoonsvorm gebruikt slot 2;
- een verplaatst item laat één trace op de horizontale bronrij.

Er is geen tweede pijl of LOG-tussentrace. De centrale Syntax- of Functional-graph en
de LOG-sequentie veranderen niet.

Voor `HOND BIJT MAN` geldt daarom: `HOND` blijft op HOND-hoogte, `MAN` blijft
op MAN-hoogte en uitsluitend `BIJT` wisselt volgens V2.

## Bijwoorden

Een bijwoord is geen vrij LEX-hostslot meer. Het is eerst een LOG-minor.
Alleen een expliciete regel zoals `fronted-v2` verplaatst een bronknoop. Een
scopehost is semantische metadata.

## Gemarkeerde majorvolgorden

`OSV-!`, `VSO-!` en `VOS-!` geven aan dat de huidige regelset nog een
expliciete Wissel nodig heeft voor een volledig surface-resultaat.
