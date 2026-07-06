# DEPLOY_GITHUB_PAGES

Deploy- en cache-instructies voor GitHub Pages.

## Publiceren

Gebruik één gecontroleerde publicatie-BAT:

```text
publish_checked.bat
```

Niet meerdere bijna gelijke BAT-bestanden naast elkaar gebruiken.

## Preflight

Voor push moet de BAT controleren:

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

Gebruik:

```bat
git add -A
```

Niet:

```bat
git add .
```

## Cache-reset

De BAT kan browsercache niet op afstand wissen. Wel zinvol:

- controleren dat `reset-cache.html` bestaat;
- na push de juiste reset-URL tonen;
- eventueel die URL openen.

Voorbeeld:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v1.0&nocache=TIMESTAMP
```

Daarna:

```text
https://kruin.github.io/graphlite/index.html?ogv=v1.0
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
