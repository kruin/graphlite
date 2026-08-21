# S1–S2-anaforen uit de literatuur

Dit catalogusdocument hoort bij **Language Tree · extensie 1 · Anafoor**. Het
onderscheidt bronvoorbeelden van Nederlandse testfixtures. Een vertaling of
vereenvoudiging hieronder is dus nooit stilzwijgend een citaat.

## Twee betekenissen van *multiple*

| Klasse | Vorm | Voorbeeldnotatie | Past in `relations[]` v1? |
|---|---|---|---|
| meerdere links | twee of meer anaforen in S2 hebben elk een referent in S1 | `BOER→HIJ`, `EZEL→HEM` | ja, mits één interpretatie is gekozen |
| meervoudig antecedent | één anafoor verwijst naar een samengestelde groep uit S1 | `[MICHAEL,MARIA]→ZIJ` | nee; dit is één hyperrelatie, geen twee identiteitslinks |

De eerste klasse is het directe doel van `ogn-referent-anaphor-v1`. De tweede
klasse bepaalt de uitbreidingsrand voor een latere relationschema-versie.

## A. Meerdere afzonderlijke S1–S2-links

### A1. Gewone discourse-anaphora / DRT

Kort bronvoorbeeld: “A farmer owns a donkey. He beats it.” De twee
onbepaalde naamwoordgroepen introduceren twee discourse-referenten; S2 neemt
beide weer op met een voornaamwoord. De stapsgewijze DRS-constructie maakt
expliciet `he = farmer` en `it = donkey`.

Genormaliseerde Nederlandse fixture:

- S1: **Een boer bezit een ezel.**
- S2: **Hij slaat hem.**
- links: `BOER(S1)→HIJ(S2)` en `EZEL(S1)→HEM(S2)`;
- status: ondubbelzinnig bij normale geslachts- en selectierestricties;
- Language-Tree: rechtstreeks modelleerbaar als twee records in `relations[]`.

Bron: Venhuizen & Brouwer, *Semantic Theory 2022: Discourse Representation
Theory*, dia’s 11–19, gebaseerd op Kamp & Reyle (1993),
<https://www.coli.uni-saarland.de/courses/semantics-22/lectures/ST08-DRT.pdf>.

### A2. Twee ambigue voornaamwoorden en Centering

Kort bronpaar uit de vierzinnenreeks: “Friedman races her on weekends. She
often beats her.” Brennan, Friedman & Pollard gebruiken dit juist als geval
met meerdere ambigue voornaamwoorden. De voorafgaande context en de
Centering-rangschikking bepalen de voorkeurslezing.

Genormaliseerde, referenten-expliciete fixture:

- S1: **Friedman racet tegen Brennan.**
- S2: **Zij verslaat haar vaak.**
- voorkeurslinks in de beschreven lezing: `FRIEDMAN→ZIJ`, `BRENNAN→HAAR`;
- alternatief: de twee vrouwelijke referenten kunnen zonder voorafgaande
  context van rol wisselen;
- Language-Tree: twee `relations[]`-records plus een expliciete
  `interpretationId`; nooit automatisch doen alsof de zin ondubbelzinnig is.

Bron: Brennan, Friedman & Pollard (1987), *A Centering Approach to Pronouns*,
pp. 157–158, <https://aclanthology.org/P87-1022/>.

### A3. Voornaamwoord plus bepaalde nominale anafoor

Kort bronpaar: “John went to his favorite music store to buy a piano. He had
frequented the store for many years.” Hier worden in S2 twee entiteiten uit S1
heropgenomen, maar met twee verschillende uitdrukkingssoorten.

Genormaliseerde Nederlandse fixture:

- S1: **John bezocht zijn favoriete muziekwinkel.**
- S2: **Hij kende de winkel al jaren.**
- links: `JOHN→HIJ`, `MUZIEKWINKEL→DE WINKEL`;
- Language-Tree: twee links; de tweede krijgt een lexicaal profiel van het type
  `definite-np`, niet `personal-pronoun`.

