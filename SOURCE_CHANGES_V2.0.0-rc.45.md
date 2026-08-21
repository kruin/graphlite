# SOURCE_CHANGES v2.0.0-rc.45

## Source build 20260821.17 — vier flipvarianten en gezamenlijke oplossing

- Een binaire flip heeft twee onafhankelijke dimensies: links–rechts en
  kort–lang. Zij leveren exact `normal`, `left-right`, `short-long` en `both`.
  Kort–lang is plaatsingsafstand, niet subtree-omvang.
- `multi-ogn-composition-engine.js` enumereert alle toegestane varianten over
  S1 en S2 en kiest één kandidaat die alle vereiste Text-coreferenties met
  één starre S2-shift uitlijnt. Een conflict forceert geen losse knoop.
- De vijfde Configcombinatie is **De man slaat de hond omdat die hem heeft
  gebeten.** De bronrelaties zijn `HOND(S1)↔HOND(S2)` en
  `MAN(S1)↔MAN(S2)`; LEX realiseert `DIE` en `HEM`. `OMDAT` blijft Context.
- Drie gedeclareerde branches leveren 64 kandidaten; 16 zijn geldig. De
  deterministische standaardoplossing is `s1-root=left-right`,
  `s1-vp=left-right`, `s2-vcluster=normal`.
- Alleen een branch met `linearization: "child-order"` projecteert kort–lang
  tevens als omgekeerde LEX-childvolgorde. Daardoor zijn `HEEFT GEBETEN` en
  `GEBETEN HEEFT` twee varianten van dezelfde V-clusterbranch.
- Config bewaart per combinatie `auto` of een expliciete variant per branch.
  Play toont de gekozen flips per zin als één atomaire stap en speelt exact
  terug. OPN bewaart branches, gekozen varianten en flipstappen.
- `tools/check_anaphor_flip.js` bewaakt de vier varianten, de 64 kandidaten,
  beide coreferenties, conflictgedrag en beide clustervolgorden. De
  machineleesbare regressieset telt nu negen fixtures.

## Source build 20260821.16 — trailing whitespace automatisch verwijderen

- `TEXT_AND_CONTEXT.md` en de gespiegelde versie in `docs/` gebruiken geen
  Markdown-hard-break met twee trailing spaties meer. S1 en S2 blijven
  afzonderlijke alinea's zonder onzichtbare whitespacefout.
- `tools/normalize_text_files.py --write` verwijdert voortaan in alle
  projecttekst spaties en tabs aan het einde van iedere regel, naast de
  bestaande LF/CRLF-, UTF-8-BOM- en EOF-normalisatie. Inspringing en bewuste
  lege regels binnen een document blijven intact.
- `tools/check_text_normalization.py` controleert expliciet Markdown-spaties,
  tabs, bestaande inspringing, interne witruimteregels en Windows-CRLF.
- `tools/check_git_publish_staging.py` reproduceert nu zowel een verdwenen
  gevolgd bestand als `git diff --cached --check` met trailing whitespace en
  verifieert dat normalisatie plus de juiste stagingvolgorde beide blokkades
  oplossen.

## Source build 20260821.15 — volledige bronbehoud en veilige Git-staging

- De drie ontbrekende bestanden uit de oorspronkelijke bronzip zijn exact
  teruggezet: `CONFIG_UI_EXPLANATION_STANDARD.md`,
  `docs/CONFIG_UI_EXPLANATION_STANDARD.md` en
  `tools/check_lex_open_slots.js`. Iedere oorspronkelijke bron is daardoor
  opnieuw vertegenwoordigd in de volledige projectzip.
- `publish_checked.bat` voert `git add -A -- .` voortaan vóór
  `git add --renormalize -- .` uit. Verdwenen gevolgde bestanden zijn dan al
  uit de index bijgewerkt voordat Git bestaande bestanden leest; de fout
  `fatal: unable to stat ...` blokkeert publiceren niet meer.
