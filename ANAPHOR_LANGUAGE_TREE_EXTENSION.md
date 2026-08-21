# Language Tree · extensie 1 · Anafoor

Normatief contract voor de eerste extensie van Language Tree. De centrale
uiting heet **Text**: Syntax toont bijvoorbeeld `S–O–V`, Functional
bijvoorbeeld `Agens–Predicaat–Patiens`. Alles daaromheen heet **Context**.
Context is eveneens een eigen, nog te ontwikkelen **geminimaliseerde Open
Graph Notation-boom**, onderscheiden van de centrale Text-OGN; iedere
insertie behoort tot Context. Nadere Context-uitwerking en
Text–Context-koppeling blijven **p.m.** Zie
`TEXT_AND_CONTEXT.md` en `CONTEXT_TAXONOMY.md`.

De definities van anafoor, antecedent, discourse-referent, coreferentie en de
overige S1–S2-relatietypen staan in
`ANAPHOR_AND_S1_S2_RELATION_DEFINITIONS.md`.

## Extensiegrens

Anafoor is geen losstaande, ad hoc getekende plaatsingsmethode. De extensie
neemt twee gewone Language Trees als invoer en voegt daarna drie lagen toe:

1. compositie van S1 en S2 in één vaste weergaveruimte;
2. expliciete referent–anafoorrelaties uitsluitend tussen Text-bronknopen;
3. realisatie van de Text-anafoor en afzonderlijke Context-inserties op LEX.

De recursieve boomberekening zelf blijft die van Language Tree. S1 en S2
behouden elk hun eigen bronboom, gridinvariant en knoopidentiteiten.

## Meegeleverde combinaties

| Laag | S1 | S2 |
|---|---|---|
| bronboom | Ik zie een man. | Man draagt een hoed. |
| LEX-oppervlakte | Ik zie een man. | Hij draagt een hoed. |

In S2 is `MAN` het berekende subject. `HIJ`, `DIE`, `DIE MAN` of `DIE VROUW`
ontstaat alleen door de geselecteerde LEX-lexicalisatie van de relatie.

Naast de basiscombinatie zijn drie aanvullende keuzes meegeleverd; Config
bevat daarmee vier echte S1–S2-combinaties:

| Id | S1 | LEX-oppervlakte S2 | Relaties |
|---|---|---|---|
| `ik-zag-man-gisteren-vandaag-was-hij-er-niet-meer` | Ik zag de man gisteren. | Vandaag was hij er niet meer. | Text: `MAN→HIJ`; Context-inserties: `GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` |
| `boer-bezit-ezel-hij-slaat-hem` | Een boer bezit een ezel. | Hij slaat hem. | `BOER→HIJ`, `EZEL→HEM` |
| `boer-slaat-ezel-omdat-hij-hem-bezit` | De boer slaat de ezel | omdat hij hem bezit. | Text: `BOER→HIJ`, `EZEL→HEM`; Context-insertie: `OMDAT` |

De man–gisteren-combinatie is door de opdrachtgever aangeleverd. De
boer–ezel-combinatie is een Nederlandse normalisatie van een bekende
DRT-fixture. Bronverantwoording en aanvullende fixtures staan in
`ANAPHOR_S1_S2_LITERATURE_CATALOG.md`.

## Selectie en schermruimte

Iedere anafoorcombinatie is een gewone keuze in het menu **Zin**. De keuze-id
heeft intern het voorvoegsel `anaphor-combination:` en activeert de eerste
Language Tree-extensie.

De renderer berekent vóór Play één stabiliteitsframe voor:

- de complete S1-zone;
- de complete S2-zone;
- de gedeelde LEX-as;
- de relatie- en annotatieruimte.

Dit frame geldt vanaf stap 0. Wanneer alleen S1 zichtbaar is, blijft de S2-zone
als gereserveerd kader aanwezig. Auto-fit mag daardoor nooit alleen de
zichtbare S1-bounding-box gebruiken en S1 schermvullend maken.

## Play-contract

De volgorde is:

1. S1-boom knoop voor knoop;
2. horizontale S1-LEX-bronprojectie;
3. eventuele S1-Context-inserties rechtstreeks op LEX;
4. S1-V2-Wissel wanneer S1 een hoofdzin is;
5. S2-boom knoop voor knoop;
6. horizontale S2-LEX-bronprojectie;
7. eventuele S2-Context-inserties rechtstreeks op LEX;
8. S2-V2-Wissel alleen voor een hoofdzin; een omdat-bijzin behoudt V-finaal;
9. alle uitgelijnde Text-bronrelaties referent ↔ anafoor;
10. LEX-realisatie van alle gekoppelde anafoorbronnen.

