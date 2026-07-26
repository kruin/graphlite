# Source changes — v2.0.0-rc.29

## Basis

rc.29 is uitsluitend gebouwd op `v2.0.0-rc.28`.

## Lokale start en verplichte cache-reset

- `start_local_viewer.bat` leest de actieve versie uit `VERSION.txt`; er staat geen
  oude vaste versieaanduiding meer in de BAT.
- De BAT toont vóór het starten de exacte bronmap en app-versie.
- De browser wordt nooit rechtstreeks met `index.html` geopend. Iedere lokale
  start loopt verplicht via `reset-cache.html` met de actuele versie en een
  nieuwe `nocache`-waarde.
- Vóór de browser opent, vraagt de BAT `VERSION.txt` op via poort 8088. Wanneer
  daar nog een oudere projectmap wordt bediend, stopt de BAT met een concrete
  melding in plaats van die oude viewer te openen.
- Wanneer nog geen server actief is, start de BAT `server_nocache.py` in een
  afzonderlijk zichtbaar venster en wacht zij tot exact de verwachte versie
  wordt bediend.
- `start_local_viewer.bat` is toegevoegd als compatibiliteitsnaam. Daardoor
  wordt ook een bestaande werkwijze met underscore naar de actuele BAT geleid.
- Oude `v4537`-links zijn uit de actieve lokale start- en debugbestanden
  verwijderd.

## Ongewijzigd

De viewerfunctionaliteit, lexiconprofielen, OGN/JaN-documentatie, Config-save-
werkwijze, publicatieprocedure en projectielayout van rc.28 zijn niet gewijzigd.
