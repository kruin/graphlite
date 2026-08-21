# Anafoor en overige S1–S2-relaties · normatieve definities

Dit document bepaalt het begrippengebruik voor **Language Tree · extensie 1 ·
Anafoor**. De normatieve architectuurscheiding is **Text versus Context**;
zie ook `TEXT_AND_CONTEXT.md`.

**Text** is uitsluitend de centrale uiting: Syntax toont bijvoorbeeld
`S–O–V`; Functional toont dezelfde uiting als bijvoorbeeld
`Agens–Predicaat–Patiens`. **Context** is alles rondom Text. Iedere insertie
behoort tot Context; zij is nooit een centrale Text-knoop.

De taalkundige verzamelterm *discourse-anafoor* kan ruimer zijn, maar de
projectextensie **Anafoor** is bewust smaller: alleen coreferentie tussen
centrale Text-bronknopen van S1 en S2. Tijd, plaats, toestand en causaliteit
vallen onder Context; nadere Context-uitwerking blijft **p.m.**

## 1. Anafoor

Een **anafoor** is in deze projectextensie een LEX-oppervlaktevorm van een
centrale S2-Text-bronknoop waarvan de interpretatie coreferentieel wordt
gekoppeld aan een centrale S1-Text-bronknoop.

Compact:

```text
S1:Text-bron ↔ S2:Text-bron → LEX-anafoor
```

Bij **Ik zag de man. Hij droeg een hoed.** is *hij* de anafoor. De uitdrukking
*de man* is het antecedent dat een discourse-referent beschikbaar maakt.
Onder de gekozen lezing verwijzen beide uitdrukkingen naar dezelfde persoon.

In de algemene taalkunde kan een anaforische uitdrukking daarnaast ruimer
worden opgevat. Zulke gevallen vallen niet automatisch binnen deze extensie:

- is niet noodzakelijk een persoonlijk voornaamwoord; ook *die man*, *de
  winkel*, *daar*, een temporele uitdrukking of een weggelaten element kan
  anaforisch worden geïnterpreteerd;
- hoeft niet altijd coreferentieel te zijn; bridging, temporele en locatieve
  afhankelijkheid kunnen een andere relatie dan identiteit uitdrukken;
- kan ambigu zijn wanneer meerdere toegankelijke antecedenten passen;
- kan onopgelost blijven wanneer de benodigde bron alleen in de buitentalige
  context aanwezig is.

## 2. Antecedent, discourse-referent en anafoorbron

Deze drie termen mogen niet worden verwisseld.

| Term | Definitie | In `Ik zag de man. Hij…` |
|---|---|---|
| antecedent | eerdere talige uitdrukking die een mogelijke bron voor resolutie vormt | *de man* / knoop `S1:MAN` |
| discourse-referent | abstracte entiteit in het discoursemodel waarnaar uitdrukkingen kunnen verwijzen | de bedoelde persoon, bijvoorbeeld `x` |
| anafoor | contextafhankelijke oppervlakte-uitdrukking | *hij* |
| anafoorbron | structurele S2-knoop die vóór LEX-realisatie blijft staan | `S2:MAN` |

In de Language-Tree-implementatie wordt dus niet de knoop `MAN` fysiek in
`HIJ` veranderd:

```text
S1:MAN introduceert x
S2:MAN wordt aan x gekoppeld
LEX(S2:MAN, profiel=hij) = HIJ
```

Het configveld `relation.referent` wijst historisch naar de antecedentknoop.
Terminologisch preciezer is die knoop de **introducer van de
discourse-referent**; de discourse-referent zelf is geen zichtbare boomknoop.

## 3. Anaforische afhankelijkheid en coreferentie

Een **anaforische afhankelijkheid** is gericht: de interpretatie van de
latere uitdrukking wordt opgelost met behulp van de eerdere bron.

```text
antecedent/introduction  →  anafoor/resolution
```

**Coreferentie** is de gekozen identiteitsrelatie tussen de twee opgeloste
verwijzingen:

```text
resolve(S1:MAN) = x
resolve(S2:HIJ) = x
```

Daarom bewaart het schema een gerichte
`dependencyDirection = "referent-to-anaphor"`, terwijl de zichtbare
coreferentielijn ongericht mag zijn: afhankelijkheid is asymmetrisch;
identiteit van referentie is symmetrisch.

