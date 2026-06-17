

## v4504 · Main-controls naast SYNTAX-as

- De Main-projectiebalk toont nu de volledige reeks: Assen, Bron, LEX, SYN en LOG/FT.
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

- Bomen in Assen, Bron en LOG/FT krijgen een configureerbare weergave: `Boomruimte`.
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
- `start-local-viewer.bat` zet `PYTHONDONTWRITEBYTECODE=1`.
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


## v4449

- LEX-basisprojectie in Assen wordt niet meer gecomprimeerd: basisposities en traces blijven horizontaal gelijk aan de boomknopen.
- Alleen de vrije slots 0/1/2 staan bovenaan als lokale LEX-slots.


## v4449 update

- `commit_and_push.bat` wordt vanaf deze versie standaard meegeleverd in de ZIP-root.
- LOG/FT toont thematische rollen expliciet: `AGENS` voor subject/handelende deelnemer en `PATIENS` voor object/ondergaande deelnemer.
- De syntaxrollen blijven `subject` en `object`; de functionele projectie benoemt dezelfde lexicale bronnen thematisch.

## v4449

- Groei-presentatie verfijnd: lexicale leaves verschijnen niet meer tegelijk.
- Binnen dezelfde diepte/hoogte gebruikt Groei nu expliciete render-/presentatievolgorde: eerst bottom-up, bij gelijke hoogte boven-naar-beneden en daarna links-naar-rechts.
- Voor `HOND BIJT MAN` verschijnen `HOND`, `MAN` en `BIJT` dus in aparte tussenstappen voordat categorieknopen, OPN-slot en LEX-regels volgen.


## v4449 · stapsgewijze LEX-Wissels

- De boomgroei blijft deterministisch: binnen een groeilaag wordt gerenderd van boven naar beneden en daarna van links naar rechts.
- Flip/layout wijzigt de berekende posities; daardoor kan de groeivolgorde indirect veranderen, maar de renderregel blijft ruimtelijk: boven → beneden, links → rechts.
- In Assen verschijnt de LEX-as nu stapsgewijs: eerst de horizontale basisprojectie, daarna per stap één lokale Wissel met trace, daarna pas het volledige resultaat met projectiepanelen.
- Verplaatsingen blijven lokaal op de LEX-as; er komen geen verplaatsingslijnen vanuit de boom.

## v4449 · mobiele weergave

- Canvas staat op mobiel boven de bediening.
- Toolbar wordt horizontaal scrollbaar in plaats van hoog gestapeld.
- Introblok wordt op mobiel verborgen; status en zin blijven compact zichtbaar.
- SVG-canvas krijgt op mobiel een vaste brede werkbreedte met horizontale scroll, zodat de boom leesbaar blijft in plaats van te ver uit te zoomen.
- Auto-fit gebruikt op mobiel kleinere marge.
- Bij resize/orientatie wissel rendert de viewer opnieuw.


## v4449

- Layout op alle platforms stage-first gemaakt.
- Bovenaan: Projectie-window links, boom/canvas rechts.
- Toolbar, status, uitleg en bewerkpanelen volgen onder de stage.


## v4449 - beweeglijke boom/LEX-view

- Boom en LEX-as zijn niet meer vast in het canvas.
- Sleep in het SVG-canvas om de view te verplaatsen.
- Ctrl + muiswiel zoomt rond de cursor.
- Shift + muiswiel pant horizontaal.
- FIT herstelt de automatische view.

## v4449 · boom links, projectie rechts

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
- In portrait staat de Play-balk onder het grid met Reset direct ernaast; de Assen/LOG/FT-balk sluit daaronder aan.
- In landscape staat Play verticaal rechts in het boomvenster, met Reset en Assen/LOG/FT eronder.

## v4504 · Main-controls in het boomvenster

- Rechter vensterbalk blijft in het boomvenster en wordt rechts naast de SYNTAX-as gepositioneerd.
- Projectiereeks in Main is volledig: Assen, Bron, LEX, SYN en LOG/FT.
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

Free LEX insertions for adverbs are now documented as slot types with different scope. The base rule remains: reserve slots between visible LEX boxes and place the slot on vertical overlap when such overlap exists. The adverb type then determines the precise placement.

- Time: `GISTEREN`, `MORGEN` - usually `VP-BETWEEN`, optionally `S-LEFT` when fronted.
- Frequency: `VAAK`, `SOMS`, `ALTIJD` - `VP-BETWEEN`.
- Negation: `NIET` - separate `NEG`/`V-NEAR` slot.
- Manner: `SNEL`, `HARD`, `ZACHTJES` - `V-NEAR` or `VP-RIGHT`.
- Sentence adverb: `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS` - high `S/VP` or `S-LEFT`.
- Focus: `ALLEEN`, `OOK`, `ZELFS` - beside the focused phrase.
- Degree: `HEEL`, `ERG`, `ZEER` - internal to `AP/AdvP/NP`, not a general between-box slot.

The central tree is not rewritten. In this phase, adverbs belong to the LEX render layer or to phrase-internal slots.

See also: `docs/LEX_ADVERB_INSERT_SLOTS_EN.md`.

## v4511 - Config: zichtbare LEX-bijwoordinsert

- De Config-weergave is hersteld: de velden in `Dynamische boomweergave` overlappen niet meer.
- `LEX insertie` is apart en zichtbaar gemaakt als `Bijwoord / LEX-insert op LEX-as`.
- De bijwoordkeuze staat nu bij de concrete LEX-slotinstellingen:
  - aantal slots
  - slotpositie
  - bijwoord / inhoud
- Mobiel gebruikt dezelfde naamgeving.
- De Config-topbalk blijft sticky boven de scrollende instellingen.


## v4511 - Uitleg uit Config, naar Help/docs

- Het blok `Uitleg` wordt niet meer getoond in Config.
- Config blijft beperkt tot instellingen en beheer.
- Help bevat nu kaarten voor:
  - Boom eerst
  - Recursie-techniek in de boom
  - Bijwoord-inserts op de LEX-as
  - Render-uitleg
- Documentatie toegevoegd:
  - `docs/RENDER_EXPLANATION.md`
  - `docs/RENDER_EXPLANATION_EN.md`
- Engelse Help-tekst is mee bijgewerkt.

## v4511 - Oude tijdsinsertingtest verwijderd

- De eerdere vaste tijdsinsertingtest is uit de UI, Config, Help en documentatie verwijderd.
- Standaard: `LEX-slots: 0` en insertinhoud `slot leeg`.
- De nieuwere bijwoordplaatsingen blijven intact: tijd, frequentie, negatie, wijze, zinsbijwoord, focus en graad.
- De structurele plaatsingsmechaniek blijft gelijk: tussenbox/overlap/domeinslot; alleen het oude concrete testwoord is verwijderd.

## v4511 - VSO-! and VOS-! labels

VSO and VOS are now marked in the same way as OSV: `VSO-!` and `VOS-!`. The label means that the box approach cannot produce this order as a base alternative. Correct LEX rendering requires an explicit movement rule. Existing trees and existing flip behaviour remain untouched.

