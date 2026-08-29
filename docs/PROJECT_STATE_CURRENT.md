# PROJECT_STATE_CURRENT

## Actuele aanvulling · bronstand .71

- `data/testmateriaal.sqlite` is lokaal de leidende standaardcatalogus; de
  statische publieke afleiding is `data/catalog.public.json` en bevat alleen
  `status = OK`.
- Ruwe input wordt eerst als één of meer kernzinnen geanalyseerd. Categorie en
  kenmerken volgen pas uit de analyse. De viewer tekent uitsluitend graphdata
  en is geen analyzer.
- **Syntax | Functional** staat prominent buiten het plaatsingsmethodemenu voor
  Language Tree en kernzincomposities. Functional gebruikt dezelfde
  knoopidentiteiten en toont `CLAUSE`, `ARG-STRUCT` en beschikbare rollen.
- **Compact** kiest de veilige compacte recursieve layout en compacte H/V-
  kernzintakken zonder tekst of knoopsymbolen te verkleinen.
- Normatief: `../FUNCTIONAL_DATABASE_COMPACT.md` en
  `../TESTMATERIAAL_BEHEER.md`.

Leidende status van OpenGraph Lite Viewer `v2.0.0-rc.45`.

Controlestatus: rc.45 is op 2 augustus 2026 handmatig goedgekeurd, inclusief
de Greedy Grow-reconstructie, bewijsgrens en afgeleide publicatieslide.

## Actuele source build 20260825.11

- Exacte bronidentiteit:
  `v2.0.0-rc.45-publish-visible-browser-controls-20260825.11`.
- De Playwright-browsertest opent eerst het zichtbare hoofdmenu voordat hij
  Anafoor · multi-OGN kiest, vindt boomknopen in de actuele vormlaag en
  downloadt OPN via de zichtbare Config-knop. Runtime-screenshots staan in de
  tijdelijke systeemmap, zodat publicatie geen ongewenste bestanden toevoegt.
- `publish_checked.bat` controleert vóór de langdurige releasechecks of zowel
  Playwright 1.61.1 als de bijpassende Chromium-browser lokaal beschikbaar
  zijn. Zo niet, dan kan de gebruiker na een expliciete `J` de bestaande
  reproduceerbare installer starten en daarna in dezelfde publicatieroute
  doorgaan. Bij `N` stopt publicatie vóór staging, commit en push.
- De canvas-sleepbediening laat configureerbare knopen expliciet vrij;
  knoopvorm én zichtbare tekst ontvangen echte muisklikken en Enter.
- De subjectknoop van K2 is rechtstreeks klikbaar en wisselt tussen `HIJ`,
  `DIE`, `DIE HOND`, `DE HOND` en `JEK`, zonder referent, vrije boomstructuur
  of verticale verbindingen te veranderen. Rasterbreedte en rasterhoogte zijn
  onafhankelijk instelbaar van 60% tot 200%; raster en knopen schalen samen.
- Uitingen `Jan wast zichzelf`, `Jan slaat Jek omdat die hem beet` en
  `Ken uzelf` openen als twee afzonderlijke OGN-bomen, `K1` boven `K2`.
  Gedeclareerde anaforen staan verticaal; de causale uiting toont tegelijk
  `JEK ↔ DIE` en `JAN ↔ HEM`. Eén LEX-as toont uitsluitend de gerealiseerde
  uiting. Kernzinnen, coreferentie, oorzaak, rol-flip en impliciete
  geadresseerde blijven bij editor en samengestelde OPN behouden.
- De causale uiting biedt `hij`, `die` en `die hond` als rechtstreeks
  selecteerbare anafoorvormen voor dezelfde referent Jek. `DIE HOND` blijft
  één subject-NP met twee gerealiseerde LEX-woorden. Interface en documentatie
  onderscheiden noodzakelijke lokale K2-Flip bij dubbele rolwisseling van
  optionele globale beeldspiegeling; beide verticale anaforen blijven intact.
- De Play-balk blijft zichtbaar voor beide multi-OGN-varianten. Vier
  omkeerbare fasen tonen `K1`, `K2`, verticale anaforen en de gezamenlijke
  LEX-uiting; handmatig vorige/volgende en Reset werken eveneens.
- De actieve testzin of uiting blijft boven Play en werkvlak zichtbaar.
  Iedere kernzin volgt `S → NP, VP` en `VP → NP, V`; de gerealiseerde
  LEX-volgorde wordt zelfstandig afgeleid. Alle binaire knopen vertakken
  zichtbaar links/rechts. Config bevat boomkleur, boomlijnzwaarte,
  onafhankelijke horizontale/verticale compactheid en Flip. Flip spiegelt
  beide bomen zonder structuur, LEX-woordvolgorde of verticale anaforen te
  veranderen. Standaard zijn boomtakken compact, blauw en zwaar.
