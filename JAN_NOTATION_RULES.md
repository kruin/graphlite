# JAN_NOTATION_RULES

Compacte JAN-notatie voor syntaxregels en vertakking.

## Kernregel

In JAN compact notation krijgt casing structurele betekenis:

```text
onderkast = korte tak
BOVENKAST = lange tak
volgorde in de regel = links/rechtsvolgorde
```

Voorbeelden:

```text
S → np VP
```

- `np` staat links en is de korte tak.
- `VP` staat rechts en is de lange tak.

```text
S → NP vp
```

- `NP` staat links en is de lange tak.
- `vp` staat rechts en is de korte tak.

## Viewer-config

In Config staat `JAN-casing` met drie modi:

```text
uit
alleen regelnotatie
regelnotatie + taklengte
```

- `uit`: traditionele labels, geen casingbetekenis.
- `alleen regelnotatie`: SYNT toont JAN-casing in de regelboxen, maar layout blijft ongewijzigd.
- `regelnotatie + taklengte`: casing stuurt ook de relatieve korte/lange plaatsing in de syntaxlayout.

## Data-config

De syntaxbron gebruikt `data-jan-children` naast `data-children`.

Voorbeeld:

```html
<div class="node-config"
  data-id="s"
  data-label="S"
  data-children="np-subj vp"
  data-jan-children="np VP">
</div>
```

`data-children` blijft de echte knoopverwijzing. `data-jan-children` is de compacte notatie voor weergave en optioneel layoutsturing.

## Beperking v1.0

De JAN-casing is nu vooral bedoeld voor binaire vertakkingen in de SYNT-laag. Complexere regelsets kunnen dezelfde notatie tonen; verdere verfijning voor n-aire regels blijft een uitbreidingspunt.
