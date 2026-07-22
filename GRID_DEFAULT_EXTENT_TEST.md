# GRID_DEFAULT_EXTENT_TEST — v2.0.0-rc.17

## Te controleren

1. Verse start: `Config → Raster` is aangevinkt en het raster is zichtbaar.
2. Migratie vanaf rc.13 met Raster uit: eerste rc.14-start herstelt Raster naar zichtbaar.
3. Raster in rc.14 uitzetten en config bewaren: volgende rc.14-start respecteert die bewuste keuze.
4. Met LEX + SYNT + LOG zichtbaar eindigt het raster bij de uiterste projectie-stippellijnen.
5. Projectieboxen mogen buiten de rastergrens staan.
6. Syntax ↔ FT en projectiekeuzes veranderen viewBox, schaal en centrale boompositie niet.
7. Mobiel staand en liggend gebruiken dezelfde geometrische rasterregel.

## Statische controles

- `node --check viewer.js`
- `check_release.bat`
- `index.html` en `viewer.html` identiek
- zip-integriteit
