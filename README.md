# OpenGraph Lite Viewer v1.0

OpenGraph Lite Viewer is een demo/viewer voor **JAN / OPN / OpenGraph-taalbomen**.
De viewer toont een vrije bronboom met zelfstandige projectie-assen:

```text
LEX links/west
SYNT rechts/oost
LOG/FT onder/zuid
```

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
https://kruin.github.io/graphlite/index.html?ogv=v1.0
```

Bij oude browsercache:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v1.0
```

## Leidende projectbestanden

Deze bestanden zijn de compacte actuele project-sources:

```text
PROJECT_STATE_CURRENT.md
LAYOUT_RULES.md
LINGUISTIC_ACTIONS.md
DEPLOY_GITHUB_PAGES.md
HANDOVER_FOR_COLLABORATORS.md
LEX_MOVEMENT_RULES.md
```

Dezelfde kernbestanden staan ook in `docs/`, zodat ze via de docs-map vindbaar blijven.

## Harde layoutregels

- LEX-as links van de boom.
- SYNT-as rechts van de boom.
- LOG/FT-as onder de boom.
- De LOG/FT-as behoudt zijn eigen SVG-hoogte.
- HTML-overlays, inclusief de SOV-taalactiebox, mogen assen niet verplaatsen.
- Projectieboxen staan rechts van de SYNT-as, niet eroverheen.
- De standaardfit toont boom, assen, projecties en taalactiebox.

## Taalactiebox

De eerste taalactiebox bevat:

```text
‹ SOV ›
```

Deze actie verandert alleen de LOG/FT-volgordeprojectie. De centrale boom, SYNT-projectie en lexicale inhoud blijven ongemoeid.

## Referenties

Achtergrondbronnen staan apart in:

```text
references/README_REFERENCES.md
```

Deze zijn nuttig voor theorie en context, maar de actuele werkinstructies staan in de projectbestanden hierboven.

## Publiceren

Gebruik voor publicatie:

```text
publish_checked.bat
```

Deze controleert minimaal:

```bat
node --check viewer.js
```

en opent desgewenst de reset-cache-pagina na push.

## Controle vóór delen

```bat
node --check viewer.js
```

Daarna de zip-integriteit controleren.

## Versie

Dit is **OpenGraph Lite Viewer v1.0**.
Oudere v45xx-builds zijn ontwikkelgeschiedenis; deze zip is bedoeld als gedeelde basisversie.
