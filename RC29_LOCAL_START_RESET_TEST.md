# Test — lokale start en verplichte cache-reset — v2.0.0-rc.29

## Normale start

1. Sluit een eventueel oud lokaal servervenster.
2. Pak de ZIP volledig uit; start niet vanuit de gecomprimeerde map.
3. Start `start_local_viewer.bat` of de compatibiliteitsnaam
   `startlocalviewer.bat`.
4. Controleer in het BAT-venster:
   - de bronmap is de actuele projectmap;
   - de app-versie is `v2.0.0-rc.29`.
5. Controleer dat eerst `reset-cache.html` opent met `ogv=v2.0.0-rc.29` en een
   wisselende `nocache`-waarde.
6. Controleer dat daarna de viewer `v2.0.0-rc.29` toont.

## Oude server op poort 8088

1. Start vanuit een oudere projectmap `server_nocache.py` op poort 8088.
2. Start daarna de rc.29-BAT.
3. Verwacht:
   - de browser opent niet;
   - de BAT meldt de verwachte en gevonden versie;
   - de BAT vraagt het oude servervenster te sluiten.
4. Sluit de oude server en start rc.29 opnieuw.

## Cachecontract

- De lokale BAT opent nooit direct `index.html`.
- Iedere start gebruikt een nieuwe cache-bustwaarde.
- De BAT kiest alleen Python en start `start_local_viewer.py`; de Python-launcher
  regelt server, wachtroutine, versieprobe en browser.
- `v4537` mag niet voorkomen in `start_local_viewer.bat`,
  `startlocalviewer.bat` of `debug.html`.

## Automatische controle

```text
python tools/check_local_start.py
```

Deze controle toetst achtereenvolgens een bestaande en een nieuw gestarte
lokale server, een juiste versie, een verkeerde versie, een gesloten poort, de
minimale BAT en de compatibiliteitsstarter.