- Iedere korte en lange boomtak verbindt zichtbaar twee vrije knopen op
  verschillende rijen én kolommen; inkorting volgt de eigen schuine richting.
  Compacte knoopsymbolen voorkomen overlap. Alleen gedeclareerde anafoorlijnen
  staan verticaal tussen de twee afzonderlijke kernzinbomen.
- Anafoor · multi-OGN is een tweede berekende toepassing. S1 en S2 worden
  afzonderlijk berekend; S1 staat boven S2 en de complete S2 verschuift star
  totdat antecedent MAN en anafoor HIJ één gedeclareerde kolom delen. De
  gezamenlijke LEX-as houdt S1 vóór S2 en de coreferentielijn is recht,
  verticaal en ongericht. De unieke rij-/kolomregel blijft hard per OGN.
- Het hoofdmenu toont Language Tree prominent als primaire berekende
  toepassing, met Greedy Grow en Random als kleinere directe
  OGN-illustraties. De directe modi schrijven één knoop per stap en verbergen
  bediening die uitsluitend bij de taalboom hoort.
- Random heeft een afzonderlijke seedbare engine. De geaccepteerde
  `greedy-grow-engine.js` blijft bytegelijk aan de carrouselbron en de
  afleidingscontrole blijft geldig.
- `Config → Algemeen → Interface & weergave → Lijnbeeld` regelt rasterkleur,
  boomkleur en raster-, boom-, projectie- en boxlijnzwaarte. LEX, SYNT en LOG
  hebben elk een eigen kleur voor as,
  projectielijnen en overeenkomstige boxen.
- `.gitattributes` en `tools/normalize_text_files.py` leggen LF/CRLF en exact
  één afsluitende EOL structureel vast. `publish_checked.bat` normaliseert en
  voert `git add --renormalize` uit vóór de whitespacecontrole.
- Het volledige contract staat in `LINE_STYLE_AND_PLACEMENT_MODES.md`.
- Config is strikt ingedeeld als Algemeen, Calculated → Language Tree en
  Direct → Gedeeld / Greedy Grow / Random. Algemeen bevat geen Voorconfig,
  boom, voorbeelden, LEX, SYNT of LOG; die staan uitsluitend onder Language
  Tree. Per context zijn alle niet-relevante instellingen no-show. De toepassingsbalk blijft alleen in de volledige Config zichtbaar;
  vanuit actieve Greedy-Grow- of Random-modus is ook die balk no-show.
- Ieder zichtbaar Direct-, Greedy- en Random-veld heeft een mobiele,
  inklapbare uitleg volgens `CONFIG_UI_EXPLANATION_STANDARD.md`.
- LOG plant mogelijke LEX-plaatsen maar verplaatst zonder expliciete
  Language-Tree-regel geen bronknoop. In `HOND BIJT MAN` blijft `MAN` exact op
  MAN-bronhoogte en wisselt uitsluitend `BIJT` naar V2. De tijdelijke
  ruimte-indicator en de lege SPACE-fase zijn verwijderd; Play gebruikt nu
  rechtstreeks `LOG → LEX`.
- Het actieve LEX-profiel bevat uitsluitend upward-Wissels,
  toepassingsgebonden insertieplaatsen en rechtstreeks geschreven Comp.
  Generieke lege plaatsen vóór, na of tussen en iedere downward/post-V2-Wissel
  zijn no-show: geen Config-optie, rendering of nieuwe opslag. Hun gebruik
  wordt later afzonderlijk geëvalueerd.
- Upward wordt hard gemeten vanaf de zichtbare horizontale bronprojectie, niet
  vanaf een door LOG gereserveerde rij. Een lager doel blijft daarom op
  bronhoogte. Heavy NP Shift, extrapositie en morfologische Lowering blijven
  buiten rc.45.
- Zinsoort is een aparte Language-Tree-laag met mededelende hoofdzin,
  ja/nee-vraagzin, dat-zin en omdat-zin. V1 bedient de vraagzin; DAT en OMDAT
  worden direct in Comp geschreven. Perfectum blijft een werkwoordsvorm.
- Greedy/Random Config verbergt daarnaast de viewerwerkbalk, runstatus,
  voorbeeldweergave, feedback, canvas en save-uitleg. Alleen Terug naar Main,
  de eigen velden met uitleg en compacte bewaren/herstellen-knoppen blijven
  over; een andere context wordt eerst in Main gekozen.
- Eén Random-iteratie is één complete run. De centrale knoop telt niet mee;
  10 voltooide iteraties van 31 knopen leveren 300 projectie-hits per as.
  Bezettingskans deelt tellingen door het ingestelde iteratieaantal; Relatief
  schaalt op de hoogste telling van de voltooide rondes. Deze analyse plant de
  actieve directe run niet vooruit. Greedy wordt niet zinloos herhaald.
