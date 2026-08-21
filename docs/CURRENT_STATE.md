# Actuele contractlaag · v2.0.0-rc.15

> **Source build 20260821.17:** **Text** is uitsluitend de centrale uiting;
> **Context** is alles daaromheen. Beide zijn afzonderlijke Open Graph
> Notation-structuren; Context wordt later een geminimaliseerde boom. Iedere
> insertie behoort tot Context.
> Anafoor · multi-OGN berekent S1 en S2 afzonderlijk en componeert ze daarna
> star; één gezamenlijke LEX-as ordent S1 vóór S2. `relations[]` bevat alleen
> centrale Text-coreferentie. `HIJ` en `HEM` realiseren bestaande
> S2-Text-bronknopen op LEX; `GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` en
> `OMDAT` zijn zelfstandige Context-inserties zonder Text-boomknoop.
> Play toont eerst S1 en daarna S2, met alleen toegestane V2-Wissels, gevolgd
> door alle uitgelijnde Text-coreferenties en hun LEX-realisaties. **De boer
> slaat de ezel omdat hij hem bezit.** toont `BOER→HIJ` én `EZEL→HEM`;
> `BEZIT` blijft in de bijzin finaal. **De man slaat de hond omdat die hem
> heeft gebeten.** toont `HOND→DIE` en `MAN→HEM`. De actieve solver kiest per
> gedeclareerde binaire branch uit `normal`, `left-right`, `short-long` en
> `both`, plus één starre S2-shift; Play toont de gekozen flips atomair.
> Context blijft p.m. Definities en negen regressieparen staan in
> `ANAPHOR_AND_S1_S2_RELATION_DEFINITIONS.md` en
> `S1_S2_RELATION_TEST_FIXTURES.md`. Zie ook `MULTI_OGN_ANAPHOR.md`.

De leidende afleiding is:

```text
LOG-planning → horizontale LEX-projectie op bronhoogte → uitsluitend expliciete Wissels
```

Iedere bijwoord-minor vergroot de LOG-afstand tussen zijn begrenzende majors
met één vast slot. LOG plant mogelijke LEX-plaatsen, maar verplaatst zelf geen
bronwoord. De projectieoorsprong en de blijvende plaats zonder expliciete
regel zijn altijd de bronknoophoogte; bron → LEX is exact horizontaal. In
`HOND BIJT MAN` blijven HOND en MAN exact op hun bronhoogte en wisselt alleen
BIJT naar de vrije LEX-gridrij halverwege beide bronrijen. De
voorbeeldzin bepaalt de layout niet. `Syntax → Functional` zijn de centrale
views; `LEX / SYNT / LOG` zijn named projections en LOG blijft de zuidas. Zie
`../projectie-master-spec.md`.

Alle onderstaande v4540/v4430-tekst is historische ontwikkelnotitie en is
niet normatief waar zij hiermee botst.

---


## v4540 - Bijwoorden als externe LEX-slots

Bijwoordplaatsing blijft volledig op de LEX-as. `Boven S/NP/VP/V/PP/AP` betekent: plaats een extern LEX-slot verticaal net boven de gekozen syntactische hostbox. Het bijwoord wordt niet op de syntaxboom getekend en is geen projectie uit de basisboom. De host-subboom wordt lager gezet om ruimte te maken. Notatie: `LEX-ADV[..., axis=LEX, source=external, host=...]`.

# v4536 current-state note

Bijwoordplaatsing: bijwoorden staan niet meer tussen boxen. Zij worden als projectie-/plaatsingsbox boven een geldige syntactische categoriebox getekend: `S`, `NP`, `VP`, `V`, `PP`, `AP`.

---

## v4430 · LEX-as: projectie → Wissel → voorbeeldzin

De LEX-as heeft nu drie lagen: eerst horizontale basisprojectie, daarna lokale Wissels/traces, daarna het surface-resultaat als voorbeeldzin.

# Current state · OpenGraph Lite Viewer v4430

## v4430 · LEX-as is normatief de voorbeeldzin

De hoofdregel is nu strikt: de gevulde woorden op de LEX-as staan altijd in precies dezelfde volgorde als de geselecteerde voorbeeldzin. De boom kan een andere basisvolgorde hebben; de LEX-as realiseert de voorbeeldzin via lokale Wissels en traces.

