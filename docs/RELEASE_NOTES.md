## v2.0.0-rc.45 — OGN-kern vóór toepassingen

- Status: op 2 augustus 2026 handmatig goedgekeurde release candidate.
- Source build 20260802.2 integreert Language Tree als prominente berekende
  methode en Greedy Grow/Random als directe OGN-illustraties in hetzelfde
  hoofdmenu. Random gebruikt een afzonderlijke seedbare engine.
- `Config → Beeld → Lijnbeeld` regelt rasterkleur en raster-, projectie- en
  boxlijnzwaarte; LEX, SYNT en LOG hebben afzonderlijke kleuren voor as, lijn
  en box.
- `.gitattributes` plus `tools/normalize_text_files.py` voorkomen terugkerende
  LF/CRLF-drift en verwijderen extra lege EOF-regels vóór het stagen.
- De algemene OGN-uitleg begint nu bij vrije plaatsing op een open grid:
  iedere knoop bezit één horizontale en één verticale gridlijn en wordt één
  voor één op een vrije positie geschreven.
- Ruleset en zoekstrategie zijn afzonderlijke verantwoordelijkheden: de
  ruleset bepaalt geldigheid; de zoekstrategie bepaalt de kandidaatvolgorde
  voor directe plaatsing.
- Greedy Grow begint bij het centrale gridpunt en schrijft dots direct één
  voor één. De geaccepteerde compacte vierarmige volgorde reproduceert de
  bewaarde 12/31/96-demo's exact. `greedy-grow.html` maakt de directe stappen
  en experimentele zoekvolgorden controleerbaar; wereldwijde optimaliteit wordt
  niet geclaimd.
- De vaste volgorde is OGN Free Placement → OGN Projection → OGN Calculated
  Placement.
- Two-Pass Language Tree staat pas in de derde laag als één gespecialiseerde
  toepassing. LEX, SYNT en LOG zijn benoemde projecties binnen die
  taaltoepassing en definiëren OGN niet.
- Nieuwe normatieve documentatie:
  `OGN_CORE_PLACEMENT_ARCHITECTURE.md`.
- README, LEESMIJ, ingebouwde uitleg en platformteksten zijn kern-eerst
  herschreven.
- Vier nieuwe README-SVG's verduidelijken het vrije grid, sequentieel
  schrijven, verschillende zoekvolgorden en de drie lagen.
- De publicatiecarrousel bevat zeven nieuwe 1080 × 1080-slides met dezelfde
  kern-eerst-volgorde en nieuwe alt-teksten. Slide 5 wordt rechtstreeks uit de
  geaccepteerde Greedy-engine afgeleid.
- De herziene slide 4 projecteert knopen naar de benoemde assen WEST, SOUTH en
  EAST. Slide 5 noemt alleen het directe voorbeeld Greedy Grow; slide 6 noemt
  alleen het berekende voorbeeld Language Tree en toont het laatste stadium
  van `HOND BIJT MAN` met de woorden op de westelijke LEX-as. Beide voorbeelden
  verwijzen zichtbaar naar `github.com/kruin/graphlite`.
- `RC45_OGN_CORE_EXPLANATION_TEST.md` bevat de handmatige inhoudelijke en
  visuele akkoordlijst.
- `SOURCE_BUILD.txt` laat de lokale starter ook oudere bronpakketten met
  hetzelfde rc.45-versienummer herkennen en blokkeren. Daardoor wijst een
  oude, nog draaiende server niet meer ongemerkt naar een bron zonder
  `greedy-grow.html`.
- Taalboom-graphdata en OPN-opslag blijven ongewijzigd. De latere source build
  wijzigt wel hoofdmenu, Config-weergave en lijnrendering; de geaccepteerde
  carrousel en Greedy-engine blijven hashgecontroleerd ongewijzigd.

## v2.0.0-rc.44 — Direct plaatsbare publicatiecarrousel

- Status: nieuwe release candidate voor handmatige controle; de goedgekeurde
  rc.41-bron blijft ongewijzigd.
- De projectzip bevat zeven genummerde, direct uploadbare PNG-slides van exact
  1080 × 1080 pixels.
- De slides leggen achtereenvolgens het traditionele boomprobleem, de
  scheiding van structuur en woordvolgorde, LEX/SYNT/LOG, OGN Basis,
  Voorconfig/Toepassingen en projectconfig uit.
- `publicatie-carrousel/index.html` is een zelfstandige, bewerkbare HTML-bron
  zonder externe fonts of scripts.
- `tools/export_publication_carousel.js` exporteert de complete set opnieuw
  met Chromium/Playwright.
- `PUBLICATIE_README.md` bevat uploadvolgorde, alt-tekst per slide, een
  Reddit-titel en posttekst, communitybeperking en aanvullende platformcopy.
- `tools/check_publication_carousel.py` controleert bronmarkeringen,
  bestandsnamen, aantal, PNG-header en afmetingen.
- `RC44_PUBLICATION_CAROUSEL_TEST.md` legt de handmatige visuele en
  inhoudelijke akkoordpunten vast.
- Viewer-, graph-, Config- en opslaggedrag zijn niet gewijzigd; de
  rc.43-functionaliteit blijft geërfd.


## v2.0.0-rc.43 — LEESMIJ-items en projectconfig

- Status: nieuwe release candidate voor handmatige controle; de goedgekeurde
  rc.41-bron blijft ongewijzigd.
- `Config → LEESMIJ-items` bewerkt per onderwerp `Tonen: ja/nee`,
  navigatietitels NL/EN, beperkte veilige HTML-inhoud en de eigen carousel.
- `Tonen: nee` verbergt het item zonder het uit de DOM of Config te
  verwijderen. Scripts, formulieren, styles, frames, event-attributen en
  onveilige linkschema's worden uit aangepaste inhoud verwijderd.
- `Config → Bestanden & export` voegt lokale PNG-, JPEG-, WebP- en
  GIF-bestanden via een vertrouwde route als ingesloten carousel-slide toe.
  De viewer begrenst één beeld op 1,25 MB en bewaakt ook de totale payload.
- De gezamenlijke Config-savebalk staat boven ieder Config-onderdeel en
  bewaart tekst, zichtbaarheid en slides in dezelfde snapshot.
- Iedere projectzip bevat `config/default-config.json` én
  `config/user-config.json`. De ingeschakelde user-config overschrijft de
  standaard per instelling, maar vervangt het standaardbestand niet.
- Via `start_local_viewer.bat` schrijft `Schrijf huidige Config naar project`
  uitsluitend naar het allowlistdoel `config/user-config.json`. Op een gewone
  webserver is `Download user-config` de fallback.
- De vaste voorrang is code-defaults → default-config → user-config →
  lokaal bewaarde browser-Config.
- Iedere projectzip bevat `PUBLICATIE_README.md` met kopieerbare teksten voor
  LinkedIn, Reddit, Facebook, YouTube, Bluesky, Mastodon, X en GitHub.
- Nieuwe statische en browsergebaseerde controles bewaken de itemeditor,
  bestandsinvoer, savebalk, configlagen, overschrijving en lokale schrijfroute.
- De in rc.42 gereserveerde toepassingen Vraagzin, Nadruk en Onaffe zin
  blijven zichtbaar maar niet actief.

## v2.0.0-rc.42 — Gereserveerde toepassingen en LEESMIJ-carousels

- Config → Toepassingen reserveert zichtbaar maar niet-activeerbaar:
  **Vraagzin**, **Nadruk** (`juist díe trui`) en **Onaffe zin**.
- De reserveringen staan buiten de actieve featurecatalogus en voegen geen
  state, voorbeelden, inserties, documentatie, opslag, exportvelden,
  layout-demand of rendering toe.
- Statische en runtimecontroles bewaken dat de drie inputs uitgeschakeld en
  buiten OPN `metadata.extras` blijven.
- Config bevat een bewerkbare carousel per LEESMIJ-item, met add/remove,
  vorige/volgende, beeldpad, breed/smal, alt-tekst en onderschrift in NL/EN.
- Carouselwijzigingen krijgen een live voorvertoning, verschijnen direct in
  LEESMIJ en worden via de bestaande Config-save lokaal bewaard.
- Herstel verwijdert de lokale overschrijving; onveilige beeldschema's worden
  niet gerenderd.
- Onderschriftvelden zijn compact en graph-sneltoetsen blijven buiten
  Config/LEESMIJ en invoervelden.