- `tools/check_git_publish_staging.py` reproduceert de gemelde Git-fout in een
  afzonderlijke tijdelijke repository en verifieert de gecorrigeerde
  stagingvolgorde met een verdwenen
  `CONFIG_UI_EXPLANATION_STANDARD.md`.
- De oorspronkelijke actieve LEX-profielcontrole draait opnieuw in de
  releaseflow. Upward-Wissels, Context-inserties en Comp blijven actief;
  generieke plaatsen vóór, na of tussen blijven no-show en zonder
  opslagwerking. Help en Config leggen die grens zichtbaar uit.
- `HOND` en `MAN` behouden hun bronhoogte; alleen `BIJT` wisselt. De
  Text/Context-, Anafoor- en optionele Playwright-contracten blijven intact.

## Source build 20260821.14 — publiceren zonder verplichte Playwright-installatie

- `tools/check_multi_ogn_anaphor_runtime.js` voert de echte Anafoor-browsertest
  alleen uit wanneer Playwright én Chromium aanwezig zijn. Ontbrekende
  optionele hulpmiddelen worden expliciet gemeld zonder de release- of
  publicatiecontrole te laten mislukken.
- `tools/check_multi_ogn_anaphor_runtime_dependencies.js` simuleert zowel een
  ontbrekende Playwright-module als een ontbrekende Chromium-browser en bewijst
  daarnaast dat een echte defecte onderliggende afhankelijkheid nog steeds een
  fout is.
- `check_release.bat` voert deze regressiecontrole vóór de optionele
  browsertest uit. `installeer-carrousel-tools.bat` blijft beschikbaar om
  Playwright en Chromium te installeren voor de volledige browsercontrole of
  het opnieuw afleiden van publicatieslides.
- De Text/Context-, Anafoor-, Play- en plaatsingscontracten van source build
  `.13` blijven ongewijzigd.

## Source build 20260821.13 — centrale Text, Context-inserties en meervoudige anafoor

- `TEXT_AND_CONTEXT.md` legt de normatieve architectuur vast: **Text** is de
  centrale uiting (`S–O–V` / `Agens–Predicaat–Patiens`); **Context** is alles
  daaromheen. Iedere insertie is Context, ook bij `origin=LOG`, `LOG+LEX` of
  `LEX`. Zowel Text als Context is een eigen Open Graph Notation-structuur.
  Nadere Context-semantiek en Text–Context-koppeling blijven p.m.; de
  aangeleverde Context-OGN staat in `CONTEXT_TAXONOMY.md` met `CONTEXT` als
  wortel.
- Anafoor verbindt uitsluitend centrale Text-bronknopen tussen afzonderlijk
  berekende S1- en S2-bomen. `relations[]` bevat daarom alleen coreferentie;
  de historische `.12`-registratie van `GISTEREN→VANDAAG` als relatie is
  verwijderd.
- `GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` en `OMDAT` worden direct op een
  vrije LEX-positie
  ingevoegd met `layer: "Context"` en zonder centrale boomknoop. `HIJ` en
  `HEM` blijven LEX-realisaties van bestaande centrale Text-bronknopen.
- Config bevat vier selecteerbare S1–S2-combinaties, waaronder **Ik zag de
  man gisteren. Vandaag was hij er niet meer.** en **De boer slaat de ezel
  omdat hij hem bezit.**. De laatste combinatie bevat beide coreferenties
  `BOER→HIJ` en `EZEL→HEM` en toont beide uitgelijnde relaties.
- Play bouwt S1 en S2 na elkaar, toont Context-inserties als afzonderlijke
  LEX-stap en verplaatst alleen hoofdzinwerkwoorden naar V2. `BEZIT` blijft
  in de `OMDAT`-bijzin finaal.
- Het lexicon bevat nu een objectprofiel `HEM` naast subjectprofielen `HIJ`,
  `DIE` en `DIE MAN`. Config, OPN, documentatie en acht machineleesbare
  S1–S2-regressieparen bewaken dezelfde Text/Context-grens.