- Random Play en Next lopen knoop voor knoop door alle ingestelde iteraties;
  Previous kan over een rungrens terug en Reset begint bij iteratie 1 volgens
  het seedbeleid.
- Na de laatste knoop van iedere Random-ronde worden gebruikte rijen als
  cumulatieve projectie-hitspots op WEST en gebruikte kolommen op SOUTH
  toegevoegd. Een herhaalde hit maakt dezelfde spot donkerder en zwaarder.
  Onvoltooide en toekomstige rondes tellen niet mee; Reset wist de hits en
  Previous rolt een opnieuw onvoltooide ronde terug.
- Voor uniforme Random voorspelt de combinatoriek een vrijwel egaal asbeeld.
  Bij `R = N` wordt iedere niet-centrale WEST-plek iedere ronde geraakt; voor
  een ruimere as is de verwachte hitkans `(N - 1) / (R - 1)` of, op SOUTH,
  `(N - 1) / (C - 1)`.
- Random gebruikt bij een nieuwe standaardconfig **Ergens in beschikbare
  ruimte** en maximale afmetingen **Interface**. De vaste rechthoek volgt de
  beschikbare interfaceverhouding en iedere stap kiest uit alle nog vrije
  rij-kolomcombinaties in die rechthoek. Compact, Gebalanceerd, Ruim en het
  groeiende inhoudsveld blijven alternatieven; bestaande opgeslagen keuzes
  worden niet geforceerd gewijzigd.
- Uniform v1.0 blijft de standaard. Onzuiver uniform v0.1 mengt per vrije
  ascoördinaat 80% uniform met 20% herhaalgewicht uit uitsluitend voltooide
  eerdere rondes. Ronde 1 is uniform; unieke rijen en kolommen blijven hard.
- Random Config bevat model, plaatsing, gridgrootte, conditionele vaste
  kolommen/rijen, snelheid, iteraties en asbeeld. Vaste maten zijn minimaal het
  aantal knopen. Snelheid hergebruikt de gedeelde Play-klok en verandert de
  plaatsingsreeks niet.
- Seed is een startcode van 1 t/m 4.294.967.295. `20260802` is de datumseed 2
  augustus 2026; een groter getal geeft niet meer toeval of snelheid.
- v0.2 (herhaalsterkte) en v0.3 (geheugenvenster) zijn alleen voorspelde
  contracten en blijven no-show.
- Het volledige Config-contract staat in `DIRECT_PLACEMENT_CONFIG.md`.

## OGN-kern en vaste uitlegvolgorde rc.45

- De algemene Open Graph Notation begint bij een open grid met vrije posities.
- Iedere knoop is baas op één eigen horizontale en één eigen verticale
  gridlijn.
- OGN schrijft bij directe plaatsing één knoop per stap. Iedere stap leest
  eerst de actuele bezetting; een ruleset bepaalt de geldige posities en een
  zoekstrategie bepaalt de testvolgorde. De eerstgevonden geldige plek wordt
  direct geschreven.
- Greedy Grow heeft een afzonderlijke geaccepteerde reconstructie in
  `greedy-grow.html`. De historische vierarmige volgorde reproduceert de
  bewaarde 12/31/96-demo's exact; iedere stap schrijft direct één knoop en
  bewaart geen toekomstig eindbeeld. Vier experimentele kandidaatvolgorden
  zijn vergelijkbaar. De veldomtrek is alleen diagnostiek, geen bewezen
  wereldwijd optimum. Publicatieslide 5 wordt uit dezelfde engine afgeleid.
- De vaste laagvolgorde is **OGN Free Placement → OGN Projection → OGN
  Calculated Placement**.
- Two-Pass Language Tree is één toepassing van berekende plaatsing. LEX, SYNT
  en LOG zijn benoemde projecties binnen die taaltoepassing.
- De normatieve details staan in
  `OGN_CORE_PLACEMENT_ARCHITECTURE.md`.

## Publicatiecarrousel rc.45

- `publicatie-carrousel/slides/` bevat zeven genummerde PNG-bestanden van exact
  1080 × 1080 pixels. De uploadvolgorde is `01` tot en met `07`.
- `publicatie-carrousel/index.html` is de zelfstandige bewerkbare bron. De
  slides gebruiken alleen lokale projectassets en geen externe fonts. Het
  enige lokale bron-script is `greedy-grow-engine.js` voor slide 5.
- Slide 4 toont geplaatste knopen die naar WEST, SOUTH en EAST projecteren.
  Slide 5 is **Direct — Greedy Grow**. Slide 6 is
  **Calculated — Language Tree** en toont het laatste stadium van
  `HOND BIJT MAN` met `HOND · BIJT · MAN` op de westelijke LEX-as.