- Mobiele Main-bediening en de lokale viewporttestknop dekken Config/LEESMIJ
  niet meer af.

## v2.0.0-rc.41 — Recursief gemeten boxen en volledige projecties

- Status: op 28 juli 2026 handmatig door de gebruiker goedgekeurd. De
  vastgelegde technische afbakening van rc.41 blijft van kracht.
- Publicatie wordt niet meer geblokkeerd door een lokaal gedownloade
  `*_full_source (1).zip`. Full-source-zipkopieën zijn release-artefacten en
  worden consequent uitgesloten van manifest, GitHub Pages en nieuwe bronzip.
- De reset-URL na een geslaagde push wordt nu in een afzonderlijke
  `:open_reset_after_push`-subroutine opgebouwd. Daardoor krijgt `start` geen
  lege URL meer en opent Verkenner niet onbedoeld op `C:\git\graphlite`.
- De BAT kiest alleen nog Python en controleert of de ZIP volledig is
  uitgepakt. `start_local_viewer.py` regelt serverdetectie, starten, wachten,
  versiecontrole en browseropening zonder complexe CMD-probelogica.
- `tools/check_local_start.py` toetst automatisch bestaande/nieuwe server,
  juiste/verkeerde versie, gesloten poort en de enige starter
  `start_local_viewer.bat`.
- Subtree-boxen worden bottom-up gemeten uit nodevormen, labels, child-boxen
  en caption.
- Kleine unary boxen, waaronder `NP → HOND`, gebruiken alleen de werkelijk
  benodigde breedte en hoogte.
- De LEX-Wissellanes en de vrije goot vóór de boom zijn compacter.
- LEX reserveert rechts alleen de werkelijk actieve slots en Wissellanes.
- Syntax en Functional delen één oostas op hun gezamenlijke structurele
  grid-envelop. Dit is niet de gemeten rechterrand van iedere subtree.
- Handheld MAX toont volledige LEX-inhoud én volledige Syntax/Functional-
  regelboxen in portret, landschap en forced desktop.
- De mobiele README bewaart bij resize de zichtbare paneelmaat; lijst,
  tekstpaneel en sleepgreep werken in portret en landschap.
- Toepassingen declareren een abstracte layout-demand; Bijwoorden levert geen
  eigen pixelcoördinaten.
- Nieuwe architectuurdocumentatie:
  `RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.
- De documentatie onderscheidt nu expliciet structurele gridplaatsing,
  recursieve visuele boxmeting, plaatsing van assen/viewport en rendering.
  De boxmeting is nog geen algemene collision- of repacking-solver.
- `RC41_RECURSIVE_LAYOUT_TEST.md` bevat de handmatige akkoordlijst voor boxen,
  assen, mobiel beeld, voorconfig, toepassingen en README.
- Nieuwe echte Chromium-controle:
  `tools/check_recursive_box_fit_runtime.js`.

## v2.0.0-rc.40 — Volledige landscape-compositie

- Mobiel landschap gebruikt een werkelijk lagere, bredere MAX-layout.
- Het menu staat in twee compacte rijen; menu, graph en Play hebben ieder een
  eigen verticale zone.
- De oude cover-zoom is verwijderd: rastertop en de volledige LEX-, SYNT- en
  LOG-as blijven nu tegelijk zichtbaar.
- De werkelijke SVG-rechthoek bepaalt aspectratio en overlaycoördinaten.
- Echte mobiele auto-detectie, lokale desktopsimulatie en geforceerde
  Desktop-interface gebruiken dezelfde landschapregels.
- Nieuwe echte Chromium-controle:
  `tools/check_landscape_composition_runtime.js`.

## v2.0.0-rc.39 — Mobiele testweergave blijft staan

- Op een groot scherm blijft `Mobiel staand` na de MAX-render begrensd tot
  390 × 844; `Mobiel liggend` blijft 844 × 390.
- De latere MAX-regels verbreden het gesimuleerde telefoonframe niet meer
  opnieuw tot `100vw`.
- De lokale schakelaar gebruikt de actuele viewerversie voor `ogv` en schrijft
  niet langer de oude waarde `v2.0.0-rc.13`.
- Nieuwe echte Chromium-controle:
  `tools/check_viewport_switch_runtime.js`.

## v2.0.0-rc.38 — Mobiele vulling, README en rastergrenzen

- README-items zijn op mobiel weer direct zichtbaar; de onderwerpenlijst klapt
  niet langer tot 0 px in.
- De scheidingsbalk vergroot/verkleint de lijst en de geselecteerde tekst weer
  in portret en landschap.
- Een echte telefoon wordt ook in landschap herkend.
- Mobiele MAX gebruikt het asgebied als stabiele focus en blijft actief wanneer
  op de telefoon de Desktop-interface wordt geforceerd.
- Het raster begint op LEX, eindigt op SYNT en stopt onderaan op LOG.
- Nieuwe statische en echte Chromium-controles:
  `tools/check_mobile_layout_rc38.py` en
  `tools/check_mobile_layout_runtime.js`.

## v2.0.0-rc.37 — Voorconfig vóór toepassingen

- Config opent op `Voorconfig`; `Toepassingen` volgt als tweede stap.
- Insertie kan afzonderlijk aan of uit op LEX, SYNT en LOG.
- Een actieve insertie-as levert alleen infrastructuur en maakt zonder
  toepassing geen taalinhoud.
- Bijwoorden vereist de combinatie LEX + LOG en blijft tot die tijd
  geblokkeerd.
- LEX of LOG uitzetten schakelt Bijwoorden automatisch uit en wist de
  bijbehorende staat.
- SYNT is onafhankelijk voorbereid voor een volgende toepassing.
- OPN, Legacy JSON en Config-snapshots bewaren de asgebonden voorconfig.
- Import meldt ontbrekende insertie-assen voordat toepassingsdata wordt
  geladen.
- Nieuwe documentatie: `PRECONFIG_ARCHITECTURE.md`; nieuwe test:
  `RC37_PRECONFIG_TEST.md`.
- De automatische README-indeling gebruikt weer de bestaande viewportfunctie;
  de oude verwijzing naar `isActualCompactScreen()` blokkeert de viewer niet
  meer bij het starten.

## v2.0.0-rc.36 — OGN Basis en schakelbare extra’s

- `OGN Basis` is het standaardprofiel en bevat de gewone boom, raster,
  LEX/SYNT/LOG met S/O/V-majors en basisvoorbeelden.
- Config opent op `Basis & extra’s`.
- `Bijwoorden` is de eerste extra en staat standaard uit.
- Uitgeschakeld betekent dat bijwoordvoorbeelden, LOG-minors, directe
  LEX-inserties, gebruiksprofielen, bediening, featuredocumentatie en
  featurevelden in export ontbreken.
- Voorbeelden-, lexicon- en structuureditors ondersteunen `profile=base`.
- OPN legt het profiel en de actieve extra’s expliciet vast en blokkeert een
  feature-import zolang de benodigde extra niet actief is.
- Nieuwe controle: `tools/check_feature_profiles.py`.

## v2.0.0-rc.29 — LinkedIn-video met echte 30 fps

- De aangeleverde rc.24-WebM bleek slechts 16 frames over circa 11,8 seconden
  te bevatten: ongeveer 2,6 fps en een bitrate onder 192 kbps.
- LinkedIn noemt WebM als ondersteund, maar vereist daarnaast 10–60 fps en
  minimaal 192 kbps. De oude uitvoer viel dus buiten de videovoorwaarden.
- De recorder probeert nu eerst MP4/H.264 en valt alleen terug op WebM wanneer
  de browser geen MP4-recorder aanbiedt.
- Een nieuwe canvas-framepomp vraagt tijdens de hele opname actief 30 frames
  per seconde op, ook wanneer een Play-stap kort stilstaat.
- Het videobeeld is 1200 × 628: vrijwel dezelfde LinkedIn-verhouding, maar met
  een even hoogte die geschikt is voor H.264/YUV420.
- De zichtbare knop heet voortaan `Play-video`.
- Nieuwe controle: `tools/check_linkedin_video_export.py`; deze kan ook een
  concreet videobestand met `ffprobe` toetsen.

## v2.0.0-rc.25 — ZIP-naam volgt automatisch de mapnaam

- Nieuw: `maak-volledige-zip.bat` voor Windows.
- De BAT leest zijn eigen projectmapnaam uit. Na het handmatig hernoemen van
  bijvoorbeeld `...rc.24` naar `...rc.25` wordt de uitvoer automatisch
  `...rc.25_full_source.zip`.
- De ZIP komt naast de projectmap te staan en bevat die projectmap als
  bovenste map.
- Een bestaande ZIP met dezelfde naam wordt pas door de volledig opgebouwde
  nieuwe ZIP vervangen. De BAT maakt zelf nooit een naam met `(1)`.
- `publish_checked.bat` gebruikt eveneens de actuele projectmapnaam en bevat
  geen hardgecodeerde release-ZIP meer.
- Nieuwe controle: `tools/check_release_zip_batch.py`.

## v2.0.0-rc.24 — Opslaan en exporteren direct zichtbaar

- Config opent voortaan op `Opslaan & exporteren`, dat ook als eerste tab
  staat.
- De prominente eerste kaart bevat direct `LinkedIn-PNG`, `Play als WebM` en
  `Graph als SVG`, in die volgorde.
- Binnen hetzelfde tabblad volgen OPN, Config bewaren/herstellen en pas daarna
  het beheer van voorbeeldzinnen.
- `Beeld`, `LOG & LEX` en `Geavanceerd` blijven afzonderlijke tabbladen; de
  MAX-instellingen zijn dus nog steeds onder `Beeld` beschikbaar.
- De Nederlandse en Engelse interface en documentatie gebruiken overal het
  nieuwe pad `Config → Opslaan & exporteren` / `Config → Save & export`.

## v2.0.0-rc.23 — Play loopt ook exact achteruit

- De ontgrendeling van de volledige eindlaag geldt alleen nog op precies de
  laatste Play-stap.
- Eén klik op `←`/min vanaf het eindresultaat verwijdert daardoor onmiddellijk
  de laatste projectielaag; zij blijft niet meer over de eerdere fasen staan.
- Verdere min-stappen keren de opbouw exact om:
  eindprojecties → LEX-Wissels → LEX-inhoud → LEX-ruimte → LOG → boom.
- De correctie geldt voor de hoofdknoppen, Config, mobiel en de
  toetsenbordstap, omdat alle routes dezelfde `setGrowthStep()` gebruiken.
- Nieuwe regressiecontrole: `tools/check_play_reverse.py`.
- De DOM-renderproef doorloopt de volledige Play eerst vooruit en daarna
  achteruit en controleert het verdwijnen van SYNT, LEX en LOG per fase.

## v2.0.0-rc.22 — vrije LEX-goot en social-export

- De westelijke LEX-as wordt niet meer met een vaste minimum-x naar de boom
  teruggeduwd. De volledige zichtbare LEX-laag reserveert nu een eigen strook
  plus 48 SVG-eenheden tussenruimte vóór de buitenste S/CLAUSE-box.
- De geometrische rendercontrole bevestigt deze goot voor zowel Syntax als Functional,
  ook bij de lange zin met `MISSCHIEN WEL` en `VAAK`.
- De Bijwoord-dropdown bevat 25 voorbeelden plus `Geen bijwoord`.
  `MISSCHIEN WEL`, `AF EN TOE`, `OP DIT MOMENT` en
  `MET VEEL AANDACHT` zijn toegevoegd als beperkte meerwoordige eenheden.
  Elke groep blijft voorlopig één LOG-minor.
- `Config → Bestanden → Graph publiceren` exporteert een zelfstandige SVG,
  een LinkedIn-PNG van 1200 × 627 of een WebM-opname van de volledige Play.
- De Play-opname gebruikt alle named projections, 30 fps en een vast sociaal
  beeldkader; na de opname wordt de eerdere viewerstaat hersteld.
- Nieuwe documentatie:
  `docs/TALIGE_UITBREIDINGEN.md` en `docs/SOCIAL_EXPORT.md`.
- Nieuwe regressiecontrole:
  `tools/check_social_and_linguistic_export.py`.

## v2.0.0-rc.21 — rechte LOG-projecties en één LEX-verplaatsing

- LOG-majors projecteren rechtstreeks verticaal vanuit hun bron-x en worden
  niet meer naar het midden getrokken. Minors staan op een compacte tweede
  labelrij.
- LOG en eventuele topic-/V2-regels bepalen samen eerst één einddoel. Ieder
  bronwoord toont daarna hoogstens één LEX-pijl en één brontrace.
- `HOND BIJT MAN` heeft precies drie zichtbare verplaatsingen. De langere zin
  met `MISSCHIEN WEL` en `VAAK` heeft vier verplaatsingen voor haar vier
  boombronnen, zonder extra neerwaartse tussensprongen.
- Een gevuld TOPIC- of V2-slot toont niet langer ook `TOPIC/XP` of
  `vrij slot`. Compacte genummerde trajectlabels voorkomen onderlinge
  overschrijving.
- De bijwoordkeuze heeft ook bij `file://` een ingebouwde lijst met
  `Geen bijwoord` plus 21 voorbeelden.
