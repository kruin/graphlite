# RC40 landscape-compositietest

Doel: mobiel landschap toont een vullende, leesbare graph zonder dat menu,
Play, rastertop of projectieassen elkaar bedekken of buiten beeld vallen.

## Handmatig

1. Start `start_local_viewer.bat` op een groot scherm.
2. Kies lokaal `mobile liggend`.
3. Het telefoonframe blijft 844 × 390.
4. Het menu staat volledig leesbaar in twee compacte rijen bovenaan.
5. De graph begint onder het menu en eindigt boven de Play-balk.
6. Rastertop, LEX-as, SYNT-as en LOG-as zijn tegelijk zichtbaar.
7. Het raster vult het beschikbare tekenvlak en eindigt exact op de assen.
8. Wissel van Syntax naar Functional; de compositie blijft gelijk.
9. Herhaal op een echte telefoon in landschap met `Automatisch`.
10. Forceer daar `Interface → Desktop`; dezelfde landscape-compositie blijft
    actief.

## Geautomatiseerd

Met Playwright beschikbaar:

```text
node tools/check_landscape_composition_runtime.js
```

De controle start zelf een tijdelijke lokale webserver en toetst:

- desktopsimulatie 844 × 390;
- fysieke mobiele auto-detectie 844 × 390;
- fysieke mobiele viewport met geforceerde Desktop-interface;
- Syntax én Functional;
- scheiding tussen menu, SVG en Play;
- volledige LEX-, SYNT- en LOG-assen;
- vanaf rc.41 ook de volledige SYNT-regelbox rechts van de as;
- minimale rastervulling van 63% breedte en 88% tekenhoogte. De lagere
  breedtedrempel reserveert bewust ruimte voor volledige LEX-inhoud en de
  regelbox.
