# EENVOUDIGE_RELEASE_WERKWIJZE_TEST

## Broninstallatie

1. Pak de v2.0.10-source-zip buiten Git uit.
2. Kopieer de inhoud over `C:\git\graphlite`.
3. Controleer dat `C:\git\graphlite\.git` nog bestaat.
4. Controleer met `git status --short` dat alleen verwachte bronwijzigingen zichtbaar zijn.
5. Wijzig `RELEASE_MANIFEST.txt` niet handmatig; het bestand uit de bronzip is leidend.

## Lokale test

1. Start `start-local-viewer.bat`.
2. Open `http://127.0.0.1:8088/reset-cache.html`.
3. Controleer desktop, portrait en landscape.
4. Controleer Syntax, Functional, LEX, SYNT, LOG, groei, Config en talen.

## Publicatie

1. Start `publish_checked.bat` pas na een geslaagde lokale test.
2. Controleer dat de releasecheck slaagt terwijl `C:\git\graphlite\.git` aanwezig is.
3. Controleer dat de uitvoer geen `.git/HEAD`, `.git/config` of `.git/hooks/...` noemt.
4. Vul een commitbericht in.
5. Controleer dat commit en push slagen.
6. Controleer dat de online resetpagina eenmaal wordt geopend.
7. Controleer de gepubliceerde versie op desktop en mobile.
8. Controleer dat het BAT-venster bij succes en bij een testfout zichtbaar blijft tot een toets wordt ingedrukt.