- De actieve zin staat boven de graph, boven de vrijgehouden strook voor een
  mogelijke noord-as.
- De README-intro toont voorlopig alleen het eerste beeld; de generieke
  carrouselbediening blijft verborgen tot latere specificatiebeelden bestaan.
- Nieuwe regressiecontrole: `tools/check_projection_cleanup.py`.

## v2.0.0-rc.20 — Config-tabbladen en zichtbare menulagen

- Config is verdeeld in `Beeld`, `LOG & LEX`, `Bestanden` en `Geavanceerd`.
- `Boomruimte = MAX` en `Venstervulling = MAX` staan direct bovenaan in
  `Beeld`, met een korte uitleg van MAX.
- `Hoofdvenster` heet voortaan `Venstervulling`: dit is de benutting van het
  beschikbare appvenster, geen apart venster.
- De dropdowns `Zin`, `Bijwoord`, `Syntax / Functional` en `Projecties` staan boven de
  vaste Play-balk en boven latere topmenu-items; hun inhoud wordt niet meer
  visueel afgedekt.
- Play-fase `2/3 ruimte` reserveert intern dezelfde LOG-afgeleide LEX-ruimte,
  maar toont niet langer drie herhaalde vakken `vrije LEX-rij`. Eén smalle
  reserveringsband markeert de volledige ruimte.
- Nieuwe regressiecontrole:
  `tools/check_config_tabs_and_menus.py`.

## v2.0.0-rc.19 — leesbare desktopweergave op MAX

- `Boomruimte` staat standaard op `MAX`: lage, brede boom en SVG-fontschaal
  `1.70`.
- `Hoofdvenster` staat standaard op `MAX`: het werkvlak gebruikt de volledige
  beschikbare desktopbreedte en -hoogte.
- Het grote onzichtbare stabiliteitskader telt niet langer mee bij deze fit;
  alleen de werkelijk getekende boom en projecties bepalen het zichtvenster.
- De MAX-kadrering blijft tijdens de gefaseerde Play-reeks stabiel.
- Oudere lokaal bewaarde auto/window-defaults worden één keer naar MAX
  gemigreerd.
- Ook de acht zichtbare desktop-topmenu-items hebben een leesbare
  standaardlettergrootte.

## v2.0.0-rc.18 — horizontale LEX-projectie vóór plaatsing

- Een lexicale bron projecteert weer exact horizontaal naar LEX.
- LOG levert een doelrij, maar vervangt de bronhoogte niet.
- Bronanker → LOG-doel en LOG-doel → V2 worden afzonderlijke Wissels langs
  de LEX-as, elk met een trace op de verlaten positie.
- Play-fase 3 toont eerst de horizontale bronprojecties.
- De nieuwe regressietest gebruikt `BIJT` als keten:
  bronhoogte → LOG-doelrij → V2-slot.

## v2.0.0-rc.17 — LOG-config stuurt de plaatsing

- `example-controls-layout=false` wordt nu werkelijk toegepast.
- `MISSCHIEN WEL` (`MODALITEIT`) staat tussen S en O.
- `VAAK` (`FREQUENTIE`) staat tussen O en V.
- Oude voorbeeldpositiehints en de lineaire woordvolgorde kunnen deze
  automatische plaatsing niet meer terugdraaien.
- De regressietest controleert ook de afgeleide LEX-rijen.

## v2.0.0-rc.16 — actieve carrousel en gefaseerde LOG → LEX-Play

- De introcarrousel bevat drie echte SVG-slides; pijlen, stapbolletjes en
  pijltoetsen zijn actief.
- De externe zoeklink opent in een afzonderlijk venster, zodat de app open
  blijft.