Terugspelen verwijdert exact dezelfde lagen in omgekeerde volgorde.

## Configuratie van combinaties

`config.anaphorCombinations` is een lijst. Iedere combinatie heeft exact de
canonieke eenheden `S1` en `S2`, ieder met een eigen boom en LEX-lijst.

```json
{
  "schema": "ogn-anaphor-combination-v1",
  "id": "ik-zie-man-hij-draagt-hoed",
  "label": "Anafoor · Ik zie een man → hij draagt een hoed",
  "surfaceTemplate": "{ANAPHOR} draagt een hoed.",
  "interpretationId": "man-hij",
  "sentences": [
    {"id": "S1", "order": 1, "text": "Ik zie een man.", "tree": {}, "lex": [], "lexInsertions": []},
    {"id": "S2", "order": 2, "text": "Man draagt een hoed.", "tree": {}, "lex": [], "lexInsertions": []}
  ],
  "relations": [],
  "layoutResolution": {}
}
```

Combinatie-id’s moeten uniek zijn. Binnen iedere boom moeten alle knoop-id’s
uniek zijn. Een relatie-endpoint moet naar een bestaande knoop in S1 of S2
wijzen.

`anaphorCombinationId` kiest de actieve combinatie.
`anaphorLexicalizations` bewaart per combinatie het actieve lexiconprofiel.

`surfaceTemplate` vereist het primaire invulpunt `{ANAPHOR}`. Een tweede
anafoor gebruikt `{ANAPHOR:ezel-hem}`. Daardoor
kan de oppervlakte-anafoor ook midden in S2 staan, bijvoorbeeld `Vandaag was
{ANAPHOR} er niet meer.`. De bronboom en de lineaire oppervlaktevorm blijven
zo afzonderlijk opgeslagen.

Iedere `lexInsertions[]`-regel heeft `layer: "Context"`, een eigen
`insertionId` op LEX en geen centrale Text-boomknoop. De passieve reservering
`context: {"notation": "Open Graph Notation", "representation":
"minimized-tree", "status": "p.m."}` benoemt uitsluitend de toekomstige
geminimaliseerde Context-OGN; zij bouwt nog geen Context-boom.

`interpretationId` identificeert bij een ambigue combinatie de gekozen,
intern consistente set relaties. De plaatsingssolver kiest geen semantische
lezing.

## Referent–anafoornotatie

De relatie is gericht als afhankelijkheidsbeschrijving—van referent naar
anafoor—maar de zichtbare coreferentielijn is recht en ongericht.

```json
{
  "schema": "ogn-referent-anaphor-v1",
  "id": "man-hij",
  "type": "coreference",
  "status": "intended-reading",
  "dependencyDirection": "referent-to-anaphor",
  "referent": {
    "unitId": "S1",
    "nodeId": "s1-man",
    "lexeme": "man"
  },
  "anaphor": {
    "unitId": "S2",
    "nodeId": "s2-man",
    "sourceLabel": "MAN"
  },
  "lexicalization": {
    "axis": "LEX",
    "profile": "hij"
  },
  "alignment": {
    "type": "shared-column",
    "required": true
  },
  "line": {
    "shape": "straight",
    "direction": "none"
  }
}
```

`referent` is de discoursebron in de eerdere zin. `anaphor` is de bronknoop
die in S2 structureel aanwezig blijft. `lexicalization` bepaalt uitsluitend de
LEX-oppervlaktevorm.

## Context-insertienotatie

`GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` en `OMDAT` zijn geen Text-knopen.
Hun directe LEX-realisatie wordt per zin afzonderlijk vastgelegd:

```json
{
  "schema": "ogn-lexical-insertion-v1",
  "id": "lex-s2-omdat",
  "layer": "Context",
  "axis": "LEX",
  "origin": "LEX",
  "category": "COMP",
  "label": "OMDAT",
  "placement": {"position": "before", "anchorNodeId": "bc-s2-boer"}
}
```

De gedeelde LEX-lijst verwijst naar `{"insertionId":"lex-s2-omdat"}`.
Zo'n insertie heeft geen `nodeId`, geen centrale boomknoop en geen
coreferentie. Het tijdsverschil tussen gisteren en vandaag of de causaliteit
bij omdat hoort bij Context; nadere uitwerking blijft p.m.

## Meerdere relaties

Een combinatie gebruikt altijd `relations[]`, ook wanneer er maar één relatie
is. Dit voorkomt een schemawissel zodra een tweede relatie wordt toegevoegd.

De configuratie-engine bewaart en valideert meerdere **Text-coreferenties**:

- iedere relatie-id is uniek binnen de combinatie;
- beide endpoints bestaan;
- de twee endpoints zijn niet dezelfde bronknoop;
- iedere relatie heeft `type = "coreference"` en een eigen
  `lexicalization`;
