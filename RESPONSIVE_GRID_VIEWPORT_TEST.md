# RESPONSIVE_GRID_VIEWPORT_TEST

Testplan voor `v2.0.0-rc.20`.

## Statische controles

```text
node --check viewer.js
python tools/check_release.py
```

Controleer daarnaast dat `viewer.js` bevat:

```text
viewportGridProfile
projectionSpacingProfile
cellXScale: 0.70 + 0.86 * t
cellYScale: 1.17 - 0.44 * t
expandBoxToAspect(padded, canvasAspectRatio())
```

## Profielverwachtingen

De continue curve moet ongeveer deze richting geven:

| canvasverhouding | cellX-factor | cellY-factor | resultaat |
|---:|---:|---:|---|
| 0,55 | 0,70 | 1,17 | smal en hoog portraitgrid |
| 1,00 | 0,84 | 1,10 | bijna vierkant grid |
| 1,60 | 1,18 | 0,92 | breed desktop/landscapegrid |
| 2,10 | 1,46 | 0,78 | zeer breed en laag grid |

## Visuele test

Test in alle interfacekeuzes:

```text
Automatisch
Desktop
Mobiel staand
Mobiel liggend
```

Per keuze:

1. Open Syntax met LEX + SYNT + LOG.
2. Controleer maximale vulling zonder clipping.
3. Wissel Syntax ↔ FT; positie en schaal blijven gelijk.
4. Zet LEX, SYNT en LOG afzonderlijk uit en aan; geen verspringing.
5. Draai portrait ↔ landscape; het grid wordt zichtbaar smaller/hoger respectievelijk breder/lager.
6. Controleer dat raster en viewBox de nieuwe schermverhouding volledig gebruiken.
7. Start Play; direct groeiende projecties blijven op definitieve posities.

## Beoogd resultaat

De beschikbare breedte en hoogte worden beide benut. Er zijn geen grote ongebruikte meet-banden, geen afgesneden projectieboxen en geen projectieafhankelijke fitverschillen.