- Beide voorbeeldslides verwijzen zichtbaar naar
  `github.com/kruin/graphlite`; aparte uitlegkaarten voor de twee
  plaatsingssoorten zijn verwijderd.
- De carrousel is altijd een afgeleide: PNG's en carrouselzip worden nooit
  rechtstreeks bewerkt. `maak-publicatie-carrousel.bat` rendert alle zeven
  slides opnieuw, controleert ze en bouwt de zip.
- `tools/export_publication_carousel.js` rendert met Chromium/Playwright en
  schrijft `publicatie-carrousel/derived-manifest.json`. Dit manifest koppelt
  bron, exporter, versie en alle PNG's met SHA-256-hashes.
- `PUBLICATIE_README.md` bevat de Reddit-gallerywerkwijze, titel en posttekst,
  alt-tekst per slide, platformteksten en de actuele kandidaatstatus.
- `tools/check_publication_carousel.py` blokkeert bron-/PNG-drift en bewaakt
  aantal, bestandsnamen, PNG-afmetingen, drie gestippelde vrije plekken op
  afzonderlijke lijnen, WEST/SOUTH/EAST, de engine-afleiding van Greedy Grow,
  het Language Tree-eindstadium en de twee GitHub-links. Het handmatige akkoord staat in
  `RC45_OGN_CORE_EXPLANATION_TEST.md`.
- De oorspronkelijke geaccepteerde rc.45-carrousel blijft ongewijzigd. De
  actuele source build 20260802.11 breidt de viewer wel uit met plaatsingsmodi,
  geïsoleerde directe Config, lijnbeeld-Config en structurele
  tekstnormalisatie; graphdata en OPN-formaat blijven ongewijzigd.

## Config, LEESMIJ en projectzip rc.43

- `Config → LEESMIJ-items` bewerkt per onderwerp Tonen ja/nee,
  navigatietitels NL/EN, beperkte veilige HTML-inhoud en de carousel.
- Tonen: nee verbergt het item zonder DOM- of Config-verwijdering.
- Lokale PNG/JPEG/WebP/GIF-bestanden worden uitsluitend via de vertrouwde
  bestandsroute als ingesloten slide geaccepteerd; 1,25 MB per bestand en een
  totale opslaggrens.
- Dezelfde savebalk met Ja/Nee/status staat boven ieder Config-tabblad.
- Iedere projectzip bevat `config/default-config.json`,
  `config/user-config.json`, `config/README.md` en
  `PUBLICATIE_README.md`.
- De Config-voorrang is code → default-config → user-config →
  apparaatgebonden browsersnapshot.
- Via de lokale save-endpoint kan alleen het allowlistdoel
  `config/user-config.json` worden geschreven. Op een gewone webserver is
  download + handmatig plaatsen de fallback.
- `PUBLICATIE_README.md` levert versiegebonden, kopieerbare teksten voor
  LinkedIn, Reddit, Facebook, YouTube, Bluesky, Mastodon, X en GitHub.
- Nieuwe controles:
  `tools/check_readme_item_editor.py`,
  `tools/check_readme_item_editor_runtime.js`,
  `tools/check_project_config_layers.py` en
  `tools/check_project_config_layers_runtime.js`.

## Gereserveerde toepassingen rc.42, later herzien

- Config → Toepassingen toont **Nadruk** (`juist díe trui`) en **Onaffe zin**
  als uitgeschakelde reserveringen. Vraagzin is inmiddels een actieve
  Language-Tree-zinsoort en geen toepassing.
- De twee reserveringen staan niet in `FEATURE_DEFINITIONS`, krijgen geen
  runtime-state en worden niet opgeslagen of geëxporteerd.
- Een reservering activeert geen voorbeelden, inserties, documentatie,
  resources, layout-demand of renderfunctionaliteit.
- Vereiste voorconfig en taalkundig contract worden pas bepaald wanneer een
  reservering als echte toepassing wordt uitgewerkt.

## Bewerkbare LEESMIJ-carousels rc.42

- Ieder zichtbaar LEESMIJ-item heeft één eigen carouselbron.
- Config biedt onderwerpkeuze, add/remove, vorige/volgende, beeldpad,
  breed/smal, alt-tekst en onderschrift in NL en EN.
- Wijzigingen verschijnen direct in de carousel en worden als
  `readmeCarousels` in de lokale Config-snapshot bewaard.
- `Herstel dit item` verwijdert alleen de lokale overschrijving en herstelt de
  ingebouwde broncarousel of gereserveerde lege ruimte.
- Onveilige URI-schema's worden niet als beeldbron gerenderd.
- Onderschriften zijn compacte tekstvelden; graph-sneltoetsen zijn geblokkeerd
  in Config/LEESMIJ en bij focus op een invoerveld.
- Mobiele Main-bediening en de lokale viewporttestknop zijn buiten Main
  verborgen, zodat de editor niet wordt afgedekt.
