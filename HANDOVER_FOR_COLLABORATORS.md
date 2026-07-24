# HANDOVER_FOR_COLLABORATORS

Overdracht voor OpenGraph Lite Viewer `v2.0.9`.

## Niet wijzigen zonder expliciete opdracht

```text
Centrale views:  Syntax → Functional
Assen:            LEX west, SYNT oost, LOG zuid
Default assen:    LEX + SYNT + LOG zichtbaar
Topmenu rij 1:    Zin, Bijwoord, Syntax / Functional, Interface, Projecties, LOG-volgorde
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
- Syntax, Functional en iedere projectiecombinatie gebruiken binnen dezelfde viewport exact hetzelfde profiel.
- Projectiewissels veranderen x, y, schaal of viewBox niet.
- Een resize of oriëntatiewissel mag wel één volledige herfit uitvoeren.

## Plaatsingsplancontract

- Verzamel structuur, alle lexicale insertiegroepen, plaatsingsregels, Wissels en actieve projecties vóór de centrale plaatsing.
- Reserveer minor-ankers, fysieke boxafstand en wisselcorridors vóór het tekenen.
- De kernzin is invulling van het berekende frame, niet de reeds voltooide layout waarop later inserties worden geplakt.
- Groei en rendering mogen geen nieuwe positie claimen of de layout herberekenen.
- Wijzigingen aan inserties vereisen een nieuwe volledige layoutberekening vóór de volgende render.

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


## Functional-compatibiliteit

- Zichtbare naam: `Functional`.
- Interne opgeslagen waarde blijft `ft`; oude waarde `functional` blijft leesbaar.
- Gebruik niet opnieuw de oude afkorting als zichtbare naam.

## Eenvoudige lokale release-installatie

Kopieer de uitgepakte broninhoud rechtstreeks over `C:\git\graphlite`, maar behoud `.git`. Test lokaal en start daarna `publish_checked.bat`. De BAT controleert, vraagt een commitbericht, commit, pusht en opent na een geslaagde push de resetpagina.

## Talen

- Default voor nieuwe installatie: English.
- Menu: English, Nederlands, Deutsch, Français, Español.
- Nederlandse voorbeeldzinnen en Nederlandse woordvolgorde blijven taaldata, ongeacht de interfacetaal.
- Duits/Frans/Spaans gebruiken Engels als technische fallback.

## Lokale Git-update

De actuele workflow gebruikt geen `graphlite-next`, clone, bundle of promotie. Er wordt geen `git pull` of force-push uitgevoerd. Zie `EENVOUDIGE_RELEASE_WERKWIJZE.md`.

