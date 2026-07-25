# Structure-config-specificatie · v2.0.0-rc.23

## LOG-slotconfig

`#opengraph-log-config` is de plaatsingsautoriteit voor de neutrale
LOG→LEX-afleiding. De sectie definieert:

```text
authority=LOG
position-unit=slot
major-gap=1
minor-width=1
expands-major-gap=true
lex-position-source=LOG
lex-projection-origin=SOURCE-Y
lex-placement-mode=horizontal-then-move
example-controls-layout=false
```

`.log-major-config` definieert S/O/V en hun sources.
`.log-interval-config` definieert `after` plus `before`.
`.log-class-config` koppelt bijwoordklassen aan een standaardinterval.

Een minor in `S-O` verhoogt `dLOG(S,O)` met één; een minor in `O-V`
verhoogt alleen `dLOG(O,V)`. Zie `../projectie-master-spec.md`.

`lex-position-source=LOG` bepaalt de doelrij. Het bepaalt niet de oorsprong
van de projectie. `lex-projection-origin=SOURCE-Y` dwingt af dat ieder
lexicaal bronitem eerst exact horizontaal naar LEX projecteert;
`horizontal-then-move` verplaatst het daarna uitsluitend langs de LEX-as.

Bij `example-controls-layout=false` zijn de klassekoppelingen leidend.
Lineaire voorbeeldvolgorde en oude `data-log-*`-positiehints worden dan niet
als layoutinvoer gelezen. Een expliciete intervalkeuze in de Config-UI houdt
altijd voorrang.

---

## Historische syntax- en FT-config

## Bestand

```text
structure-config.html
```

De structure-config is de bron voor syntax-config en functional-config.

## Wat hoort erin?

Abstracte structurele bronnen:

```text
subject
object
predicate
pv
vdw
S
NP
VP
V
CLAUSE
PRED
ARG-STRUCT
ARG1
ARG2
```

## Wat hoort er niet in?

Lexicale woorden:

```text
hond
man
kat
vrouw
trui
bijt
breit
beet
breide
heeft
gebeten
gebreid
omdat
```

Deze horen in `lexicon-config.html`.

## Syntax-model

Basis:

```text
s:S [cat=S] -> np-subj vp
np-subj:NP [cat=NP] -> subj
subj:{subject} [leaf role=subject source=subject cat=N]
vp:VP [cat=VP] -> np-obj v
np-obj:NP [cat=NP] -> obj
obj:{object} [leaf role=object source=object cat=N]
v:V [cat=V] -> pred
pred:{predicate} [leaf role=predicate source=predicate cat=V]
```

Perfectum:

```text
vp:VP [cat=VP] -> np-obj vp-perfectum
vp-perfectum:VP [cat=VP] -> pv vdw
pv:{pv} [leaf role=aux source=pv cat=AUX]
vdw:{vdw} [leaf role=participle source=vdw cat=V]
```

## Functional-model

```text
ft-clause:CLAUSE -> ft-pred ft-argstruct
ft-pred:PRED -> f-root
f-root:{predicate} [leaf role=predicate source=predicate cat=V]
ft-argstruct:ARG-STRUCT -> ft-arg1 ft-arg2
ft-arg1:ARG1 -> f-subj-np
f-subj-np:NP -> f-subj
f-subj:{subject} [leaf role=subject source=subject cat=N]
ft-arg2:ARG2 -> f-obj-np
f-obj-np:NP -> f-obj
f-obj:{object} [leaf role=object source=object cat=N]
```


## v4535 update

- `commit_and_push.bat` wordt vanaf deze versie standaard meegeleverd in de ZIP-root.
- LOG toont thematische rollen expliciet: `AGENS` voor subject/handelende deelnemer en `PATIENS` voor object/ondergaande deelnemer.
- De syntaxrollen blijven `subject` en `object`; de functionele projectie benoemt dezelfde lexicale bronnen thematisch.