# Current state · OpenGraph Lite Viewer v4430

## v4430 · Wissels realiseren de voorbeeldzin

De LEX-as is de plaats waar de woordvolgorde van de voorbeeldzin wordt gerealiseerd. De centrale boom wordt niet omgebouwd tot surface-volgorde. Waar de voorbeeldzin afwijkt van de basisboom, verschijnen lokale Wissels en traces op de LEX-as.

# Current state · OpenGraph Lite Viewer v4430

## v4430 · dynamische pasvorm

Assen, Bron en LOG gebruiken nu een dynamische presentatielaag voor de boomweergave. De layout blijft logisch hetzelfde, maar de projectie naar pixels is configureerbaar:

```text
compact        = gelijke HOR/VER-afstand
breed/lager   = grotere HOR-afstand, kleinere VER-afstand
breed+font    = idem, met grotere labels
auto-fit      = SVG-viewBox volgt de echte getekende inhoud
```

Hierdoor blijven vrije HOR-plaatsen herkenbaar, terwijl diepe bomen minder snel buiten het venster vallen.


## v4430 · horizontale LEX-projectie + lokale Wissel

De centrale boom projecteert elk lexicaal bronitem horizontaal naar zijn eigen bronpositie op de LEX-as. De LEX-as wordt daarna lokaal bewerkt met **Wissel**: een vrij slot wordt gevuld en de oude bronpositie wordt als trace getoond. De boom tekent dus geen verplaatsing naar de as en de LEX-projectie schuift bronitems niet omhoog naar woordvolgorde.

Concreet: in `HOND BIJT MAN` blijft `HOND` op zijn horizontale bronpositie. `BIJT` projecteert eerst horizontaal naar de V-bronpositie; daarna wisselt `BIJT` lokaal naar slot 2. Op de oude V-positie staat `t[V]`.


---

# Current state · OpenGraph Lite Viewer v4430

## v4430 · Wissel lokaal op de LEX-as

De centrale boom wordt niet meer gebruikt als vertrekpunt van de Wissel-tekening. De boom projecteert naar het gevulde LEX-slot. Daarna noteert de LEX-as zelf de plaatsingsregel: het vrije slot wordt gevuld, en de oude LEX-basispositie wordt als trace op de LEX-as weergegeven.


## v4430 · LEX-as volgt de voorbeeldzin

De LEX-as gebruikt de volgorde van de geselecteerde voorbeeldzin als oppervlaktestructuur. `Wissel` is nu een extra plaatsingsannotatie: het gevulde slot staat in voorbeeldzinvolgorde, de oude bronpositie wordt als trace getoond. Daarmee kan `HOND BIJT MAN`, `OMDAT HOND MAN BIJT`, `TRUI BREIT VROUW` en `HOND HEEFT MAN GEBETEN` rechtstreeks van boven naar beneden op de LEX-as worden gelezen.

## v4430 · V2/Wissel toegevoegd

Deze versie integreert de Nederlandse V2-plaatsingsregel op de LEX-as. Hoofdzinnen gebruiken een vrij `slot 2 · V2/PV`; de persoonsvorm of het eenvoudige predicaat wordt daar via **Wissel** geplaatst. De oude basispositie blijft zichtbaar als trace, bijvoorbeeld `t[V]` of `t[pv]`. Bijzinnen met `OMDAT` houden de werkwoordelijke basispositie en gebruiken geen V2-Wissel. Slot 1 blijft het vrije topicalisatie-/vooropplaatsingsslot.

De centrale OPN-boom krijgt daarom twee vrije slots vóór het gewone boommateriaal:

```text
slot 1 = TOPIC / vooropplaatsing
slot 2 = V2 / persoonsvorm
```

Voorbeeld: `TRUI BREIT VROUW` is opgenomen als topicalisatie-demo: `TRUI` blijft patiens/object; `VROUW` blijft agens/subject.

---

v4430 integreert thematische rollen in het lexicon en gebruikt die rollen bij de korte voorbeeldzinnen. Subject wordt in de huidige actieve patronen als `agens` geïnterpreteerd; object als `patiens`. De uitingenbouwer biedt alleen combinaties aan die bij het gekozen predicaat passen.

