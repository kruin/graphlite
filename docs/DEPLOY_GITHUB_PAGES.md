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

Gebruik in de BAT geen brede `git add -A -- .` wanneer lokale genegeerde testbestanden in de map staan.

Huidige aanpak:

```bat
git add -u -- .
git ls-files --others --exclude-standard
```

Dat staged tracked wijzigingen/verwijderingen en daarna alleen nieuwe, niet-genegeerde bestanden.

Niet gebruiken:

```bat
git add .
git add -A -- .
```

## Cache-reset

De BAT kan browsercache niet op afstand wissen. Wel zinvol:

- controleren dat `reset-cache.html` bestaat;
- na push de juiste reset-URL tonen;
- eventueel die URL openen.

Voorbeeld:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v1.0.7&nocache=TIMESTAMP
```

Daarna:

```text
https://kruin.github.io/graphlite/index.html?ogv=v1.0.7
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

## v1.0.7 publicatie

Geen master/user-profiel in de viewer. Publicatie is handmatig:

```text
Repo:  https://github.com/kruin/graphlite
Site:  https://kruin.github.io/graphlite/
```

Lokaal testen blijft lokaal:

```text
index.html?viewport=mobile-portrait
index.html?viewport=mobile-landscape
index.html?viewport=desktop
```

`local-mobile-test.js` voegt lokaal een keuzeknop toe, maar staat in `.gitignore` en hoort niet naar GitHub Pages.

`publish_checked.bat` toont alleen de `github.io/graphlite` reset- en index-URL.


## v1.0.7 staging-fix

`publish_checked.bat` gebruikt nu:

```bat
git add -u -- .
```

Daarna worden nieuwe bestanden apart toegevoegd via:

```bat
git ls-files --others --exclude-standard
```

Hierdoor blokkeert een lokaal genegeerd bestand zoals `local-mobile-test.js` de publicatie niet meer. Release-zips en lokale testbestanden worden bovendien uit de Git-index verwijderd als ze eerder toch getrackt waren.

## v1.0.7 publicatie

Publiceer handmatig naar `https://github.com/kruin/graphlite`; controleer daarna `https://kruin.github.io/graphlite/reset-cache.html?ogv=v1.0.7`. Lokale mobile-testbestanden blijven buiten GitHub.
