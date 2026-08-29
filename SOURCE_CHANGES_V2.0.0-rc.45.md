# SOURCE_CHANGES v2.0.0-rc.45

## Bronstand .71 — Functional, database en Compact

- **Syntax | Functional** staat prominent buiten het
  plaatsingsmethodemenu en geldt voor alle kernzinnen van een compositie.
- Functional gebruikt dezelfde goedgekeurde analyse en tekent onder meer
  `CLAUSE`, `ARG-STRUCT`, `PRED`, `AGENS` en `PATIENS` waar beschikbaar.
- **Compact** kiest veilige compacte boomdichtheid, `auto-compact` en compacte
  H/V-kernzinvertakking zonder tekst of knoopsymbolen te verkleinen.
- De lokale SQLite-catalogus, analysepoort en publieke `OK`-export zijn samen
  vastgelegd in `FUNCTIONAL_DATABASE_COMPACT.md`.

## Bronstand .63 — lokale kernzinzones, nummers en bulkstatus

- Iedere LEX-wissel behoudt dezelfde bron- en doelkern; K2/K3 mogen niet in een eerdere kernzinzone landen.
- De asnaam bij uitingen is verkort tot `LEX`.
- Het DB-nummer staat vóór de oorspronkelijke input boven de graph en in de zinnen-/uitingenlijsten.
- Testmateriaal ondersteunt meervoudige selectie en één transactionele statuswijziging voor alle geselecteerde nummers.

## Bronstand .62 — uitsluitend upward en SQLite lokaal leidend

- De onjuiste neerwaartse LEX-mogelijkheid uit `.61` is verwijderd.
- Iedere LEX-doelrij ligt op of boven haar bronrij; overtredingen stoppen de render en de releasecontrole.
- Meerdelige realisaties eindigen op de bronrij en groeien naar boven.
- De lokale viewer leest standaard `data/testmateriaal.sqlite` via de lokale server; GitHub Pages gebruikt uitsluitend de afgeleide `data/catalog.public.json`.

## Bronstand .61 — Uiting-LEX en lokale DB-invoer

- Boom→LEX-projecties zijn horizontaal; doelrijwissels lopen afzonderlijk verticaal over de LEX-as.
- Meerdelige realisaties beginnen niet langer boven hun bronrij.
- `voeg-lokale-db-in.bat` valideert DB-schema 2, maakt een reservekopie, vervangt atomair, exporteert de publieke catalogus en rolt bij fouten terug.
- Lokale DB-reservekopieën blijven buiten GitHub en de volledige bron-ZIP.

## Source build 20260813.5 — Anafoor · multi-OGN

- Nieuwe berekende modus **Anafoor · multi-OGN** met het vaste voorbeeld
  `Ik zie een man. Hij draagt een hoed.`
- S1 en S2 worden aantoonbaar afzonderlijk berekend en per eenheid tegen de
  unieke rij-/kolomregel gevalideerd.
- De compositor houdt beide bomen star, plaatst S1 boven S2 en verschuift de
  complete S2 totdat MAN en HIJ exact één gedeclareerde gridkolom delen.
- MAN is het antecedent, HIJ de anafoor; de coreferentie is een rechte
  verticale lijn zonder pijl of richting.
- Eén gezamenlijke LEX-as ordent alle S1-items vóór alle S2-items.
- Config, Help, OPN/Legacy-opslag, importvalidatie, referentiemateriaal en
  afzonderlijke engine-/browsertests volgen hetzelfde contract.

Normatief: `MULTI_OGN_ANAPHOR.md`.

## Source build 20260813.4 — upward-profiel en zinsoorten

- Het actieve LEX-contract is versmald tot upward-Wissels vanaf de zichtbare
  bronhoogte, toepassingsgebonden inserties en rechtstreeks geschreven Comp.
- Een LOG-reservering kan een lager doel niet meer legitimeren. Een doel op of
  onder de bronhoogte blijft exact op de horizontale bronprojectie.
- Generieke plaatsen vóór, na of tussen en alle downward/post-V2-Wissels zijn
  no-show: geen Config, rendering of nieuwe Config-/OPN-opslag. Oude velden
  worden compatibel genegeerd. Hun gebruik wordt later geëvalueerd.
