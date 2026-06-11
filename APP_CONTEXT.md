# OpenGraph Lite Viewer — app-context v4408

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
| lexicon | voorraad woorden waarmee voorbeelden worden gevuld |
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


## Groei-presentatie vanaf v4408

De viewer kan de vooraf berekende centrale boom stapsgewijs tonen. Dit is een presentatielaag, geen nieuwe layoutmethode:

```text
layout volledig berekenen → growthStep per element → gedeeltelijk renderen
```

Daarmee kan JAN/Open Notation didactisch worden getoond als een groeiende vrije boom, zonder dat knopen tijdens het afspelen verspringen.
