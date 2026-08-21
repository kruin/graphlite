# Language Tree · extensie 1 · Anafoor — bronstructuur en LEX-realisatie

Dit document bewaart het oorspronkelijke multi-OGN-detailcontract. Het
leidende extensiecontract staat in `ANAPHOR_LANGUAGE_TREE_EXTENSION.md`; het
generieke flipcontract staat in `FLIP_CONSTRAINT_SOLVER.md`. De normatieve
indeling is `TEXT_AND_CONTEXT.md`: centrale Syntax/Functional-uiting =
**Text**; alles daarbuiten en iedere insertie = **Context**; Context p.m.

Anafoor is de eerste extensie van Language Tree: S1 en S2 worden ieder als een
gewone Language Tree berekend; compositie, referent–anafoorrelaties en
LEX-realisatie worden daarna toegevoegd.

## Twee lagen in het vaste voorbeeld

De structurele invoer en de zichtbare uiting zijn bewust niet hetzelfde:

| Laag | S1 | S2 |
|---|---|---|
| bron / afzonderlijke boom | Ik zie een man. | Man draagt een hoed. |
| LEX-oppervlakte | Ik zie een man. | Hij draagt een hoed. |

De MAN-knoop in S1 is het **antecedent**. Het subject van S2 is onderliggend
eveneens **MAN**. Deze twee bronknopen zijn coreferentieel. De
anafoorrelatie projecteert pas op LEX een toepasselijke anaforische
uitdrukking voor het tweede MAN. `HIJ` is dus geen bronknoop in de S2-boom.

De natuurlijke zinnen houden de lidwoorden *een*. De vereenvoudigde bomen
tonen de lexicale bronvolgorden `IK · MAN · ZIE` en
  `MAN · HOED · DRAAGT`. Binnen beide bronbomen staat het object vóór het
eindwerkwoord. De zichtbare
hoofdzinsvolgorde ontstaat op LEX doordat `ZIE` respectievelijk `DRAAGT` naar
de vrije V2-gridrij tussen subject en object wisselt.

## Play: eerst S1, daarna S2, daarna de anafoor

Play mengt de twee berekeningen niet. De vaste tijdlijn is:

1. laat de complete S1-boom knoop voor knoop groeien;
2. projecteer `IK`, `MAN` en `ZIE` horizontaal op hun bronhoogte;
3. wissel uitsluitend `ZIE` naar de vrije V2-rij: `IK ZIE MAN`;
4. laat daarna pas de complete S2-boom knoop voor knoop groeien;
5. projecteer `MAN`, `HOED` en `DRAAGT` horizontaal op hun bronhoogte;
6. wissel uitsluitend `DRAAGT` naar de vrije V2-rij: `MAN DRAAGT HOED`;
7. toon de ongerichte broncoreferentie `S1 MAN ↔ S2 MAN`;
8. realiseer als laatste LEX-stap `S2 MAN → HIJ` (of het gekozen toepasselijke
   profiel).

De tweede zin toont dus vóór de laatste stap bewust nog `MAN`. `HIJ` verschijnt
niet tijdens de boomberekening en niet tijdens V2, maar uitsluitend door de
anafoorrelatie op LEX. De pijl-terugknop verwijdert de lagen in exact omgekeerde
volgorde: eerst `HIJ → MAN`, dan de coreferentielijn, daarna S2 en ten slotte
S1. Dezelfde Play-bediening is beschikbaar op desktop en mobiel.

## Berekening en compositie

De bomen zijn **niet ad hoc getekend**. De demo bewaart alleen boomtopologie
en labels en bevat geen `x`- of `y`-coördinaten.
`multiOgnSentenceLayout(...)` stuurt S1 en S2 ieder afzonderlijk door dezelfde
recursieve `layoutTree(...)`-berekening. Pas daarna begint de compositie:

