# SOURCE_CHANGES_V2.0.5

## Nieuwe versieduiding

De release is aangeduid als `v2.0.6`. `VERSION.txt`, appbestanden, cachebestanden, manifest, actieve documentatie en lokale startlinks gebruiken dezelfde versie.

## Eenvoudige Git-werkwijze hersteld

De tijdelijke A/B-repositorywerkwijze uit v2.0.0–v2.0.3 is verwijderd uit de actuele releasebediening.

Verwijderd:

- `graphlite_safe_update.bat`;
- `LOCAL_GIT_SAFE_WORKFLOW.md`;
- de actuele A/B-workflowtestbestanden.

Hersteld:

- rechtstreeks kopiëren naar `C:\git\graphlite`;
- lokaal testen via `start-local-viewer.bat` en `reset-cache.html`;
- publiceren via `publish_checked.bat`;
- commitbericht, directe commit en push in dezelfde gecontroleerde publicatiestap;
- automatische eenmalige cache-reset na een geslaagde push.

De BAT gebruikt geen `git pull` en geen force-push.

## Release-manifest hersteld voor een echte Git-repository

De releasecontrole behandelde `.git` ten onrechte als onderdeel van de productbron wanneer `publish_checked.bat` vanuit `C:\git\graphlite` werd gestart. Daardoor meldde de controle interne bestanden zoals `.git/HEAD`, `.git/config` en `.git/hooks/...` als ontbrekend in `RELEASE_MANIFEST.txt`.

Hersteld:

- `.git` wordt volledig uitgesloten van de productmanifestcontrole;
- lege regels in `RELEASE_MANIFEST.txt` worden genegeerd;
- lokale releasezips, Python-cachebestanden en lokale config-logbestanden blokkeren de releasecontrole niet;
- een manifest waarin handmatig `.git`-regels zijn geplaatst geeft een gerichte herstelmelding;
- `RELEASE_MANIFEST.txt` hoeft bij normaal gebruik niet handmatig te worden aangepast.

## Meldingen blijven zichtbaar

`publish_checked.bat` wacht voortaan bij zowel succes als fout op een toets. Bij starten via dubbelklik sluit het DOS-venster daardoor niet meer voordat de melding kan worden gelezen.