Coreferentie is een **interpretatie**, niet louter een gevolg van twee knopen
op dezelfde kolom. Alleen een record in `relations[]` verklaart een relatie.
Toevallig gelijke x-coördinaten hebben geen semantische betekenis.

## 4. Temporele referentie · Context p.m.

Een **temporele referentierelatie** verbindt tijdsuitdrukkingen of
eventtijden. Zij beweert geen identiteit van personen en is dus geen
coreferentielijn.

In de opdrachtgeversfixture:

```text
S1: GISTEREN  = utterance-day − 1 dag
S2: VANDAAG   = utterance-day
VANDAAG       = GISTEREN + 1 dag
```

De twee woorden zijn zelfstandige **Context-inserties**; zij hebben geen
centrale boomknoop. Bijvoorbeeld:

```json
{
  "id": "lex-s2-vandaag",
  "schema": "ogn-lexical-insertion-v1",
  "layer": "Context",
  "axis": "LEX",
  "label": "VANDAAG"
}
```

De observatie “één dag later” behoort tot Context. Zij wordt niet opgenomen in
Anafoor-`relations[]`, veroorzaakt geen flip of gedeelde kolom en krijgt
voorlopig geen zelfstandig Context-relatieschema.

## 5. Locatieve referentie · Context p.m.

Een **locatieve anafoor** verwijst naar een eerder geïntroduceerde of
contextueel gegeven plaats. In het expliciete paar

> Gisteren zag ik de man **in het park**. Vandaag was hij **daar** niet meer.

kan onder de bedoelde lezing `PARK(S1)→DAAR(S2)` worden vastgelegd.

In het oorspronkelijke paar

> Ik zag de man gisteren. Vandaag was hij **er** niet meer.

ontbreekt een uitgesproken plaatsantecedent. *Er* kan locatief worden gelezen
als “op de relevante plaats”, maar de plaats moet uit de situatie of bredere
context worden aangevuld. De norm is daarom: **Context, p.m.; geen verzonnen
Text-bronknoop en geen Anafoorrelatie voor `ER`.**

Een renderer mag een impliciete setting nooit alleen op basis van het woord
*er* promoveren tot een harde S1–S2-lijn. Bovendien moet eerst worden bepaald
of *er* werkelijk locatief is en niet een andere grammaticale functie heeft.

## 6. Toestandsverandering en *niet meer* · Context p.m.

Een **toestandsverandering** relateert twee toestanden of eventualiteiten, niet
twee identieke referenten. De constructie *niet meer p* presenteert `p` als
eerder geldend en ontkent `p` voor de relevante latere tijd.

```text
eerder:  PRESENT(x, locatie)
later:  ¬PRESENT(x, locatie)
cue:    NIET MEER
```

In **Gisteren was de man in het park. Vandaag was hij daar niet meer.** zijn
persoon, plaats en eerdere aanwezigheid overt verankerd. In **Ik zag de man
gisteren** moet aanwezigheid op een relevante plaats eerst pragmatisch uit
*zien* worden afgeleid. De tweede analyse krijgt daarom
`status = "pragmatically-inferred"` en geen identiteitslijn.

## 7. Discourse-relatie en causaliteit · Context p.m.

Een **discourse-relatie** verbindt proposities, gebeurtenissen of zinnen als
geheel. Voorbeelden zijn temporele voortgang, contrast, oorzaak en
elaboratie. Zij heeft dus doorgaans geen twee lexicale knopen als endpoints.

Voor het basispaar is een analyse als `temporal-progression` of
`change/contrast` aannemelijk door *gisteren*, *vandaag* en *niet meer*. Die
analyse blijft onderscheiden van de exacte tijdsoffset:

```text
temporele referentie:  time(S2) = time(S1) + 1 day
discourse-relatie:     relation(event/state S1, event/state S2)
```

Beide observaties behoren tot Context; zij worden niet als Anafoorrelaties
ingevoerd. Nadere Context-modellering blijft p.m.

## 8. Bridging, deixis, exofora en catafora

