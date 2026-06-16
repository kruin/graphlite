# OpenGraph Lite Viewer v4481

## v4481 — mobile portrait grid-first

- Mobile portrait: grid/boomvenster staat standaard helemaal bovenaan; header, projectiebalk, zinmenu en toolbar staan niet meer boven het grid.
- Nieuwe config `portrait_menu_slots`: ruimte boven het grid voor 0, 1 of 2 toekomstige menuhoogtes; standaard 0.
- Gridvensterhoogte wordt in portrait afgeleid van de actuele viewBox/tekening, zodat het venster niet groter is dan nodig voor boom + assen.
- Config is beschikbaar in Projectie-instellingen en in het mobiele menu.

# OpenGraph Lite Viewer v4481

## v4481 — carousel fix en documentatie-integratie

- Carousel laadt nu met cacheversies: `carousel/index.html?v4481`, `carousel.js?v4481` en `slides.json?v4481`.
- Carousel heeft een fallback in `carousel.js`, zodat de slide-teksten blijven werken wanneer `slides.json` niet geladen wordt.
- Debug test nu ook de carousel, `slides.json` en de eerste slide-afbeelding.
- Viewer- en docs-teksten noemen de carousel expliciet als aparte uitleglaag naast de interactieve graph-viewer.

# OpenGraph Lite Viewer v4481

## v4481 — mobile Play consistent boven

- Mobile portrait gebruikt nu dezelfde bovenbalk voor Groei/Play als landscape.
- De aparte portrait mini-groeibalk boven de onderbalk is visueel uitgeschakeld.
- De mobiele onderbalk blijft voor zin-navigatie, FIT en Meer.
- Cacheversies bijgewerkt naar `v4481`.

# OpenGraph Lite Viewer — PWA v4481

## v4481 — mobile portrait Play-fix

- In mobile portrait werd de sticky Groei-balk verborgen, waardoor `Play` niet bereikbaar was.
- Toegevoegd: vaste mini-Groei-balk boven de mobiele onderbalk met `0`, `←`, `Play/Pauze`, `→` en staplabel.
- Dezelfde knoppen blijven gekoppeld aan de bestaande groei-state; geen tweede groeimodus.
- Cacheversie verhoogd naar `v4481`.

## v4451 — correctie groei-start

- Groei aanzetten blijft nu op `stap 0`: alleen raster/titels.
- `Volgende` of `Play` toont daarna eerst de wortel/topknoop, niet een geïsoleerde terminal zoals `HOND`.
- De view zoomt tijdens groei niet meer in op één zichtbare knoop; het groeipodium blijft stabiel.

---


## v4450 — documentatie plaatsingsregels

Toegevoegd: `docs/LEX_MOVEMENT_RULES.md`.

Kern:

```text
eerst horizontale basisprojectie
dan lokale Wissels naar vrije slots 0/1/2
verplaatste knoop laat trace achter
resultaat leest als voorbeeldzin
```

Zinstypen: hoofdzin, bijzin met OMDAT, topicalisatie, perfectum en voorlopige vraagzin.

---


## v4450 — lokale Wissel op de LEX-as

V2 en topicalisatie worden niet meer als verplaatsing vanuit de centrale boom naar de as getekend. De centrale boom projecteert naar het gevulde LEX-slot. De Wissel zelf staat lokaal op de LEX-as; de oude basispositie verschijnt daar als trace.


## v4450 — lexicon- en uitingeneditor

`lexicon-editor.html` is nu de centrale editor voor:

```text
lexicon-config.html
examples-input.html
```

Vooralsnog beheert de editor korte zinnen:

```text
hoofdzin:       S V O
omdat-bijzin:  OMDAT S O V
perfectum:     S AUX O VDW
```

De aparte `examples-editor.html` blijft voorlopig aanwezig, maar de hoofdroute is nu de gecombineerde `lexicon-editor.html`.
Nieuw in deze patch:

