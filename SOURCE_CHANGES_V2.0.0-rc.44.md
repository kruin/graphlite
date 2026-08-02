# Source changes v2.0.0-rc.44

## Doel

rc.44 maakt van `PUBLICATIE_README.md` een werkelijk plaatsbaar
publicatiepakket. De release bevat naast platformtekst ook een vaste reeks
beeldslides die als één gallery kan worden geüpload, bijvoorbeeld op Reddit.

## Toegevoegd

- `publicatie-carrousel/index.html`: zelfstandige bewerkbare HTML-bron voor de
  complete reeks.
- `publicatie-carrousel/slides/01-*.png` tot en met
  `publicatie-carrousel/slides/07-*.png`: zeven kant-en-klare beelden van exact
  1080 × 1080 pixels.
- `tools/export_publication_carousel.js`: herhaalbare export met
  Chromium/Playwright.
- `tools/check_publication_carousel.py`: controle op bron, inhoudsmarkeringen,
  bestandsnamen, aantal, PNG-signatuur en pixelafmetingen.
- `RC44_PUBLICATION_CAROUSEL_TEST.md`: handmatige visuele en inhoudelijke
  akkoordlijst.

## Inhoud van de reeks

1. kernstelling: structure is not word order;
2. probleem: één traditionele boom moet twee taken tegelijk uitvoeren;
3. OGN-oplossing: centrale structuur en LEX-woordvolgorde gescheiden;
4. named projections: LEX west, SYNT oost en LOG zuid;
5. OGN Basis → Voorconfig → Toepassing;
6. standaardconfig plus overschrijvende user-config;
7. gerichte oproep tot technische en taalkundige feedback.

## Documentatie

- `PUBLICATIE_README.md` bevat de exacte uploadvolgorde, Reddit-stappen, titel,
  posttekst, alt-tekst per slide en aanvullende platformteksten.
- `README.md`, `LEESMIJ.md`, ingebouwde README, projectstatus, overdracht,
  publicatiehandleiding en docs-home verwijzen naar de bron en de zeven
  uitvoerbeelden.
- De release notes en documentatieregels maken onderscheid tussen
  automatische PNG-controle en het nog vereiste menselijke oordeel over
  leesbaarheid, afsnijding, kleur en inhoud.

## Afbakening

- rc.44 verandert geen graph-, layout-, Config-, opslag- of
  toepassingsfunctionaliteit van de viewer.
- De rc.43-Config- en LEESMIJ-functionaliteit blijft ongewijzigd geërfd.
- De slides gebruiken lokale projectassets en laden geen externe scripts of
  fonts.
- Een gallery kan alleen worden geplaatst waar het gekozen platform en de
  gekozen community meerdere afbeeldingen toestaan.
