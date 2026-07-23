# Actuele contractlaag · v2.0.0-rc.21

De leidende actuele indeling is: `Syntax → FT` in het View-menu en `LEX / SYNT / LOG` als named projections. FT is de tweede centrale view; LOG is uitsluitend de zuidas. Onderstaande tekst bevat historische ontwikkelnotities en is niet normatief waar zij hiermee botst.

---

# OpenGraph Lite Viewer — app-context v4430

## v4430 · bronpositie blijft zichtbaar op de LEX-as

OpenGraph/JAN behandelt de LEX-as als projectieruimte met lokale plaatsingsregels. De boom levert bronposities; de LEX-as voert Wissels uit met vrije slots. Daarom blijven projecties horizontaal en verschuift een bronitem niet door de projectie zelf.


---

# OpenGraph Lite Viewer — app-context v4430

## v4430 · V2-theorie in de demo

De viewer noteert Nederlandse V2 niet als wijziging van de centrale boom, maar als lokale LEX-plaatsing. De LEX-as heeft vrije slots en **Wissel**-regels. Daardoor blijft de OPN-bron stabiel terwijl verschillende lineaire uitingen zichtbaar worden.

---

## Doel

OpenGraph Lite Viewer is een lokale demo van JAN / Open Notation voor taalbomen.
De viewer toont hoe een taalstructuur eerst als OPN-bron wordt opgebouwd en daarna naar LEX wordt geprojecteerd.

Hoofdzin van de app:

```text
Redesign: eerst syntax-tree, daarna LEX-projectie, daarna lokale LEX-regel.
```

## Kernlagen

| laag | functie |
|---|---|
| OPN-syntax | abstracte syntaxboom, geen lexicale woorden in de structure-config |
| OPN-functioneel | functionele structuur met PRED apart en ARG-STRUCT apart |
| LEX | horizontale projectie naar lexicale as / lokale uitingregel |
| lexicon | voorraad woorden, thematische rollen en eenvoudige selectieframes |
| lexicon-editor | beheer en uitbreiding van `lexicon-config.html` |
| examples-input | concrete voorbeeldzinnen met subject/object-markering |

## Hoofdprincipe

De centrale OPN-structuur blijft invariant. Lokale variatie zoals bijzin, perfectum of latere topicalisatie wordt voorbereid via slots en LEX-regels, niet door de bronboom inhoudelijk te herschrijven.

## Projectieprincipe

Projecties zijn horizontaal: bronknoop naar LEX-as op dezelfde hoogte. Dit geldt als basisprincipe voor LEX en latere andere projecties.

## Layoutprincipe

De layout is bottom-up en vrij: child-subtrees worden eerst als box berekend en daarna op vrije HOR/VER-posities geplaatst.

v4402 voegde per-vertakking flipconfig toe met twee doelen:

```text
1. compactste boom zoeken
2. verticale rolcorridors alignen, bv. subject/AGENS en object/PATIENS
```

De docs-map blijft vanaf v4401 de canonieke projectcontext en moet bij iedere nieuwe ZIP worden onderhouden.


## Groei-presentatie vanaf v4430

De viewer kan de vooraf berekende centrale boom stapsgewijs tonen. Dit is een presentatielaag, geen nieuwe layoutmethode:

```text
layout volledig berekenen → growthStep per element → gedeeltelijk renderen
```

Daarmee kan JAN/Open Notation didactisch worden getoond als een groeiende vrije boom, zonder dat knopen tijdens het afspelen verspringen.


## Lexicon-editor vanaf v4430

`lexicon-editor.html` is de beheerlaag voor lexemen. De editor leest de structurele sources en slots uit `structure-config.html`, zodat lexemen niet losraken van de actuele omgeving.

## Lexicon- en uitingeneditor vanaf v4430

`lexicon-editor.html` is nu de centrale beheerlaag voor lexemen én korte voorbeelduitingen. Daarmee ontstaat één lokale workflow voor de lexicale voorraad en de concrete testzinnen.


## v4535 — eenvoudige documentatie LEX-plaatsingsregels

Toegevoegd: `docs/LEX_MOVEMENT_RULES.md`.

Kernregel:

```text
basisprojectie blijft staan
vrije slots worden gevuld
oude plek wordt trace
resultaat = voorbeeldzin
```

Beschreven zinstypen: hoofdzin, bijzin met OMDAT, topicalisatie, perfectum en voorlopige vraagzin.


## v4535 update

- `commit_and_push.bat` wordt vanaf deze versie standaard meegeleverd in de ZIP-root.
- LOG toont thematische rollen expliciet: `AGENS` voor subject/handelende deelnemer en `PATIENS` voor object/ondergaande deelnemer.
- De syntaxrollen blijven `subject` en `object`; de functionele projectie benoemt dezelfde lexicale bronnen thematisch.





### NOORD-as (PM)

Naast west/LEX, oost/SYNTAX en zuid/LOGICAL is ook een NOORD-as mogelijk. Die is genoteerd als uitbreiding, maar nog niet gebruikt.


Aanvulling v4504: LEX vrije slots zijn plaatsbare insertiepunten op de LEX-as voor later materiaal uit andere LEX-assen/bomen en anafora. Boom vrije rijen blijven apart.
