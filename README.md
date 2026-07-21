# OpenGraph Lite Viewer v1.0.9

OpenGraph Lite Viewer is een demo/viewer voor **JAN / OPN / OpenGraph-taalbomen**.
De viewer toont Open Graph Notation als rastergebaseerde taalnotatie.

Tree notation is daarin een toepassing: de syntaxboom wordt getekend op een geordend grid waarin elke knoop zijn eigen horizontale én verticale gridlijn heeft. Daardoor staat elke knoop op een eigen kruispunt en blijft er ruimte voor zelfstandige projecties en views.

## Start

Open lokaal:

```text
index.html
```

Of via een eenvoudige lokale server:

```bat
start-local-viewer.bat
```

Voor GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v1.0.9
```

Bij browsercache:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v1.0.9
```

## Views

De viewer heeft twee hoofdviews:

```text
Syntax tree              standaardweergave
Functional structure     standaard alternatieve weergave
```

De **Syntax tree** toont de centrale syntactische boom.

De **Functional structure** toont de functionele structuur van de zin, bijvoorbeeld:

```text
CLAUSE
AGENS
PRED
PATIENS
```

## Projectie-assen

De zelfstandige projectie-assen zijn:

```text
LEX    links/west: zichtbare woordvolgorde en lexicale plaatsing
SYNT   rechts/oost: syntactische regels en categorieprojectie
LOG    onder/zuid: logische S-O-V-projectie
```

## Taalactiebox

De eerste taalactiebox bevat:

```text
‹ SOV ›
```

Deze actie verandert alleen de LOG-volgordeprojectie. De centrale boom, SYNT-projectie, Functional structure en lexicale inhoud blijven gelijk.

## Mobile-test lokaal

Voor lokale desktoptest van mobile-layouts wordt `local-mobile-test.js` geladen op:

```text
localhost
127.0.0.1
file:
```

Dit script geeft lokaal een kleine keuzeknop voor:

```text
auto
desktop
mobile staand
mobile liggend
```

Het bestand staat in `.gitignore` en hoort niet mee naar GitHub Pages.

## Leidende projectbestanden

Deze bestanden zijn de compacte actuele project-sources:

```text
README.md
PROJECT_STATE_CURRENT.md
LAYOUT_RULES.md
LINGUISTIC_ACTIONS.md
DEPLOY_GITHUB_PAGES.md
DOCUMENTATION_RULES.md
HANDOVER_FOR_COLLABORATORS.md
PROJECT_FILES_TO_ADD_UPDATE.md
LEX_MOVEMENT_RULES.md
```

Dezelfde kernbestanden staan ook in `docs/`, zodat ze via de docs-map vindbaar blijven.

## Referenties

Achtergrondbronnen staan apart in:

```text
references/README_REFERENCES.md
```

Deze zijn nuttig voor theorie en context. De actuele werkinstructies staan in de projectbestanden hierboven.

## Publiceren

Gebruik voor publicatie:

```text
publish_checked.bat
```

Deze controleert minimaal:

```bat
node --check viewer.js
```

en gebruikt daarna Git voor staging, commit en push.

## Controle vóór delen

```bat
node --check viewer.js
```

Daarna de zip-integriteit controleren.


## Help

Help is opgezet als boomnavigatie. Links staat de onderwerpboom; rechts opent één onderwerp tegelijk. In Help is ruimte gereserveerd voor een carousel over Open Graph Notation en tree notation als toepassing.
