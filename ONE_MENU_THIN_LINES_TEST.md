# ONE_MENU_THIN_LINES_TEST — v2.0.0-rc.37

## Statische controles

- `node --check viewer.js`: geslaagd.
- `tools/check_release.py`: geslaagd.
- `index.html` en `viewer.html`: byte-identiek.
- HTML-id’s: uniek.
- Hoofdmenu: precies één `details`-element en geen geneste submenu’s.
- JSON-bestanden: geldig.
- Lokale HTML-links: gecontroleerd door de releasecheck.
- Lokale HTTP-smoketest voor de hoofdassets: status 200.
- CSS: geparset met `tinycss2` indien beschikbaar.

## Lijncontract

- bron-/boomlijnen: `0.72`;
- minimale SVG-boxcontouren: `0.50`;
- projectielijnen: `1.42`;
- projectieassen: `1.58`.

De projecties zijn daarmee visueel zwaarder dan de bronstructuur, zonder vette belijning.

## Browsercontrole

Een lokale HTTP-smoketest is uitgevoerd. Chromium kon in deze container niet betrouwbaar afsluiten; daarom wordt geen volledige visuele browsertest geclaimd.
