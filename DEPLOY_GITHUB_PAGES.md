# DEPLOY_GITHUB_PAGES

Deploy- en cache-instructies voor GitHub Pages.

## Publiceren

Gebruik één gecontroleerde publicatie-BAT:

```text
publish_checked.bat
```

Publicatiepad:

```text
https://github.com/kruin/graphlite
https://kruin.github.io/graphlite/
```

## Preflight

Voor push controleert de BAT minimaal:

```bat
node --check viewer.js
```

En minimaal bestaan:

```text
index.html
viewer.html
viewer.js
styles.css
reset-cache.html
```

## Staging

De BAT staged tracked wijzigingen met:

```bat
git add -u -- .
```

Daarna voegt hij alleen nieuwe, niet-genegeerde bestanden toe via:

```bat
git ls-files --others --exclude-standard
```

Genegeerde bestanden blokkeren de publicatie niet.

## Niet publiceren naar Pages-root

```text
OpenGraph_Lite_Viewer_v*.zip
local-mobile-test.js
local-mobile-test.html
```

Deze staan in `.gitignore`.

## Cache-reset

Na een bevestigde nieuwe push roept `publish_checked.bat` een afzonderlijke
reset-subroutine aan. De URL wordt daar vóór de `if`-blokken opgebouwd, zodat
CMD geen lege waarde kan invullen en Verkenner niet in plaats van de browser
opent.

De BAT kan browsercache niet op afstand wissen. Zij kan wel:

- controleren dat `reset-cache.html` bestaat;
- uitsluitend na een geslaagde nieuwe push de juiste reset-URL tonen;
- die URL eenmaal per appversie automatisch openen;
- bij mislukte browseropening de volledige handmatige URL tonen.

Voorbeeld:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.41&nocache=TIMESTAMP
```

Daarna:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.41
```

## GitHub Pages settings

Controleer bij problemen:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

## .nojekyll

Laat `.nojekyll` in de root staan zodat GitHub Pages alle bestanden direct serveert.

## Line endings

`.gitattributes` legt line-endings vast voor Windows, GitHub Pages en zip-builds.


## .gitignore

Deze bestanden blijven lokaal of buiten de Pages-root:

```text
*_full_source*.zip
local-mobile-test.js
local-mobile-test.html
opengraph-local-config-log-*.txt
local-config-log*.txt
```

Reden:

- full-source-releasezips zijn downloadartefacten, geen sitebestanden; ook een
  browserkopie met `(1)` in de naam wordt genegeerd;
- `local-mobile-test.*` is alleen voor lokale mobile-test op desktop;
- config-logbestanden zijn lokale werksessie-logs.
