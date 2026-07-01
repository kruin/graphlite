# LEX-bijwoordslots — v4540-regel

Deze file vervangt de eerdere interpretatie “bijwoord boven syntaxbox”.

## Actuele regel

Alle bijwoordplaatsing staat op de **LEX-as**.

`boven S`, `boven NP`, `boven VP`, `boven V`, `boven PP` en `boven AP` betekenen:

```text
extern bijwoord -> LEX-slot op LEX-as, verticaal net boven de gekozen syntactische hostbox
```

Het bijwoord wordt nergens op de syntaxboom getekend. De hostbox/subboom schuift lager om ruimte te maken. De insertie heeft `source=external` en is geen projectie vanuit de basisboom.

Zie ook: `docs/LEX_ADVERB_AXIS_SLOTS.md`.
