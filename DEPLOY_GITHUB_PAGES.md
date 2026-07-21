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

De BAT kan browsercache niet op afstand wissen. Wel zinvol:

- controleren dat `reset-cache.html` bestaat;
- na push de juiste reset-URL tonen;
- eventueel die URL openen.

Voorbeeld:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.9&nocache=TIMESTAMP
```

Daarna:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.9
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
OpenGraph_Lite_Viewer_v*.zip
local-mobile-test.js
local-mobile-test.html
opengraph-local-config-log-*.txt
local-config-log*.txt
```

Reden:

- release-zips zijn downloadartefacten, geen sitebestanden;
- `local-mobile-test.*` is alleen voor lokale mobile-test op desktop;
- config-logbestanden zijn lokale werksessie-logs.
