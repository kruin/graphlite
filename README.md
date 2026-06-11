# OpenGraph Lite Viewer — PWA v4408

Browser-native proefversie van **OpenGraphEd Lite** voor **JAN — Open Notation**.

## Doel van deze fase

Deze versie beperkt de test bewust tot drie stappen:

1. maak eerst de centrale boom voor `HOND BIJT MAN` correct;
2. teken daarna de LEX-projectie;
3. regel pas daarna lokaal op de LEX-as het uitingtype `OMDAT HOND MAN BIJT`.

De centrale boom blijft invariant. `OMDAT` wordt niet in de centrale syntaxboom ingevoegd. Lidwoorden/determinatoren zijn uit deze systeemlaag verwijderd.

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

## v4408-correctie functioneel

`OPN · functionele structuur` tekent nu zichtbaar `CLAUSE > AGENS/PRED/PATIENS`. `BIJT` is alleen de leaf onder `PRED` en mag dus niet meer als centrale root van een driehoek verschijnen.

## v4408-noot

De header/subtitel is bewust gelijk gehouden: **Redesign: eerst syntax-tree, daarna LEX-projectie, daarna lokale LEX-regel.**  
Om te voorkomen dat de browser alleen `index.html` vernieuwt maar een oude `viewer.js` houdt, laadt `index.html` nu `viewer.js?v4408` en `styles.css?v4408`.


## v4408 — OPN-slot voor vooropplaatsing

De OPN-bronnen reserveren nu expliciet een plaats voor vooropplaatsing/topicalisatie:

- in de OPN-syntaxboom: tussen `S` en de bovenste boomlaag;
- in de OPN-functionele structuur: tussen `CLAUSE` en de bovenste role-boxen;
- in de LEX-projectie: `slot 1 · vooropplaatsing` projecteert horizontaal mee met de OPN-bron;
- `slot 0 · Comp/(om)dat` blijft het hogere lokale LEX-slot voor bijzinnen.

De functionele structuur heeft daarmee, net als de syntaxboom, een eigen LEX-projectie. De functionele structuur blijft n-ary en gebruikt de config `left-first` / `right-first` voor de vrije role-boxplaatsing.


## v4408 — voorbeeldzinnen als HTML-input

De actieve voorbeeldzinnen staan nu ook in `examples-input.html`.

- `<strong>` markeert het gekozen subject.
- `<em>` markeert het gekozen object.
- De viewer leest deze HTML-input bij opstarten wanneer hij via de lokale server draait.
- De knop **Wissel S/O** wisselt de lexicale vulling van subject en object. De grammaticale markering blijft gelijk: vet blijft subject, cursief blijft object.

Actieve beginvoorbeelden:

```html
<strong>HOND</strong> BIJT <em>MAN</em>
OMDAT <strong>HOND</strong> <em>MAN</em> BIJT
```

## v4408 — voorbeeldzinnen-editor

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


## v4408 — structure-config als eerste stap

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

## v4408 — bescheiden lexicon

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

## v4408 — perfectumregel

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

## v4408 — functional config: PRED apart, ARG-STRUCT apart

De functionele configuratie is aangepast van `CLAUSE → AGENS PRED PATIENS` naar `CLAUSE → PRED ARG-STRUCT`. `ARG-STRUCT` bevat `ARG1` en `ARG2`, elk met een eigen NP-subtree. Hierdoor worden predicaat en argumentstructuur als eigen vrije subtree-boxes behandeld.

## v4408 — lidwoorden verwijderd

Lidwoorden/determinatoren zijn verwijderd uit voorbeeldzinnen, lexicon, LEX-slots, viewer-fallback en voorbeeldeditor. Voorbeelden gebruiken nu kale NP/N-vulling: `de man` → `man`, `de hond` → `hond`.


## Layout order

`left-first/right-first` geldt voor syntax én functioneel. Deze keuze stuurt de zoekrichting van vrije plaatsing; het is geen inhoudelijke transformatie.

## v4408 — flip per vertakking

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


## v4408 — flip per vertakking

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


### v4408 startdiagnose
Open bij startproblemen `reset-cache.html?v4408` of `debug.html?v4408`. De debug controleert nu of de root-index daadwerkelijk de viewer is.



## v4408 — expliciete render-volgorde

De derde stap is nu strikt een tekenlaag:

1. subtree-box rects;
2. subtree-box captions;
3. takken/lijnen;
4. OPN-slot;
5. node-shapes;
6. node-labels.

Equal-size subtree-boxes worden deterministisch getekend: boven naar beneden, links naar rechts, daarna oorspronkelijke layoutvolgorde. Leaf-nodes zoals HOND, BIJT en MAN zijn geen subtree-boxen; zij worden in de node-lagen getekend, met labels altijd bovenop.

## v4408 root-index fix
`docs/index.html` is vervangen door `docs/docs-home.html`; `viewer.html` is toegevoegd als fallback. Gebruik `debug.html?v4408` om te testen of root `index.html` echt de viewer is.

## v4408 — groei-presentatie

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


## v4408-correctie groei/projectiewissel

`LEX` is geen groei-projectie. In v4407 kon wisselen naar `LEX` de globale groeistap naar 0 zetten, waardoor `Assen`, `Bron` en `LOG/FT` leeg bleven zolang groei actief was. v4408 bewaart de laatst geldige groeistap en clamped alleen in ondersteunde groei-projecties.