- Play toont na de centrale boomopbouw eerst LOG, reserveert daarna lege
  LOG-afgeleide LEX-rijen en plaatst pas vervolgens de lexicale inhoud.
- De Play-volgorde staat in `structure-config.html`.
- `README.md` is Engels; `LEESMIJ.md` is Nederlands.

## v2.0.0-rc.15 — Lees mij met eerste carrouselbeeld

- `Help` heet voortaan `Lees mij / README` en opent direct op de intro
  `Boom, gek`.
- Het rechter tekstpaneel is meteen zichtbaar; een algemene flexregel
  overschrijft de tweekolomsindeling niet langer.
- De carrouselruimte bevat één eigen SVG met drie traditionele
  voorbeeldbomen.
- Bij één beeld blijft de navigatie verborgen. Latere beelden per README-item
  kunnen als volgende slides worden toegevoegd; vanaf twee beelden verschijnt
  de navigatie automatisch.

## v2.0.0-rc.14 — LOG-slotafstand bepaalt LEX

- `S`, `O` en `V` staan als majors in vaste LOG-slots; ingevoegde bijwoorden
  zijn minors en voegen elk precies één afstandsslot toe.
- De neutrale plaats op de LEX-as wordt uit de LOG-volgorde afgeleid. De
  voorbeeldzin is voortaan validatie-invoer en geen layoutregel.
- Het LOG-interval is configureerbaar als `vóór S`, `S–O`, `O–V` of `na V`;
  `automatisch` gebruikt de categoriekoppeling uit de structuurconfiguratie.
- Viewer, configuratie-editors, voorbeelden en OPN-rondreis bewaren dezelfde
  LOG-informatie.
- `logische afstand` is binnen dit project de operationele term voor het
  aantal LOG-slots tussen twee majors; er wordt geen algemeen gevestigde
  taalkundige metriek mee geclaimd.

## v4551 — gecontroleerde bijwoordplaatsing

- Bestaande bijwoordregels gecontroleerd per woord en per categorie.
- Belangrijkste correctie: `host=S` betekent niet automatisch `fronted-v2`; scope en lineaire plaats zijn gescheiden in de nieuwe config.
- `niet` is scope-gevoelig en krijgt geen vaste V-default meer.
- Focuspartikels krijgen `FOCUS_TARGET` in plaats van vaste NP-default.
- Graadwoorden krijgen `AP|ADV-MOD` als target; zij zijn meestal geen zelfstandig LEX-slot.
- Nieuwe bestanden: `docs/LEX_ADVERB_PLACEMENT_RULES_CHECKED.md`, `samples/adverb_placement_rules_v4551.json`, `samples/adverb_word_rules_v4551.json`.



## v4548 - Bijwoorden boven hostbox, niet erin

- Corrigeert LEX-bijwoordslots die optisch in de hostbox vielen.
- Reserveert een extra gridrij zodat de insertie duidelijk boven `NP`, `VP`, `V-CLUSTER`, `V`, `PP` of `AP` staat.
- `V`-nabije plaatsing bij een perfectum gebruikt de hele `V-CLUSTER` als hoogteanker.

# v4548

- Literatuurcorrectie: initieel bijwoord in Nederlandse hoofdzinnen betekent V2/inversie, niet bijzinsvolgorde.
- Toegevoegd: `functional:fronted-v2` voor bijwoordelijke vooropplaatsing op LEX-slot 1.
- LEX-as: bij vooropplaatsing vult het bijwoord slot 1; de persoonsvorm blijft slot 2; het subject wordt niet ook naar slot 1 verplaatst.
- Correctie: bij `GISTEREN` + eenvoudige tegenwoordige tijd kiest de LEX-as de bekende OVT-vorm (`BIJT`→`BEET`, `BREIT`→`BREIDE`) in plaats van de foutieve combinatie `GISTEREN BIJT ...`.

# v4548

- Fix: LEX-bijwoordslot wordt nu op de LEX-as verticaal gekoppeld aan de gekozen hostbox (`S`, `NP`, `VP`, `V`, `PP`, `AP`).
- Oorzaak: `cloneLayout()` verloor `lexAdverbAxisSlots`, waardoor de LEX-as terugviel op de algemene S/root-positie.
- Extra: `shiftLayout()` verschuift bewaarde bijwoordslots mee; de losse LEX-view gebruikt een onzichtbare syntax-ankerkaart.

# v4541

- Bijwoorden staan als externe LEX-slots op de LEX-as.
- `boven S/NP/VP/V/PP/AP` betekent: LEX-slot op de LEX-as, verticaal net boven de gekozen hostbox.
- De gekozen hostbox/subboom schuift lager om ruimte te maken.
- Het bijwoord wordt niet op de syntaxboom getekend en is geen projectie vanuit de basisboom.
- Notatie: `LEX-ADV[..., axis=LEX, source=external, host=...]`.

---

# v4538

- Bijwoordplaatsing aangepast: bijwoorden worden niet langer tussen boxen of op losse tussenposities geplaatst.
- Nieuwe hostregel: bijwoordbox boven geldige syntactische categoriebox. Geldig: `S`, `NP`, `VP`, `V`, `PP`, `AP`.
- Oude LEX-tussenposities zijn vervangen door host-keuzes: boven geselecteerde box, boven S, boven NP, boven VP, boven V, boven PP, boven AP.
- Centrale boom blijft ongemuteerd; de bijwoordbox is een zichtbare plaatsingslaag.

---



## v4504 · Main-controls naast SYNTAX-as

- De Main-projectiebalk toont nu de volledige reeks: Assen, Bron, LEX, SYN en LOG.
- In landscape wordt de rechter vensterbalk naast de SYNTAX-as geplaatst met een kleine tussenruimte.
- `portrait-test.html` toegevoegd voor lokale desktop/laptop-tests met een portrait-venster.


## v4504 · strak passend raster rond boom + assen

- In het hoofdscherm volgt de SVG-viewBox nu exact de getekende boom plus projectie-assen.
- Het raster wordt dynamisch opnieuw opgebouwd binnen dezelfde fit-box; lege rastervelden rondom worden niet meer meegetekend.
- Hulplabels en het raster zelf tellen niet meer mee bij FIT.
- In Config blijft de ruimere aspect-fit beschikbaar voor beheer en vergelijking.

## v4504 · grid maximaal passend + ruimere topmenu-keuze

- Het gridvenster wordt nu gemaximeerd op de actuele fit-box van boom + assen; het schaalt niet groter dan nodig.
- De fitmarge is kleiner, zodat minder lege rasterruimte rond boom en assen overblijft.
- `Menu’s boven grid` staat niet meer op maximaal 2; alle vier benoemde menu’s kunnen worden gekozen.
- Genoteerd: een NOORD-as is mogelijk, maar nog niet gebruikt.


## v4504 · Menu’s boven grid als benoemde meerkeuze

- De oude instelling `Ruimte onder grid` is vervangen door een benoemde meerkeuze: `Menu’s boven grid`.
- De gebruiker kiest maximaal vier menu’s die boven het grid mogen staan.
- Beschikbare keuzes: Projectiekeuze, Voorbeeldzin, Play/Groei en Werkknoppen.
- Standaard staat geen enkel menu boven het grid; alle menu’s staan dan onder het grid.
- De tooltip en helptekst leggen per keuze uit waarom een taalkundige die boven het grid kan willen zetten.

# OpenGraph Lite Viewer v4504

## v4504 — benoemde menu's boven het grid

- Vervangt `Ruimte onder grid` door `Menu's boven grid`.
- User kiest maximaal vier benoemde menu's die boven het grid mogen staan.
- Opties: Projectiekeuze, Voorbeeldzin, Play/Groei en Werkknoppen.
- Niet gekozen menu's staan onder het grid.
- Max > 2 wordt geblokkeerd en toegelicht in de viewer.

# OpenGraph Lite Viewer v4504

## v4504 — mobile portrait grid-first

- Mobile portrait: grid/boomvenster staat standaard helemaal bovenaan; header, projectiebalk, zinmenu en toolbar staan niet meer boven het grid.
- Nieuwe config `portrait_menu_slots`: ruimte boven het grid voor 0, 1 of 2 toekomstige menuhoogtes; standaard 0.
- Gridvensterhoogte wordt in portrait afgeleid van de actuele viewBox/tekening, zodat het venster niet groter is dan nodig voor boom + assen.
- Config is beschikbaar in Projectie-instellingen en in het mobiele menu.

# Release notes v4457

