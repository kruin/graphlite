# SOURCE_CHANGES v2.0.0-rc.17

## Herstel Config-raster

- `Raster` verplaatst van de onderkant van een lange algemene configuratiekaart naar `Config → Boom → Weergave`.
- Nieuw zichtbaar label: `Raster zichtbaar · standaard aan`.
- Engelse vertaling: `Grid visible · default on`.
- Taklijnen en boomlabels staan in dezelfde directe Weergavegroep.

## Werkelijke standaard

- `state.showGrid` blijft `true`.
- Een snapshot uit een oudere release migreert bij rc.15 naar `showGrid=true`.
- Een daarna bewust in rc.15 opgeslagen uitgeschakelde keuze blijft behouden.
- De HTML-checkbox is standaard `checked`.

## Zichtbaarheid en grens

- Rasterlijnen blijven dunner dan projectielijnen, maar hebben voldoende dekking om op desktop en mobile zichtbaar te zijn.
- De rastergrens blijft de unie van centrale boom en zichtbare projectie-stippellijnen.
- De stabiele projectie-viewBox verandert niet.
