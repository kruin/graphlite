# EENVOUDIGE_RELEASE_WERKWIJZE

De eenvoudige werkwijze gebruikt rechtstreeks de bestaande repository:

```text
C:\git\graphlite
```

Er is geen `graphlite-next`, geen clone, geen Git-bundle en geen promotiefase.

## 1. Download en pak de bronzip uit

Pak de volledige source-zip uit in een tijdelijke downloadmap. Kopieer daarna de **inhoud** van de uitgepakte versiemap over:

```text
C:\git\graphlite
```

Verwijder of overschrijf nooit handmatig:

```text
C:\git\graphlite\.git
```

`.git` hoort niet bij de productbron en wordt door de releasecontrole volledig genegeerd. Pas `RELEASE_MANIFEST.txt` niet handmatig aan; kopieer het bestand gewoon mee uit de bronzip.

De productzip hoort buiten de repository te blijven.

## 2. Test lokaal

Open in `C:\git\graphlite`:

```bat
start-local-viewer.bat
```

Test vervolgens:

```text
http://127.0.0.1:8088/reset-cache.html
```

Test minimaal desktop, mobile portrait, mobile landscape, Syntax, Functional, projecties, groei, Config en talen.

## 3. Publiceer pas na een goede lokale test

Start in dezelfde map:

```bat
publish_checked.bat
```

De BAT:

1. controleert de release;
2. toont `git status`;
3. vraagt om een commitbericht;
4. staged gewijzigde, verwijderde en nieuwe sitebestanden;
5. maakt direct de commit;
6. pusht naar de huidige branch;
7. opent na een geslaagde push eenmaal de online cache-resetpagina.

Er wordt geen `git pull` en geen force-push uitgevoerd.

## Bij een fout vóór publiceren

Start `publish_checked.bat` niet. Corrigeer eerst de bestanden in `C:\git\graphlite` en test opnieuw.

Om uitsluitend de nog niet gecommitte bronkopie volledig terug te zetten naar de laatste commit:

```bat
git restore .
git clean -fd
```

Gebruik deze twee herstelopdrachten alleen wanneer alle lokale, niet-gecommitte wijzigingen werkelijk mogen verdwijnen.
