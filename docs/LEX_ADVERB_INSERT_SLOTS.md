# LEX-bijwoordslots — v4540-regel

Deze file vervangt de eerdere interpretatie “bijwoord boven syntaxbox”.

## Voorafgaande plaatsingsberekening

Alle bijwoordelijke insertiegroepen worden vóór de centrale boomplaatsing verzameld. De layout reserveert hun LEX-slots, minor-ankers, onderlinge fysieke afstand en eventuele Wissel-corridors. Pas daarna wordt de hostbox of hostsubboom geplaatst en wordt de kernzin ingevuld.

Een insertie verschijnt dus niet achteraf in toevallig overgebleven ruimte. De groeiversie toont een reeds berekend slot op het gekozen moment.

## Actuele regel

Alle bijwoordplaatsing staat op de **LEX-as**.

`boven S`, `boven NP`, `boven VP`, `boven V`, `boven PP` en `boven AP` betekenen:

```text
extern bijwoord -> LEX-slot op LEX-as, verticaal net boven de gekozen syntactische hostbox
```

Het bijwoord wordt nergens op de syntaxboom getekend. De hostbox/subboom schuift lager om ruimte te maken. De insertie heeft `source=external` en is geen projectie vanuit de basisboom.

Zie ook: `docs/LEX_ADVERB_AXIS_SLOTS.md`.


### Lineaire zone versus scope

Bij meervoudige middenveldinserties zijn lineaire landingsplaats en semantische scope gescheiden. In `... DE MAN MISSCHIEN WEL VAAK GEBETEN HEEFT` reserveert het plaatsingsplan beide insertiegroepen na het object en vóór het V-CLUSTER. `MISSCHIEN WEL` kan daarbij propositionele scope houden; die scope verplicht geen hoge positie boven de hele VP op de LEX-as.