## v4457 — mobile Play consistent boven

- Mobile portrait en mobile landscape tonen Groei/Play op dezelfde plek: de bovenbalk.
- De oude portrait-only mini-groeibalk boven de onderbalk is verborgen om dubbele bediening te vermijden.
- Onderbalk blijft beperkt tot voorbeeldzin-navigatie, FIT en Meer.


## v4457 — start-render en Play-fix

- Hersteld: ontbrekende `toggleGrowthPlayback()` veroorzaakte afgebroken init in v4453.
- Lokale viewer tekent de boom nu direct bij start.
- Play/Pauze werkt weer voor de groeipresentatie.

# Release notes

## v4430

- Standaardtakvolgorde is nu grammaticaal/normaal, niet auto-compact.
- Openingsboom `HOND BIJT MAN` begint met de standaardvertakking `S → NP VP`; de eerste child `NP` wordt links en boven geplaatst, daarna volgt `VP` rechts en lager.
- Binnen `VP` blijft de basis `VP → NP V`: object-positie boven/voor de V-basispositie; alleen de V/PV wisselt lokaal naar slot 2.
- `auto-compact`, `auto-align` en `flip` blijven beschikbaar als vergelijkingsopties, maar zijn niet meer de default.

## v4430 · basisprojectie vóór Wissel

- LEX-as toont eerst de horizontale basisprojectie vanaf de boom.
- Projectielijnen landen op de basispositie, niet op het surface-slot.
- Daarna worden lokale Wissels op de LEX-as toegepast.
- Een verplaatste knoop laat op de oude basispositie een trace achter.
- Het eindresultaat blijft de woordvolgorde van de voorbeeldzin.

# Release notes

## v4430 · LEX-resultaat is altijd de voorbeeldzin

- De gevulde LEX-slots worden nu uitsluitend gerenderd in de tokenvolgorde uit `examples-input.html`.
- Boomhoogtes of horizontale bronankers mogen de zichtbare woordvolgorde op de LEX-as niet meer veranderen.
- Wissels zijn verklarende lokale regels: ze vullen een oppervlakteslot en zetten de oude positie als trace in een aparte trace-zone.
- Projectielijnen landen op het gevulde LEX-slot; de LEX-as leest daardoor altijd exact als de voorbeeldzin.

# Release notes

## v4430 · basisboom blijft; voorbeeldzin wordt op de LEX-as gerealiseerd

- Auto per voorbeeldtype maakt geen surface-boom meer.
- De syntax blijft hiërarchisch: `S → NP VP`; in de basis `VP → NP V`.
- De LEX-as volgt de voorbeeldzin.
- Afwijkingen tussen basisboom en voorbeeldzin worden als lokale `Wissel` + trace op de LEX-as getekend.
- Hoofdzinnen tonen dus V2 als Wissel; bijzinnen met `omdat` kunnen zonder V2-Wissel blijven.

# Release notes

## v4430 · dynamische boomruimte + auto-fit

- Bomen in Assen, Bron en LOG krijgen een configureerbare weergave: `Boomruimte`.
- `auto` en `breed/lager` maken de HOR-afstand groter en de VER-afstand kleiner; daardoor past de boom beter in het venster zonder de onderliggende gridcoördinaten te wijzigen.
- `breed + groter font` verhoogt tegelijk de labelgrootte.
- `Venster: automatisch passend` berekent na elke render de echte SVG-bounding-box en zet de viewBox daarop.
- `FIT` voert dezelfde passende viewBox direct uit.


## v4430 · horizontale LEX-projecties

- Projectielijnen van centrale boom naar LEX blijven nu horizontaal: bronknoop → bronpositie op de LEX-as.
- Tokens worden niet meer eerst naar de oppervlaktevolgorde omhoog/omlaag geschoven.
- Wissel blijft lokaal op de LEX-as: vrij slot wordt gevuld, bronpositie blijft staan als trace.
- In `HOND BIJT MAN` blijft `HOND` dus op zijn horizontale bronplaats; alleen `BIJT` wisselt naar het V2/PV-slot.


---

# Release notes
## v4430 · lokale Wissel op de LEX-as

- Wissel wordt niet meer als verplaatsing vanuit de centrale boom naar de LEX-as getekend.
- De projectielijn uit de boom wijst naar het gevulde LEX-slot in de voorbeeldzinvolgorde.
- De oude basispositie verschijnt als `trace` op een lokale LEX-as-rij.
- Bij meerdere Wissels krijgen de traces eigen lokale rijen onder de oppervlakteslots.



## v4430 · LEX-as woordvolgorde + Wissel-correctie

- De gevulde LEX-posities volgen nu expliciet de tokenvolgorde uit `examples-input.html`.
- V2/Wissel verandert de zichtbare woordvolgorde niet meer op basis van bron-/layoutposities.
- `slot 1` en `slot 2` worden op de LEX-as gekoppeld aan de oppervlakteslots: eerste zinsdeel en V2/PV.
- Oude bronposities blijven zichtbaar als trace; in de assenweergave komen die trace-posities uit de centrale OPN-bron.

## v4430 · V2/Wissel

- Nederlandse V2 geïntegreerd als lokale LEX-plaatsingsregel.
- Extra vrij `slot 2 · V2/PV` toegevoegd naast `slot 1 · topicalisatie`.
- Hoofdzinnen tonen **Wissel**: persoonsvorm/predicaat naar slot 2.
- Oude basispositie wordt als trace getekend (`t[V]`, `t[pv]`).
- Bijzinnen met `OMDAT` blijven zonder V2-Wissel.
- Voorbeeld `TRUI BREIT VROUW` toegevoegd als topicalisatie-demo: `TRUI` blijft patiens/object, `VROUW` blijft agens/subject.
- LEX-as toont Wissel-pijlen en trace-posities.
- `structure-config.html` bevat nu `v2` en `trace` als LEX-slots.


## v4430

- Lexicon uitgebreid met thematische rollen (`agens`, `patiens`, enz.).
- Nouns krijgen naast syntactische rollen ook thematische mogelijkheden.
- Predicaten krijgen eenvoudige selectieframes: toegestane agens-lexemen en patiens-lexemen.
- De korte-uitingenbouwer in `lexicon-editor.html` filtert subject/object op plausibiliteit.
- `trui` is nu patiens/object, maar geen agens/subject.
- `breit` accepteert voorlopig `vrouw` als agens en `trui` als patiens.
- `examples-input.html` markeert tokens met `data-thematic-role`.
- De oude swap-knop is uit de hoofdviewer en gegenereerde uitingen verwijderd.

## v4430

- `lexicon-editor.html` toegevoegd.
- Lexemen kunnen worden toegevoegd, gekopieerd, verwijderd, gezocht/gefilterd en gevalideerd.
- Editor leest `structure-config.html` om geldige sources en LEX-slots aan te bieden.
- Export maakt opnieuw een compatibel `lexicon-config.html`.
- Viewer, voorbeeldeditor, lexicon-config, debug en docs linken naar de nieuwe lexicon-editor.
- `debug.html` controleert nu ook `lexicon-editor.html`.

## v4430

- Correctie groei/projectiewissel: LEX is geen groei-projectie en mag de opgeslagen groeistap niet naar 0 clampen.
- Terugwisselen van LEX naar Assen/Bron/LOG herstelt nu de laatst geldige groeistap; de boom blijft zichtbaar.
- `setProjection(...)` bewaart groeistatus expliciet en stopt alleen playback bij niet-ondersteunde projecties.

## v4407

- Groei-presentatie toegevoegd aan de viewer.
- Nieuwe controls in het projectiepaneel: `Groei`, stap-slider, `0`, vorige, `Play`, volgende.
- Groei werkt vanuit de vooraf berekende layout: de boom verschuift niet tijdens het afspelen.
- Bottom-up groeivolgorde: leaves → categorie/role-nodes en subtree-boxen → OPN-slot 1 → LEX-projectie en projectiepanelen.
- Stap-3/render blijft gescheiden van groei-presentatie: renderlaag bepaalt z-order; groei bepaalt alleen welke reeds berekende elementen zichtbaar zijn.
- Sneltoetsen: `g` toggelt groei, `n` volgende stap, `p` vorige stap.
- Docs bijgewerkt met groei/render-onderscheid.

## v4406