- Zinsoort is een aparte Language-Tree-laag met mededelende hoofdzin,
  ja/nee-vraagzin, dat-zin en omdat-zin. De vraagzin gebruikt V1; DAT en OMDAT
  worden direct in Comp geschreven. Perfectum is een werkwoordsvorm.
- Vraagzin is uit de gereserveerde toepassingen gehaald. Alleen Nadruk en
  Onaffe zin blijven daar no-show gereserveerd.
- Voorbeeldeneditor, Help, OPN, documentatie en regressietests gebruiken
  hetzelfde vierdelige zinsoortcontract.

Deze source build vervangt het actieve gedrag uit de onderstaande historische
20260813.3- en 20260813.2-notities; die blijven alleen als wijzigingshistorie
staan.

## Source build 20260813.3 — LEX-plaats- en richtingscontract

- Config legt nu altijd zichtbaar uit dat 0–6 het exacte aantal extra lege
  kandidaatrijen is. Bronprojecties, systeemslots en insertieplekken tellen
  als bezet, worden niet meegeteld en worden nooit verschoven of hergebruikt.
- De actuele combinatie van Aantal en Plaats krijgt een live NL/EN-uitleg.
  De volledige toelichting staat standaard open en Help heeft afzonderlijke
  onderwerpen **Vrije LEX-plekken** en **Richting van Wissels**.
- `Tussen` gebruikt eerst echte gaten en plaatst een restant voortaan
  vóór/boven de actieve woordvolgorde. Dit volgt de top-down LEX-volgorde en
  Comp/slot 0 als bestaande voorpositie. Een bezette Comp-rij wordt
  overgeslagen; de extra kandidaat wordt geen Comp-slot.
- `Automatisch` blijft na de echte tussenruimten afwisselend vóór en na
  plaatsen en behoudt zo zijn inhoudsneutrale karakter.
- Iedere zichtbare Wissel draagt `data-display-direction="up"`, `"down"` of
  `"same-row"`. Dit is uitsluitend schermgeometrie en geen syntactische
  richtingsanalyse. De regressietest dekt zowel een eerdere/opwaartse
  V2-Wissel als een latere/neerwaartse post-V2-Wissel.
- Help en documentatie geven voorbeelden van omhoog, omlaag, geen Wissel en
  direct geschreven Comp. Heavy NP Shift, extrapositie en morfologische
  Lowering zijn expliciet buiten rc.45 geplaatst en mogen later alleen met een
  eigen bron-, doel-, fase- en tracecontract worden toegevoegd.
- De verouderde Engelse README-beschrijving van een afzonderlijke lege
  SPACE-fase is gecorrigeerd naar het actuele tweefasencontract `LOG → LEX`.

Normatief: `LEX_MOVEMENT_RULES.md`, `projectie-master-spec.md` en
`OPN_STORAGE_FORMAT.md`.

## Source build 20260813.2 — vrije LEX-plekken zonder SPACE-fase

- De tijdelijke LEX-ruimte-indicator en de bijbehorende lege Play-fase zijn
  verwijderd. De afleiding loopt nu rechtstreeks `LOG → LEX`; reverse Play
  gebruikt exact `eindlaag → LEX → LOG → boom`.
- LEX onderscheidt nu expliciet drie soorten plaatsen: vaste systeemslots,
  toepassingsgebonden insertieplekken en extra vrije plekken zonder inhoud,
  bron of plaatsingsregel.
- `Config → Calculated → Language Tree → LOG & LEX` bevat voor de extra soort
  een aantal van 0–6 en vijf plaatsingswijzen: automatisch, vóór, tussen, na
  en rond de actieve LEX-rijen. `tussen` wijkt bij plaatsgebrek uit naar `na`.
- De berekening blokkeert iedere rij die al door bronprojectie, systeemslot of
  insertieplek wordt gebruikt. De extra plekken verplaatsen geen bronknoop.
- Configsnapshot, standaardconfig, OPN en Legacy JSON bewaren aantal en
  plaats. De releaseflow voert een geïsoleerde geometriecontrole over alle
  vijf plaatsingswijzen uit.

Normatief: `LEX_MOVEMENT_RULES.md` en `projectie-master-spec.md`.

## Source build 20260813.1 — Configgrenzen en MAN op bronhoogte

