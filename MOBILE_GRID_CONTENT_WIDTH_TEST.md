# MOBILE_GRID_CONTENT_WIDTH_TEST

## Doel

Controleer dat het raster op een echte telefoon niet breder wordt dan de zichtbare projectie-inhoud.

## Testmatrix

Test op dezelfde telefoon:

1. Interface: Automatisch.
2. Interface: Desktop.
3. Interface: Mobiel staand.
4. Interface: Mobiel liggend.

Voer iedere stand uit in beide centrale views, Syntax en FT, met LEX + SYNT + LOG zichtbaar.

## Verwacht

- Linkerrastergrens volgt de uiterste LEX-projectielijn.
- Rechterrastergrens volgt de uiterste SYNT/FT-projectielijn.
- Ondergrens volgt de LOG-projectielijnen.
- Geen brede lege rasterstroken links of rechts.
- Boom, assen en projectieboxen verschuiven niet bij projectiekeuze.
- Desktop op een werkelijk desktopvenster blijft gelijk aan rc.20.