1. bereken S1 als complete, afzonderlijke OGN;
2. bereken S2 met MAN als subject als complete, afzonderlijke OGN;
3. valideer per afzonderlijke OGN de unieke rijen en kolommen;
4. plaats S1 boven S2;
5. **star verschuiven**: geef iedere S2-knoop exact dezelfde `dx,dy`, totdat
   S2 MAN de kolom van S1 MAN deelt;
6. valideer de compositie;
7. projecteer beide bomen naar één gezamenlijke LEX-as;
8. realiseer S2 MAN op LEX volgens het gekozen anaforische lexiconprofiel.

Een compositor mag geen afzonderlijke S2-subtree herschikken. De interne
afstanden en topologie van beide berekende bomen blijven ongewijzigd.

## Gridinvariant: per afzonderlijke OGN

Binnen iedere eenheid geldt:

```text
A ≠ B  ⇒  x(A) ≠ x(B)  en  y(A) ≠ y(B)
```

De compositie is geen nieuwe, samengevoegde OGN. De unieke-rij/kolomregel
geldt daarom **per eenheid**. S1 en S2 kunnen na een starre verschuiving
toevallig meer kolommen delen; zo'n numerieke gelijkheid declareert geen
semantische relatie. Alleen `relations[]` is semantisch gezag. Een relatie met
`alignment.type = "shared-column"` eist uitlijning van haar benoemde
Text-paar. Context-inserties leveren geen Anafoorconstraint. Er mag geen rij
tussen S1 en S2 worden gedeeld.

De rechte verticale MAN–MAN-lijn is ongericht, heeft geen pijlpunt en drukt
gelijkheid van referent uit. Zij beeldt geen verplaatsing en geen
MAN–HIJ-bronrelatie af.

## Anaforische lexiconprofielen

De profielen staan in `lexicon-config.html` onder constructie
`anaphor-subject`. Config kiest het profiel voor deze zinsinstantie; de keuze
muteert het globale lexicon niet.

| Profiel | LEX-vorm | Toepasselijk antecedent | In dit voorbeeld |
|---|---|---|---|
| `hij` | HIJ | man, boer | standaard |
| `die` | DIE | man, vrouw, boer | beschikbaar |
| `die-man` | DIE MAN | man | beschikbaar |
| `die-vrouw` | DIE VROUW | vrouw | zichtbaar, uitgeschakeld |
| `hem` | HEM | ezel, man, boer | alleen anaforisch object |

Bij een vrouwelijke bronreferent is `DIE VROUW` dus wel toepasselijk. De
metadata `surface`, `antecedents`, `category` en `kind` is via de
lexiconeditor bewerkbaar. Een niet-toepasselijk profiel wordt niet stilzwijgend
op de bronstructuur toegepast.

Met het standaardprofiel luidt de gezamenlijke LEX-as:

```text
S1: IK → ZIE → MAN
S2: HIJ → DRAAGT → HOED
```

Bij `die-man` verandert alleen het eerste LEX-item van S2 in `DIE MAN`; de
S2-boom en de coreferentiekolom blijven MAN–MAN.

## Config, meerdere combinaties, opslag en compatibiliteit

De complete S1–S2-combinatie staat als keuze in het menu **Zin**. Config
bewaart `anaphorCombinations[]`, kiest met `anaphorCombinationId` de actieve
combinatie en bewaart per combinatie het LEX-profiel in
`anaphorLexicalizations`.

De meegeleverde lijst bevat nu het oorspronkelijke man–hoed-geval, de
opdrachtgeversfixture **Ik zag de man gisteren. Vandaag was hij er niet meer.**
en de literatuur-normalisatie **Een boer bezit een ezel. Hij slaat hem.**.
De vierde keuze is **De boer slaat de ezel omdat hij hem bezit.** De vijfde is
**De man slaat de hond omdat die hem heeft gebeten.** Het
tijdsvoorbeeld declareert uitsluitend Text-coreferentie `MAN→HIJ`;
`GISTEREN`, `VANDAAG`, `ER` en `NIET MEER` zijn Context-inserties. Beide
boer–ezelgevallen
declareren `BOER→HIJ` en `EZEL→HEM`. `OMDAT` is een Context-insertie;
`BEZIT` blijft finaal in de bijzin. De volledige researchselectie en de
grens tussen gewone links en hyperrelaties staat in
`ANAPHOR_S1_S2_LITERATURE_CATALOG.md`.

