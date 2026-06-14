# Structure-config-specificatie v4414

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


## v4449 update

- `commit_and_push.bat` wordt vanaf deze versie standaard meegeleverd in de ZIP-root.
- LOG/FT toont thematische rollen expliciet: `AGENS` voor subject/handelende deelnemer en `PATIENS` voor object/ondergaande deelnemer.
- De syntaxrollen blijven `subject` en `object`; de functionele projectie benoemt dezelfde lexicale bronnen thematisch.