- Bijwoordgebonden LEESMIJ-items zijn alleen beschikbaar wanneer de toepassing
  Bijwoorden actief is en worden bij uitschakelen opgeruimd.

## Recursieve layout en volledige projecties rc.42

- Structurele gridplaatsing blijft recursief; daarna meet een tweede bottom-up
  pass per subtree de nodevormen, labels, child-boxen en het caption.
- Zichtbare subtree-rects gebruiken `requiredWidth/requiredHeight` uit één
  centrale layout-policy.
- Kleine unary boxen, waaronder `NP → HOND`, zijn inhoudsgestuurd compact en
  bevatten desondanks alle node- en labelgeometrie.
- LEX-Wissellanes, trace/indexposities en de goot vóór de boom zijn compacter;
  de rechterreserve volgt alleen de actieve slots en banen.
- Handheld MAX bevat volledige LEX-inhoud en volledige Syntax- én
  Functional-regelboxen, ook in landschap en forced desktop.
- Syntax en Functional gebruiken één oostas op hun gezamenlijke structurele
  grid-envelop; de oostas volgt niet iedere gemeten subtree-rand.
- De README-paneelmaat blijft bij mobiele resize behouden; lijst en tekst zijn
  in portret en landschap met de sleepgreep verstelbaar.
- Een toepassing declareert alleen abstracte layout-demand. Bijwoorden vraagt
  brede LEX-inhoud; de renderer bepaalt de maten.