- Render-volgorde expliciet gemaakt.
- Subtree-boxen: eerst alle rects, daarna alle captions.
- Equal-size subtree-box tie-break vastgelegd: boven→beneden, links→rechts, daarna oorspronkelijke layoutvolgorde.
- Node-rendering in twee lagen: eerst shapes, daarna labels.
- Interne helper `renderWith` hernoemd naar `layoutWithChildOrder`, omdat die layoutvarianten berekent en niet rendert.
- Docs bijgewerkt met stap-3/render-volgorde.

## v4405

- Root/startdiagnose aangescherpt.
- `reset-cache.html` toegevoegd voor oude service workers/caches.
- `debug.html` controleert nu of `index.html` echt de viewer is.
- `docs/index.html` vervangen door `docs/docs-home.html`, zodat `/docs` niet per ongeluk de viewer-root overschrijft.
- `viewer.html` toegevoegd als fallback-entry.

## v4404/v4403

- Herstelbuilds voor startproblemen na v4402.
- `.nojekyll` toegevoegd voor GitHub Pages: statische deploy zonder Jekyll-build.
- `__pycache__` en `.pyc` uit de ZIP verwijderd.
- `.gitignore` toegevoegd voor lokale cachebestanden.
- `server_nocache.py` accepteert optioneel een poortargument en stuurt extra no-cache/nosniff headers.
- `start_local_viewer.bat` zet `PYTHONDONTWRITEBYTECODE=1`.
- Inline startdiagnose toegevoegd.

## v4402

- Flipdoel per vertakking toegevoegd: compact, align, normal, flip-all.
- Per-vertakking-config: top, VP/ARG-STRUCT, overig.

## v4401

- `docs/`-map toegevoegd als canonieke projectcontext.
- Docs-knop toegevoegd aan viewer.
- Documenten toegevoegd voor app-context, design decisions, layout, structure-config, lexicon/examples, current state, known issues, next steps en developer notes.

## v4400

- `Takvolgorde` toegevoegd.
- Flip werkt op alle vertakkingen.
- Default: `Layout order = left-first`, `Takvolgorde = normaal`.

## v4399

- Left/right-switch geldt voor syntax én functioneel.
- Menu-label naar `Layout order`.

## v4398

- Left/right-switch werkt in functionele layout-engine.

## v4397

- Lidwoorden/determinatoren verwijderd uit systeem en voorbeelden.

## v4396

- Functional-config gewijzigd naar `CLAUSE → PRED ARG-STRUCT`.
- `PRED` en `ARG-STRUCT` zijn zelfstandige subtree-boxes.

## v4395

- No-cache lokale server toegevoegd.
- Service-worker cleanup.

## v4394

- Perfectumregel toegevoegd met `pv` en `vdw`.
- Voorbeeld `HOND HEEFT MAN GEBETEN` toegevoegd.

## v4393

- Lexicale items verwijderd uit structure-config.
- Abstracte sources: `subject`, `object`, `predicate`.

## v4392

- Bescheiden lexicon toegevoegd.

## v4391

- Structure-editor bevat syntax-config en functional-config als eerste stap.

## v4389

- Voorbeeldzinnen-editor toegevoegd.

## v4388

- `examples-input.html` toegevoegd.
- Subject vet, object cursief.

## v4386

- OPN-slot 1 voor topicalisatie/vooropplaatsing.

## v4385

- LEX-slot 0 voor Comp/(om)dat boven S-box.

## v4384

- LEX-projectie horizontaal.

## v4383

- Cache-issue rond functionele structuur opgelost via geversioneerde JS/CSS.

## v4430

- LEX-as gecorrigeerd voor horizontale projectie: niet-gewisselde bronwoorden blijven op hun bronhoogte.
- Traces van gewisselde woorden staan op de oude/basispositie: de horizontale bronhoogte, niet op een te hoge lokale rij.
- De groeistap met lokale LEX-as gebruikt nu wel de centrale bronkaart, maar tekent nog steeds geen projectielijnen.

## v4430

- LEX-as gecorrigeerd voor horizontale projectie: niet-gewisselde bronwoorden blijven op hun bronhoogte.
- Traces van gewisselde woorden staan op de oude/basispositie: de horizontale bronhoogte, niet op een te hoge lokale rij.
- De groeistap met lokale LEX-as gebruikt de centrale bronkaart, maar tekent nog steeds geen projectielijnen.


## v4430

- Boomkeuze `auto-min`: per voorbeeldzin wordt de centrale syntaxboom in voorbeeldzinvolgorde opgebouwd, zodat de LEX-as zo weinig mogelijk lokale Wissels hoeft te tekenen.
- `structure-config` blijft beschikbaar als vergelijkingsstand voor de oudere basisboom.
- LEX-as behoudt strikt de volgorde uit `examples-input.html`.


## v4430

- LEX-verplaatsingen beperkt tot expliciete vrije slots: Comp-slot 0, topic-slot 1, V2/PV-slot 2.
- Geen automatische LEX-Wissels meer voor subject/object om een surface-rij te forceren.
- Niet-verplaatste knopen blijven op hun horizontale basisprojectie; alleen verplaatste knopen laten een trace achter.


## v4430

- LEX-regel verduidelijkt: een subject-initiale hoofdzin verplaatst het subject niet.
- Slot 1/topicalisatie wordt alleen getekend bij een expliciete TOPIC-Wissel.
- HOND in `HOND BIJT MAN` krijgt geen TOPIC-box, geen Wissel-pijl en geen trace; alleen BIJT wisselt naar V2.


## v4430
- LEX-asresultaat is weer strikt de voorbeeldzin.
- Subject-initial HOND is geen verplaatsing; alleen BIJT/V2 krijgt Wissel en trace.
- Traces staan in een aparte lokale trace-zone onder de voorbeeldzin.


## v4536

- LEX-basisprojectie in Assen wordt niet meer gecomprimeerd: basisposities en traces blijven horizontaal gelijk aan de boomknopen.
- Alleen de vrije slots 0/1/2 staan bovenaan als lokale LEX-slots.


## v4536 update

- `commit_and_push.bat` wordt vanaf deze versie standaard meegeleverd in de ZIP-root.
- LOG toont thematische rollen expliciet: `AGENS` voor subject/handelende deelnemer en `PATIENS` voor object/ondergaande deelnemer.
- De syntaxrollen blijven `subject` en `object`; de functionele projectie benoemt dezelfde lexicale bronnen thematisch.

## v4536

- Groei-presentatie verfijnd: lexicale leaves verschijnen niet meer tegelijk.
- Binnen dezelfde diepte/hoogte gebruikt Groei nu expliciete render-/presentatievolgorde: eerst bottom-up, bij gelijke hoogte boven-naar-beneden en daarna links-naar-rechts.
- Voor `HOND BIJT MAN` verschijnen `HOND`, `MAN` en `BIJT` dus in aparte tussenstappen voordat categorieknopen, OPN-slot en LEX-regels volgen.


## v4536 · stapsgewijze LEX-Wissels

- De boomgroei blijft deterministisch: binnen een groeilaag wordt gerenderd van boven naar beneden en daarna van links naar rechts.
- Flip/layout wijzigt de berekende posities; daardoor kan de groeivolgorde indirect veranderen, maar de renderregel blijft ruimtelijk: boven → beneden, links → rechts.
- In Assen verschijnt de LEX-as nu stapsgewijs: eerst de horizontale basisprojectie, daarna per stap één lokale Wissel met trace, daarna pas het volledige resultaat met projectiepanelen.
- Verplaatsingen blijven lokaal op de LEX-as; er komen geen verplaatsingslijnen vanuit de boom.

## v4536 · mobiele weergave

- Canvas staat op mobiel boven de bediening.
- Toolbar wordt horizontaal scrollbaar in plaats van hoog gestapeld.
- Introblok wordt op mobiel verborgen; status en zin blijven compact zichtbaar.
- SVG-canvas krijgt op mobiel een vaste brede werkbreedte met horizontale scroll, zodat de boom leesbaar blijft in plaats van te ver uit te zoomen.
- Auto-fit gebruikt op mobiel kleinere marge.
- Bij resize/orientatie wissel rendert de viewer opnieuw.


## v4536

- Layout op alle platforms stage-first gemaakt.
- Bovenaan: Projectie-window links, boom/canvas rechts.
- Toolbar, status, uitleg en bewerkpanelen volgen onder de stage.


## v4536 - beweeglijke boom/LEX-view

- Boom en LEX-as zijn niet meer vast in het canvas.
- Sleep in het SVG-canvas om de view te verplaatsen.
- Ctrl + muiswiel zoomt rond de cursor.
- Shift + muiswiel pant horizontaal.
- FIT herstelt de automatische view.

