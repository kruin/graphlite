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


## v4548 — vooropplaatsing van bijwoorden

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

## v4548 — bijwoorden vóór verplaatsingen

De LEX-afleiding is nu expliciet geordend:

1. Eerst wordt het externe bijwoordslot op de LEX-as geplaatst, met de gekozen hostbox alleen als hoogteanker.
2. Daarna pas worden LEX-Wissels toegepast, zoals topic/V2/post-V2.

Gevolg: een bijwoord kan blijven staan op de oorspronkelijke hosthoogte, terwijl het gehoste element later verplaatst wordt. De trace blijft dan zichtbaar onder/naast het oorspronkelijke punt; het bijwoord is niet mee verplaatst.

Voorbeeldnotatie:

```text
LEX-ADV[word=ALLEEN, class=FOCUS, axis=LEX, defaultHost=NP, host=NP, source=external, order=before-movement]
LEX-MOVE[source=subject, target=slot1, trace=t[subject], order=after-adverb]
```

Dit blijft een LEX/FUNC-regel. De SYNT-boom wordt niet gemuteerd.


## v4548: boven betekent buiten de hostbox

`boven NP`, `boven VP`, `boven V-CLUSTER`, enzovoort betekent: een extern LEX-slot op de LEX-as, op een rij vóór/boven de hostbox. Het slot wordt niet in de hostbox getekend. De hostbox/subboom wordt lager gezet om een vrije rij te maken.

Notatie:

```text
LEX-ADV[word=HARD, class=WIJZE, axis=LEX, host=V-CLUSTER, placement=above-host, source=external, order=before-movement]
```

De host is alleen hoogteanker; de basisboom levert geen projectie voor het bijwoord.


## v4551 — plaatsingsregels per bijwoordcategorie

De app bevat nu een expliciete configtabel voor ongemarkeerde en gemarkeerde bijwoordplaatsing per categorie. Zie `docs/LEX_ADVERB_PLACEMENT_RULES.md` en `samples/adverb_placement_rules_v4551.json`.

Kernregel:

```text
LEX-ADV eerst, LEX-Wissels daarna.
host = defaultHost        -> functioneel ongemarkeerd
host != defaultHost       -> functional:marked-host
host=S in hoofdzin        -> functional:fronted-v2
```

Alle bijwoorden blijven externe inserties op de LEX-as. De hostbox is alleen hoogteanker; de basisboom wordt niet gemuteerd.


### v4552-notitie: NIET

`NIET` als neutrale negatie gebruikt `linear=post-object-pre-vcluster`: `HOND BIJT MAN NIET`, `HOND HEEFT MAN NIET GEBETEN`. Vóór het object is gemarkeerd/contrastief.


### Lineaire zone versus scope

Bij meervoudige middenveldinserties zijn lineaire landingsplaats en semantische scope gescheiden. In `... DE MAN MISSCHIEN WEL VAAK GEBETEN HEEFT` reserveert het plaatsingsplan beide insertiegroepen na het object en vóór het V-CLUSTER. `MISSCHIEN WEL` kan daarbij propositionele scope houden; die scope verplicht geen hoge positie boven de hele VP op de LEX-as.
