# DEPLOY_GITHUB_PAGES

Deploy- en cache-instructies voor GitHub Pages.

## Eenvoudige lokale bronupdate

Pak de volledige source-zip buiten Git uit. Kopieer daarna de inhoud van de uitgepakte versiemap over:

```text
C:\git\graphlite
```

Laat `C:\git\graphlite\.git` staan. Er is geen `graphlite-next`, clone, bundle of promotiefase.

## Eerst lokaal testen

Start:

```bat
start-local-viewer.bat
```

Open:

```text
http://127.0.0.1:8088/reset-cache.html
```

Publiceer pas nadat desktop en mobile lokaal goed werken.

## Publiceren

Start in `C:\git\graphlite`:

```bat
publish_checked.bat
```

De BAT controleert de release, vraagt om een commitbericht, staged de sitebestanden, commit en pusht naar de actieve branch. Er wordt geen `git pull` en geen force-push uitgevoerd.

Publicatiepad:

```text
https://github.com/kruin/graphlite
https://kruin.github.io/graphlite/
```

## Eenmalige cache-reset na push

Na een geslaagde push opent `publish_checked.bat` automatisch eenmaal:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.9&nocache=...
```

Handmatig opnieuw resetten:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.9&nocache=TIMESTAMP
```

Daarna:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.9
```

## Niet publiceren naar Pages-root

```text
OpenGraph_Lite_Viewer_v*.zip
local-mobile-test.js
local-mobile-test.html
opengraph-local-config-log-*.txt
local-config-log*.txt
```

Deze staan in `.gitignore` of worden door `publish_checked.bat` uitgesloten.

## GitHub Pages settings

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

Laat `.nojekyll` in de root staan. `.gitattributes` legt line-endings vast.