- iedere relatie bewaart eigen alignmentmetadata.

De renderer tekent iedere reeds uitgelijnde, gedeclareerde Text-coreferentie.
De compositor controleert alle gedeclareerde uitlijningen. OPN-export schrijft
alle coreferenties en markeert per relatie `rendered_in_this_version`.

Tijd, plaats, toestand, causaliteit en discourse vallen onder Context en
worden niet in `relations[]` gezet. Nadere Context-uitwerking blijft
p.m. De positieve en negatieve S1–S2-paren staan in
`S1_S2_RELATION_TEST_FIXTURES.md`.

De literatuur maakt bovendien onderscheid tussen meerdere gewone links en
één meervoudige anafoor met verscheidene antecedenten. `[MICHAEL,MARIA]→ZIJ`
is één hyperrelatie en mag niet als twee onafhankelijke identiteitslijnen
worden vervalst. Die vorm is als `ogn-referent-anaphor-v2-draft`
gedocumenteerd, maar wordt bewust nog niet door v1 geaccepteerd.

## Flip en gezamenlijke constraintoplossing

De anafoorextensie definieert geen eigen, sequentiële flipprocedure. Zij
verwijst naar het generieke contract in `FLIP_CONSTRAINT_SOLVER.md`.

De voorbereide `layoutResolution` gebruikt:

- één gezamenlijke zoekruimte voor toegestane branch-flips in S1 en S2;
- de starre S2-verschuiving als aanvullende variabele;
- alle vereiste `relations[*].alignment`-waarden als harde constraints;
- minimalisatie van flipcount en daarna verschuiving als doelen.

De perfectumalternatieven `aux-vdw` en `vdw-aux` vormen de eerste kleine
fixture van de generieke flip, niet een anafoorspecifieke voorstap.

In de huidige versie is joint search uitgesteld. Actief zijn de bestaande
layouts, één starre S2-verschuiving en alle reeds uitgelijnde Text-relaties.
Config en OPN bewaren dit onder `layoutResolution.currentSupport`.

## LEX-profielen

De lexiconconstructie `anaphor-subject` levert onder meer:

| Profiel | Oppervlakte | Toepasselijkheid |
|---|---|---|
| `hij` | HIJ | man, boer |
| `die` | DIE | man, vrouw, boer |
| `die-man` | DIE MAN | man |
| `die-vrouw` | DIE VROUW | vrouw |
| `hem` | HEM | ezel, man, boer; alleen object |

Een niet-toepasselijk profiel blijft zichtbaar in Config maar is
uitgeschakeld. De bronboom wordt nooit stilzwijgend aangepast aan een gekozen
oppervlaktevorm.

## OPN-opslag

Nieuwe multi-OGN-export bewaart aanvullend:

- `composition.extension` met `extends = "language-tree"` en `order = 1`;
- `composition.relations[]` met uitsluitend centrale Text-coreferentie;
- `units[].lex_insertions` met Context-inserties buiten `graph.nodes[]`;
- `shared_lex_axis.items[].source_layer` met `Text` of `Context`;
- de legacy-compatibele `composition.relation` voor de primair gerenderde
  relatie;
- `composition.layout_resolution` met de joint-solvernotatie en actuele
  supportgrens;
- bron- en oppervlaktezinnen afzonderlijk;
- de twee berekende graphs en de starre shifts;
- de volledige Play-tijdlijn.

## Implementatiegrens

Werkend:

- combinatie als Zin-keuze;
- meerdere combinaties in Config;
- `relations[]`-validatie en -opslag;
- binaire Text-coreferentie; tijd en causaliteit blijven Context p.m.;
- alle inserties als Context op LEX, zonder centrale boomknoop;
- vaste S1+S2-viewport tijdens Play;
- S1, daarna S2, daarna alle uitgelijnde Text-relaties en LEX-anaforen;
- V2 in hoofdzinnen en V-finaal zonder V2 in de omdat-bijzin;
- per-combinatiekeuze van LEX-profiel;
- een oppervlakte-template met `{ANAPHOR}` en `{ANAPHOR:relatie-id}`;
- OPN-export van alle geconfigureerde relaties en solvernotatie.

Voorbereid, nog niet werkend:

- gelijktijdige geometrische oplossing via nog uitgestelde branch-flips;
- joint branch-flip search over S1 en S2;
- catafoor, ketens van meer dan twee zinnen en n-aire branchpermutaties.
- groepscoreferentie met één anafoor en meerdere antecedenten;
- kwantificationele subordinatie en automatische interpretatiekeuze.
- nadere Context-modellering: p.m.
