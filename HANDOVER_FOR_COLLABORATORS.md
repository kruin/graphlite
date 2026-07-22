# HANDOVER_FOR_COLLABORATORS

Overdracht voor OpenGraph Lite Viewer `v2.0.0-rc.17`.

## Niet wijzigen zonder expliciete opdracht

```text
Centrale views:  Syntax → FT
Assen:            LEX west, SYNT oost, LOG zuid
Default assen:    LEX + SYNT + LOG zichtbaar
Topmenu:          Zin, Bijwoord, Syntax/FT, Interface, Projecties,
                  LOG-volgorde, NL/EN, Help, Config
Raster:           standaard aan; Config → Boom → Weergave
```

- LOG is nooit een centrale view.
- Er is geen Bron-tabblad, algemene Menu-knop, genest submenu of SOV-box in het canvas.

## Layoutcontract

- Projectiewissels veranderen x, y, schaal of viewBox niet.
- Syntax ↔ FT behoudt pan en zoom.
- Mobile gebruikt de volledige viewport onder de bediening.
- Raster loopt tot de uiteinden van zichtbare projectie-stippellijnen en mag de viewBox niet beïnvloeden.
- Rasterlijnen blijven dunner dan projectielijnen.

## Configcontract

- `showGrid` start als `true`.
- Oudere snapshots migreren eenmaal naar `showGrid=true`.
- De zichtbare checkbox staat direct onder `Config → Boom → Weergave` met label `Raster zichtbaar · standaard aan` / `Grid visible · default on`.

## Werkwijze

1. Lees `VERSION.txt`.
2. Wijzig app en leidende instructies samen.
3. Voer `node --check viewer.js` en `check_release.bat` uit.
4. Maak een zip met exact hetzelfde versienummer.

## Topmenu-layout rc.17

Behoud altijd twee vaste rijen. De zes keuze-items staan op rij 1; NL/EN, Help en Config staan op rij 2. Dit geldt ook op desktop en in geforceerde mobile-preview.