```text
lexemen krijgen thematische rollen: agens, patiens, enz.
predicaten krijgen eenvoudige selectieframes: toegestane agens- en patiens-lexemen
de uitingenbouwer filtert op plausibele combinaties
```

Voorbeeld: `vrouw` kan als agens bij `breit`; `trui` is patiens en wordt niet meer als agens aangeboden.


Workflow:

```text
lexicon-editor.html
→ lexemen en korte uitingen beheren
→ Download lexicon-config.html
→ Download examples-input.html
→ beide bestanden vervangen
→ viewer hard herladen
```

---

Browser-native proefversie van **OpenGraphEd Lite** voor **JAN — Open Notation**.

## Doel van deze fase

Deze versie beperkt de test bewust tot drie stappen:

1. maak eerst de centrale boom voor `HOND BIJT MAN` correct;
2. teken daarna de LEX-projectie;
3. regel pas daarna lokaal op de LEX-as het uitingtype `OMDAT HOND MAN BIJT`.

De centrale boom blijft invariant. `OMDAT` wordt niet in de centrale syntaxboom ingevoegd. Lidwoorden/determinatoren zijn uit deze systeemlaag verwijderd.


## v4450 — lexicon-editor

Toegevoegd:

```text
lexicon-editor.html
```

Functie:

- bestaand `lexicon-config.html` laden;
- lexemen toevoegen voor N, V, AUX en COMP;
- lexemen dupliceren/verwijderen;
- rollen instellen: subject, object, predicate, aux, participle, comp;
- `sourceDefault` en `slotDefault` kiezen op basis van `structure-config.html`;
- valideren op dubbele IDs, ontbrekende labels en onbekende sources/slots;
- concept bewaren in browser;
- nieuwe `lexicon-config.html` downloaden of opslaan.

Workflow:

```text
lexicon-editor.html
→ lexemen aanpassen
→ Download lexicon-config.html
→ bestand vervangen in viewer-map
→ examples-editor.html / viewer hard herladen
```

## Recursieve syntaxboom

De syntaxboom wordt niet top-down met vaste handmatige posities geschreven. De layout gebruikt een bottom-up rekengang:

1. bereken eerst alle leaf-boxes;
2. bereken daarna elke parent-subtree uit de reeds berekende child-boxes;
3. plaats child-subtrees als complete boxen op de eerste vrije HOR/VER-positie;
4. reserveer gebruikte rijen, kolommen en boxruimte;
5. render pas daarna de boxen, lijnen en knopen.

De structurele volgorde blijft left-first, maar de tekenvolgorde is bottom-up:

```text
HOND / MAN / BIJT
→ V(BIJT), NP(MAN), NP(HOND)
→ VP(NP(MAN), V(BIJT))
→ S(NP(HOND), VP(...))
```

De centrale syntaxboom is:

```text
S
├─ NP
│  └─ HOND
└─ VP
   ├─ NP
   │  └─ MAN
   └─ V
      └─ BIJT
```

## Recursieve OPN-functionele structuur

De OPN-functionele structuur gebruikt dezelfde bottom-up gedachte, maar de inhoud is nu expliciet gesplitst:

```text
CLAUSE
├─ PRED
│  └─ root: predicate
└─ ARG-STRUCT
   ├─ ARG1
   │  └─ NP
   │     └─ subject
   └─ ARG2
      └─ NP
         └─ object
```

Dus niet meer:

```text
CLAUSE → AGENS PRED PATIENS
```

maar:

```text
CLAUSE → PRED ARG-STRUCT
ARG-STRUCT → ARG1 ARG2
```

Daardoor kan de structuur vrijer worden: `PRED` en `ARG-STRUCT` zijn eigen subtree-boxes, en de argumenten zitten niet meer als losse role-boxen direct onder `CLAUSE`. De vrije HOR/VER-boxplaatsing zoekt voor elke subtree opnieuw een vrije positie.