Voorbeelden:

```text
vrouw = agens
trui  = patiens
breit = agens:vrouw + patiens:trui
```

Daardoor wordt `VROUW BREIT TRUI` aangeboden, maar niet `TRUI BREIT VROUW`.

---

# Current state · OpenGraph Lite Viewer v4430

v4430 maakt `lexicon-editor.html` de primaire beheerlaag voor zowel het lexicon als de verzameling voorbeelduitingen. De aparte `examples-editor.html` blijft voorlopig aanwezig, maar is niet meer de hoofdroute.

## Nieuw in v4430

- `lexicon-editor.html` beheert nu `lexicon-config.html` én `examples-input.html`.
- Vooralsnog ondersteunt de editor korte zinnen:
  - hoofdzin: `S V O`;
  - omdat-bijzin: `OMDAT S O V`;
  - perfectum: `S AUX O VDW`.
- De editor leest lexemen uit het lexicon en structurele sources/slots uit `structure-config.html`.
- Export is gescheiden maar centraal:
  - `Download lexicon-config.html`;
  - `Download examples-input.html`.
- De viewer verwijst nu naar `Lexicon+uitingen-editor`.

## Workflow v4430

```text
lexicon-editor.html
→ lexemen beheren
→ korte uitingen beheren
→ lexicon-config.html downloaden
→ examples-input.html downloaden
→ beide bestanden vervangen
→ viewer hard herladen
```

---

# Current state · OpenGraph Lite Viewer v4430

v4430 bouwt voort op v4408 en voegt een echte lexicon-editor toe.

Belangrijk:
- De app blijft functioneel gelijk aan v4408 wat layout/groei betreft.
- `lexicon-config.html` blijft de leesbare lexiconbron.
- `lexicon-editor.html` kan die bron laden, valideren, uitbreiden en opnieuw exporteren.
- De voorbeeldeditor leest de uitgebreide lexemen uit `lexicon-config.html` voor subject/object/verb-keuzes.
- GitHub Pages gebruikt `.nojekyll`; publiceer bij voorkeur vanaf `main / root`.
- `debug.html` controleert nu ook of `lexicon-editor.html` bereikbaar is.

## Nieuwe lexicon-editor v4430

De editor ondersteunt:

```text
+ N / + V / + AUX / + COMP
zoeken/filteren
rollen: subject, object, predicate, aux, participle, comp, topic, modifier
sourceDefault uit structure-config.html
slotDefault uit structure-config.html
infinitive en participle/VDW voor werkwoorden
validatie van dubbele ids, ontbrekende labels en onbekende sources/slots
concept opslaan in localStorage
import/export van lexicon-config.html
```

Gebruikspad:

```text
lexicon-editor.html → Download lexicon-config.html → vervang bestand → examples-editor.html herladen
```

# Current state · OpenGraph Lite Viewer v4430

v4430 bouwt voort op v4407 en corrigeert de groeistatus bij wisselen tussen projecties.

Belangrijk:
- De app blijft functioneel gelijk aan v4406 wat layoutdoelen betreft.
- Layout wordt nog steeds volledig vooraf berekend.
- Groei verandert geen x/y-posities. Het bepaalt alleen welke reeds berekende elementen zichtbaar zijn.
- GitHub Pages gebruikt `.nojekyll`; publiceer bij voorkeur vanaf `main / root`.
- `debug.html` controleert of `index.html`, `styles.css`, `viewer.js`, `structure-config.html`, `examples-input.html`, `lexicon-config.html` en `.nojekyll` bereikbaar zijn.

## Correctie v4430

Bij wisselen van `Groei` naar de niet-ondersteunde `LEX`-projectie werd de groeistap in v4407 naar 0 geclamped. Daardoor bleven `Assen`, `Bron` en `LOG` daarna leeg zolang groei actief was.

Vanaf v4430 geldt:

```text
LEX ondersteunt groei niet, maar wist de groeistap niet.
Assen/Bron/LOG herstellen de laatst geldige groeistap.
Render/layout worden niet opnieuw door LEX bepaald.
```

## Groei-presentatie

Nieuwe bediening in het projectiepaneel:

