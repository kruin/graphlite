# Test — meervoudige lexicale inserties v2.0.10

## Voorbeelden

Kies achtereenvolgens:

```text
DE HOND HEEFT DE MAN MISSCHIEN WEL VAAK GEBETEN
OMDAT DE HOND DE MAN MISSCHIEN WEL VAAK GEBETEN HEEFT
```

## Verwacht

1. De zinpreview toont de volledige Nederlandse voorbeeldzin.
2. Op de LEX-as verschijnen precies twee externe insertieboxen.
3. De eerste box bevat `MISSCHIEN WEL`.
4. De tweede box bevat `VAAK`.
5. De twee woorden `MISSCHIEN WEL` delen één box.
6. De boxen overlappen niet.
7. De boxcentra staan op minor-gridankers.
8. De centrumafstand is minimaal 72 pixels.
9. De V-CLUSTER-subboom wordt voldoende lager geplaatst; de inserties staan na het object en vóór het cluster.
10. Syntax en Functional bevatten geen extra bijwoordknoop.

## Viewports

Test minimaal:

- desktop breed;
- desktop smal;
- mobile portrait;
- mobile landscape;
- geforceerd Desktop op telefoon;
- geforceerd Mobiel liggend.

## Handmatige override

Wijzig in Config het aantal bijwoordboxen, de inhoud of de host. De voorbeeldspecifieke lijst wordt dan uitgeschakeld en de handmatige instelling wordt gebruikt.

11. Op de LEX-as is de volgorde bij de bijzin: `DE MAN → MISSCHIEN WEL → VAAK → GEBETEN → HEEFT`.
12. `MISSCHIEN WEL` staat niet meer hoog vóór de hele VP-zone.