- Een gezamenlijke flipzoeker voor nog niet gelijktijdig uitlijnbare
  coreferenties is alleen voorbereid en gedocumenteerd; reeds uitgelijnde
  relaties worden direct allemaal getekend.

## Source build 20260821.12 — Language Tree-extensie 1, definities en heterogene S1–S2-relaties

- Anafoor is normatief gedocumenteerd als de eerste Language Tree-extensie;
  S1 en S2 blijven afzonderlijk recursief berekende bomen.
- Config en het Zin-menu bevatten drie echte combinaties. De fixture **Ik zag
  de man gisteren. Vandaag was hij er niet meer.** bewaart zowel
  `MAN(S1)→HIJ(S2)` als `GISTEREN(S1)→VANDAAG(S2)` met `offset = +1 day`.
- `ogn-temporal-reference-v1` is type-specifiek: `reference`, `relativeTime`
  en `temporal.offset`; er wordt geen coreferentielexicalisatie gefabriceerd.
- `semantic-only`-relaties zijn geen geometrische constraints. De compositor
  rapporteert ze als `not-a-geometric-constraint`; OPN bewaart beide typen
  zonder informatieverlies.
- De gridinvariant geldt per OGN. Toevallig gedeelde S1/S2-kolommen hebben
  geen semantische kracht; alleen `relations[]` declareert relaties.
- `ANAPHOR_AND_S1_S2_RELATION_DEFINITIONS.md` scheidt anafoor, antecedent,
  discourse-referent, coreferentie, tijd, plaats, toestandsverandering,
  discourse-relatie, bridging, deixis, exofora en catafora.
- `samples/s1-s2-relation-fixtures.json` bevat zeven positieve, negatieve en
  ambigue regressieparen. Impliciete plaats en pragmatisch afgeleide toestand
  blijven `unresolved`/`inferred` en worden niet getekend.
- `tools/check_anaphor_language_tree_extension.js` bewaakt schema's, endpoints,
  +1 dag, inferentiegrenzen, documentkopieën, Config en OPN-markers.

## Source build 20260821.11 — Anafoor-Play per zin en pas daarna MAN → HIJ

- Play toont eerst de volledige S1-boom, de horizontale LEX-projectie en
  `ZIE → V2`; S2 is in deze fasen nog niet zichtbaar.
- Daarna volgen de volledige S2-boom, haar horizontale LEX-projectie en
  `DRAAGT → V2`. Het subject blijft daarbij op bron en LEX nog `MAN`.
- Pas vervolgens verschijnt de ongerichte broncoreferentie MAN–MAN. De laatste
  stap realiseert `S2 MAN → HIJ` of het gekozen toepasselijke LEX-profiel.
- De desktop- en mobiele Play-knoppen zijn voor Anafoor actief. Pijl-terug
  doorloopt alle lagen exact omgekeerd, zonder dat de view verspringt.
- Beide bronbomen gebruiken de algemene object-vóór-eindwerkwoordbasis; alleen
  het eindwerkwoord verplaatst naar de vrije V2-gridrij tussen subject en
  object.
- Nieuwe zelfstandige tijdlijnengine en regressie:
  `multi-ogn-anaphor-play-engine.js` en
  `tools/check_multi_ogn_anaphor_play.js`.

## Source build 20260820.10 — anafoor pas op LEX; LEX-hoogten gecorrigeerd

- De afzonderlijk berekende S2-bronboom bevat nu `MAN` als subject; `HIJ` is
  geen bronknoop meer.
- De kruis-OGN-coreferentie verbindt `S1 MAN ↔ S2 MAN`. Beide bomen blijven
  recursief berekend en S2 wordt nog steeds uitsluitend star verschoven.
- De relatie projecteert het tweede MAN pas op LEX. Config kiest een profiel
  uit de bewerkbare lexiconconstructie `anaphor-subject`: `HIJ`, `DIE` of
  `DIE MAN` is toepasselijk bij MAN; `DIE VROUW` is aanwezig maar alleen
  toepasselijk bij VROUW.