- De beslisregels voor voorconfig, toepassingen en LOG-majors/minors staan in
  `RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.
- De gemeten subtree-maat bestuurt de zichtbare rect, maar herplaatst in rc.42
  nog geen knopen naar andere gridcellen.
- `tools/check_recursive_box_fit_runtime.js` controleert containment, viewport,
  majors/minors en Syntax/Functional-stabiliteit in Chromium.

## Landscape-compositie rc.40

- Mobiel landschap gebruikt één begrensde schermcompositie: twee compacte
  menurijen bovenaan, het SVG-tekenvlak in het midden en Play onderaan.
- Menu en Play hebben gereserveerde ruimte en liggen niet over de graph.
- De landschaplayout is werkelijk lager en breder; MAX gebruikt een
  `contain`-fit en geen cover-zoom die rastertop of assen afsnijdt.
- LEX, SYNT en LOG blijven volledig zichtbaar. Het raster eindigt exact op
  deze assen en benut vrijwel de volledige beschikbare tekenhoogte.
- Dezelfde regels gelden voor een echte telefoon, de lokale
  desktopsimulatie van 844 × 390 en een fysieke telefoon waarop de
  Desktop-interface is geforceerd.
- `tools/check_landscape_composition_runtime.js` controleert menu, graph,
  Play, raster en alle drie assen in Syntax én Functional.

## Lokale viewporttest rc.39

- Op een groot desktopscherm blijft `Mobiel staand` begrensd tot 390 × 844 en
  `Mobiel liggend` tot 844 × 390, ook nadat MAX volledig is gerenderd.
- De MAX-regels mogen het lokale telefoonframe niet opnieuw naar `100vw`
  verbreden.
- De lokale keuzeknop neemt `ogv` over uit de actuele viewer en bevat geen
  afzonderlijk hardgecodeerd versienummer.
- Het grote automatische venster keert alleen terug na een expliciete keuze
  voor `auto`, `Automatisch` of `Desktop`.

## Mobiele layout rc.38

- Een fysieke telefoon wordt ook in landschap herkend; een breedte boven
  760 px maakt de mobiele omgeving niet meer onzichtbaar.
- README gebruikt in portret lijst boven tekst en in landschap lijst links van
  tekst.
- De lijst heeft een echte, verstelbare maat en klapt niet meer tot 0 px in.
- De scheidingsbalk werkt met pointer/touch en bewaart een geldige sessiemaat,
  ook wanneer README tijdens initialisatie nog verborgen is.
- Mobiele MAX focust het stabiele Syntax/Functional-asgebied. In portret vult
  dat de breedte en in landschap de hoogte.
- De fysieke telefoonmaat blijft voor MAX gelden wanneer de interface op
  Desktop wordt geforceerd.
- Het raster begint op LEX, eindigt op SYNT en stopt onderaan op LOG.

## Voorconfigcontract rc.37

- Config begint bij `Voorconfig`; concrete toepassingen volgen pas daarna.
- Insertie heeft onafhankelijke schakelaars voor LEX, SYNT en LOG. Alle drie
  staan standaard uit.
- Een actieve as levert alleen infrastructuur en maakt zelf geen insertiedata.
- `Bijwoorden` vereist insertie op LEX én LOG.
- Zolang die combinatie niet gereed is, blijft de toepassing niet aanklikbaar.
- LEX of LOG uitzetten schakelt een actieve toepassing Bijwoorden onmiddellijk
  uit en wist haar staat.
- SYNT-insertie is onafhankelijk en in rc.37 nog niet aan een toepassing
  gekoppeld.
- OPN, Legacy JSON en Config-snapshots bewaren de drie asschakelaars.

## Profielcontract

- Nieuwe installaties starten in `OGN Basis`.
- Basis bevat Syntax/Functional, raster, LEX/SYNT/LOG met S/O/V-majors en
  voorbeelden zonder optionele inserties.
- `Config → Toepassingen` bevat de centrale toepassingsschakelaars.
- De eerste extra is `Bijwoorden` en staat standaard uit.
- Uit betekent: geen bijwoordvoorbeelden, LOG-minors, directe LEX-inserties,
  gebruiksprofielen, bediening, featuredocumentatie of featurevelden in
  OPN/Legacy JSON.
- Een basis-OPN vermeldt `profile=base` en een lege lijst `extras`.
- Een import die de uitgeschakelde extra nodig heeft, wordt niet gedeeltelijk
  geladen maar vraagt eerst om activering via Config.

## Lees mij / README

- `Help` is hernoemd tot `Lees mij / README`.
- Openen activeert altijd `Start · OGN-kern / Start · OGN Core`.
- De README gebruikt in iedere interfacevorm twee verticale helften:
  onderwerpen boven en de actieve tekst onmiddellijk onder.
- Beide helften scrollen onafhankelijk.
- `README.md` is Engels; `LEESMIJ.md` is Nederlands.
- De eerste carousel toont vier SVG-beelden: vrije gridplaatsen, sequentieel
  schrijven, verschillende zoekvolgorden en de vaste drie lagen.
- De traditionele probleembomen verschijnen pas later bij de taaltoepassing.
- De externe zoeklink in de intro opent in een afzonderlijk venster; de app
  blijft open.

## Desktop-MAX

- `Config → Calculated → Language Tree → Boom & projecties → Boomruimte`
  staat standaard op `MAX`.
- `Config → Algemeen → Interface & weergave → Venstervulling` staat
  standaard op `MAX`.
- MAX gebruikt het volledige resterende browservenster en een
  SVG-fontschaal van `1.70`.
- Raster, hulplabel en het historische ruime stabiliteitskader tellen niet
  mee in de MAX-fit.
- Een compacte Syntax / Functional- en projectie-unie houdt schaal en positie stabiel
  tijdens projectiewissels en Play.
- De westelijke LEX-laag reserveert haar volledige zichtbare breedte vóór de
  buitenste S/CLAUSE-box. Daardoor kan de LEX-as niet meer over S/CLAUSE heen
  worden getekend, ook niet bij meerwoordige minors of meerdere Wissels.

## Projectiecontract

```text
structure-config
→ LOG-majors/minors
→ horizontale LEX-bronprojectie
→ LOG-afgeleide neutrale doelrij
→ eventueel vervangen door expliciet topic-/V2-doel
→ één rechtstreekse zichtbare LEX-verplaatsing per bronwoord
→ voorbeeldzin als validatie
```

- `S`, `O` en `V` zijn LOG-majors.
- Een insertie met `origin=LOG` of `origin=LOG+LEX` levert een LOG-minor.
- Een insertie met `origin=LEX` wordt rechtstreeks in het LEX-plan geplaatst
  en levert geen LOG-minor.
- Iedere werkelijke LOG-minor bezet één vast slot en vergroot de afstand tussen
  zijn begrenzende majors met één.
- De bronknoop bepaalt altijd de hoogte van het LEX-projectieanker.
- LOG is autoriteit voor de geplande LEX-plaatsen, niet voor zichtbare
  bronknoopverplaatsing.
- Bronanker → bepaald einddoel is één verplaatsing langs de LEX-as, met één
  brontrace.
- De losse surface-string levert geen layoutcoördinaten. Expliciete
  zinsinstantiemetadata, zoals `post-object-pre-vcluster`, is wel layoutinput
  en heeft in automatische modus voorrang op een brede klasse-default.
- Topic en V2 worden logisch na LOG opgelost, maar veroorzaken geen tweede
  zichtbare tussensprong.
- Gevulde TOPIC- en V2-rijen tonen geen onderliggend vak `vrij slot`.
- De normatieve details staan in `projectie-master-spec.md`.

## Views en assen

- Centrale views: `Syntax` en `Functional`.
- Named projections: LEX west, SYNT oost, LOG zuid.
- LOG is geen centrale view.
- Standaard zijn alle drie named projections zichtbaar.
- Iedere projectiecombinatie en Syntax ↔ Functional gebruikt hetzelfde stabiele
  viewport.

## Configuratie

Config opent op de infrastructuur met deze gerichte secties:

- `Voorconfig`;
- `Toepassingen`;
- `Overzicht` en `JaN · TODO`;
- `Opslaan & exporteren`;
- `Beeld`;
- `LOG & LEX`;
- `Geavanceerd`.

Bij zoveel mogelijk instellingen staat direct een korte effecttoelichting. De
bestaande Ja/Nee-save-werkwijze blijft ongewijzigd.

## Volledige bron-ZIP

- `maak-volledige-zip.bat` gebruikt de actuele projectmapnaam.
- `<projectmap>` wordt automatisch `<projectmap>_full_source.zip`.
- De ZIP staat naast de projectmap en bevat die map als bovenste map.
- Een bestaande gelijknamige ZIP wordt pas na geslaagde compressie vervangen.
- Lokale `*_full_source*.zip`-kopieën, inclusief namen met `(1)`, zijn
  release-artefacten: manifest, publicatie en nieuwe bronzip sluiten ze uit.
- Er staat geen releaseversie hardgecodeerd in de BAT.

## Lokale start

- `start_local_viewer.bat` is de enige lokale starter.
- De BAT is alleen nog een minimale Python-kiezer en controleert expliciet of
  de volledige zip is uitgepakt.
- `start_local_viewer.py` bedient serverdetectie, starten, wachten,
  broncontrole en browseropening; complexe CMD-probelogica is verwijderd.
- Eén Python 3-installatie bedient zowel `server_nocache.py` als de versieprobe
  op poort 8088.
- Alleen wanneer zowel `VERSION.txt` als `SOURCE_BUILD.txt` exact met de
  huidige map overeenkomen, opent de BAT `reset-cache.html`. Daardoor wordt
  ook een oude bron met hetzelfde rc.45-versienummer geblokkeerd; de launcher
  vraagt dan het oude servervenster te sluiten.
- `tools/check_local_start.py` toetst bestaande en nieuw gestarte server,
  juiste/verkeerde versie, juiste/verkeerde bronstand, gesloten poort en de
  enige minimale BAT.

## Publicatie

- `publish_checked.bat` voert controles, commit en push uit vóór een
  browseractie.
- Alleen na een bevestigde nieuwe push wordt
  `:open_reset_after_push` aangeroepen.
- De reset-URL en resetmarkering worden in die subroutine vóór gebruik
  ingevuld. Hierdoor kan CMD geen lege URL aan `start` doorgeven en opent
  Verkenner niet onbedoeld.
- Zonder nieuwe push wordt geen cache-reset geopend.

`structure-config.html#opengraph-log-config` definieert:

