# Graphlite gefaseerd publiceren

## Hoofdregel

Iedere aflevering bestaat uit één ingebouwd LEESMIJ-item met zijn eigen
carrousel. Dat is één inhoudseenheid en de enige redactionele bron. Vierkante
platformbeelden, platformtekst en campagne-URL's zijn afgeleiden. Corrigeer
daarom altijd eerst de LEESMIJ. Zie `AFLEVERINGEN_PUBLICEREN.md`.

## Actuele aflevering

**Aflevering 1 — OGN-kern**

- OGN Free Placement;
- OGN Projection;
- OGN Calculated Placement;
- zeven beelden, in exact dezelfde volgorde als in de LEESMIJ;
- geen LEX, woorden, taalboom of transformatieanalyse.

Links:

- LinkedIn: `https://kruin.github.io/graphlite/public-phase-1.html?utm_source=linkedin&utm_campaign=ogn_kern`
- Reddit: `https://kruin.github.io/graphlite/public-phase-1.html?utm_source=reddit&utm_campaign=ogn_kern`
- Direct: `https://kruin.github.io/graphlite/public-phase-1.html`

## Reeks

1. **OGN-kern** — vrije plaatsing, projectie en berekende plaatsing.
2. **Hond bijt man** — een echte taalboom, Language Tree en LEX op Oost.
3. **Vertakking en uiting** — volgorde van vertakking versus volgorde van de uiting.
4. **Transformatie-kerstboom** — transformaties grafisch geprojecteerd op de boom.
5. **LEX, SYN en LOG** — drie named projections afzonderlijk.
6. **Uiting, Anafoor en Flip** — meerdere kernzinnen en gedeelde relaties.
7. **Volledige app en meedoen** — Config, testmateriaal, lokaal testen en bijdragen.

Een nieuwe aflevering vervangt een eerdere niet. Iedere externe afbeelding
krijgt zichtbaar auteur, titel, jaar, oorspronkelijke bestandspagina, licentie
en bewerkingsstatus; het volledige register staat in `CARROUSEL_BRONNEN.md`.

## Meetcontract

De actuele pagina genereert `view-phase-1`, `play-phase-1` en
`open-interactive-graph` als lokale `opengraph:publication-event`-gebeurtenis.
Zonder gekoppelde statistiekdienst wordt niets naar een server verzonden.