| Begrip | Definitie | Modellering |
|---|---|---|
| bridging / associatieve anafoor | de latere uitdrukking is via kennis of een deel-geheelrelatie verbonden, maar niet identiek aan het antecedent; bijvoorbeeld *een huis … de voordeur* | geen `coreference`; eigen relationele inferentie |
| deixis | interpretatie via spreker, plaats of spreektijd | contextanker, bijvoorbeeld `utterance-day` |
| exofora | verwijzing naar iets in de buitentalige context zonder talig antecedent | contextbron of `unresolved`; geen verzonnen S1-knoop |
| catafora | de afhankelijke uitdrukking gaat vooraf aan de uitdrukking die haar interpreteert | richting later-in-discourse; buiten extensie v1 |

`GISTEREN` en `VANDAAG` zijn deiktisch omdat zij aan de spreektijd zijn
verankerd én onderling temporeel gerelateerd. De categorieën sluiten elkaar
dus niet noodzakelijk uit.

## 9. Meerdere links, ambiguïteit en groepsanaforen

**Meerdere links** betekent dat één S1–S2-paar meer dan één afzonderlijke
relatie bevat, bijvoorbeeld `BOER→HIJ` en `EZEL→HEM`. Eén gekozen lezing kan
die als twee records in `relations[]` bewaren.

**Ambiguïteit** betekent dat verschillende complete toewijzingen mogelijk
zijn. Eerst kiest `interpretationId` één consistente relatieset; pas daarna
mag de flip-/plaatsingssolver geometrie zoeken. Geometrie beslist nooit welke
persoon met welk voornaamwoord bedoeld is.

Een **groepsanafoor met gesplitst antecedent**, bijvoorbeeld
`[MICHAEL,MARIA]→ZIJ`, is één n-aire relatie naar een samengestelde groep. Twee
losse identiteitslijnen zouden ten onrechte zeggen dat de groep identiek is aan
ieder groepslid afzonderlijk. Hiervoor is een toekomstig hyperrelatieschema
nodig.

## 10. Status van een analyse

Iedere niet-triviale relatie behoort een epistemische status te krijgen:

| Status | Betekenis | Mag als harde lijn worden getekend? |
|---|---|---|
| `asserted` | rechtstreeks door aanwezige bronknopen en de gekozen fixture vastgelegd | ja, indien het relatietype een lijn gebruikt |
| `intended-reading` | één expliciet gekozen lezing uit meerdere mogelijkheden | ja, na selectie van `interpretationId` |
| `pragmatically-inferred` | afgeleid met wereldkennis of impliciete eventstructuur | standaard nee |
| `unresolved` | bron ontbreekt of meerdere bronnen blijven open | nee |

De scheiding voorkomt dat visuele plaatsing als semantisch bewijs wordt
gebruikt.

## 11. Analyse van de basisfixture

| Laag | Analyse | Status | Geometrisch? |
|---|---|---|---|
| Text · Anafoor | `MAN(S1)↔MAN(S2)`, LEX `MAN→HIJ` | expliciete coreferentie | `shared-column` voor de bronknopen `MAN–MAN` |
| Context · inserties | `GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` | alleen LEX, geen Text-boomknoop | nee |
| Context · tijd | verschil `+1 day` | p.m. | nee |
| Context · plaats | impliciete plaats bij `ER` | p.m. | nee |
| Context · toestand | aanwezig→niet meer aanwezig | p.m. | nee |
| Context · discourse | temporele voortgang / verandering | p.m. | nee |

De testparen en verwachte negatieve controles staan in
`S1_S2_RELATION_TEST_FIXTURES.md`; de bronvoorbeelden uit de literatuur staan
in `ANAPHOR_S1_S2_LITERATURE_CATALOG.md`.

## 12. Bronnen voor het theoretische kader

- Brennan, Friedman & Pollard (1987), *A Centering Approach to Pronouns*:
  <https://aclanthology.org/P87-1022/>.
- Grosz, Joshi & Weinstein (1995), *Centering: A Framework for Modeling the
  Local Coherence of Discourse*: <https://aclanthology.org/J95-2003/>.
- Venhuizen & Brouwer (2022), *Discourse Representation Theory*, met de
  stapsgewijze farmer–donkey-resolutie:
  <https://www.coli.uni-saarland.de/courses/semantics-22/lectures/ST08-DRT.pdf>.
- Eschenbach et al. (1989), *Remarks on Plural Anaphora*:
  <https://aclanthology.org/E89-1022/>.
