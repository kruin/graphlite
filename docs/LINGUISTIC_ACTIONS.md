# LINGUISTIC_ACTIONS

Ontwerpnotities voor taalkundige acties in GraphLite.

## Views

```text
Syntax    eerste centrale view
FT        tweede centrale view; functionele boomstructuur
```

FT en Syntax zijn views. LEX, SYNT en LOG zijn named projections.

## Named projections

```text
LEX    zichtbare woordvolgorde en lexicale plaatsing
SYNT   syntactische regels en categorieprojectie
LOG    logische S-O-V-volgorde op de zuidas
```

## Taalactiebox

De taalactiebox bevat voorlopig `‹ SOV ›`. De cyclus kan SOV, SVO, OVS, OSV-!, VSO-! en VOS-! tonen. `!` markeert een gemarkeerde variant.

## Geen mutatie van de centrale views

De SOV/SVO/etc-actie verandert niet:

- de Syntax-view;
- de FT-view;
- de SYNT-projectie;
- de lexicale inhoud.

De actie verandert alleen LOG.

## LEX-stappen

```text
1. Centrale bronknopen plaatsen in Syntax of FT.
2. LEX-projectiemerkers schrijven.
3. LEX-Wissels toepassen op gereserveerde lege plekken.
```

Bijwoorden zijn externe LEX-inserties. Een Wissel verandert de zichtbare woordvolgorde op LEX en laat de centrale Syntax- en FT-structuren ongemoeid.