- Nieuwe OPN-export gebruikt compositieschema v2 en bewaart bronzinnen,
  oppervlaktezinnen, MAN–MAN en het gekozen LEX-profiel afzonderlijk. Import
  van het oudere v1-schema blijft ondersteund.
- De `.8`-representatie hieronder is hiermee inhoudelijk vervangen voor
  nieuwe uitvoer.

## Source build 20260814.8 — historische tussenstand

- De actuele projectzip uit Sources,
  `OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source(5)(1).zip`, blijft de
  leidende bron. Alleen de eerder ontwikkelde Anafoor-/multi-OGN-wijzigingen
  zijn daarop overgezet.
- De berekende modus **Anafoor · multi-OGN** toont het vaste voorbeeld
  `Ik zie een man. Hij draagt een hoed.`. S1 en S2 worden afzonderlijk
  berekend en gevalideerd.
- De compositor houdt beide bomen star, plaatst S1 boven S2 en verschuift de
  complete S2 totdat antecedent MAN en anafoor HIJ exact dezelfde
  gedeclareerde gridkolom delen.
- De MAN–HIJ-coreferentie is een rechte verticale lijn zonder pijl of
  verwijzingsrichting. Eén gezamenlijke LEX-as ordent alle S1-items vóór alle
  S2-items.
- Source build 20260820.10 corrigeert de drie LEX-hoogten. In
  `HOND BIJT MAN` blijven **HOND** en **MAN** exact op hun recursief berekende
  bronhoogte; uitsluitend **BIJT** wisselt naar de vrije LEX-gridrij
  halverwege die twee bronrijen. Het V2-doel is dus niet langer een vaste
  offset onder `S`. LOG mag plaatsen reserveren, maar geeft zonder expliciete
  Wisselregel geen verplaatsingsopdracht.
- De zichtbare eindvolgorde blijft **HOND BIJT MAN**.
- Config, Help, OPN/Legacy-opslag, importvalidatie, referentiemateriaal en
  afzonderlijke engine-/runtimecontroles volgen hetzelfde Anafoor-contract.
- De Anafoor-regressie bewaakt nu tevens dat de twee boomdefinities geen vaste
  `x/y`-coördinaten bevatten en dat S1 en S2 elk via de recursieve
  `layoutTree(...)`-berekening lopen voordat de compositie begint.

Normatief: `MULTI_OGN_ANAPHOR.md`.

## Source build 20260802.6 — Configschil volgt de actieve methode

- Bij actieve Greedy Grow opent Config rechtstreeks met alleen Terug naar
  Main, de twee eigen velden en Config-save.
- Bij actieve Random opent Config rechtstreeks met alleen Terug naar Main, de
  vijf eigen velden, de berekende as-impact en Config-save.
- De algemene hoofdtabbladen, het Algemeen/Greedy/Random-submenu, taalmenu,
  README-knop, algemene Configuitleg en configlogknop zijn in beide
  methodeschermen verborgen.
- Met Language Tree actief blijft de volledige projectconfig beschikbaar;
  `Config → Direct` toont daar uitsluitend Algemeen.
- De vorige aanpassing beperkte wel de inhoud van de methodepanelen, maar liet
  de buitenste algemene Configschil nog zichtbaar. Deze bronstand corrigeert
  precies dat verschil.
- De releasecontrole bewaakt zowel de exacte veldinhoud als de afscherming van
  de volledige Configschil.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

## Source build 20260802.5 — methodepanelen tonen alleen eigen Config

- Het Greedy Grow-paneel bevat uitsluitend Zoekstrategie en Oriëntatie.
- Het Random-paneel bevat uitsluitend Seed, Resetbeleid, Spreiding, Hoe vaak
  en Impact op west- en zuidas, plus de daaruit berekende impactregel.
- Uitlegblokken, Toon-knoppen, methodegebonden herstelknoppen en algemene
  statusregels zijn uit beide methodepanelen verwijderd.
