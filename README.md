# OpenGraph Lite Viewer v4551


## v4548 - bijwoord vóór verplaatsing

Bijwoorden worden nu eerst als externe LEX-slots geplaatst. Daarna pas komen V2/topic/post-V2-Wissels aan de orde. Daardoor kan een bijwoord op zijn oorspronkelijke hosthoogte blijven staan, terwijl het bijbehorende zinsdeel later een trace achterlaat.

Voorbeeldprincipe:

```text
1. LEX-ADV boven NP
2. NP wisselt naar slot 1
3. bijwoord blijft boven de oorspronkelijke NP/trace
```

## v4548 - bijwoord voorop = V2

Bijwoordelijke vooropplaatsing is gecorrigeerd: `GISTEREN BEET HOND MAN` is hoofdzin-V2/inversie, niet bijzinsvolgorde. Het bijwoord is een externe LEX-insertie in slot 1; de persoonsvorm blijft slot 2. Bijzinsvolgorde blijft gekoppeld aan een bindterm/complementizer zoals `omdat`.

## v4548 - LEX-bijwoordslot volgt echte hostbox

Fix: bijwoordslots op de LEX-as gebruiken nu de bewaarde `lexAdverbAxisSlots` uit de syntaxlayout. Daardoor valt `boven VP/V/AP/NP` niet langer terug op de S-hoogte. Ook de losse LEX-view gebruikt een onzichtbare syntax-ankerkaart voor de correcte hostboxhoogte.

## v4541 - correctie BIJWOORD-host

De dropdown **Met bijwoord** plaatst niet meer alles boven S.
De gekozen bijwoordoptie bepaalt de host:

- modaliteit/tijd/reden/voorwaarde → S
- frequentie/plaats → VP
- negatie/wijze → V
- graad → AP
- focus/restrictief → NP

Alle plaatsingen blijven LEX-slots op de LEX-as. De hostbox is alleen hoogteanker.


Deze build verwijdert de aparte beeldmodule volledig uit de viewer.

## Aanwezig

- hoofdviewer
- Help
- Config
- voorbeeldzinnen
- lexicon- en structure-editors
- docs

## Verwijderd

- aparte beeldmap
- bijbehorende knoppen
- bijbehorende links
- bijbehorend Config-blok
- bijbehorende startscripts

## v4541

Toegevoegd als voorbeeldzin in `examples-input.html` en als fallback in `viewer.js`:

`OMDAT DE HOND DE MAN HEEFT GEBETEN`

LEX-volgorde: `OMDAT · DE HOND · DE MAN · HEEFT · GEBETEN`.


## v4541

Bijwoordplaatsing: bijwoorden worden boven een geldige syntactische categoriebox getekend (`S`, `NP`, `VP`, `V`, `PP`, `AP`), niet tussen boxen.


## v4541 — bijwoordvoorbeeldset

- Toegevoegd: `examples-adverbs.html`.
- Toegevoegd: `docs/LEX_ADVERB_EXAMPLE_SET.md`.
- Toegevoegd: `samples/adverb_host_examples_v4537.json`.
- `examples-input.html` is hersteld als oorspronkelijke basisvoorbeeldset; de bijwoordtestset staat apart in `examples-adverbs.html`.
- Eén bijwoord per voorbeeldzin.
- Default-host per categorie: MODALITEIT→S, TIJD→S, FREQUENTIE→VP, PLAATS→VP, NEGATIE→V, GRAAD→AP, WIJZE→V, REDEN/OORZAAK→S, VOORWAARDE→S, FOCUS→NP.
- Geforceerde afwijkingen krijgen notatie `functional:marked-host`.


## v4541 — herstel eerste voorbeeldset

- `examples-input.html` is teruggezet naar de oorspronkelijke basisvoorbeeldset.
- Bijwoordvoorbeelden staan apart in `examples-adverbs.html`, `docs/LEX_ADVERB_EXAMPLE_SET.md` en `samples/adverb_host_examples_v4537.json`.
- De viewer-link naar Bijwoordvoorbeelden blijft bestaan, maar de eerste voorbeeldset wordt niet meer vermengd met bijwoordtests.

### v4541

Het hoofdbeeld heeft nu twee onafhankelijke dropdowns:

- **Zin**: kiest de basiszin uit `examples-input.html`.
- **Met bijwoord**: kiest een bijwoord uit `examples-adverbs.html` en tekent het boven de ingestelde syntaxhost.

