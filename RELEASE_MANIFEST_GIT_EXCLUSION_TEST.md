# RELEASE_MANIFEST_GIT_EXCLUSION_TEST

## Doel

Controleer dat `publish_checked.bat` rechtstreeks vanuit `C:\git\graphlite` kan draaien zonder dat interne `.git`-bestanden in `RELEASE_MANIFEST.txt` hoeven te staan.

## Test

1. Kopieer de inhoud van de v2.0.6-bronzip over `C:\git\graphlite`.
2. Laat `C:\git\graphlite\.git` ongewijzigd aanwezig.
3. Gebruik het meegeleverde `RELEASE_MANIFEST.txt`; voeg geen `.git`-regels toe.
4. Start `check_release.bat`.
5. Verwacht: `RELEASE CHECK: OK (v2.0.6)`.
6. Start daarna `publish_checked.bat`.
7. Verwacht dat de releasecontrole geen `.git/HEAD`, `.git/config`, `.git/hooks/...`, `.git/FETCH_HEAD` of `.git/COMMIT_EDITMSG` noemt.

## Negatieve controle

Voeg tijdelijk `.git/HEAD` toe aan `RELEASE_MANIFEST.txt` en start `check_release.bat`.

Verwacht een gerichte melding dat `.git` niet in het productmanifest mag staan. Zet daarna het originele manifest uit de bronzip terug.