## v4536 · boom links, projectie rechts

- Boom/LEX-canvas staat nu links in de hoofd-stage.
- Projectie-instellingen staan rechts naast de boom.
- De vaste Groei-balk staat boven het canvas en volgt dezelfde linker kolom als het boomvenster.
- Projectietabs blijven vast zichtbaar boven de boom.


Aanvulling v4504: LEX vrije slots zijn plaatsbare insertiepunten op de LEX-as voor later materiaal uit andere LEX-assen/bomen en anafora. Boom vrije rijen blijven apart.


## v4504 desktop LEX-insertie zichtbaar

De rechter desktop-config toont nu dezelfde LEX-insertieconfig als mobiel: LEX vrije slots, LEX insertie-inhoud en takverlenging door insertie. De insertie blijft een aparte box op de LEX-as; de gekozen takken/boxgrenzen worden alleen layoutmatig verlengd.

## v4504 · rechterkolom en gridvenster

- Rechterkolom-config toegevoegd: auto/rest, breed, zeer breed, maximaal.
- Gridvenster wordt op boom + assen begrensd; de rest van de workspace gaat naar het rechter menu.
- Canvas-panning is uitgezet, omdat het venster zelf passend wordt gemaakt.


## v4504 · hoofdbeeld en config-scherm

Het hoofdbeeld is opnieuw ontworpen als grid-only view: boven het grid staan alleen het zinmenu en één knop **Config**. Alle andere instellingen zijn verplaatst naar een apart configuratiescherm met **Terug naar main**. Daardoor blijft de werkweergave schoon, terwijl projecties, Play/Groei, LEX-inserties, takverlenging, layout, export en documentatie in één config-scherm bereikbaar blijven.


### v4504 — Main-bediening in boomvenster

- Main behoudt een vaste topbalk met alleen Zin en Config.
- De ZUID-volgorde staat nu als zichtbare pijlbediening onder in het boomvenster.
- In portrait staat de Play-balk onder het grid met Reset direct ernaast; de Assen/LOG-balk sluit daaronder aan.
- In landscape staat Play verticaal rechts in het boomvenster, met Reset en Assen/LOG eronder.

## v4504 · Main-controls in het boomvenster

- Rechter vensterbalk blijft in het boomvenster en wordt rechts naast de SYNTAX-as gepositioneerd.
- Projectiereeks in Main is volledig: Assen, Bron, LEX, SYN en LOG.
- De nieuwe ZUID/SOV-bediening met pijlen vervangt de oude SVG-ZUID-badge visueel en wordt op dezelfde positie geplaatst.
- De oude ZUID-badge blijft alleen onzichtbaar als positioneringsanker bestaan.


## v4504 - Config topbar en documentatie

- Config heeft een vaste topbalk met Terug naar main; de instellingenpagina kan daaronder scrollen.
- Het oude blok “Redesign - boom eerst” is uit Config gehaald en verplaatst naar Help/documentatie.
- Help/documentatie maakt nu expliciet onderscheid tussen **boom eerst** als didactisch/notatieprincipe en **recursie-techniek** als bottom-up tekenmethode.
- Menu’s boven grid is weer zichtbaar in Config, inclusief **Hoofdvenster**, zodat hoofdvenster-fit en boomruimte boven Main kunnen verschijnen.


## v4504

OSV-! is marked as an impossible box alternative. The box approach can never produce OSV as a base layout; an explicit movement rule is required to render the LEX axis correctly. All other LOG-order trees and existing flip settings remain untouched.

## v4505 - OSV-! and LEX rendering

OSV-! is deliberately marked with an exclamation mark. The box approach can never produce OSV as a base alternative: VP still groups object and verb as a subtree. A pure box flip is therefore insufficient.

To render the visible LEX axis correctly, an explicit movement rule is always required. OSV-! is not a base layout or linguistic alternative; it is a warning/test label for an impossible box variant. The other orders and existing flips remain untouched.



## v4506 - LEX adverb insertion slots

Adverb placement is now documented as host-box placement. The base rule is no longer to reserve slots between visible LEX boxes: choose a valid syntactic host box (`S`, `NP`, `VP`, `V`, `PP`, `AP`) and render the adverb above it.

- Time: `GISTEREN`, `MORGEN` - usually `VP-BETWEEN`, optionally `S-LEFT` when fronted.
- Frequency: `VAAK`, `SOMS`, `ALTIJD` - `VP-BETWEEN`.
- Negation: `NIET` - separate `NEG`/`V-NEAR` slot.
- Manner: `SNEL`, `HARD`, `ZACHTJES` - `V-NEAR` or `VP-RIGHT`.
- Sentence adverb: `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS` - high `S/VP` or `S-LEFT`.
- Focus: `ALLEEN`, `OOK`, `ZELFS` - beside the focused phrase.
- Degree: `HEEL`, `ERG`, `ZEER` - internal to `AP/AdvP/NP`, not a general hostless adverb position.

The central tree is not rewritten. In this phase, adverbs belong to the LEX render layer or to phrase-internal slots.

See also: `docs/LEX_ADVERB_INSERT_SLOTS_EN.md`.

## v4536 - Config: zichtbare LEX-bijwoordinsert

- De Config-weergave is hersteld: de velden in `Dynamische boomweergave` overlappen niet meer.
- `LEX insertie` is apart en zichtbaar gemaakt als `Bijwoord / LEX-insert op LEX-as`.
- De bijwoordkeuze staat nu bij de concrete LEX-slotinstellingen:
  - aantal slots
  - slotpositie
  - bijwoord / inhoud
- Mobiel gebruikt dezelfde naamgeving.
- De Config-topbalk blijft sticky boven de scrollende instellingen.


## v4536 - Uitleg uit Config, naar Help/docs

- Het blok `Uitleg` wordt niet meer getoond in Config.
- Config blijft beperkt tot instellingen en beheer.
- Help bevat nu kaarten voor:
  - Boom eerst
  - Recursie-techniek in de boom
  - Bijwoordboxen boven syntaxboxen
  - Render-uitleg
- Documentatie toegevoegd:
  - `docs/RENDER_EXPLANATION.md`
  - `docs/RENDER_EXPLANATION_EN.md`
- Engelse Help-tekst is mee bijgewerkt.

## v4536 - Oude tijdsinsertingtest verwijderd

- De eerdere vaste tijdsinsertingtest is uit de UI, Config, Help en documentatie verwijderd.
- Standaard: `LEX-slots: 0` en insertinhoud `slot leeg`.
- De nieuwere bijwoordplaatsingen blijven intact: tijd, frequentie, negatie, wijze, zinsbijwoord, focus en graad.
- De structurele plaatsingsmechaniek blijft gelijk: hostbox boven S/NP/VP/V/PP/AP; alleen het oude concrete testwoord is verwijderd.

## v4536 - VSO-! and VOS-! labels

VSO and VOS are now marked in the same way as OSV: `VSO-!` and `VOS-!`. The label means that the box approach cannot produce this order as a base alternative. Correct LEX rendering requires an explicit movement rule. Existing trees and existing flip behaviour remain untouched.




- De editor kan afbeeldingen toevoegen, verwijderen, vervangen, dupliceren, de volgorde wijzigen en Nederlandse/Engelse toelichting aanpassen.
- Exportmogelijkheden:
  - `slides.json`
  - zelfstandige `index.html`
- Engelse knoppen/tooltips en Engelstalige toelichting zijn mee bijgewerkt.





## v4514



- The editor shows the current module path and selected write folder.
- The selected folder is validated: it must contain `editor.html` or `slides.json`.



- `Bewaar lokaal` bewaart nu een volledige editorstate, inclusief `tonen/niet tonen` per slide.
- `slides.json` schrijft per slide expliciet `visible: true` of `visible: false`.


- Bij heropenen wordt eerst de huidige v4526-opslag geladen. Oudere opslag wordt alleen als import gebruikt wanneer er nog geen v4526-opslag bestaat.
- `toon/niet tonen` wordt exact per slide opgeslagen. Een uitgevinkt vakje blijft uitgevinkt na `Bewaar lokaal`, sluiten en heropenen.
- Oude opslagkeys blijven staan als veiligheidskopie en worden niet automatisch verwijderd bij bewaren.


## v4536 - LEX slot 0 boven S

Slot 0 op de LEX-as staat in de gecombineerde Assen-weergave weer boven de centrale S/CLAUSE-root. Bronknopen blijven op hun eigen hoogte; alleen de lokale LEX-systeemslots starten hoger.


