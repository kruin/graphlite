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
config/default-config.json
config/user-config.json
PUBLICATIE_README.md
publicatie-carrousel/index.html
publicatie-carrousel/slides/01-every-node-owns-grid-lines.png
publicatie-carrousel/slides/07-core-first-examples-follow.png
```

`tools/check_publication_carousel.py` controleert daarnaast dat alle zeven
genummerde slides aanwezig zijn en exact 1080 × 1080 pixels meten.

## Eigen Config vóór de projectzip

De site en iedere volledige projectzip bewaren de standaard en de eigen
Config als afzonderlijke lagen:

```text
config/default-config.json
config/user-config.json
```

Start lokaal via `start_local_viewer.bat`, stel Config in en kies onder
`Bestanden & export` de knop `Schrijf huidige Config naar project`. De lokale
server schrijft alleen het allowlistdoel `config/user-config.json`; de
standaardconfig blijft ongewijzigd. Maak daarna pas de volledige projectzip.

Werk je vanaf een gewone webserver, kies dan `Download user-config` en plaats
het gedownloade bestand handmatig als `config/user-config.json`.

Laadvolgorde:

```text
code-defaults → default-config → user-config → browser-Config
```

De laatste aanwezige waarde wint. Controleer vóór publicatie dat beide
configbestanden hetzelfde versienummer als `VERSION.txt` hebben.

`PUBLICATIE_README.md`, de bewerkbare carrouselbron en alle zeven PNG-slides
gaan verplicht mee in de projectzip. Vul de platformspecifieke
URL-placeholders pas in voor de concrete publicatie.

## Staging

Vóór de releasecheck normaliseert de BAT alle bekende tekstbestanden:

```bat
python tools\normalize_text_files.py --write
```

Daarna past Git de actuele `.gitattributes` ook op bestaande indexinhoud toe en
staged de BAT alle wijzigingen:

```bat
git add --renormalize -- .
git add -A -- .
git diff --cached --check
```

Genegeerde bestanden blokkeren de publicatie niet. Full-sourcezips en lokale
test-/logbestanden worden bovendien expliciet uit de index gehouden.

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
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.45&nocache=TIMESTAMP
```

Daarna:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.45
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

`.gitattributes` legt line-endings vast voor Windows, GitHub Pages en
zip-builds: bron, web en documentatie gebruiken LF; Windows-scripts gebruiken
CRLF. `tools/normalize_text_files.py` bewaakt daarnaast exact één afsluitende
EOL en verwijdert een extra lege regel aan EOF. `publish_checked.bat` voert de
herstelmodus uit vóór checks, commitboodschap en staging. Daardoor keren de
reeks `LF will be replaced by CRLF` en een late `new blank line at EOF`-fout
niet als handwerk terug.


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