- Gedeelde instellingen en hun herstelknop blijven uitsluitend onder
  Algemeen. De Config-savebalk blijft volgens het algemene Configcontract
  beschikbaar.
- De releasecontrole telt de velden en weigert algemene of methodevreemde
  bediening in Greedy Grow en Random.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

## Source build 20260802.4 — Random-config geïsoleerd

- `Config → Direct` bevat nu drie afgebakende submenu's: Algemeen, Greedy
  Grow en Random.
- Algemeen bevat alle gedeelde run- en weergavekeuzes. Greedy Grow bevat
  uitsluitend strategie en oriëntatie. Random bevat uitsluitend seed,
  resetbeleid, spreiding, **Hoe vaak** en **Impact op west- en zuidas**.
- Eén Random-iteratie is één complete run met het algemene aantal knopen. De
  centrale knoop telt niet mee: 10 iteraties met 31 knopen leveren precies
  300 waarnemingen per as.
- Het asbeeld kan uit, als Bezettingskans (`telling ÷ iteraties`) of als
  Relatief patroon (`telling ÷ hoogste telling`) worden weergegeven.
- Het Random-paneel toont de actuele rekensom direct onder de opties. De
  iteratieanalyse blijft reproduceerbare diagnostiek en verandert de actieve
  directe run niet.
- Oudere rc.45-configs worden bij het laden naar
  `directPlacementGeneral`, `greedyGrowConfig` en `randomPlacementConfig`
  gemigreerd; een nieuwe save schrijft alleen het geïsoleerde model.
- De automatische controle faalt wanneer een algemene of Greedy-optie opnieuw
  in het Random-paneel verschijnt en controleert de 300 waarnemingen per as.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

## Source build 20260802.3 — directe Config-submenu's

- `Config → Direct` bevat één gedeeld presentatieblok en afzonderlijke
  submenu's voor Greedy Grow en Random.
- Greedy Grow configureert zijn vijf bestaande deterministische strategieën,
  aantal, Play-snelheid en afgeleide weergaveoriëntatie. Herhaling is bewust
  niet toegevoegd: dezelfde Greedy-invoer levert exact hetzelfde resultaat.
- Random configureert aantal, snelheid, seed, resetbeleid en spreiding.
- Random kan 1, 3, 10 of 25 deterministische vergelijkingsruns analyseren.
  Marginale coördinaatfrequenties worden aan de west- en zuidas getekend; het
  verplichte centrale startpunt telt niet mee.
- De herhalingsanalyse is diagnostiek en plant de actieve directe run niet
  vooruit. De harde unieke-rij/kolomregel blijft per run gelden.
- Gedeelde presentatie en beide methodeblokken worden genest opgeslagen en
  per sleutel samengevoegd tussen default-, user- en browser-Config.
- `DIRECT_PLACEMENT_CONFIG.md`, een handmatige test en een automatische
  releasecontrole leggen de nieuwe opties vast.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

## Source build 20260802.2 — lijnbeeld, directe modi en EOF/EOL

- Language Tree blijft de primaire berekende toepassing in het hoofdmenu.
  Greedy Grow en Random zijn daaronder geïntegreerd als directe
  OGN-illustraties met dezelfde stap-, Play- en resetbediening.
- Greedy Grow gebruikt ongewijzigd de geaccepteerde historische engine.
  Random gebruikt een afzonderlijke seedbare engine, zodat de bestaande
  carrouselafleiding niet door een nieuwe strategie kan worden vervuild.
- Config bevat rasterkleur en afzonderlijke gewichten voor rasterlijnen,
  projectielijnen en boxlijnen. LEX, SYNT en LOG hebben verschillende
  standaardkleuren die door hun assen, lijnen en boxen worden gevolgd.
- `.gitattributes` maakt de EOL-keuze onafhankelijk van globale Windows-Git-
  instellingen. De normalizer bewaakt LF voor bron/documentatie, CRLF voor
  Windows-scripts en exact één afsluitende EOL.
