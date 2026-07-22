# LAYOUT_RULES

Harde layoutregels voor OpenGraph Lite Viewer.

## Centrale views en assen

```text
Syntax   eerste centrale view
FT       tweede centrale view
LEX      westas
SYNT     oostas
LOG      zuidas; nooit centrale view
```

## Viewportstabiliteit

- Iedere projectiecombinatie gebruikt dezelfde viewBox.
- Syntax ↔ FT behoudt dezelfde viewport en handmatige pan/zoom.
- Menu’s, Config en rasterzichtbaarheid wijzigen de canvasmaat of fitbox niet.

## Projecties

- Bediening staat buiten het canvas onder `Projecties` / `Projections`.
- Beschikbaar: LEX, SYNT, LOG, Alle en Geen.
- Default: LEX + SYNT + LOG zichtbaar.
- Er is geen Bron-tabblad.

## Topmenu

```text
Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde · NL/EN · Help · Config
```

- Geen algemene Menu-knop.
- Geen geneste submenu’s.
- Op smalle schermen mag de balk gecontroleerd naar een volgende rij lopen zonder de graph te verschuiven.

## Mobile full view

- Het SVG-canvas gebruikt de volledige viewport onder topmenu en Play-balk.
- De mobile fitbox omvat de centrale view en zichtbare assen zonder reserves voor verwijderde canvasbediening.
- Portrait/landscape voert na keuze of oriëntatiewissel een volledige herfit uit.

## Raster / grid

- `Config → Boom → Weergave → Raster zichtbaar` staat standaard aan.
- De optie staat direct onder Interface en is zonder scrollen door lange configuraties vindbaar.
- Migratie uit een oudere release zet Raster eenmaal aan; een later bewust opgeslagen keuze blijft behouden.
- De rastergrens is de unie van de centrale boom en de uiterste eindpunten van zichtbare projectie-stippellijnen.
- Projectieboxen mogen buiten de rastergrens liggen.
- Rasterberekening verandert x, y, schaal of viewBox niet.

## Lijndikte

- Raster-, boom-, relatie- en hulplijnen: dun.
- Boxcontouren: zo dun mogelijk.
- Projectielijnen: iets dikker.
- Projectieassen: iets dikker dan projectielijnen.

## Raster en mobile topmenu (rc.16)

- Het raster ligt boven gevulde subtree-achtergronden, maar onder captions, boomlijnen, knopen en projecties.
- Op mobile staan de negen topmenu-items in exact twee rijen: vijf items boven en vier onder. Geen derde menurij.

## Topmenu-rijen (v2.0.0-rc.17)

Het topmenu heeft op desktop, mobile en mobile-preview exact twee vaste rijen:

```text
Rij 1: Zin · Bijwoord · Syntax/FT · Interface · Projecties · LOG-volgorde
Rij 2: NL/EN · Help · Config
```

- Rij 2 heeft eigen verticale ruimte en mag niet aansluiten op of overlappen met rij 1.
- Vrije wrapping is verboden.
- Geen item mag buiten een mobile-frame of viewport schuiven.
- Uitklappanelen van rij 1 openen onder de volledige tweerijige menubalk.
