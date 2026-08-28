# Graphlite gefaseerd publiceren

## Platformstart via canonieke item-URI

Iedere publicatielink gebruikt de vaste parameter `item`. De platformkeuzes
staan machineleesbaar in `config/publication-start-items.json`.

- **LinkedIn** opent voorlopig direct
  `?item=jan-beloonde-jek-omdat-die-het-bot-terugbracht&anafoor=die&werkwoord=terugbracht&bot=het-bot`.
  Dit sluit aan op de drie reeds geplaatste bijdragen over man en hond.
- **Reddit** heeft nog geen vast campagne-startitem. Dat wordt pas gekozen bij
  de eerste uitnodigende Reddit-batch.
- De kale ingang zonder parameters opent vast `hond-bijt-man`.
- Publicatie werkt niet via Config. Kies een expliciete URI uit
  `publicatie-links.html`.
- Een keuze door een bezoeker wordt nooit teruggeschreven naar GitHub.

Canonieke LinkedIn-link:

`https://kruin.github.io/graphlite/?item=jan-beloonde-jek-omdat-die-het-bot-terugbracht&anafoor=die&werkwoord=terugbracht&bot=het-bot&utm_source=linkedin`

## Gescheiden itemfamilies

**Uitleg · Notatie**, **Language Tree**, **Greedy Grow** en **Random** blijven
afzonderlijke families. Zo worden uitlegdiagrammen geen taaldata en ook geen
directe plaatsingsresultaten. Een publicatiebatch mag wel een route samenstellen,
bijvoorbeeld OGN Minimal Tree → Simple Tree → één Language Tree. Greedy Grow en
Random krijgen hun eigen publicatielijnen.

De publieke ingang is bewust kleiner dan de volledige viewer. De ontwikkel- en volledige app blijft `index.html`; fase 1 staat op `public-phase-1.html`.

## Actuele fase

**Fase 1 — Hond bijt man**

- één zin;
- korte Simple-uitleg;
- afspeelbare opbouw;
- één inhoudelijke vraag;
- doorklik naar de volledige interactieve graph.

Links om rechtstreeks te kopiëren:

- LinkedIn: `https://kruin.github.io/graphlite/public-phase-1.html?utm_source=linkedin&utm_campaign=hond_bijt_man`
- Reddit: `https://kruin.github.io/graphlite/public-phase-1.html?utm_source=reddit&utm_campaign=hond_bijt_man`
- Direct: `https://kruin.github.io/graphlite/public-phase-1.html`

De bronparameter wordt zonder persoonsnaam doorgegeven aan de interactieve viewer. De pagina maakt een willekeurig sessie-ID in de browser, maar verzendt zonder gekoppelde statistiekdienst niets naar een server. Namen van bezoekers zijn alleen mogelijk wanneer bezoekers die zelf via een formulier of reactie verstrekken.

## Vervolgfasen

1. Hond bijt man + Simple README.
2. Probleembomen.
3. LEX, SYN en LOG afzonderlijk.
4. Vrije knopen en OGN.
5. Uiting, Anafoor en Flip.
6. Volledige editor, documentatie en downloads.

Een nieuwe fase vervangt een eerdere fase niet. Iedere ingang blijft bereikbaar en krijgt bij publicatie een eigen Git-tag `public-phase-N-<slug>`.

## Meetcontract

De publieke pagina genereert de gebeurtenissen `view-phase-1`, `play-phase-1` en `open-interactive-graph` als `opengraph:publication-event`. Een latere privacyvriendelijke statistiekdienst kan daarop aansluiten zonder de pagina opnieuw te ontwerpen. Tot die koppeling geven GitHub Insights alleen de beperkte GitHub-verkeersgegevens over de meest recente veertien dagen.
