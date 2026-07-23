# HANDOVER_FOR_COLLABORATORS

Overdracht voor OpenGraph Lite Viewer `v2.0.0-rc.24`.

## Niet wijzigen zonder expliciete opdracht

```text
Centrale views:  Syntax → FT
Assen:            LEX west, SYNT oost, LOG zuid
Default assen:    LEX + SYNT + LOG zichtbaar
Topmenu rij 1:    Zin, Bijwoord, Syntax/FT, Interface, Projecties, LOG-volgorde
Topmenu rij 2:    NL/EN, LEESMIJ/README, Config
Raster:           standaard aan
```

- LOG is nooit een centrale view.
- Er is geen Bron-tabblad, algemene Menu-knop, genest submenu of SOV-box in het canvas.

## Responsief layoutcontract

- `layoutDensity === "auto"` gebruikt de actuele canvasverhouding, niet alleen een mobile/desktop-boolean.
- Portrait verkleint `cellX`, vergroot `cellY` en brengt west-/oostas dichter bij de centrale boom.
- Landscape vergroot `cellX`, verkleint `cellY` en spreidt de assen verder uit.
- Desktop volgt dezelfde continue curve op basis van de werkelijke vensterverhouding.
- `stableProjectionViewBox()` en het dynamische raster worden aan de canvasverhouding aangepast.
- Syntax, FT en iedere projectiecombinatie gebruiken binnen dezelfde viewport exact hetzelfde profiel.
- Projectiewissels veranderen x, y, schaal of viewBox niet.
- Een resize of oriëntatiewissel mag wel één volledige herfit uitvoeren.

## Configcontract

- `showGrid` start als `true`.
- `growthProjectionImmediate` start als `true`.
- Raster en directe projectiegroei staan onder `Config → Boom → Weergave`.
- Een bewust opgeslagen keuze blijft na de releasemigratie behouden.

## Werkwijze

1. Lees `VERSION.txt`.
2. Wijzig app en leidende instructies samen.
3. Voer `node --check viewer.js` en `check_release.bat` uit.
4. Maak een zip met exact hetzelfde versienummer.

## Mobile rastercontract

Op compacte fysieke schermen mag `state.lastGridBox` niet via de canvas-aspectratio worden verbreed. Gebruik de werkelijke projectie-extentie. Dit geldt voor Auto, Desktop, Mobiel staand en Mobiel liggend op een telefoon.

## Mobile-landscapecontract

- Gebruik nooit alleen `max-width` om een telefoon in landscape te herkennen.
- `isActualCompactScreen()` combineert viewportmaat met touch/coarse-pointer.
- Runtimeklassen `actual-compact-landscape` en `actual-compact-portrait` sturen uitsluitend fysieke schermoptimalisatie.
- Draaien moet de profielcache wissen en een vertraagde tweede fit uitvoeren.


## Config-overzicht (rc.24)

- Config opent met een compact sectieoverzicht; uitgebreide instellingen zijn standaard ingeklapt.
- Secties: Basisweergave, JaN-notatie (TODO), Boom & layout, LEX & bijwoorden, Projecties, Voorbeelden & editors en Geavanceerd.
- Terugnavigatie gebruikt steeds de vorm `Terug naar: Main` of `Terug naar: Config`.
- De bestaande save-werkwijze blijft ongewijzigd: `Ja · bewaar config`, `Nee · herstel laatst bewaarde config`, en download van het lokale config-log.
- JaN is de werknaam voor Just another Notation. TODO: `S:np-VP` (niet `S:NP-VP`); werkvorm `S+ np-VP`; binaire bomen eerst, meertakkigheid later.