De bijwoordkeuze verandert de centrale syntactische boom niet.


## v4541 - Bijwoorden als externe LEX-slots

Met `boven S/NP/VP/V/PP/AP` wordt bedoeld: een LEX-slot op de LEX-as, verticaal net boven de gekozen syntactische box. Het bijwoord wordt nergens op de syntaxboom getekend en komt niet als projectie uit de basisboom. De gekozen host-subboom schuift lager om ruimte te maken.

### v4548: Boven S = V2/inversie

Bijwoordplaatsing `boven S` is nu geen gewone lokale hostplaatsing meer. In GraphLite betekent dit: het bijwoord vult een extern LEX-slot net boven de S-box en staat daarmee voorop. In een hoofdzin activeert dit V2/inversie: `BIJWOORD | PV | SUBJECT | OBJECT`.

### v4548 — klikbare gemarkeerde bijwoordvariant

De bijwoordbox op de LEX-as is nu zelf een klikbare knoop als er een tegenhanger bestaat. Klik op een ongemarkeerde bijwoordbox om de gemarkeerde variant te tonen; klik op de gemarkeerde bijwoordbox om terug te gaan. Dit verandert alleen de LEX-host/markering, niet de centrale boom.


## v4548 - Bijwoorden boven hostbox, niet erin

- Bijwoordslots blijven externe LEX-inserties op de LEX-as.
- `boven NP/VP/V-CLUSTER/V/...` betekent nu: het slot ligt visueel boven de hostbox, met een extra gereserveerde gridrij.
- Bij perfectum/werkwoordcluster kiest een V-nabije bijwoordplaatsing eerst de hele `V-CLUSTER`-box als hoogteanker, niet een interne AUX/VDW-positie.
- De basisboom blijft ongemuteerd; de hostbox wordt alleen lager gezet om ruimte te maken.


### v4549 — fix bijwoordkeuze zonder beeld

Bij elke gekozen bijwoordoptie kon v4548 stoppen met renderen. De oorzaak was een niet-bestaande variabele in het label van het LEX-bijwoordslot. In v4549 gebruikt dat label `visibleSlotCount`. Zonder bijwoord en met bijwoord renderen nu via dezelfde flow.


## v4551 - Gecontroleerde bijwoordregels per woord

- Bijwoordplaatsing gecontroleerd tegen Nederlandse grammaticale bronnen.
- Nieuwe scheiding: `scopeHost` ≠ `linear`. S-scope is niet automatisch voorop; alleen `linear=fronted-v2` triggert V2.
- `niet`, focuspartikels, graadwoorden, plaatsbijwoorden en polyfunctionele woorden krijgen eigen uitzonderingsregels.
- Nieuwe config: `samples/adverb_placement_rules_v4551.json` en `samples/adverb_word_rules_v4551.json`.
- Nieuwe documentatie: `docs/LEX_ADVERB_PLACEMENT_RULES_CHECKED.md`.

## v4550 - Help en Config voor lexicale bijwoordinsertie

Toegevoegd:

- Helpkaart **Lexicale insertie: bijwoorden** met de afleidingsvolgorde: eerst `LEX-ADV`, daarna LEX-Wissels/verplaatsingen.
- Configblok **Bijwoordplaatsingsregels per categorie** met default en gemarkeerde host(s).
- Documentatiebestand `docs/LEX_ADVERB_PLACEMENT_RULES.md`.
- Configbestand `samples/adverb_placement_rules_v4550.json`.

Kernregel: bijwoorden blijven externe inserties op de LEX-as. De hostbox is alleen hoogteanker. `host=defaultHost` is ongemarkeerd; `host!=defaultHost` is `functional:marked-host`; `host=S` in hoofdzin activeert `functional:fronted-v2`.


## v4552 — NIET als eigen rechterveldslot

Neutrale negatie gebruikt nu een eigen LEX-regel: `HOND | BIJT | MAN | NIET` en bij perfectum `HOND | HEEFT | MAN | NIET | GEBETEN`. `HOND | BIJT | NIET | MAN` blijft alleen een gemarkeerde contrastlezing (`niet de man maar ...`). Zie `docs/LEX_ADVERB_PLACEMENT_RULES_V4552.md` en `samples/adverb_word_rules_v4552.json`.