```text
Groei checkbox
stap-slider
0 / ← / Play / →
```

Sneltoetsen:

```text
g = groei aan/uit
n = volgende stap
p = vorige stap
```

Groeivolgorde:

```text
0. raster/titels
1. leaves: HOND, BIJT, MAN / subject, predicate, object
2. kleinste categorie/role-nodes en hun boxes
3. grotere subtree-boxes
4. root S/CLAUSE
5. OPN-slot 1
6. LEX-projectie en projectiepanelen   [alleen in Assen-view]
```

Exacte stapnummers zijn afhankelijk van de diepte van de gekozen `structure-config`.

## Renderstatus

- Subtree-boxen worden als achtergrondlagen getekend: groot naar klein.
- Even grote subtree-boxen krijgen een vaste tie-break: boven→beneden, links→rechts, daarna oorspronkelijke layoutvolgorde.
- Box-captions worden pas na alle subtree-rects getekend.
- Node-shapes en node-labels zijn gescheiden lagen; labels liggen altijd bovenop.
- Groei-filtering gebeurt vóór het toevoegen van deze renderlagen aan SVG.

## Layoutstatus

- Syntax en functioneel gebruiken bottom-up recursieve vrije boxplaatsing.
- Projecties naar LEX zijn horizontaal.
- Layout order: `left-first` / `right-first`.
- Flipdoel: compact, align, normal, flip-all.
- Per-vertakking-config: top, VP/ARG-STRUCT, overig.

Functionele structuur:

```text
CLAUSE
├─ PRED
│  └─ predicate
└─ ARG-STRUCT
   ├─ ARG1
   │  └─ NP
   │     └─ subject
   └─ ARG2
      └─ NP
         └─ object
```

## Start/cache

Gebruik bij cacheproblemen eerst `reset-cache.html?v4430`; daarna opent de viewer als `index.html?v4430&fresh=...`. Debug meldt expliciet als root `index.html` niet de viewer is.


### v4430 LEX-as-volgorde

De LEX-as toont de gevulde woorden in de volgorde van `examples-input.html`. Wissels worden lokaal op de as getekend: oude basispositie/trace naar gevuld oppervlakte-slot. Horizontale projecties vanuit de boom mogen naar basis-/traceposities lopen, maar mogen de surface-volgorde niet herschikken.

## v4430 correctie

De LEX-as scheidt nu drie posities: het vrije surface-slot voor een Wissel, de horizontale basis-/bronpositie voor niet-gewisselde woorden, en de trace op die oude basispositie voor gewisselde woorden. Daardoor staat `MAN` in `HOND BIJT MAN` niet meer te hoog en komt `t[V]` op de bronhoogte van `BIJT`.

## v4430 correctie

De LEX-as scheidt nu drie posities: het vrije surface-slot voor een Wissel, de horizontale basis-/bronpositie voor niet-gewisselde woorden, en de trace op die oude basispositie voor gewisselde woorden. Daardoor staat `MAN` in `HOND BIJT MAN` niet meer te hoog en komt `t[V]` op de bronhoogte van `BIJT`.


### v4430 auto-min boomkeuze

De viewer kiest standaard per voorbeeldzin een centrale syntaxbron met source-volgorde gelijk aan de voorbeeldzinvolgorde. Daardoor worden LEX-Wissels alleen nog getekend wanneer de gekozen basisorder werkelijk afwijkt van de voorbeeldzin.


## v4430 takvolgorde

De standaardtakvolgorde is grammaticaal/normaal: `S → NP VP` en `VP → NP V`. De eerste child wordt links en hoger geplaatst; de tweede child rechts en lager. Hierdoor ligt de basisprojectie op de LEX-as in de verwachte volgorde: subject hoog, object daaronder, V/PV onderaan. Alleen expliciete vrije-slotregels zoals V2 of topicalisatie veroorzaken een Wissel en een trace.


## v4536 — eenvoudige documentatie LEX-plaatsingsregels

Toegevoegd: `docs/LEX_MOVEMENT_RULES.md`.

Kernregel:

```text
basisprojectie blijft staan
vrije slots worden gevuld
oude plek wordt trace
resultaat = voorbeeldzin
```

