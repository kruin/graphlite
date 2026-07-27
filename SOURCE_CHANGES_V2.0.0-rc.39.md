# Source changes v2.0.0-rc.39

## Staand/liggend testen op een groot scherm

- Hersteld dat de lokale simulatie eerst kort het gekozen telefoonframe toonde
  en na de MAX-render weer naar de volledige desktopbreedte sprong.
- De oorzaak was een latere `main-window-max`-regel die de breedte van
  `app-shell`, `workspace` en `canvas-wrap` opnieuw op `100vw` zette.
- De definitieve viewportregel houdt `mobile-portrait` nu op 390 × 844 en
  `mobile-landscape` op 844 × 390, ook nadat MAX volledig is gerenderd.
- Terug naar het grote scherm gebeurt alleen nog wanneer expliciet
  `Automatisch`, `Desktop` of lokaal `auto` wordt gekozen.

## Actuele versie in de lokale schakelaar

- `local-mobile-test.js` schrijft geen hardgecodeerde oude `rc.13` meer.
- De cachequery `ogv` wordt afgeleid uit de versie van de geladen viewer.
- Daardoor veroorzaakt een keuze voor staand of liggend geen kunstmatige
  versieafwijking meer.

## Controle

- Nieuw: `tools/check_viewport_switch_runtime.js`.
- De echte Chromium-controle schakelt op een desktopviewport via zowel het
  Interface-menu als de lokale keuzeknop.
- Zij wacht na iedere render, controleert de blijvende frameafmetingen en
  verifieert ook liggend en de expliciete terugkeer naar automatisch.