De plaatsing heeft een menuconfiguratie:

- `left-first`: eerste child-subtree zoekt eerst links, daarna alternerend;
- `right-first`: dezelfde structuur, maar de eerste child-subtree zoekt eerst rechts; de tweede zoekt daarna links. Er worden geen rollen of lexicale posities gewisseld.

Deze keuze staat in het menu **Layout order** en wordt meegenomen in JSON/.OPN-export.

## Projecties

- **Bron**: toont de gekozen OPN-bron: syntaxboom of functionele structuur.
- **LEX**: toont de lokale uitingtype-regel.
- **SYNTAX-projectie**: toont alleen regels, geen rollenboom.
- **LOG/FT**: toont de OPN-functionele structuur.

## Start lokaal

Dubbelklik in deze map op:

```bat
start-local-viewer.bat
```

Open daarna:

```text
http://localhost:8088
```

Gebruik na updates zo nodig `Ctrl+F5` of verwijder de oude service worker.

## Testpunten

1. Open `Bron → OPN · syntaxboom` en controleer de bottom-up vrije boxplaatsing.
2. Open `Bron → OPN · functionele structuur` en wissel `Layout order`, `Flipdoel` en de branch-overrides.
3. Controleer dat `AGENS/PRED/PATIENS` niet als binaire boom worden behandeld.
4. Open `Assen` en controleer dat LEX apart blijft.
5. Kies `OMDAT HOND MAN BIJT` en controleer dat alleen de LEX-as verandert.

## v4450-correctie functioneel

`OPN · functionele structuur` tekent nu zichtbaar `CLAUSE > AGENS/PRED/PATIENS`. `BIJT` is alleen de leaf onder `PRED` en mag dus niet meer als centrale root van een driehoek verschijnen.

## v4450-noot

De header/subtitel is bewust gelijk gehouden: **Redesign: eerst syntax-tree, daarna LEX-projectie, daarna lokale LEX-regel.**  
Om te voorkomen dat de browser alleen `index.html` vernieuwt maar een oude `viewer.js` houdt, laadt `index.html` nu `viewer.js?v4450` en `styles.css?v4450`.


## v4450 — OPN-slot voor vooropplaatsing

De OPN-bronnen reserveren nu expliciet een plaats voor vooropplaatsing/topicalisatie:

- in de OPN-syntaxboom: tussen `S` en de bovenste boomlaag;
- in de OPN-functionele structuur: tussen `CLAUSE` en de bovenste role-boxen;
- in de LEX-projectie: `slot 1 · vooropplaatsing` projecteert horizontaal mee met de OPN-bron;
- `slot 0 · Comp/(om)dat` blijft het hogere lokale LEX-slot voor bijzinnen.

De functionele structuur heeft daarmee, net als de syntaxboom, een eigen LEX-projectie. De functionele structuur blijft n-ary en gebruikt de config `left-first` / `right-first` voor de vrije role-boxplaatsing.


## v4450 — voorbeeldzinnen als HTML-input

De actieve voorbeeldzinnen staan nu ook in `examples-input.html`.

- `<strong>` markeert het gekozen subject.
- `<em>` markeert het gekozen object.
- De viewer leest deze HTML-input bij opstarten wanneer hij via de lokale server draait.
- De oude **Wissel S/O**-route is uit de hoofdviewer verwijderd, omdat die gemakkelijk onwaarschijnlijke combinaties maakt, zoals `trui` als agens.

Actieve beginvoorbeelden:

```html
<strong>HOND</strong> BIJT <em>MAN</em>
OMDAT <strong>HOND</strong> <em>MAN</em> BIJT
```

## v4450 — voorbeeldzinnen-editor

Toegevoegd:

```text
examples-editor.html
```

Functie:

- voorbeelden toevoegen;
- voorbeelden verwijderen;
- voorbeeld kopiëren;
- tokens bewerken;
- subject/object markeren;
- subject/object-vulling wisselen;
- LEX-regel kiezen;
- source/slot per token instellen;
- `examples-input.html` downloaden of via Chrome/Edge opslaan als HTML.

