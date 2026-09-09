# Afleveringen publiceren vanuit de LEESMIJ

## Hoofdregel

Iedere aflevering heeft één inhoudelijke bron: een ingebouwd LEESMIJ-item in
de viewer. De aflevering vertelt één afgebakend verhaal en gebruikt één
hoofdvoorbeeld. De bijbehorende carrousel hoort bij hetzelfde LEESMIJ-item.

```text
LEESMIJ-item + eigen carrousel
→ inhoudelijke en visuele controle
→ afleveringspakket
→ platformpublicatie
```

Een post op Reddit, LinkedIn of een ander platform is dus geen zelfstandige
bron. Corrigeer eerst het LEESMIJ-item en leid daarna de aflevering opnieuw af.

## Eén carrousel, twee uitvoervormen

De carrousel hoort inhoudelijk bij het LEESMIJ-item. In de viewer verschijnt
zij als ingebouwde LEESMIJ-carrousel; voor platforms wordt exact dezelfde
volgorde als vierkante, genummerde beelden uitgevoerd. Er zijn dus geen twee
verhalen of twee onafhankelijke bronnen.

De bestaande map `publicatie-carrousel/` blijft de algemene OGN-kerncarrousel
van de release. Afleveringscarrousels komen later afzonderlijk naast elkaar te
staan en overschrijven die algemene carrousel niet.

## Vaste inhoud van één aflevering

| Onderdeel | Verplicht |
|---|---|
| Nummer en slug | Bijvoorbeeld `01-hond-bijt-man` |
| Centrale vraag | Eén uitnodigende vraag |
| LEESMIJ-item | Ingebouwde NL- en EN-tekst |
| Hoofdvoorbeeld | Eén canoniek viewer-item en vaste URL |
| Carrousel | Bij voorkeur 4–7 genummerde beelden |
| Formaat | 1080 × 1080 pixels voor platformbeelden |
| Toegankelijkheid | Alt-tekst per beeld |
| Teststatus | Concept, testklaar of goedgekeurd |
| Testbewijs | Automatische controles plus handmatig beeldakkoord |
| Platformtekst | Per gekozen platform, niet automatisch voor alle platforms |
| Bronvermelding | Zichtbaar per slide; volledige bron en licentie in `CARROUSEL_BRONNEN.md` |

Publiceer zinnen en testmateriaal niet als één grote batch. Kies per aflevering
een uitnodigende, inhoudelijk samenhangende subset.

## Statussen

- **Concept:** onderwerp, tekst of beelden mogen nog wijzigen.
- **Testklaar:** bron en afgeleiden zijn technisch controleerbaar; visueel en
  inhoudelijk akkoord ontbreekt mogelijk nog.
- **Goedgekeurd:** de genoemde bronstand, tekst, carrousel, URL en platformtekst
  zijn handmatig gecontroleerd en mogen worden gepubliceerd.
- **Gepubliceerd:** datum, platform en definitieve URL zijn vastgelegd.

Noem een aflevering nooit goedgekeurd op basis van alleen automatische tests.

## Werkvolgorde

1. **Afbakenen** — kies één LEESMIJ-onderwerp en één voorbeeld.
2. **Brontekst** — werk de ingebouwde NL/EN-tekst bij.
3. **Broncarrousel** — voeg per stap beeld, onderschrift en NL/EN-alt-tekst toe.
   Voor ieder extern beeld zijn auteur, titel, jaar, oorspronkelijke
   bestandspagina, licentie en bewerkingsstatus verplicht. Zonder controleerbare
   hergebruikstatus vervalt het beeld.
4. **Interactieve link** — leg het viewer-item en alle noodzakelijke
   queryparameters vast.
5. **Afleiden** — maak genummerde 1080 × 1080 platformbeelden en platformtekst.
6. **Automatisch controleren** — aantallen, namen, afmetingen, links,
   bronversie en afleidingsmanifest.
7. **Handmatig controleren** — inhoud, volgorde, leesbaarheid, afsnijding,
   kleuronderscheid, desktop en mobiel.
8. **Goedkeuren** — noteer wie/wat is goedgekeurd en welke beperkingen blijven.
9. **Publiceren** — gebruik de vaste aflevering-URL met `utm_source` en een
   eigen campagnecode.
10. **Bewaren** — vervang een oudere aflevering niet; iedere aflevering blijft
    zelfstandig bereikbaar.

## Afleveringssjabloon

Kopieer dit blok bij het voorbereiden van een nieuwe aflevering:

```text
Aflevering: NN
Slug: nn-korte-naam
Status: concept
LEESMIJ-item-id:
Titel NL:
Title EN:
Centrale vraag:
Hoofdvoorbeeld/item-id:
Canonieke viewer-URL:
Carrousel: aantal slides
Platform(en):
Automatische controles:
Handmatige controles:
Bekende beperkingen:
Goedgekeurd door/op:
Gepubliceerd op:
Definitieve platform-URL's:
```

## Voorlopige reeks

De bestaande fasering kan als afleveringsreeks worden gebruikt:

1. **OGN-kern** — Free Placement, Projection en Calculated Placement.
2. **Hond bijt man** — echte taalboom, Language Tree en LEX op Oost.
3. **Vertakking en uiting** — twee verschillende ordeningen.
4. **Transformatie-kerstboom** — transformaties geprojecteerd op de boom.
5. **LEX, SYN en LOG** — de drie projecties afzonderlijk.
6. **Uiting, Anafoor en Flip** — meerdere kernzinnen en gedeelde relaties.
7. **Volledige app en meedoen** — Config, testen, downloads en bijdragen.

De volgorde mag pas veranderen nadat de verwijzingen in
`PUBLICATION_PHASES.md` en `publicatie/phases.json` samen zijn aangepast.

De uitgewerkte volgorde, productiecyclus en slide-voor-slidebeelden staan in
[AFLEVERINGEN_PLANNING.md](AFLEVERINGEN_PLANNING.md).

## Kladversie vanuit Config

Via **Config → LEESMIJ-items** kan tekst en carrousel lokaal worden voorbereid.
Die browserconfig is apparaatgebonden en geldt niet als publicatiebron. Exporteer
of documenteer het voorstel en neem het na goedkeuring op in `index.html` én
`viewer.html`. Pas dan kunnen releasecontroles de aflevering bewaken.

## Relatie met bestaande bestanden

- [MEEDOEN.md](MEEDOEN.md): instaproute voor testers en bijdragers.
- [LEESMIJ.md](LEESMIJ.md): Nederlandstalige projectuitleg.
- [README.md](README.md): Engelstalige projectuitleg.
- [PUBLICATION_PHASES.md](PUBLICATION_PHASES.md): actuele en geplande fasen.
- [PUBLICATIE_README.md](PUBLICATIE_README.md): huidige algemene
  publicatiecarrousel en platformteksten.
- [DEPLOY_GITHUB_PAGES.md](DEPLOY_GITHUB_PAGES.md): gecontroleerd publiceren
  van de site.
