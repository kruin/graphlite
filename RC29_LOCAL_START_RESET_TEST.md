# Test — lokale start en verplichte cache-reset — v2.0.0-rc.29

## Normale start

1. Sluit een eventueel oud lokaal servervenster.
2. Start `start_local_viewer.bat` of `start_local_viewer.bat`.
3. Controleer in het BAT-venster:
   - de bronmap is de actuele projectmap;
   - de app-versie is `v2.0.0-rc.29`.
4. Controleer dat eerst `reset-cache.html` opent met `ogv=v2.0.0-rc.29` en een
   wisselende `nocache`-waarde.
5. Controleer dat daarna de viewer `v2.0.0-rc.29` toont.

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
- `v4537` mag niet voorkomen in `start_local_viewer.bat`,
  `start_local_viewer.bat` of `debug.html`.
