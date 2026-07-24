# Test — meervoudige lexicale inserties v2.0.8

## Voorbeelden

Kies achtereenvolgens:

```text
DE HOND HEEFT DE MAN MISSCHIEN WEL VAAK GEBETEN
OMDAT DE HOND DE MAN MISSCHIEN WEL VAAK HEEFT GEBETEN
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
9. De VP-hostsubboom wordt voldoende lager geplaatst.
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
