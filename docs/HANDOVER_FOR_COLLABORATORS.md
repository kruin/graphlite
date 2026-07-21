# HANDOVER_FOR_COLLABORATORS

Overdracht voor mensen die verder willen werken aan OpenGraph Lite Viewer v1.0.9.

## Wat is dit?

OpenGraph Lite Viewer is een viewer/demo voor JAN / OPN / OpenGraph-taalbomen.
De kern is een vrije bronboom met zelfstandige views en projectie-assen.

Views:

```text
Syntax tree              standaardweergave
Functional structure     standaard alternatieve weergave
```

Projectie-assen:

```text
LEX    zichtbare volgorde / lexicale plaatsing
SYNT   syntactische categorieprojectie en syntaxregels
LOG    zuidas: logische S-O-V-volgordeprojectie
```

## Beginpunt

Werk vanaf de actuele projectzip:

```text
OpenGraph_Lite_Viewer_v1.0.9_help_tree_carousel_space.zip
```

Open:

```text
index.html
```

## Bestanden die leidend zijn

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

## Werken met ChatGPT

Maak een ChatGPT-project en voeg minimaal de bestanden toe die in `PROJECT_FILES_TO_ADD_UPDATE.md` staan.

Projectinstructie:

```text
Je werkt aan OpenGraph / GraphLite / JAN / OPN.
Werk altijd vanaf de nieuwste projectzip.
Maak bij elke wijziging een nieuwe versie-zip.
Geef altijd: downloadlink, gewijzigde onderdelen en uitgevoerde controles.
Gebruik Nederlands voor overleg.
Bij codewijzigingen: wijzig bestanden, test met node --check viewer.js en zip opnieuw.
Documentatie beschrijft de actuele werking, niet de projecthistoriek.
```

## Harde layoutregels

- LEX-as links.
- SYNT-as rechts.
- LOG-as onder.
- LOG-as behoudt eigen SVG-hoogte.
- HTML-overlays mogen assen niet verplaatsen.
- SOV-taalactiebox staat default links naast het begin van de LOG-as.
- SOV-box bevat `‹ SOV ›`.
- Projectiebox staat rechts naast de SYNT-as, niet eroverheen.
- Syntax tree en Functional structure zijn views op dezelfde voorbeeldzin.

## Taalkundige regels

- Bijwoorden zijn LEX-inserties, geen syntaxmutaties.
- Wissel is een LEX-regel.
- SOV/VSO/etc verandert alleen LOG-projectie, niet SYNT of LEX.
- Functional structure blijft beschikbaar als alternatieve view.
- Lexicale insertie, negatiebereik, focus/contrast en V2/PV-plaatsing kunnen later in dezelfde taalactiebox worden ondergebracht.

## Referenties

Achtergrondbronnen staan in:

```text
references/README_REFERENCES.md
```

Gebruik deze als context. De leidende projectspecificatie staat in de projectbestanden.

## Publicatie

Gebruik:

```text
publish_checked.bat
```

Deze doet preflight en publiceert naar GitHub wanneer de map een Git-repository is.

Na publicatie:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v1.0.9
```


## Helpstructuur

Help werkt als boomnavigatie. Houd helpcontent per onderwerp apart en gebruik de gereserveerde carouselruimte voor de documentatie van Open Graph Notation en de tree-toepassing.
