# GRID_TOPMENU_CONFIG_TEST

## Geautomatiseerde controles

- `node --check viewer.js`: geslaagd.
- `python tools/check_release.py`: geslaagd.
- `index.html` en `viewer.html`: byte-identiek.
- HTML-id’s: uniek.
- Versie in VERSION, HTML, JavaScript, service worker en resetpagina: `v2.0.0-rc.19`.
- Hoofdmenu bevat negen zichtbare items.
- Mobile CSS gebruikt twee rijen met vijf kolommen; de tweede rij bevat vier items.
- `Config` is daardoor altijd onderdeel van de tweede rij en kan niet in een derde, afgedekte rij terechtkomen.
- `showGrid` initialiseert op `true`; snapshots van oudere versies migreren naar `true`.
- De vaste Config-balk bevat `configGridQuickInput`; deze en `showGridInput` gebruiken dezelfde setter.
- SVG-laagvolgorde: subtree-rects → raster → captions → boomlijnen/knopen/projecties.
- Rasteromvang blijft bepaald door centrale boom plus uiterste `.projection-line`-eindpunten.

## Handmatige controle na publicatie

1. Open de viewer na de automatische cache-reset: raster moet direct zichtbaar zijn.
2. Controleer raster buiten én binnen de centrale subtree-boxen.
3. Open Config: `Raster zichtbaar` staat direct in de vaste bovenbalk en onder `Boom → Weergave`.
4. Schakel via beide plaatsen: beide checkboxes blijven synchroon.
5. Test 390×844 en 844×390: alle negen topmenu-items zijn zichtbaar in twee rijen.
6. Open `LOG-volgorde`: Config en Help blijven zichtbaar; er ontstaat geen derde rij.
7. Wissel Syntax/FT en projecties: viewBox mag niet verspringen.

## Browserbeperking

De lokale Chromium-navigatie werd door de container geblokkeerd met `ERR_BLOCKED_BY_ADMINISTRATOR`. Daarom wordt geen visuele browsertest geclaimd.
