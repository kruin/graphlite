# Source changes · v2.0.0-rc.23

## Eindlaag niet langer blijvend ontgrendeld

`setGrowthStep()` behandelde `projectionBlockUnlocked` als een blijvende vlag:
op de laatste stap werd zij `true`, maar bij teruggaan pas op stap nul weer
`false`. Daardoor tekende `drawAxes()` tijdens alle min-stappen de volledige
eindlaag en leek Play niet omkeerbaar.

De vlag wordt nu bij iedere stap opnieuw afgeleid:

```text
projectionBlockUnlocked = (growthStep == laatste stap)
```

Bij de eerste min-stap wordt de eindlaag dus direct gesloten. Daarna gebruikt
de bestaande `visibleAt()`-logica dezelfde stapgrenzen achteruit.

## Reverse-volgorde

De zichtbare afbraak is:

1. eindprojecties en SYNT-paneel;
2. LEX-Wissels, één voor één;
3. horizontale LEX-inhoud;
4. gereserveerde LEX-ruimte;
5. LOG-as;
6. centrale boom, knoop voor knoop.

Hoofdvenster, Config, mobiel en toetsenbord delen `setGrowthStep()` en krijgen
daarom hetzelfde gedrag.

## Controle

- `tools/check_play_reverse.py` verbiedt de oude blijvende vlaglogica en
  bewaakt de renderfasevolgorde.
- De DOM-rendertest bouwt Play volledig op, klikt één keer terug en controleert
  dat SYNT meteen weg is. Daarna controleert zij achtereenvolgens fase 3/3,
  2/3, 1/3 en het verdwijnen van LOG bij terugkeer naar de boom.
