# Source changes v2.0.10

## Correcte bijzinsvolgorde

De meervoudige insertie-bijzin is gecorrigeerd naar:

```text
OMDAT DE HOND DE MAN MISSCHIEN WEL VAAK GEBETEN HEEFT
```

De lexicale bronvolgorde gebruikt nu `GEBETEN · HEEFT`.

## Inserties lager op de LEX-as

`MISSCHIEN WEL` en `VAAK` waren geankerd boven de volledige VP en stonden daardoor te hoog. In de perfectumvoorbeelden gebruiken zij nu de vooraf berekende lineaire zone:

```text
na object · vóór V-CLUSTER
```

Het plaatsingsplan reserveert de ruimte vóór rendering. De V-CLUSTER-subboom zakt; de inserties vullen de vrijgemaakte minor-ankers. De semantische scope blijft afzonderlijk: `MISSCHIEN WEL` kan propositionele scope hebben zonder hoog vóór de hele VP te staan.

## Ongewijzigd

- geen bijwoordknopen in Syntax of Functional;
- minimaal 72 pixels centrumafstand tussen grote insertieboxen;
- Config-save-werkwijze;
- groei onthult hetzelfde vooraf berekende plaatsingsplan.