Conventie blijft:

```html
<strong>SUBJECT</strong>
<em>OBJECT</em>
```

De viewer leest `examples-input.html` bij start. Na wijziging via de editor: download de nieuwe `examples-input.html`, vervang het bestand in de viewer-map en herlaad de viewer hard met `Ctrl+F5`.


## v4450 — structure-config als eerste stap

De werkwijze is aangescherpt:

1. Bewerk eerst `structure-config.html` via `structure-editor.html`.
2. De syntax-config bevat **geen lexicale woorden** meer. Zij bevat alleen abstracte structurele posities/projectiebronnen.
3. Lexicale woorden zoals `hond`, `man`, `vrouw`, `trui`, `bijt` en `breit` staan uitsluitend in `lexicon-config.html` en in de voorbeeldzinnen.

Correct basispatroon:

```text
s:S [cat=S] -> np-subj vp
np-subj:NP [cat=NP] -> subj
subj:{subject} [leaf role=subject source=subject cat=N]
vp:VP [cat=VP] -> np-obj v
np-obj:NP [cat=NP] -> obj
obj:{object} [leaf role=object source=object cat=N]
v:V [cat=V] -> pred
pred:{predicate} [leaf role=predicate source=predicate cat=V]
```

Functioneel idem: n-ary role-boxes met dezelfde abstracte sources `subject`, `predicate` en `object`.

De knop `Voorbeeld VP: NP-VP / VP: pv-VDW` maakt een nieuwe VP-regelset met structurele posities `pv` en `vdw`; dat zijn dus geen lexicale items.

## v4450 — bescheiden lexicon

Er is nu een aparte lexiconbron toegevoegd:

```text
lexicon-config.html
```

De voorbeeldzinnen-editor gebruikt dit lexicon voor de zichtbare woordvulling. De structure-config blijft verantwoordelijk voor de boomstructuur en de projectiebronnen.

Startlexicon:

- NP/N: `man`, `hond`, `kat`, `vrouw`, `trui`
- V: `bijt(en)`, `brei(en)`
- AUX: `heeft`, `hebben`, `is`
- COMP: `omdat`, `dat`

De editor houdt daarom twee lagen uit elkaar:

```text
lexeme = zichtbaar woord
source  = structurele projectiebron
```

Voorbeeld: `VROUW` kan als subject zichtbaar zijn, maar blijft projecteren naar de structurele subjectbron.

## v4450 — perfectumregel

Toegevoegd aan de structure-laag:

```text
vp:VP [cat=VP] -> np-obj vp-perfectum
vp-perfectum:VP [cat=VP] -> pv vdw
pv:{pv} [leaf role=aux source=pv cat=AUX]
vdw:{vdw} [leaf role=participle source=vdw cat=V]
```

Deze regel beschrijft het perfectum `heeft gebeten` structureel als twee projectiebronnen:

- `pv` = persoonsvorm / hulpwerkwoord, bijvoorbeeld `HEEFT`
- `vdw` = voltooid deelwoord, bijvoorbeeld `GEBETEN`

De lexicale woorden blijven in `lexicon-config.html`; de structure-config bevat alleen posities en bronnen. De voorbeeldzinnen-editor heeft een patroon `perfectum: S HEEFT O VDW`. Lidwoorden zijn verwijderd.

## v4450 — functional config: PRED apart, ARG-STRUCT apart

De functionele configuratie is aangepast van `CLAUSE → AGENS PRED PATIENS` naar `CLAUSE → PRED ARG-STRUCT`. `ARG-STRUCT` bevat `ARG1` en `ARG2`, elk met een eigen NP-subtree. Hierdoor worden predicaat en argumentstructuur als eigen vrije subtree-boxes behandeld.

## v4450 — lidwoorden verwijderd

