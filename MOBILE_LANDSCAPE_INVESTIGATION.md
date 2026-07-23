# MOBILE LANDSCAPE INVESTIGATION — v2.0.0-rc.22

## Gereproduceerde fout in rc.21

Getest als echte touch/mobile viewport van 844×390 CSS-pixels.

```text
mobile media query            false (844 > 760)
topmenuhoogte                 63.0 px
Play-balkhoogte               55.8 px
beschikbare canvashoogte      261 px
canvasverhouding              3.23 : 1
graph/frame-verhouding        1.97 : 1
graphvulling in de breedte    57.3%
```

De app behandelde de liggende telefoon gedeeltelijk als desktop. Daarnaast bleef de graph te hoog voor het zeer brede resterende canvas.

## Resultaat rc.22

```text
compact landscape herkend     ja
topmenuhoogte                 50.9 px
Play-balkhoogte               39.9 px
beschikbare canvashoogte      290 px
canvasverhouding              2.91 : 1
graph/frame-verhouding        2.50 : 1
graphvulling in de breedte    82.3%
graphvulling in de hoogte     95.6%
```

Bij 740×390 vult de graph 93.9% van de breedte. Portrait 390×844 en desktop 1440×1000 behouden hun eerdere profielen.

## Interfacekeuzes op een echte 844×390-telefoon

```text
Automatisch         breedtevulling 82.3%
Desktop              breedtevulling 80.0%
Mobiel staand        breedtevulling 82.3%
Mobiel liggend       breedtevulling 82.3%
```

De fysieke schermvorm blijft bepalend voor de maximale vulling; de gekozen interface bepaalt de bediening/presentatiemodus.

## Draaiproef

Dezelfde sessie is van 390×844 naar 844×390 gedraaid. Na de vertraagde herfit stonden de runtimeklassen op `actual-compact-landscape`, was het canvas 844×290 en was de breedtevulling 82.3%.