- majors en lexicale sources;
- LOG-intervallen met `after` en `before`;
- standaardintervallen per bijwoordklasse;
- vaste LOG- en LEX-slotstappen;
- `LOG` als plaatsingsautoriteit;
- `lex-projection-origin=SOURCE-Y`;
- `lex-placement-mode=horizontal-then-move`;
- `example-controls-layout=false`;
- `play-phases="LOG LEX"`;
- `play-space-mode="none"`.

De Config-UI kan het interval automatisch uit de klasse kiezen of expliciet
op `before-S`, `S-O`, `O-V` of `after-V` zetten. De vroegere hostkeuze is
alleen nog scope-/compatibiliteitsmetadata.

## Play

Na de bestaande knoop-voor-knoopopbouw van de centrale boom:

1. verschijnt de LOG-as met majors en minors;
2. verschijnen de lexicale bronnen horizontaal op hun bronhoogte en verhuizen
   zij elk eenmaal naar het bepaalde einddoel.

LOG bepaalt eerst de neutrale doelrij; een expliciete topic-/V2-regel kan dat
doel vóór het tekenen vervangen. SYNT en de overige projectiepanelen
verschijnen in de eindstap.

De vorige-stapknoppen gebruiken dezelfde stapnummers achteruit. De eindlaag is
alleen ontgrendeld op exact de laatste stap. Eén stap terug verwijdert daarom
meteen de eindprojecties; daarna verdwijnen achtereenvolgens LEX-Wissels,
LEX-inhoud, LOG en de boomknopen.

## OPN-opslag

`.opn` is het primaire round-tripformaat. Het scheidt `metadata`, `data` en
optionele `paradata`. De data bewaart de LOG-sequentie, minorintervallen,
slotnummers, majorafstanden en `lex_position_source=LOG`. Daarnaast bewaart
zij `lex_projection_origin=SOURCE-Y` en
`lex_placement_mode=horizontal-then-move`.

## Graph- en Play-export

- `Graph als SVG` maakt een zelfstandig vectorbestand met ingebedde
  vormgeving.
- `LinkedIn-PNG` maakt een wit beeld van 1200 × 627 pixels.
- `Play-video` neemt de volledige gefaseerde Play automatisch op in
  1200 × 628 bij een actief vastgelegde 30 fps.