De vijfde keuze declareert `HOND→DIE` en `MAN→HEM`. De S2-bronboom bevat
daarom HOND als subject en MAN als object; DIE en HEM bestaan uitsluitend op
LEX. Het werkwoordcluster bevat de Text-bronnen HEEFT en GEBETEN.

Iedere combinatie gebruikt een lijst `relations[]` met uitsluitend centrale
Text-coreferentie. De renderer tekent alle reeds uitgelijnde links en
realiseert iedere gekoppelde S2-bron zelfstandig op LEX. Config toont de
selector voor de
LEX-realisatie van de primaire anafoorbron. De opties worden uit het lexicon
geladen en krijgen daar hun toepasbaarheid.

Nieuwe OPN-export gebruikt
`data.composition.schema = "ogn-multi-composition-v2"` en bewaart afzonderlijk:

- de bronzinnen en de LEX-oppervlaktezinnen;
- de twee zelfstandig berekende graphs, met S2 `s2-man`/`MAN`;
- Context-inserties afzonderlijk buiten `graph.nodes[]`, met `layer: Context`;
- de starre verschuiving per eenheid;
- de ongerichte broncoreferentie `s1-man ↔ s2-man`;
- alle geconfigureerde `relations[]`, met een vlag welke relatie in deze
  versie wordt gerenderd;
- het gekozen LEX-profiel, zijn oppervlaktevorm en bronknoop;
- de gezamenlijke LEX-volgorde met `source_label` en zichtbaar `label`;
- de gezamenlijke flipconstraints, gevraagde Configvarianten en gekozen
  oplossing.

OPN-v1 met de oudere directe bronknoop `s2-hij` blijft alleen voor import
ondersteund. Nieuwe export schrijft die representatie niet meer.

## Flipcontract

Flip wordt niet als vaste reeks `S2 → S1` uitgevoerd. Alle gedeclareerde
branchvarianten en de starre S2-shift worden actief in één gezamenlijke
zoekruimte opgelost. Iedere binaire branch kent vier toestanden: `normal`,
`left-right`, `short-long` en `both`. Links–rechts bepaalt de zijde;
kort–lang bepaalt de plaatsingsafstand en verandert alleen bij
`linearization: "child-order"` tevens de LEX-childvolgorde.

De fixture **De man slaat de hond omdat die hem heeft gebeten** gebruikt drie
gedeclareerde branches en twee harde uitlijningen. De solver onderzoekt 64
kandidaten en kiest deterministisch één geldige variantset. Daardoor zijn
`HEEFT GEBETEN ↔ GEBETEN HEEFT` varianten van dezelfde generieke bewerking,
niet van een aparte perfectummodule. Config kan per branch `auto` of een
expliciete variant kiezen; Play toont de gekozen flips per zin als één
atomaire stap. Zie `FLIP_CONSTRAINT_SOLVER.md`.

## Grenzen en controles

Deze versie heeft precies twee OGN-eenheden en S1 vóór S2. Config en OPN mogen
meerdere coreferentieparen bevatten; de geometrische weergave lost alle harde
paren gezamenlijk op zonder losse Text-knopen te verplaatsen. Vrije
zinsinvoer, catafoor en
ketens met meer dan twee zinnen vallen buiten deze toepassing.

`tools/check_multi_ogn_anaphor.js` bewaakt de recursieve berekening, MAN–MAN,
de lexiconprofielen en het ontbreken van ad-hoc-coördinaten.
`tools/check_anaphor_flip.js` bewaakt de vier varianten, alle 64 kandidaten,
beide coreferenties en de twee werkwoordclustervolgorden. De browsertest
controleert daarnaast de getekende bronknopen, LEX-realisatie, Config-keuze en
OPN-v2-roundtrip.