## v4538 — bijwoordvoorbeeldset

- Toegevoegd: `examples-adverbs.html`.
- Toegevoegd: `docs/LEX_ADVERB_EXAMPLE_SET.md`.
- Toegevoegd: `samples/adverb_host_examples_v4538.json`.
- `examples-input.html` is hersteld als oorspronkelijke basisvoorbeeldset; de bijwoordtestset staat apart in `examples-adverbs.html`.
- Eén bijwoord per voorbeeldzin.
- Default-host per categorie: MODALITEIT→S, TIJD→S, FREQUENTIE→VP, PLAATS→VP, NEGATIE→V, GRAAD→AP, WIJZE→V, REDEN/OORZAAK→S, VOORWAARDE→S, FOCUS→NP.
- Geforceerde afwijkingen krijgen notatie `functional:marked-host`.


## v4538 — herstel eerste voorbeeldset

- `examples-input.html` is teruggezet naar de oorspronkelijke basisvoorbeeldset.
- Bijwoordvoorbeelden staan apart in `examples-adverbs.html`, `docs/LEX_ADVERB_EXAMPLE_SET.md` en `samples/adverb_host_examples_v4537.json`.
- De eerste voorbeeldset bevat dus weer alleen de bestaande HOND/BIJT/MAN t/m VROUW/BREIT/TRUI voorbeelden.

## v4539 — ZIN + Met bijwoord

- Hoofdbeeld: naast de bestaande dropdown **Zin** staat nu een tweede dropdown **Met bijwoord**.
- De eerste voorbeeldset in `examples-input.html` blijft intact.
- De bijwoorddropdown leest `examples-adverbs.html` en projecteert het gekozen bijwoord als hosted bijwoordbox boven de geldige syntaxhost: `S`, `NP`, `VP`, `V`, `PP` of `AP`.
- Keuze `Geen bijwoord` verwijdert de bijwoordbox.
- Gemarkeerde plaatsingen blijven functioneel genoteerd als `functional:marked-host`; de syntactische boom wordt niet gemuteerd.

## v4541 — bijwoorden op LEX-as, hostbox alleen als hoogteanker

- `boven S/NP/VP/V/PP/AP` betekent nu: LEX-slot op de LEX-as, verticaal net boven die hostbox.
- Bijwoorden worden niet meer op/boven de syntaxboom getekend.
- De host-subboom schuift lager om visuele ruimte te maken.
- De notatie gebruikt `LEX-ADV[..., axis=LEX, source=external, host=...]`.


## v4548 — Boven S activeert V2/inversie

- `host=S` / `LEX-slot boven S` betekent nu automatisch: extern bijwoord voorop op de LEX-as.
- De persoonsvorm wordt naar `slot 2 · V2/PV` gezet.
- Subject en object volgen na V2 op de LEX-as.
- Het bijwoordslot staat letterlijk net boven de S-box; andere hosts blijven lokale LEX-slots boven hun hostbox.
- Voorbeeld: `GISTEREN | BEET | HOND | MAN`, niet `HOND | BEET | GISTEREN | MAN`.

## v4548 — klikbare gemarkeerde bijwoordvariant

- Bijwoordslots op de LEX-as zijn nu klikbare knopen wanneer er een gemarkeerde/ongemarkeerde tegenhanger bestaat.
- Klik op het bijwoordslot wisselt bijvoorbeeld `WAARSCHIJNLIJK` default naar `WAARSCHIJNLIJK · gemarkeerd boven V`.
- Klik op de gemarkeerde variant wisselt terug naar de ongemarkeerde/defaultvariant.
- De bijwoordplaatsing blijft extern, op de LEX-as. De SYNT-boom wordt niet gemuteerd.

## v4548 — bijwoorden vóór verplaatsingen

De LEX-afleiding is nu expliciet geordend:

1. Eerst wordt het externe bijwoordslot op de LEX-as geplaatst, met de gekozen hostbox alleen als hoogteanker.
2. Daarna pas worden LEX-Wissels toegepast, zoals topic/V2/post-V2.

Gevolg: een bijwoord kan blijven staan op de oorspronkelijke hosthoogte, terwijl het gehoste element later verplaatst wordt. De trace blijft dan zichtbaar onder/naast het oorspronkelijke punt; het bijwoord is niet mee verplaatst.

Voorbeeldnotatie:

```text
LEX-ADV[word=ALLEEN, class=FOCUS, axis=LEX, defaultHost=NP, host=NP, source=external, order=before-movement]
LEX-MOVE[source=subject, target=slot1, trace=t[subject], order=after-adverb]
```

Dit blijft een LEX/FUNC-regel. De SYNT-boom wordt niet gemuteerd.

## v4549 — bijwoordkeuze herstelt beeld

- Fix voor runtime-fout bij elke BIJWOORD-keuze.
- Oorzaak: de labelopbouw van het externe LEX-bijwoordslot gebruikte een niet-bestaande variabele `dy`.
- Gevolg in v4548: zonder bijwoord werd de boom getekend; met bijwoord stopte de renderflow.
- Correctie: het slotlabel gebruikt nu `visibleSlotCount`.
- Model blijft gelijk: bijwoord = externe LEX-insertie, vóór Wissels, boven de hostbox/trace en niet in de hostbox.


## v4550 — help/config voor lexicale bijwoordinsertie

- Help uitgebreid met detailuitleg over lexicale insertie van bijwoorden.
- Config uitgebreid met plaatsingsregels per bijwoordcategorie, telkens met ongemarkeerde/default-host en gemarkeerde host(s).
- Nieuwe docs: `docs/LEX_ADVERB_PLACEMENT_RULES.md`.
- Nieuwe machineleesbare config: `samples/adverb_placement_rules_v4550.json`.
- `viewer.js` bevat nu `ADVERB_PLACEMENT_RULES` als expliciete regelconfig.
- Model ongewijzigd: `LEX-ADV` is extern, staat op de LEX-as, wordt geplaatst vóór LEX-Wissels en muteert de SYNT-boom niet.


## v4554 — Play/Reset naast taalkeuze

- `Play` en `Reset` verplaatst naar de hoofdtoolbar, direct rechts van de taal/UI-knop.
- Taalbutton toont nu alleen `Nederlands` of `English`; `Taal:` en `UI:` zijn verwijderd.

## v4552 — NIET / neutrale negatie

- `NIET` krijgt een eigen lineaire LEX-regel: `post-object-pre-vcluster`.
- De dropdownregel `HOND BIJT MAN NIET` rendert nu als extern LEX-slot na het object.
- `HOND BIJT NIET MAN` is niet verwijderd, maar herclassificeerd als gemarkeerde contrastnegatie.
- Nieuwe configbestanden: `samples/adverb_placement_rules_v4552.json`, `samples/adverb_word_rules_v4552.json`.

## v4558 — Play/Reset op eigen centrale balk

- `Play` en `Reset` verplaatst uit de hoofdactieregel naast de taal/UI-knop.
- Nieuwe centrale balk direct boven het grid.
- Styling prominenter gemaakt met grotere knoppen en eigen achtergrond.
- `syncMainTopbarLayout()` houdt nu rekening met de play/reset-balk bij het berekenen van `--main-grid-top`.


## v4558 — mobiel/desktop cacheherstel
- Oude service-workers en caches worden bij laden éénmalig opgeruimd.
- `sw.js` is cleanup-only; de viewer gebruikt geen PWA-cache in deze lokale/dev-build.
- Alle top-level links en asset-queries zijn naar v4558 gezet.


## v4560 — SOV-box onder LOG

- De SOV/SVO/OVS/OSV/VSO/VOS-bediening staat nu onder de verticale projectiereeks, direct onder `LOG`.
- De box is een eigen LOG-bediening met tussenruimte, niet langer een zwevende badge onder de LOG-projectie.
- De centrale Play-balk behoudt `←`, `Play`, `→`, `Groei` en `Reset`.


## v4566 — Hoofdvenster: volledige boom zichtbaar als standaard

- De opties onder `Hoofdvenster` zijn hernoemd en herordend rond één default: `volledige boom zichtbaar`.
- Desktop en mobiel starten op deze veilige fit-modus.
- De fitbox krijgt extra ondermarge voor LOG en extra rechterruimte voor de SYNT-as.
- `strak`, `scroll` en `vast/debug` blijven beschikbaar als secundaire opties.