Beschreven zinstypen: hoofdzin, bijzin met OMDAT, topicalisatie, perfectum en voorlopige vraagzin.


## v4536 update

- `commit_and_push.bat` wordt vanaf deze versie standaard meegeleverd in de ZIP-root.
- LOG toont thematische rollen expliciet: `AGENS` voor subject/handelende deelnemer en `PATIENS` voor object/ondergaande deelnemer.
- De syntaxrollen blijven `subject` en `object`; de functionele projectie benoemt dezelfde lexicale bronnen thematisch.

## v4536 · mobiel

Mobiel gebruikt nu een aparte responsieve presentatie: eerst canvas, daarna bediening. Het canvas is horizontaal scrollbaar om de JAN-boom leesbaar te houden. De layoutregels zelf veranderen niet.





### NOORD-as (PM)

Naast west/LEX, oost/SYNTAX en zuid/LOGICAL is ook een NOORD-as mogelijk. Die is genoteerd als uitbreiding, maar nog niet gebruikt.


Aanvulling v4504: LEX vrije slots zijn plaatsbare insertiepunten op de LEX-as voor later materiaal uit andere LEX-assen/bomen en anafora. Boom vrije rijen blijven apart.


## v4504 · portrait split grid/menu

- In mobile portrait staat het rechter menu naast het grid in plaats van verborgen of onder het grid.
- De breedte van het grid wordt gemaximeerd op de actuele boom + assen.
- De grens tussen grid en rechter menu is sleepbaar/touchbaar: links/rechts schuiven past de verdeling aan.


## v4504 desktop LEX-insertie zichtbaar

De rechter desktop-config toont nu dezelfde LEX-insertieconfig als mobiel: LEX vrije slots, LEX insertie-inhoud en takverlenging door insertie. De insertie blijft een aparte box op de LEX-as; de gekozen takken/boxgrenzen worden alleen layoutmatig verlengd.

## v4504 · gridvenster en rechterkolom

Het gridvenster is niet langer een pannend subvenster. De actuele boom + assen bepalen de benodigde stage-breedte en -hoogte. De resterende breedte wordt toegewezen aan de rechterkolom. Gebruiker kan de rechterkolom via config verbreden of de grens handmatig slepen.


## v4504 · hoofdbeeld en config-scherm

Het hoofdbeeld is opnieuw ontworpen als grid-only view: boven het grid staan alleen het zinmenu en één knop **Config**. Alle andere instellingen zijn verplaatst naar een apart configuratiescherm met **Terug naar main**. Daardoor blijft de werkweergave schoon, terwijl projecties, Play/Groei, LEX-inserties, takverlenging, layout, export en documentatie in één config-scherm bereikbaar blijven.

## v4504 · strak passend raster rond boom + assen

- In het hoofdscherm volgt de SVG-viewBox nu exact de getekende boom plus projectie-assen.
- Het raster wordt dynamisch opnieuw opgebouwd binnen dezelfde fit-box; lege rastervelden rondom worden niet meer meegetekend.
- Hulplabels en het raster zelf tellen niet meer mee bij FIT.
- In Config blijft de ruimere aspect-fit beschikbaar voor beheer en vergelijking.


### v4504 — Main-bediening in boomvenster

- Main behoudt een vaste topbalk met alleen Zin en Config.
- De ZUID-volgorde staat nu als zichtbare pijlbediening onder in het boomvenster.
- In portrait staat de Play-balk onder het grid met Reset direct ernaast; de Assen/LOG-balk sluit daaronder aan.
- In landscape staat Play verticaal rechts in het boomvenster, met Reset en Assen/LOG eronder.


## v4504 · Main-controls naast SYNTAX-as

Main toont alle projectiekeuzes (Assen, Bron, LEX, SYN, LOG). In landscape staat de vensterbalk rechts naast de SYNTAX-as. `portrait-test.html` biedt een lokaal portrait-testvenster op desktop/laptop.

## v4504 · Main-controls in venster

De rechter Main-balk staat in het boomvenster, rechts naast de SYNTAX-as. De projectiereeks bevat Assen, Bron, LEX, SYN en LOG. De nieuwe ZUID/SOV-box met pijlen staat op de oude ZUID-badgeplek; de oude badge wordt niet meer zichtbaar getoond.


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



