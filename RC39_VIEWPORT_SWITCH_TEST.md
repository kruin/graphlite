# RC39 viewport-schakeltest

Doel: op een groot scherm blijven de lokaal gekozen mobiele testweergaven
staan nadat MAX volledig is gerenderd.

## Handmatig

1. Start `start_local_viewer.bat` op een groot scherm.
2. Kies rechtsonder bij `LOKAAL` voor `mobile staand`.
3. Het venster blijft 390 × 844; het mag niet na korte tijd weer breed worden.
4. Kies `mobile liggend`.
5. Het venster blijft 844 × 390.
6. Controleer in de adresbalk dat `ogv` de actuele releaseversie bevat en niet
   `v2.0.0-rc.13`.
7. Kies `auto`. Alleen nu vult de viewer het grote scherm weer.
8. Herhaal `Mobiel staand` via het hoofdmenu `Interface`; ook die keuze blijft
   na de MAX-render begrensd.

## Geautomatiseerd

Met Playwright beschikbaar:

```text
node tools/check_viewport_switch_runtime.js
```

De controle start zelf een tijdelijke lokale webserver. Een bestaande server
kan optioneel als URL worden meegegeven.