Lidwoorden/determinatoren zijn verwijderd uit voorbeeldzinnen, lexicon, LEX-slots, viewer-fallback en voorbeeldeditor. Voorbeelden gebruiken nu kale NP/N-vulling: `de man` → `man`, `de hond` → `hond`.


## Layout order

`left-first/right-first` geldt voor syntax én functioneel. Deze keuze stuurt de zoekrichting van vrije plaatsing; het is geen inhoudelijke transformatie.

## v4450 — flip per vertakking

Nieuwe menuconfiguratie:

```text
Flipdoel:
- doel: compact · auto per vertakking
- doel: align subj/agens + obj/patiens
- globaal: normaal
- globaal: flip alle vertakkingen

Branch-overrides:
- Top S/CLAUSE
- VP / ARG-STRUCT
- Overig
```

Default:

```text
Layout order = left-first
Flipdoel = auto-compact
Top S/CLAUSE = auto
VP / ARG-STRUCT = auto
Overig = auto
```

`auto-compact` probeert bij elke vertakking de normale en geflipte childvolgorde en kiest de compactste subtree-box. `auto-align` kiest per vertakking met voorkeur voor verticale alignment van overeenkomstige rollen, bijvoorbeeld `subject/AGENS` en `object/PATIENS`. Handmatige overrides kunnen per branchklasse `normaal` of `flip` afdwingen.

De flip verandert alleen de plaatsingsvolgorde van complete subtree-boxes. Grammaticale rollen, sources en lexicale vulling veranderen niet.

## v4401+ — projectdocumentatie

Deze versie bevat een vaste `docs/`-map met projectcontext, ontwerpbeslissingen, layoutspecificatie, configuratiespecificatie, lexicon/voorbeeldspecificatie, current state, known issues, next steps en release notes. Deze documenten vormen vanaf nu de canonieke context voor handleiding en technische documentatie.


## v4450 — flip per vertakking

Menuconfiguratie toegevoegd:

```text
Flipdoel:
- compact · auto per vertakking
- align subj/agens + obj/patiens
- globaal normaal
- globaal flip alle vertakkingen

Branch-overrides:
- Top S/CLAUSE
- VP / ARG-STRUCT
- Overig
```

Default:

```text
Layout order = left-first
Flipdoel = auto-compact
Top / VP-ARG / Overig = auto
```

`auto-compact` probeert per vertakking normale en geflipte childvolgorde en kiest de kleinste box. `auto-align` probeert daarnaast verticale rolcorridors te benaderen, bijvoorbeeld `subject/AGENS` en `object/PATIENS`. Dit blijft layout; rollen en lexicale bronnen worden niet gewisseld.


### v4450 startdiagnose
Open bij startproblemen `reset-cache.html?v4450` of `debug.html?v4450`. De debug controleert nu of de root-index daadwerkelijk de viewer is.



## v4450 — expliciete render-volgorde

De derde stap is nu strikt een tekenlaag:

1. subtree-box rects;
2. subtree-box captions;
3. takken/lijnen;
4. OPN-slot;
5. node-shapes;
6. node-labels.

Equal-size subtree-boxes worden deterministisch getekend: boven naar beneden, links naar rechts, daarna oorspronkelijke layoutvolgorde. Leaf-nodes zoals HOND, BIJT en MAN zijn geen subtree-boxen; zij worden in de node-lagen getekend, met labels altijd bovenop.

## v4450 root-index fix
`docs/index.html` is vervangen door `docs/docs-home.html`; `viewer.html` is toegevoegd als fallback. Gebruik `debug.html?v4450` om te testen of root `index.html` echt de viewer is.

## v4450 — groei-presentatie

De viewer bevat nu een aparte groei-presentatie. De volledige layout wordt eerst berekend; daarna toont de renderlaag stapsgewijs elementen met `growthStep <= huidige stap`.

Groeivolgorde:

