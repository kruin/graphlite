# HANDOVER_FOR_COLLABORATORS

Overdracht voor mensen die verder willen werken aan OpenGraph Lite Viewer v1.0.7.

## Wat is dit?

OpenGraph Lite Viewer is een viewer/demo voor JAN / OPN / OpenGraph-taalbomen.
De kern is een vrije bronboom met zelfstandige views/projecties:

```text
LEX    zichtbare volgorde / lexicale plaatsing
SYNT   syntactische categorieprojectie en syntaxregels
LOG    zuidas: logische S-O-V-volgordeprojectie
FT     functionele view naast de standaard syntaxboom-view
```

Belangrijk: FT is geen onderdeel van de LOG-as. Op de zuidas staat alleen LOG.

## Beginpunt

Werk altijd vanaf de nieuwste stabiele projectzip. Voor deze overdracht is dat:

```text
OpenGraph_Lite_Viewer_v1.0.7.zip
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
OpenGraph_Lite_Viewer_v1.0.7.zip
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
- LOG-as onder.
- Alleen LOG staat op de zuidas.
- FT is functionele view, niet LOG-as.
- LOG-as behoudt eigen SVG-hoogte.
- HTML-overlays mogen assen niet verplaatsen.
- SOV-taalactiebox staat default links naast het begin van de LOG-as.
- SOV-box bevat `‹ SOV ›` en geen LOG-label.
- Projectiebox staat rechts naast de SYNT-as, niet eroverheen.

## Taalkundige regels

- Bijwoorden zijn LEX-inserties, geen syntaxmutaties.
- Wissel is een LEX-regel.
- SOV/VSO/etc verandert alleen LOG-projectie, niet SYNT of LEX.
- FT-bronrollen blijven apart van de LOG-flip.
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
reset-cache.html?ogv=v1.0.7
```

## v1.0.7 — View-keuze syntaxboom / functional structure

- Hoofdmenu krijgt een compacte `View`-keuze.
- Standaard: syntax tree / syntaxboom.
- Alternatief: functional structure met `CLAUSE`, `PRED`, `AGENS` en `PATIENS`.
- FT blijft een view naast de syntaxboom-view, niet een onderdeel van de LOG-zuidas.
- LOG blijft de zuidas voor de logische S-O-V-projectie.