## v4506 - LEX-bijwoordslots

Vrije LEX-inserts voor bijwoorden zijn nu gedocumenteerd als slottypen met verschillende scope. De basisregel blijft: reserveer slots tussen zichtbare LEX-boxen en plaats het slot op verticale overlap als die bestaat. Daarna bepaalt het bijwoordtype de exacte plaatsing.

- Tijd: `GISTEREN`, `MORGEN` - meestal `VP-BETWEEN`, eventueel `S-LEFT` bij vooropplaatsing.
- Frequentie: `VAAK`, `SOMS`, `ALTIJD` - `VP-BETWEEN`.
- Negatie: `NIET` - apart `NEG`/`V-NEAR` slot.
- Wijze: `SNEL`, `HARD`, `ZACHTJES` - `V-NEAR` of `VP-RIGHT`.
- Zinsbijwoord: `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS` - hoog `S/VP` of `S-LEFT`.
- Focus: `ALLEEN`, `OOK`, `ZELFS` - bij de gefocuste phrase.
- Graad: `HEEL`, `ERG`, `ZEER` - intern in `AP/AdvP/NP`, dus geen algemene hostloze bijwoordpositie.

De centrale boom wordt niet herschreven. Bijwoorden horen in deze fase in de LEX-renderlaag of in phrase-interne slots.

Zie ook: `docs/LEX_ADVERB_INSERT_SLOTS.md`.

## v4536 - Oude tijdsinsertingtest verwijderd

De eerdere vaste tijdsinsertingtest is uit de standaardconfiguratie gehaald. Vrije LEX-slots staan standaard uit (`LEX-slots: 0`) en de insertinhoud staat standaard op `slot leeg`. De overige bijwoordcategorieën en plaatsingsregels blijven beschikbaar via Config → Projectie-instellingen → Bijwoord / LEX-insert op LEX-as.

## v4536 - Config leesbaar en LEX-bijwoordkeuze zichtbaar

De bijwoord/LEX-insertinstelling is uit de compacte boomweergavegrid gehaald en staat nu in een eigen blok. Daarmee is zichtbaar waar GISTEREN, VAAK, NIET, SNEL, MISSCHIEN enz. gekozen worden. De centrale boom blijft ongewijzigd; de keuze vult alleen vrije slots op de LEX-as.

## v4536 - VSO-! and VOS-! labels

VSO and VOS are now marked in the same way as OSV: `VSO-!` and `VOS-!`. The label means that the box approach cannot produce this order as a base alternative. Correct LEX rendering requires an explicit movement rule. Existing trees and existing flip behaviour remain untouched.




- De editor kan afbeeldingen toevoegen, verwijderen, vervangen, dupliceren, de volgorde wijzigen en Nederlandse/Engelse toelichting aanpassen.
- Exportmogelijkheden:
  - `slides.json`
  - zelfstandige `index.html`
- Engelse knoppen/tooltips en Engelstalige toelichting zijn mee bijgewerkt.






- `Bewaar lokaal` wordt automatisch geladen na refresh/opnieuw openen.
- Tonen/niet tonen staat direct in de slidelijst.
- Vorige/volgende staan op vaste positie boven de tekst; de afbeelding staat midden-hoog.



- `Bewaar lokaal` bewaart nu een volledige editorstate, inclusief `tonen/niet tonen` per slide.
- `slides.json` schrijft per slide expliciet `visible: true` of `visible: false`.


- Bij heropenen wordt eerst de huidige v4526-opslag geladen. Oudere opslag wordt alleen als import gebruikt wanneer er nog geen v4526-opslag bestaat.
- `toon/niet tonen` wordt exact per slide opgeslagen. Een uitgevinkt vakje blijft uitgevinkt na `Bewaar lokaal`, sluiten en heropenen.
- Oude opslagkeys blijven staan als veiligheidskopie en worden niet automatisch verwijderd bij bewaren.


## v4536 - LEX slot 0 boven S

Slot 0 op de LEX-as staat in de gecombineerde Assen-weergave weer boven de centrale S/CLAUSE-root. Bronknopen blijven op hun eigen hoogte; alleen de lokale LEX-systeemslots starten hoger.
