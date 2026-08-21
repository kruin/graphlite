# Text en Context · normatieve projectindeling

## 1. Text

**Text** is uitsluitend de centrale uiting: de berekende Language Tree en de
structurele deelnemers en predicaten die daarin als bronknopen aanwezig zijn.

- In **Syntax** verschijnt Text bijvoorbeeld als `S–O–V`.
- In **Functional** verschijnt dezelfde Text bijvoorbeeld als
  `Agens–Predicaat–Patiens`.
- De views verschillen van notatie en ordening, maar beschrijven dezelfde
  centrale uiting.
- Een Text-bronknoop behoudt zijn identiteit en bronhoogte.

De term **Text** benoemt deze architectuurlaag; hij is niet automatisch gelijk
aan het JSON-veld `sentence.text`, waarin een leesbare uiting kan staan.

## 2. Context

**Context** is alles rondom Text. **Context is zelf eveneens Open Graph
Notation:** Text en Context zijn onderscheiden OGN-structuren, elk met hun
eigen knopen en eigen gridinvariant. Context is bedoeld als een
**geminimaliseerde boom**: toekomstige opbouw behoudt uitsluitend relevante
takken uit de aangeleverde Context-referentieboom.
**Iedere insertie behoort tot Context**, ook als haar oppervlaktevorm op LEX
verschijnt.

Dat geldt voor alle bestaande insertie-oorsprongen: `origin=LOG`,
`origin=LOG+LEX` en `origin=LEX`. De oorsprong bepaalt uitsluitend het
plaatsings- of projectiemechanisme; zij verandert Context nooit in Text.
Een LOG-minor blijft dus Context, ook wanneer LOG een slot voor die insertie
reserveert.

Voorbeelden zijn tijd, plaats, toestand, causaliteit en de bijbehorende
lexicale inserties `GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` en `OMDAT`.

Een Context-insertie:

- is geen centrale Text-knoop;
- krijgt geen `nodeId` in de centrale Text-boom;
- verandert de recursieve Language Tree niet;
- heeft een eigen `insertionId`;
- draagt `layer: "Context"`;
- wordt op LEX ingevoegd rond een bestaand Text-anker.

De aangeleverde Context-OGN onderscheidt `STATISCH` en `DYNAMISCH`, met
vertakkingen voor onder meer tijd, plaats, richting, wijze en motief. Iedere
knoop heeft, net als in iedere andere OGN, een eigen horizontale en verticale
rasterlijn. De volledige referentiestructuur staat in
`CONTEXT_TAXONOMY.md`.

Nadere modellering en plaatsing van de zelfstandige Context-OGN blijven
**p.m.**. Er wordt nog geen Text–Context-relatieschema, Context-engine of
geometrische koppeling tussen beide OGN's verondersteld.

## 3. Anafoor

In **Language Tree · extensie 1 · Anafoor** is een anafoor een geselecteerde
LEX-realisatie van een centrale S2-Text-bronknoop die coreferentieel is met
een centrale S1-Text-bronknoop.

`relations[]` bevat daarom uitsluitend Text–Text-coreferentie:

```json
{
  "type": "coreference",
  "referent": {"unitId": "S1", "nodeId": "bc-s1-boer"},
  "anaphor": {"unitId": "S2", "nodeId": "bc-s2-boer"},
  "lexicalization": {"axis": "LEX", "profile": "hij"}
}
```

De bronknoop blijft `BOER`; alleen LEX realiseert `HIJ`. `HIJ` is dus geen
afzonderlijke Context-insertie maar de oppervlaktevorm van een bestaande
Text-bron.

| Oppervlakte-element | Bron | Laag | Verwerking |
| --- | --- | --- | --- |
| `BOER`, `EZEL`, `SLAAT`, `BEZIT` | centrale boomknoop | Text | horizontale bronprojectie; V2 alleen bij expliciete hoofdzinregel |
| `HIJ` | centrale S2-bronknoop `BOER` | Text | anaforische LEX-realisatie |
| `HEM` | centrale S2-bronknoop `EZEL` | Text | anaforische LEX-realisatie |
| `GISTEREN`, `VANDAAG` | zelfstandige tijdinsertie | Context | directe LEX-insertie |
| `ER`, `NIET MEER` | zelfstandige plaats-/toestandsinsertie | Context | directe LEX-insertie |
| `OMDAT` | zelfstandige COMP-insertie | Context | directe LEX-insertie vóór S2 |

## 4. Analyse: gisteren en vandaag

S1: **Ik zag de man gisteren.**

S2: **Vandaag was hij er niet meer.**

