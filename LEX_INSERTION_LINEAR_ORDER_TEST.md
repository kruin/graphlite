# Test — LEX-inserties lineair lager v2.0.10

## Bijzin

Kies:

```text
OMDAT DE HOND DE MAN MISSCHIEN WEL VAAK GEBETEN HEEFT
```

## Verwacht

1. De zinpreview eindigt op `GEBETEN HEEFT`, niet op `HEEFT GEBETEN`.
2. De structurele LEX-bronnen staan in de bijzinvolgorde `DE HOND · DE MAN · GEBETEN · HEEFT`.
3. `MISSCHIEN WEL` en `VAAK` staan op de LEX-as na `DE MAN` en vóór `GEBETEN`.
4. De inserties gebruiken het lineaire anker `V-CLUSTER`, niet het hoge anker boven de volledige VP.
5. `MISSCHIEN WEL` blijft één groep met propositionele scope.
6. `VAAK` blijft een tweede groep met gebeurtenisscope.
7. De twee boxen overlappen niet in desktop, portrait en landscape.
8. Syntax en Functional krijgen geen extra bijwoordknoop.

## Hoofdzin

Kies:

```text
DE HOND HEEFT DE MAN MISSCHIEN WEL VAAK GEBETEN
```

Na de V2-Wissel moet de zichtbare LEX-volgorde zijn:

```text
DE HOND → HEEFT → DE MAN → MISSCHIEN WEL → VAAK → GEBETEN
```
