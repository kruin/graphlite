# HANDOVER_FOR_COLLABORATORS

Overdracht voor mensen die verder willen werken aan OpenGraph Lite Viewer v1.0.5.

## Wat is dit?

OpenGraph Lite Viewer is een viewer/demo voor JAN / OPN / OpenGraph-taalbomen.
De kern is een vrije bronboom met zelfstandige projecties:

```text
LEX    zichtbare volgorde / lexicale plaatsing
SYNT   syntactische categorieprojectie
LOG/FT logische, functionele of thematische projectie
```

## Beginpunt

Werk altijd vanaf de nieuwste stabiele projectzip. Voor deze overdracht is dat:

```text
OpenGraph_Lite_Viewer_v1.0.5.zip
```

Open:

```text
index.html
```

## Bestanden die leidend zijn

```text
PROJECT_STATE_CURRENT.md
LAYOUT_RULES.md
LINGUISTIC_ACTIONS.md
DEPLOY_GITHUB_PAGES.md
LEX_MOVEMENT_RULES.md
README.md
```

Gebruik oude zips, screenshots en verouderde docs alleen als archief, niet als leidende specificatie.

## Werken met ChatGPT

Maak een nieuw ChatGPT-project en voeg minimaal deze bestanden toe:

```text
OpenGraph_Lite_Viewer_v1.0.5.zip
PROJECT_STATE_CURRENT.md
LAYOUT_RULES.md
LINGUISTIC_ACTIONS.md
DEPLOY_GITHUB_PAGES.md
LEX_MOVEMENT_RULES.md
README.md
```

Projectinstructie:

```text
Je werkt aan OpenGraph / GraphLite / JAN / OPN.
Werk altijd vanaf de nieuwste projectzip.
Maak bij elke wijziging een nieuwe versie-zip.
Geef altijd: downloadlink, gewijzigde onderdelen en uitgevoerde controles.
Gebruik Nederlands voor overleg.
Bij codewijzigingen: wijzig bestanden, test met node --check viewer.js en zip opnieuw.
```

## Harde layoutregels

- LEX-as links.
- SYNT-as rechts.
- LOG/FT-as onder.
- LOG/FT-as behoudt eigen SVG-hoogte.
- HTML-overlays mogen assen niet verplaatsen.
- SOV-taalactiebox staat default links naast het begin van de LOG/FT-as.
- SOV-box bevat `‹ SOV ›` en geen LOG-label.
- Projectiebox staat rechts naast de SYNT-as, niet eroverheen.

## Taalkundige regels

- Bijwoorden zijn LEX-inserties, geen syntaxmutaties.
- Wissel is een LEX-regel.
- SOV/VSO/etc verandert alleen LOG/FT-projectie, niet SYNT of LEX.
- Lexicale insertie, negatiebereik, focus/contrast en V2/PV-plaatsing kunnen later in dezelfde taalactiebox worden ondergebracht.

## Referenties

Achtergrondbronnen staan in:

```text
references/README_REFERENCES.md
```

Gebruik deze als context, niet als leidende projectspecificatie.

## Publicatie

Gebruik:

```text
publish_checked.bat
```

Deze doet preflight en publiceert naar GitHub wanneer de map een Git-repository is.

Na publicatie:

```text
reset-cache.html?ogv=v1.0.5
```

## Test vóór nieuwe zip

```bat
node --check viewer.js
```

Daarna zip-integriteit controleren.

## v1.0.5 — lokale mobile-test

Er is geen master/user-profiel meer in de viewer. Werk lokaal, test lokaal en kopieer daarna handmatig naar de repository.

Lokaal is er een kleine keuzeknop voor desktop/mobile-test. Die wordt toegevoegd door:

```text
local-mobile-test.js
```

Deze file staat in `.gitignore` en hoort niet mee naar GitHub Pages. Zonder die file blijft de gepubliceerde viewer schoon.

Handmatig testen kan ook met:

```text
index.html?viewport=mobile-portrait
index.html?viewport=mobile-landscape
index.html?viewport=desktop
```

Publicatiecontext:

```text
Repo: https://github.com/kruin/graphlite
Site: https://kruin.github.io/graphlite/
```