- Text-coreferentie: `MAN(S1) ↔ MAN(S2)`.
- Anaforische LEX-realisatie: `MAN(S2) → HIJ`.
- Context-inserties: `GISTEREN(S1)` en `VANDAAG(S2)`, `ER(S2)`,
  `NIET MEER(S2)`.
- Hun contrast van één dag behoort tot Context en staat niet in
  `relations[]`.
- Uitwerking van plaats, toestand en overige Context: p.m.

```json
{
  "id": "lex-s2-vandaag",
  "schema": "ogn-lexical-insertion-v1",
  "layer": "Context",
  "axis": "LEX",
  "origin": "LEX",
  "label": "VANDAAG",
  "placement": {"position": "before", "anchorNodeId": "tm-s2-man", "fronted": true}
}
```

## 5. Analyse: de boer slaat de ezel omdat hij hem bezit

Eén samengestelde uiting bevat twee centrale zinseenheden:

| | S1 · hoofdzin | S2 · omdat-bijzin |
| --- | --- | --- |
| Text-subject | `BOER` | `BOER` |
| Text-object | `EZEL` | `EZEL` |
| Text-predicaat | `SLAAT` | `BEZIT` |
| Persoonsvorm | V2: `BOER SLAAT EZEL` | finaal: `BOER EZEL BEZIT` |
| Context-insertie | geen | `OMDAT`, rechtstreeks op LEX |
| LEX-oppervlakte | `de boer slaat de ezel` | `omdat hij hem bezit` |

De twee onafhankelijke Text-anaforen zijn:

1. `BOER(S1) ↔ BOER(S2)`; LEX: `BOER(S2) → HIJ`.
2. `EZEL(S1) ↔ EZEL(S2)`; LEX: `EZEL(S2) → HEM`.

`OMDAT` en de causale interpretatie behoren tot Context. `OMDAT` is geen
boomknoop en `BEZIT` ondergaat in de bijzin geen V2-Wissel.

## 6. Analyse: de man slaat de hond omdat die hem heeft gebeten

Ook deze samengestelde uiting bestaat uit twee centrale Text-eenheden:

| | S1 · hoofdzin | S2 · omdat-bijzin |
| --- | --- | --- |
| Text-subject | `MAN` | `HOND` |
| Text-object | `HOND` | `MAN` |
| Text-predicaat | `SLAAT` | `V-CLUSTER(HEEFT, GEBETEN)` |
| Context-insertie | geen | `OMDAT`, rechtstreeks op LEX |
| LEX-oppervlakte | `de man slaat de hond` | `omdat die hem heeft gebeten` |

De twee onafhankelijke Text-anaforen zijn:

1. `HOND(S1) ↔ HOND(S2)`; LEX: `HOND(S2) → DIE`.
2. `MAN(S1) ↔ MAN(S2)`; LEX: `MAN(S2) → HEM`.

De bronknopen blijven dus HOND en MAN. `DIE` en `HEM` zijn geen
Context-inserties maar anaforische LEX-realisaties van die Text-bronnen.
`OMDAT` en causaliteit behoren wel tot Context.

Voor de gezamenlijke geometrie zijn drie binaire Text-branches als
flipkandidaat gedeclareerd. Iedere branch kent `normal`, `left-right`,
`short-long` en `both`. Links–rechts wisselt de zijde; kort–lang wisselt de
plaatsingsafstand. Alleen het expliciet lineariserende V-cluster projecteert
kort–lang ook als `HEEFT GEBETEN ↔ GEBETEN HEEFT` op LEX. De solver kiest
alle branches en de starre S2-shift tegelijk, zodat beide coreferenties
gelijktijdig uitlijnen.

## 7. Play en opslag

Play bouwt steeds eerst de volledige S1-Text en daarna de volledige S2-Text.
Na de knoopopbouw kan per zin één atomaire flipstap volgen.
Per zin volgen de horizontale Text-projectie naar LEX, eventuele
Context-inserties en uitsluitend waar toegestaan een V2-Wissel. Daarna
verschijnen alle uitgelijnde Text-coreferenties en hun LEX-realisaties.

In config en OPN blijven de objecttypen expliciet gescheiden:

- centrale Text: `tree`, `graph`, `nodeId`, `source_layer: "Text"`;
- Context-insertie: `lexInsertions`, `insertionId`,
  `source_layer: "Context"`;
- Anafoor: `relations[]`, uitsluitend `type: "coreference"`;
- toekomstige Context-uitwerking:
  `context: {"notation": "Open Graph Notation", "representation":
  "minimized-tree", "status": "p.m."}`.