```text
0. raster/titels
1. leaves
2. kleinste categorie/role-nodes en subtree-boxes
3. grotere subtree-boxes
4. root S/CLAUSE
5. OPN-slot 1
6. LEX-projectie en projectiepanelen   [Assen-view]
```

Bediening:

```text
Groei checkbox
slider
0 / ← / Play / →
g = toggle groei
n = volgende stap
p = vorige stap
```

Belangrijk: groei is presentatie, geen layout. Posities blijven stabiel tijdens het afspelen.


## v4450-correctie groei/projectiewissel

`LEX` is geen groei-projectie. In v4407 kon wisselen naar `LEX` de globale groeistap naar 0 zetten, waardoor `Assen`, `Bron` en `LOG/FT` leeg bleven zolang groei actief was. v4450 bewaart de laatst geldige groeistap en clamped alleen in ondersteunde groei-projecties.

## v4450 takvolgorde

De standaardtakvolgorde is grammaticaal/normaal: `S → NP VP` en `VP → NP V`. De eerste child wordt links en hoger geplaatst; de tweede child rechts en lager. Hierdoor ligt de basisprojectie op de LEX-as in de verwachte volgorde: subject hoog, object daaronder, V/PV onderaan. Alleen expliciete vrije-slotregels zoals V2 of topicalisatie veroorzaken een Wissel en een trace.


## v4450 update

- `commit_and_push.bat` wordt vanaf deze versie standaard meegeleverd in de ZIP-root.
- LOG/FT toont thematische rollen expliciet: `AGENS` voor subject/handelende deelnemer en `PATIENS` voor object/ondergaande deelnemer.
- De syntaxrollen blijven `subject` en `object`; de functionele projectie benoemt dezelfde lexicale bronnen thematisch.

## v4450 — mobiele weergave

De viewer gebruikt op kleine schermen een mobiele presentatie: canvas eerst, controls daaronder, horizontaal scrollbare toolbar en horizontaal scrollbaar canvas. Dit voorkomt dat de boom op telefoon te klein wordt door volledige auto-fit in een smal portretvenster.


## v4450 - beweeglijke boom/LEX-view

- Boom en LEX-as zijn niet meer vast in het canvas.
- Sleep in het SVG-canvas om de view te verplaatsen.
- Ctrl + muiswiel zoomt rond de cursor.
- Shift + muiswiel pant horizontaal.
- FIT herstelt de automatische view.


## v4481 · gridvenster bovenaan op alle platforms

- Grid/boomvenster staat nu op alle platforms bovenaan, niet alleen in mobile portrait.
- Projectiekeuze, zinmenu, groei/play, toolbar, status en documentatie staan onder het grid.
- Canvas-hoogte gebruikt de actuele viewBox, zodat het gridvenster niet groter wordt dan nodig voor boom + assen.


## v4481 · portrait split grid/menu

- In mobile portrait staat het rechter menu naast het grid in plaats van verborgen of onder het grid.
- De breedte van het grid wordt gemaximeerd op de actuele boom + assen.
- De grens tussen grid en rechter menu is sleepbaar/touchbaar: links/rechts schuiven past de verdeling aan.


## v4481 desktop LEX-insertie zichtbaar

De rechter desktop-config toont nu dezelfde LEX-insertieconfig als mobiel: LEX vrije slots, LEX insertie-inhoud en takverlenging door insertie. De insertie blijft een aparte box op de LEX-as; de gekozen takken/boxgrenzen worden alleen layoutmatig verlengd.


## v4481 · hoofdbeeld en config-scherm

Het hoofdbeeld is opnieuw ontworpen als grid-only view: boven het grid staan alleen het zinmenu en één knop **Config**. Alle andere instellingen zijn verplaatst naar een apart configuratiescherm met **Terug naar main**. Daardoor blijft de werkweergave schoon, terwijl projecties, Play/Groei, LEX-inserties, takverlenging, layout, export en documentatie in één config-scherm bereikbaar blijven.