- `publish_checked.bat` normaliseert vóór de checks en gebruikt daarna
  `git add --renormalize`; een extra lege EOF-regel wordt dus vóór committekst
  en push gevonden en hersteld.
- Nieuwe controles bewaken Random, het lijnbeeld, de modushiërarchie en de
  tekstnormalisatie. `tools/check_publication_carousel.py` blijft aantonen dat
  de geaccepteerde Greedy-bron en de zeven slides niet uit elkaar zijn gelopen.

Normatief: `LINE_STYLE_AND_PLACEMENT_MODES.md`.

rc.45 herschrijft de algemene OGN-uitleg. De vaste volgorde is:

```text
OGN Free Placement
→ OGN Projection
→ OGN Calculated Placement
→ gespecialiseerde toepassingen
```

## OGN-kern

- De algemene kern schrijft knopen één voor één op vrije posities van een open
  grid.
- Iedere knoop is baas op één eigen horizontale en één eigen verticale
  gridlijn.
- De knoopregel is nu een harde invariant: `A ≠ B ⇒ x(A) ≠ x(B) én
  y(A) ≠ y(B)`. Kern, toepassingen, render en OPN-export mogen dus nooit twee
  knopen op dezelfde horizontale of verticale gridlijn toelaten; er bestaat
  geen ongeldige renderfallback. De vaste naam voor zo'n overtreding is
  `gridlijnhergebruik`.
- Iedere nieuwe stap leest eerst de door eerdere knopen opgebouwde bezetting.
- Een ruleset bepaalt welke vrije posities geldig zijn.
- Een zoekstrategie bepaalt de kandidaatvolgorde; de eerstgevonden geldige
  plek wordt bij directe plaatsing meteen geschreven.
- Greedy Grow begint bij het centrale gridpunt en schrijft dots één voor één.
  De geaccepteerde compacte vierarmige volgorde reproduceert de bewaarde
  12/31/96-demo's exact. De veldomtrek blijft diagnostiek; de reconstructie
  claimt geen bewezen wereldwijd optimum.
- Het vrije-plaatsenvoorbeeld gebruikt unieke binnenrijen en kolommen; de
  onderste gridrij blijft leeg.
- Verdere plaatsingsbeperkingen worden pas uitgewerkt in afzonderlijke
  rulesets voor directe of berekende plaatsing en blijven hier buiten beeld.

De normatieve beschrijving staat in
`OGN_CORE_PLACEMENT_ARCHITECTURE.md` en
`docs/OGN_CORE_PLACEMENT_ARCHITECTURE.md`.

## Drie lagen

- Projectie komt pas na de plaatsing van de bronknoop. Zij kan een marker of
  ordening afleiden zonder de bronknoop te verplaatsen.
- Berekende plaatsing is de derde laag: een toepassing mag eerst een
  plaatsingsplan berekenen en dat daarna door OGN laten schrijven en renderen.
- Two-Pass Language Tree is voortaan expliciet één berekende toepassing.
- LEX, SYNT en LOG zijn benoemde projecties binnen de taaltoepassing en
  definiëren de algemene OGN-kern niet.
- Het UI-profiel `OGN Basis` blijft de basis van de huidige taaltoepassing; de
  profielnaam betekent niet `OGN Core`.

## README en publicatie

- `README.md`, `LEESMIJ.md` en de ingebouwde README beginnen nu bij de
  algemene OGN-kern.
- Vier nieuwe ingebouwde uitlegbeelden tonen vrije gridplaatsing,
  sequentieel schrijven, verschillende zoekvolgorden en de laagvolgorde.
- De oude probleembomen blijven alleen als later taaltoepassingsmateriaal
  aanwezig.
- `PUBLICATIE_README.md` en alle sociale platformteksten zijn kern-eerst
  herschreven.
- De publicatiecarrousel bevat zeven beelden van 1080 × 1080. Slide 4 toont
  geplaatste knopen die naar WEST, SOUTH en EAST projecteren. `node`/`knoop`
  vervangt daar de eerdere term `source`/`bron`.
