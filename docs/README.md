# OpenGraph Lite Viewer v1.0.7

OpenGraph Lite Viewer is een demo/viewer voor **JAN / OPN / OpenGraph-taalbomen**.
De viewer toont een vrije bronboom met zelfstandige projectie-assen:

```text
LEX links/west
SYNT rechts/oost
LOG onder/zuid
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
https://kruin.github.io/graphlite/index.html?ogv=v1.0.7
```

Bij oude browsercache:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v1.0.7
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
- LOG-as onder de boom.
- Alleen LOG staat op de zuidas.
- FT is geen aslaag; FT is de functionele view naast de standaard syntaxboom-view.
- De LOG-as behoudt zijn eigen SVG-hoogte.
- HTML-overlays, inclusief de SOV-taalactiebox, mogen assen niet verplaatsen.
- Projectieboxen staan rechts van de SYNT-as, niet eroverheen.
- De standaardfit toont boom, assen, projecties en taalactiebox.

## Taalactiebox

De eerste taalactiebox bevat:

```text
‹ SOV ›
```

Deze actie verandert alleen de LOG-volgordeprojectie. De centrale boom, SYNT-projectie, FT-view en lexicale inhoud blijven ongemoeid.

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

Dit is **OpenGraph Lite Viewer v1.0.7**.
Oudere v45xx-builds zijn ontwikkelgeschiedenis; deze zip is bedoeld als gedeelde basisversie.

## v1.0.3 — mobile smaller, SYNT isolated, help split LOG

- Mobile main controls are narrower: sentence and adverb controls show only the pulldown.
- `SYN` is renamed to `SYNT`.
- The `SYNT` projection is isolated: it shows syntax rules on source height without drawing a second central tree.
- `Boomruimte` and `Hoofdvenster` are configured under Config → Boom, not in the Main topbar.
- Help text distinguishes LOG from FT:
  - LOG = visible logical-order projection / flip context.
  - FT = functional/thematic layer with roles such as agens, patiens and predicaat.

## v1.0.3 — lokale mobile-test zonder publicatieprofielen

Gecorrigeerd:

- Master/user-profiel verwijderd uit de viewer en uit Config.
- `opengraph-runtime-config.js` verwijderd.
- Config → Boom bevat geen `Versieprofiel` en geen `Testweergave` meer.
- Mobile-test blijft mogelijk via lokale URL-parameter:
  - `?viewport=mobile-portrait`
  - `?viewport=mobile-landscape`
  - `?viewport=desktop`
- Lokaal wordt `local-mobile-test.js` geladen. Dit script voegt een kleine keuzeknop toe voor desktop/mobile-test.
- `local-mobile-test.js` staat in `.gitignore` en wordt niet mee gepubliceerd naar GitHub Pages.
- Publicatie blijft handmatig: bestanden kopiëren naar `https://github.com/kruin/graphlite`; gebruikersversie draait op `https://kruin.github.io/graphlite/`.


## v1.0.7 — publish staging fix

- `publish_checked.bat` gebruikt geen brede `git add -A -- .` meer.
- Tracked wijzigingen/verwijderingen worden gestaged met `git add -u`.
- Nieuwe, niet-genegeerde bestanden worden daarna apart toegevoegd via `git ls-files --others --exclude-standard`.
- Lokale mobile-testbestanden blijven genegeerd en blokkeren publicatie niet.
- `.gitattributes` legt line-endings vast, zodat Windows-waarschuwingen over LF/CRLF minder snel terugkomen.

## v1.0.7 — mobile zoom / portrait freeze fix

- Canvas pan/zoom standaard actief.
- Oude pinch/touch-state wordt leeggemaakt bij resize, orientationchange, blur en tabwissel.
- Lokale mobile-test emuleert portrait expliciet via body-class, niet alleen via browser-mediaquery.


## v1.0.7 — LOG-as gescheiden van FT-view

- Oude gecombineerde LOG+FT-labels verwijderd uit UI-tekst en documentatie.
- Projectieknop heet nu `LOG`.
- De zuidas is alleen LOG: logische S-O-V-projectie.
- FT is geen onderdeel van de zuidas; FT is de functionele view naast de standaard syntaxboom-view.
- De geïsoleerde LOG-view toont geen FT-regel-as meer.

## v1.0.7 — View-keuze syntaxboom / functional structure

- Hoofdmenu krijgt een compacte `View`-keuze.
- Standaard: syntax tree / syntaxboom.
- Alternatief: functional structure met `CLAUSE`, `PRED`, `AGENS` en `PATIENS`.
- FT blijft een view naast de syntaxboom-view, niet een onderdeel van de LOG-zuidas.
- LOG blijft de zuidas voor de logische S-O-V-projectie.