Bron: Grosz, Joshi & Weinstein (1995), *Centering: A Framework for Modeling
the Local Coherence of Discourse*, voorbeeld 1a–b,
<https://aclanthology.org/J95-2003/>.

### A4. Kwantificationele subordinatie

Kort bronpaar: “Every man loves a woman. They kiss them.” De twee anaforen
verwijzen hier niet naar één eerder genoemd individu, maar covariëren met
kwantificationeel geïntroduceerde verzamelingen.

Genormaliseerde fixture:

- S1: **Iedere man houdt van een vrouw.**
- S2: **Zij kussen hen.**
- links: `MEN-SET→ZIJ` en `DEPENDENT-WOMEN-SET→HEN`;
- Language-Tree: bewust **niet** reduceren tot gewone individuele
  coreferentie; hiervoor zijn discourse-domeinen en kwantificationele
  afhankelijkheid nodig.

Bron: Grudzińska & Zawadowski (2014), *System with Generalized Quantifiers on
Dependent Types for Anaphora*, voorbeeld 2,
<https://aclanthology.org/W14-1402/>.

### A5. Waarom twee links als samenstel moeten worden opgelost

Chambers & Smyth rapporteren experimenten waarin meer dan één anaforische link
nodig kan zijn voor lokale coherentie. Dit ondersteunt de ontwerpbeslissing om
alle vereiste `relations[]` gezamenlijk te toetsen, en niet relation 1 eerst vast
te zetten en relation 2 daarna te forceren.

Bron: Chambers & Smyth (1998), *Structural Parallelism and Discourse
Coherence: A Test of Centering Theory*, Journal of Memory and Language 39,
593–608, <https://doi.org/10.1006/jmla.1998.2575>.

## B. Eén anafoor met meerdere antecedenten

### B1. Split antecedent / groepsvorming

Kort bronpaar: “Michael met Maria at the cinema. They had a great time.” De
anafoor verwijst naar de som van twee enkelvoudige discourse-referenten.

Genormaliseerde Nederlandse fixture:

- S1: **Michael ontmoette Maria bij de bioscoop.**
- S2: **Zij hadden het erg leuk.**
- hyperlink: `[MICHAEL,MARIA]→ZIJ` met `composition.operator = "sum"`;
- foutieve notatie: twee losse coreferentielinks `MICHAEL→ZIJ` en
  `MARIA→ZIJ`, want `ZIJ` is niet identiek aan ieder groepslid afzonderlijk.

Bron: Eschenbach et al. (1989), *Remarks on Plural Anaphora*, voorbeeld 1d,
<https://aclanthology.org/E89-1022/>.

### B2. Nominale meervoudige anafoor

Kort bronpaar: “Lisa smiled at Bart. The children were happy.” De tweede
uitdrukking is een meervoudige nominale anafoor in plaats van een persoonlijk
voornaamwoord.

Genormaliseerde Nederlandse fixture:

- S1: **Lisa glimlachte naar Bart.**
- S2: **De kinderen waren blij.**
- hyperlink: `[LISA,BART]→DE KINDEREN`;
- profiel: `definite-plural-np`;
- Language-Tree: dezelfde toekomstige hyperrelatie als B1, met een ander
  LEX-profiel.

Bron: Burga et al. (2016), *Towards Multiple Antecedent Coreference Resolution
in Specialized Discourse*, voorbeelden 7 en 9,
<https://aclanthology.org/L16-1325/>.

## C. Nederlandse kalibratiefixture

Door de opdrachtgever aangeleverd, dus geen literatuurcitaat:

- S1: **Ik zag de man gisteren.**
- S2: **Vandaag was hij er niet meer.**
- Text-link: `MAN(S1)↔MAN(S2)`, met LEX-realisatie `MAN→HIJ`;
- Context-inserties: `GISTEREN(S1)` en `VANDAAG(S2)`, `ER(S2)`,
  `NIET MEER(S2)`; de tijdsinserties verschillen één dag;