- Slide 5 is het voorbeeld **Direct — Greedy Grow** en wordt rechtstreeks uit
  de geaccepteerde engine afgeleid. Slide 6 is het voorbeeld
  **Calculated — Language Tree** en toont `HOND BIJT MAN` in het laatste
  stadium, met `HOND · BIJT · MAN` op de westelijke LEX-as.
- Beide voorbeeldslides tonen `github.com/kruin/graphlite`; de oude kaarten
  die de twee plaatsingssoorten uitlegden zijn verwijderd.
- De carrousel is voortaan strikt afgeleid: alleen
  `publicatie-carrousel/index.html` is bewerkbare beeldbron.
  `maak-publicatie-carrousel.bat` genereert altijd alle zeven PNG's en de
  carrouselzip opnieuw. Een SHA-256-manifest en de releasecontrole blokkeren
  verouderde of handmatig gewijzigde afgeleiden.
- Een schone Windows-uitpakmap bevat nu een vastgezette Playwright-installatie,
  een expliciete eenmalige installer en een startcontrole van Chromium.
  Dezelfde herbouw werkt vanuit de volledige projectmap en vanuit de losse
  carrouselmap; een browsertoevoeging als ` (6)` komt niet in de nieuwe zipnaam.
  Lokale `node_modules` en browserbestanden blijven buiten beide releasezips.

## Controles

- `tools/check_publication_carousel.py` controleert de nieuwe slideset,
  kerntermen, laagvolgorde, bestandsnamen, afmetingen en de hashes van bron,
  exporter en alle afgeleide PNG's.
- `tools/check_release.py` controleert de normatieve architectuur, de vier
  README-beelden, het vastgelegde rc.45-akkoord en de nieuwe carrousel.
- `RC45_OGN_CORE_EXPLANATION_TEST.md` bevat de handmatige inhoudelijke en
  visuele akkoordlijst.

## Lokale bronidentiteit

- `SOURCE_BUILD.txt` onderscheidt deze herziening met knoopprojecties,
  voorbeeldslides en GitHub-verwijzingen van eerdere pakketten die hetzelfde
  rc.45-appversienummer dragen.
- De lokale starter controleert voortaan versie én bronstand voordat hij
  `reset-cache.html` opent. Een nog draaiende oudere rc.45-server wordt dus
  niet meer stilzwijgend hergebruikt en kan geen misleidende 404 voor nieuwe
  bestanden zoals `greedy-grow.html` veroorzaken.
- `tools/check_local_start.py` toetst ook expliciet de fouttoestand waarin de
  appversie gelijk is maar de bronstand verschilt.

## Geaccepteerde Greedy Grow-reconstructie

- `greedy-grow-engine.js` herstelt de exacte vierarmige schrijfvolgorde uit de
  drie bewaarde demo's van 12, 31 en 96 knopen.
- `greedy-grow.html` maakt iedere directe `+1`-stap, undo, Play en actuele
  JSON-state afzonderlijk controleerbaar.
- Vier uit de oude browserproef herstelde kandidaatvolgorden leveren zichtbare
  alternatieven zonder vooraf een volledig eindbeeld op te slaan.
- `GREEDY_GROW_RECONSTRUCTION.md` scheidt teruggevonden feiten, operationele
  reconstructie en onbewezen optimaliteitsclaims.
- `tools/check_greedy_grow_reconstruction.js` vergelijkt alle bewaarde
  coördinaten exact en bewaakt unieke rijen/kolommen en direct schrijven.
- De gebruiker heeft de reconstructie en afbakening op 2 augustus 2026
  handmatig goedgekeurd. Publicatieslide 5 wordt uit dezelfde engine afgeleid.

## Compatibiliteitsgrens

De taalboom-graphdata en het OPN-formaat zijn niet gewijzigd. De oorspronkelijke
rc.45-carrousel blijft byte- en hashgecontroleerd; source build 20260802.6
wijzigt wel de viewerinterface, geïsoleerde directe Config en het
lijnrendercontract zoals hierboven beschreven.
