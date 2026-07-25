# Source changes · v2.0.0-rc.25

## Mapnaam is ZIP-naam

`maak-volledige-zip.bat` gebruikt de map waarin de BAT zelf staat als enige
bron voor de pakketnaam:

```text
<actuele projectmap> → <actuele projectmap>_full_source.zip
```

Na het hernoemen van de projectmap hoeft daarom geen versienummer in een
script te worden aangepast. De ZIP wordt naast de projectmap geplaatst en
bevat de projectmap zelf als bovenste map.

## Veilige vervanging

De BAT bouwt eerst een tijdelijke ZIP naast de projectmap. Alleen na een
geslaagde compressie wordt die naar de definitieve doelnaam verplaatst. Een
bestaande ZIP met dezelfde naam blijft daardoor behouden als de compressie
mislukt en wordt anders vervangen. De BAT maakt zelf geen `(1)`-variant.

Voor de compressie wordt de standaard aanwezige Windows PowerShell/.NET
ZIP-functionaliteit gebruikt; een afzonderlijke EXE is niet nodig.

## Gelijke naam in publiceren

Ook `publish_checked.bat` leidt zijn getoonde release-ZIP nu af uit de actuele
projectmapnaam. De eerdere hardgecodeerde releasenaam is verwijderd.

## Controle

`tools/check_release_zip_batch.py` bewaakt:

- mapnaamafleiding via de locatie van de BAT;
- de suffix `_full_source.zip`;
- opname van de bovenste projectmap;
- veilige tijdelijke opbouw en vervanging;
- afwezigheid van een hardgecodeerde releaseversie.