- bijzonderheid: de anafoor staat niet vooraan in de lineaire S2-volgorde; het
  oppervlaktesjabloon moet daarom `{ANAPHOR}` op een benoemde positie kunnen
  invullen.

Deze fixture bevat precies één centrale Text-anafoor. `GISTEREN`, `VANDAAG`,
`ER` en `NIET MEER` zijn Context-inserties en staan nooit als knoop in de
centrale boom. Het tijdsverschil behoort tot Context; nadere
Context-uitwerking blijft p.m.

De locatieve lezing `IMPLICIETE-SETTING(S1)→ER(S2)` en de overgang
`AANWEZIG→NIET-MEER-AANWEZIG` zijn plausibel, maar niet volledig uitgesproken
in S1. Zij vallen eveneens onder Context en worden niet als Anafoorlijn getekend.
Expliciete en negatieve testparen staan in `S1_S2_RELATION_TEST_FIXTURES.md`.

Een tweede door de opdrachtgever aangeleverde fixture is **De boer slaat de
ezel omdat hij hem bezit.** S1 bevat centrale Text `BOER–EZEL–SLAAT`; S2
bevat `BOER–EZEL–BEZIT`. De twee Text-links zijn `BOER→HIJ` en `EZEL→HEM`.
`OMDAT` is een Context-insertie op LEX; S2 is een bijzin en behoudt
`BEZIT` aan het einde.

## Config-notatie: nu en later

Meerdere afzonderlijke links gebruiken het bestaande schema:

```json
{
  "relations": [
    {
      "id": "boer-hij",
      "type": "coreference",
      "referent": {"unitId": "S1", "nodeId": "s1-boer"},
      "anaphor": {"unitId": "S2", "nodeId": "s2-boer"},
      "lexicalization": {"axis": "LEX", "profile": "hij"},
      "alignment": {"type": "shared-column", "required": true}
    },
    {
      "id": "ezel-hem",
      "type": "coreference",
      "referent": {"unitId": "S1", "nodeId": "s1-ezel"},
      "anaphor": {"unitId": "S2", "nodeId": "s2-ezel"},
      "lexicalization": {"axis": "LEX", "profile": "hem"},
      "alignment": {"type": "shared-column", "required": true}
    }
  ]
}
```

Voor één anafoor met meerdere antecedenten reserveren we een toekomstige,
niet door v1 geaccepteerde vorm:

```json
{
  "schema": "ogn-referent-anaphor-v2-draft",
  "id": "michael-maria-zij",
  "type": "group-coreference",
  "antecedents": [
    {"unitId": "S1", "nodeId": "s1-michael"},
    {"unitId": "S1", "nodeId": "s1-maria"}
  ],
  "composition": {"operator": "sum", "groupId": "michael+maria"},
  "anaphor": {"unitId": "S2", "nodeId": "s2-zij"}
}
```

`interpretationId` groepeert bij ambiguïteit een complete, intern consistente
set relaties. De flip-/plaatsingssolver kiest geen semantische interpretatie;
hij krijgt één gekozen interpretatieset en zoekt daarna gezamenlijk een
geometrisch geldige oplossing.

## Selectie voor regressietests

1. Nederlandse kalibratiefixture: één Text-link, vier Context-inserties en
   middenpositie van de anafoor.
2. Boer–ezel: twee afzonderlijke Text-links; ook als omdat-bijzin zonder V2.
3. Friedman–Brennan: twee links plus expliciete interpretatiekeuze.
4. John–winkel: gemengde LEX-profielen.
5. Michael–Maria en Lisa–Bart: voorlopig alleen schema-/fouttests voor de
   toekomstige hyperrelatie.
6. Kwantificationele subordinatie: researchfixture, niet als gewone
   `coreference` importeren.

De machineleesbare samenvatting staat in
`samples/anaphor-s1-s2-literature-catalog.json`.
