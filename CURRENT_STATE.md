# Current state · OpenGraph Lite Viewer v4417

## v4417 · dynamische pasvorm

Assen, Bron en LOG/FT gebruiken nu een dynamische presentatielaag voor de boomweergave. De layout blijft logisch hetzelfde, maar de projectie naar pixels is configureerbaar:

```text
compact        = gelijke HOR/VER-afstand
breed/lager   = grotere HOR-afstand, kleinere VER-afstand
breed+font    = idem, met grotere labels
auto-fit      = SVG-viewBox volgt de echte getekende inhoud
```

Hierdoor blijven vrije HOR-plaatsen herkenbaar, terwijl diepe bomen minder snel buiten het venster vallen.


## v4417 · horizontale LEX-projectie + lokale Wissel

De centrale boom projecteert elk lexicaal bronitem horizontaal naar zijn eigen bronpositie op de LEX-as. De LEX-as wordt daarna lokaal bewerkt met **Wissel**: een vrij slot wordt gevuld en de oude bronpositie wordt als trace getoond. De boom tekent dus geen verplaatsing naar de as en de LEX-projectie schuift bronitems niet omhoog naar woordvolgorde.

Concreet: in `HOND BIJT MAN` blijft `HOND` op zijn horizontale bronpositie. `BIJT` projecteert eerst horizontaal naar de V-bronpositie; daarna wisselt `BIJT` lokaal naar slot 2. Op de oude V-positie staat `t[V]`.


---

# Current state · OpenGraph Lite Viewer v4417

## v4417 · Wissel lokaal op de LEX-as

De centrale boom wordt niet meer gebruikt als vertrekpunt van de Wissel-tekening. De boom projecteert naar het gevulde LEX-slot. Daarna noteert de LEX-as zelf de plaatsingsregel: het vrije slot wordt gevuld, en de oude LEX-basispositie wordt als trace op de LEX-as weergegeven.


## v4417 · LEX-as volgt de voorbeeldzin

De LEX-as gebruikt de volgorde van de geselecteerde voorbeeldzin als oppervlaktestructuur. `Wissel` is nu een extra plaatsingsannotatie: het gevulde slot staat in voorbeeldzinvolgorde, de oude bronpositie wordt als trace getoond. Daarmee kan `HOND BIJT MAN`, `OMDAT HOND MAN BIJT`, `TRUI BREIT VROUW` en `HOND HEEFT MAN GEBETEN` rechtstreeks van boven naar beneden op de LEX-as worden gelezen.

## v4417 · V2/Wissel toegevoegd

Deze versie integreert de Nederlandse V2-plaatsingsregel op de LEX-as. Hoofdzinnen gebruiken een vrij `slot 2 · V2/PV`; de persoonsvorm of het eenvoudige predicaat wordt daar via **Wissel** geplaatst. De oude basispositie blijft zichtbaar als trace, bijvoorbeeld `t[V]` of `t[pv]`. Bijzinnen met `OMDAT` houden de werkwoordelijke basispositie en gebruiken geen V2-Wissel. Slot 1 blijft het vrije topicalisatie-/vooropplaatsingsslot.

De centrale OPN-boom krijgt daarom twee vrije slots vóór het gewone boommateriaal:

```text
slot 1 = TOPIC / vooropplaatsing
slot 2 = V2 / persoonsvorm
```

Voorbeeld: `TRUI BREIT VROUW` is opgenomen als topicalisatie-demo: `TRUI` blijft patiens/object; `VROUW` blijft agens/subject.

---

v4417 integreert thematische rollen in het lexicon en gebruikt die rollen bij de korte voorbeeldzinnen. Subject wordt in de huidige actieve patronen als `agens` geïnterpreteerd; object als `patiens`. De uitingenbouwer biedt alleen combinaties aan die bij het gekozen predicaat passen.

Voorbeelden:

```text
vrouw = agens
trui  = patiens
breit = agens:vrouw + patiens:trui
```

Daardoor wordt `VROUW BREIT TRUI` aangeboden, maar niet `TRUI BREIT VROUW`.

---

# Current state · OpenGraph Lite Viewer v4417

v4417 maakt `lexicon-editor.html` de primaire beheerlaag voor zowel het lexicon als de verzameling voorbeelduitingen. De aparte `examples-editor.html` blijft voorlopig aanwezig, maar is niet meer de hoofdroute.

## Nieuw in v4417

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

## Workflow v4417

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

# Current state · OpenGraph Lite Viewer v4417

v4417 bouwt voort op v4408 en voegt een echte lexicon-editor toe.

Belangrijk:
- De app blijft functioneel gelijk aan v4408 wat layout/groei betreft.
- `lexicon-config.html` blijft de leesbare lexiconbron.
- `lexicon-editor.html` kan die bron laden, valideren, uitbreiden en opnieuw exporteren.
- De voorbeeldeditor leest de uitgebreide lexemen uit `lexicon-config.html` voor subject/object/verb-keuzes.
- GitHub Pages gebruikt `.nojekyll`; publiceer bij voorkeur vanaf `main / root`.
- `debug.html` controleert nu ook of `lexicon-editor.html` bereikbaar is.

## Nieuwe lexicon-editor v4417

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

# Current state · OpenGraph Lite Viewer v4417

v4417 bouwt voort op v4407 en corrigeert de groeistatus bij wisselen tussen projecties.

Belangrijk:
- De app blijft functioneel gelijk aan v4406 wat layoutdoelen betreft.
- Layout wordt nog steeds volledig vooraf berekend.
- Groei verandert geen x/y-posities. Het bepaalt alleen welke reeds berekende elementen zichtbaar zijn.
- GitHub Pages gebruikt `.nojekyll`; publiceer bij voorkeur vanaf `main / root`.
- `debug.html` controleert of `index.html`, `styles.css`, `viewer.js`, `structure-config.html`, `examples-input.html`, `lexicon-config.html` en `.nojekyll` bereikbaar zijn.

## Correctie v4417

Bij wisselen van `Groei` naar de niet-ondersteunde `LEX`-projectie werd de groeistap in v4407 naar 0 geclamped. Daardoor bleven `Assen`, `Bron` en `LOG/FT` daarna leeg zolang groei actief was.

Vanaf v4417 geldt:

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

Gebruik bij cacheproblemen eerst `reset-cache.html?v4417`; daarna opent de viewer als `index.html?v4417&fresh=...`. Debug meldt expliciet als root `index.html` niet de viewer is.
