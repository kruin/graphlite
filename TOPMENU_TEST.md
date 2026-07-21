# TOPMENU_TEST

Te controleren hoofditems:

1. Zin
2. Bijwoord
3. Syntax / FT
4. Projecties
5. LOG-volgorde
6. NL/EN
7. Help
8. Config

De algemene knop `Menu` mag niet bestaan. Keuzepanelen zijn onderling exclusief en sluiten met Escape of een klik buiten het paneel.

## Automatische controles

- JavaScript-syntax: te controleren met `node --check viewer.js`.
- Releasecontrole: `python tools/check_release.py`.
- HTML-id’s uniek.
- Vijf directe keuze-items; geen geneste `details`.
- `index.html` en `viewer.html` identiek.
- Chromium-headless kon in de container niet betrouwbaar worden afgesloten; visuele eindcontrole blijft lokaal nodig.
