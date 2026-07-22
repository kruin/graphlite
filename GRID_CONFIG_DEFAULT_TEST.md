# GRID_CONFIG_DEFAULT_TEST

Controlepunten voor v2.0.0-rc.17.

## Vindbaarheid

1. Open `Config`.
2. Open de eerste kaart `Boom`.
3. Direct onder `Interface` staat `Weergave`.
4. De eerste checkbox heet `Raster zichtbaar · standaard aan`.

## Verse start / migratie

- `state.showGrid` is `true`.
- De HTML-checkbox heeft `checked`.
- Een opgeslagen snapshot met een oudere `version` krijgt bij laden `showGrid=true`.
- Een in rc.15 opgeslagen snapshot mag de bewuste gebruikerskeuze bewaren.

## Rastergrens

- De gridbox wordt berekend met `projectionGridExtentBox()`.
- De berekening gebruikt centrale boom plus alle zichtbare `.projection-line`-elementen.
- Projectieboxen tellen niet mee.
- De viewBox wordt niet door het raster aangepast.

## Lijnhiërarchie

- gewone rasterlijn: dun en zichtbaar;
- hoofdrasterlijn: iets duidelijker;
- projectielijn: duidelijk dikker dan het raster;
- projectieas: iets dikker dan de projectielijn.