- **Algemeen** bevat nu uitsluitend toepassingsonafhankelijke interface-,
  LEESMIJ- en bestandsinstellingen. Voorconfig, uitbreidingen, boom,
  voorbeelden, LEX, SYNT en LOG staan uitsluitend onder **Calculated →
  Language Tree**. Gedeelde directe instellingen hebben de eigen context
  **Direct → Gedeeld**.
- Openen van Config vanuit Language Tree kiest direct de Language-Tree-context;
  vanuit Greedy Grow en Random blijft de bestaande harde methode-no-show
  gelden.
- De LOG-slotplanning reserveert mogelijke LEX-plaatsen, maar is niet langer
  zelf een zichtbare verplaatsingsopdracht. Zonder expliciete topic-, V2- of
  post-V2-regel blijft een bronknoop exact op bronhoogte.
- In `HOND BIJT MAN` blijven daardoor `HOND` en `MAN` op hun eigen
  bronknoophoogte; uitsluitend `BIJT` wisselt naar V2.
- De doorschijnende verdikking met dwarskapjes in Play-fase 2/3 heet nu de
  **tijdelijke LEX-ruimte-indicator**. Zij toont de spanne van geplande plaatsen,
  is geen OGN-element en verplaatst niets.
- De regressietest onderscheidt planning en zichtbare beweging en controleert
  de exacte MAN-bronhoogte.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`, `LEX_MOVEMENT_RULES.md` en
`projectie-master-spec.md`.

## Source build 20260803.12 — harde no-show voor directe methode-Config

- Bij Config vanuit een actieve Greedy-Grow- of Random-modus is nu ook de
  toepassings-/contextbalk volledig no-show.
- Zichtbaar blijven uitsluitend **Terug naar Main**, de eigen bewerkbare
  methodevelden met hun inklapbare uitleg en de compacte Config-save-acties.
- Algemeen, Language Tree en de andere directe methode worden in dit scherm
  niet getoond. Een andere context wordt eerst in Main gekozen.
- De no-show geldt functioneel via het `hidden`-attribuut, semantisch voor
  hulptechnologie en als CSS-veiligheidsregel. De regressiecontrole bewaakt
  beide lagen.
- Dit corrigeert source build 20260802.11, waarin de velden al geïsoleerd waren
  maar de nieuwe toepassingsbalk nog zichtbaar bleef.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

## Source build 20260802.11 — toepassings-Config en Onzuiver uniform v0.1

- Config heeft een vaste eerste laag: **Algemeen**, **Calculated → Language
  Tree** en **Direct → Greedy Grow / Random**. Per context zijn niet-relevante
  instellingen no-show; de toepassingsbalk blijft beschikbaar om te wisselen.
- Ieder zichtbaar Direct-, Greedy- en Random-veld heeft een compacte,
  inklapbare uitleg. `CONFIG_UI_EXPLANATION_STANDARD.md` maakt dit een vaste
  projectoverstijgende bronregel.
- **Uniform v1.0** blijft bytegedragsmatig ongewijzigd en is de standaard.
  **Onzuiver uniform v0.1 · hit-herhaling** is functioneel toegevoegd: per
  vrije ascoördinaat 80% uniform plus 20% herhaalgewicht uit uitsluitend
  voltooide eerdere rondes. Ronde 1 is uniform.
- Random Config bevat nu expliciet model, gridgrootte, vaste kolommen/rijen en
  snelheid. Vaste maten zijn minimaal het aantal knopen; snelheid gebruikt de
  bestaande gedeelde Play-klok en beïnvloedt de plaatsingsreeks niet.
- Seed is begrensd op 1 t/m 4.294.967.295. `20260802` wordt in Config en Help
  uitgelegd als datumseed; een groter getal geeft niet meer toeval of snelheid.
- De voorspellingen voor v0.2 (instelbare herhaalsterkte) en v0.3 (instelbaar
  geheugenvenster) zijn vastgelegd, maar blijven no-show totdat zij volledig
  functioneel en getest zijn.
- Engine-, statische en browsercontroles bewaken reproduceerbaarheid, de harde
  unieke rij-/kolomregel, v0.1-ascontrast, contextisolatie en mobiele uitleg.

Normatief: `DIRECT_PLACEMENT_CONFIG.md` en
`CONFIG_UI_EXPLANATION_STANDARD.md`.

## Source build 20260802.10 — cumulatieve projectie-hits per Random-ronde

- WEST en SOUTH zijn nu echte hitassen: gebruikte rijen projecteren naar
  WEST-spots en gebruikte kolommen naar SOUTH-spots.
- Een ronde draagt pas bij nadat haar laatste knoop is geschreven. Een
  herhaalde hit verhoogt de telling van dezelfde spot en maakt die donkerder,
  groter en zwaarder omlijnd.
- Reset wist de cumulatieve hits. Previous verwijdert een ronde uit het
  asbeeld zodra die ronde door terugstappen niet meer volledig is.
- De vorige voorafberekende asverdeling is verwijderd. Alleen reeds voltooide
  rondes worden deterministisch gereconstrueerd; toekomstige rondes worden
  niet gegenereerd of getekend.
- De documentatie geeft de voorspelling voor uniforme Random: verwachte
  hitkans `(N - 1) / (aslijnen - 1)` per niet-centrale asplek en dus op termijn
  een vrijwel egaal beeld.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

## Source build 20260802.9 — Random gebruikt standaard de beschikbare ruimte

- Random Config heeft één extra eigen veld: **Maximale afmetingen**.
- De toegevoegde standaardcombinatie is **Ergens in beschikbare ruimte** met
  **Interface · beschikbare ruimte**. Bij Reset wordt een vaste rechthoek met
  de actuele interfaceverhouding en voldoende unieke rijen en kolommen
  afgeleid.
- Iedere Random-stap kiest rechtstreeks uit alle nog vrije
  rij-kolomcombinaties in die rechthoek; er is voor deze standaard geen
  kunstmatig compacte groeizone.
- Compact, Gebalanceerd, Ruim en **Inhoud · groeiend veld** blijven bestaande
  alternatieven. Eerder opgeslagen keuzes worden niet geforceerd omgezet en
  de optielijsten blijven uitbreidbaar.
- Engine-, Config- en browsercontroles bewaken de vaste rechthoek, de zes
  eigen velden, de standaardwaarden en de harde unieke rij-/kolomregel.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

## Source build 20260802.8 — minimale methode-Config

- Greedy Grow en Random openen nu als kale taakschermen.
- De viewerwerkbalk, run-/voorbeeldstatus, feedbackblokken, het canvas,
  algemene Configuitleg en de grote save-kaart zijn daar verborgen.
- Zichtbaar blijven uitsluitend **Terug naar Main**, de eigen bewerkbare
  methodevelden en twee compacte knoppen voor bewaren en herstellen.
- De Configwaarden en opslagsemantiek blijven gelijk; alleen de niet-relevante
  schil is verwijderd.
- De browsercontrole bewaakt ook dat werkbalk, status, Play-balk, save-uitleg
  en savekop werkelijk niet zichtbaar zijn.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

## Source build 20260802.7 — Random-config en iteratiebediening

- Random Config bevat uitsluitend de vijf eigen bewerkbare velden: Seed,
  Resetbeleid, Spreiding, Hoe vaak en Impact op west- en zuidas.
- De berekende impactregel is uit Config verwijderd. Formules, betekenis en
  voorbeelden staan voortaan in Help en `DIRECT_PLACEMENT_CONFIG.md`.
- **Hoe vaak** bestuurt nu ook de actieve uitvoering. Play loopt knoop voor
  knoop door alle ingestelde iteraties; Next en Previous werken over de
  rungrens heen en Reset begint opnieuw bij iteratie 1 volgens het seedbeleid.
- Main toont `iteratie n/totaal · knoop n/totaal`. De actieve runs en het
  afgeleide asbeeld gebruiken dezelfde reproduceerbare seedreeks.
- De knopstatus houdt rekening met de iteratieset: Next blijft na een complete
  tussenrun beschikbaar en Previous blijft bij de start van een latere run
  beschikbaar.
- De automatische Configcontrole bewaakt de exacte vijf velden en verbiedt
  berekende uitvoer in het paneel. De volledige bediening is bovendien in een
  echte browser over drie iteraties gecontroleerd.

Normatief: `DIRECT_PLACEMENT_CONFIG.md`.

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
rc.45-carrousel blijft byte- en hashgecontroleerd; source build 20260802.7
wijzigt wel de viewerinterface, geïsoleerde directe Config en het
lijnrendercontract zoals hierboven beschreven.