- De recorder kiest MP4/H.264 als de browser dit aanbiedt en anders WebM.
- De canvas-framepomp schrijft ook tijdens stilstaande Play-fasen frames; de
  oude uitvoer van circa 2,6 fps kan daardoor niet terugkeren.
- LinkedIn noemt WebM als ondersteund, maar toetst daarnaast minimaal 10 fps
  en 192 kbps. Daarom krijgt MP4/H.264 voorrang.
- De uitvoer blijft lokaal; er wordt niets automatisch gepubliceerd.

## Voorbeelden en controle

- 14 voorbeeldzinnen.
- Twee meervoudige bijwoordvoorbeelden met zinsgebonden lineaire
  landingsplaatsen. `post-object-pre-vcluster` heeft in automatische modus
  voorrang op de brede klasse-default.
- De Bijwoord-dropdown bevat 25 voorbeelden plus `Geen bijwoord`.
- Vier beperkte meerwoordige eenheden vormen elk voorlopig één zichtbaar
  LEX-slot. Het gekozen gebruiksprofiel bepaalt of daarnaast een LOG-minor
  bestaat:
  `MISSCHIEN WEL`, `AF EN TOE`, `OP DIT MOMENT` en
  `MET VEEL AANDACHT`. Interne syntaxis valt buiten deze eerste uitbreiding.
- `tools/check_log_slot_distance.py` bewaakt de afstandsinvariant.
- `tools/check_lex_horizontal_projection.py` bewaakt de horizontale bronlijn
  en één rechtstreekse eindverplaatsing per bronwoord.
- `tools/check_projection_cleanup.py` bewaakt de volledige bijwoordfallback,
  één introbeeld, rechte LOG-projecties, vrije-slotopruiming en de zinkop.
- `tools/check_desktop_max_view.py` bewaakt full-window MAX en de leesbare
  desktopfontschaal.
- `tools/check_social_and_linguistic_export.py` bewaakt de vier talige
  uitbreidingen en de SVG/PNG/video-export.
- `tools/check_linkedin_video_export.py` bewaakt MP4-voorkeur, de 30-fps-pomp
  en desgewenst een concreet uitvoerbestand met `ffprobe`.
- `tools/check_linkedin_video_runtime.js` voert formaatkeuze, requestFrame en
  de canvasfallback daadwerkelijk uit.
- `tools/check_play_reverse.py` bewaakt dat de eindlaag niet blijft staan en
  dat de fasevolgorde ook achteruit geldig blijft.
- `tools/check_examples_roundtrip.py` bewaakt voorbeeld-round-trips.
- `tools/check_release.py` bewaakt releasebestanden en contractmarkers.

## Topmenu

```text
OGN Basis: Zin · Syntax / Functional · Interface · Projecties · LOG-volgorde
Bijwoorden aan: Zin · Bijwoord · Syntax / Functional · Interface · Projecties · LOG-volgorde
Taal · LEESMIJ/README · Config
```

De app start bij een nieuwe installatie in het Engels. Het talenmenu bevat
English, Nederlands, Deutsch, Français en Español en vermeldt dat de
voorbeeldzinnen Nederlands zijn en Nederlandse woordvolgorde tonen.

Er is geen algemene Menu-knop en er zijn geen geneste submenu’s.

## Lexiconprofielen rc.28

- Eén lemma kan meerdere gebruiksprofielen bevatten.
- Een zinsinstantie kiest één profiel; de keuze herschrijft het lexicon niet.
- `origin=LOG` en `origin=LOG+LEX` leveren een LOG-minor.
- `origin=LEX` reserveert uitsluitend een directe LEX-plaats.
- `misschien wel` is één constructie met één zichtbaar slot en drie kandidaatprofielen.
- De viewer vraagt alleen wanneer de keuze oorsprong, LOG-projectie, scope, groepering of componentanalyse verandert.

## OGN-kernprobleem en plaatsingsplancontract

OGN ontkoppelt de structurele vertakkingsvolgorde onder `S` van de lineaire
woordvolgorde van de zin. De centrale boom representeert structuur; LEX
representeert de oppervlaktestring.

De layoutinput bestaat uit structuur, lexicale inserties, gebruiksprofielen,
plaatsingsregels, Wissels en actieve projecties. Eerst wordt één volledig
plaatsingsplan berekend; daarna wordt de kernzin lexicaal ingevuld en pas daarna
wordt gerenderd. De renderer mag geen nieuwe ruimte reserveren.

JaN is de werknaam voor Just another Notation. TODO: `S:np-VP` (niet
`S:NP-VP`), onderzoeksnotatie `S+ np-VP`, binaire bomen eerst en
meertakkigheid later, plus `heeft gebeten` ↔ `gebeten heeft`.
