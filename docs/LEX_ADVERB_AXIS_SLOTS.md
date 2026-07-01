# GraphLite v4541 — bijwoorden als externe LEX-slots

## Regel

Met `boven S`, `boven NP`, `boven VP`, `boven V`, `boven PP` of `boven AP` wordt bedoeld:

```text
extern bijwoord -> LEX-slot op de LEX-as, verticaal net boven de gekozen syntactische hostbox
```

Dus niet:

```text
bijwoordlabel boven/op de syntaxboom
bijwoordprojectie vanuit de basisboom
bijwoord als centrale boomknoop
```

## Layout-effect

Wanneer een bijwoordslot boven bijvoorbeeld `VP` wordt gekozen:

1. GraphLite zoekt de geldige hostbox `VP`.
2. De VP-subboom wordt één rij lager gezet.
3. De vrijgekomen hoogte wordt gebruikt als visuele doelhoogte.
4. Het bijwoord zelf wordt links op de LEX-as getekend, op die hoogte.

De insertie komt dus van buiten de basisboom: `source=external`.

## Notatie

Default:

```text
LEX-ADV[word=WAARSCHIJNLIJK, class=MODALITEIT, axis=LEX, defaultHost=S, host=S, source=external, marking=functional:default-host]
```

Gemarkeerde plaatsing:

```text
LEX-ADV[word=WAARSCHIJNLIJK, class=MODALITEIT, axis=LEX, defaultHost=S, host=V, source=external, marking=functional:marked-host]
```

## Geldige hostboxes

```text
S, NP, VP, V, PP, AP
```


## v4546 — vooropplaatsing van bijwoorden

Regel: een bijwoord dat als eerste zinsdeel wordt gekozen, activeert geen bijzinsvolgorde. Het vult een extern LEX-slot in het voorveld:

```text
LEX-ADV[word=GISTEREN, class=TIJD, axis=LEX, slot=1, source=external, marking=functional:fronted-v2]
```

De persoonsvorm blijft in slot 2:

```text
GISTEREN | BEET | HOND | MAN
slot 1   | slot 2 V2 | subject | object
```

Bijzin blijft apart en vereist een bindterm/complementizer, bijvoorbeeld `omdat`:

```text
OMDAT | HOND | GISTEREN | MAN | BIJT
```
