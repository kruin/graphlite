# Gebruikershandleiding — concept v4430

## Horizontale LEX-projectie lezen

In `Assen` loopt elke projectielijn van een bronknoop horizontaal naar de LEX-as. Daarna toont de LEX-as eventuele Wissels. Bij `HOND BIJT MAN` blijft `HOND` op zijn bronhoogte; `BIJT` wisselt lokaal naar het V2-slot en laat op de oude V-positie een trace achter.


---

# Gebruikershandleiding — concept v4430

## V2 en Wissel bekijken

Open `Assen` of `LEX`. In hoofdzinnen tekent de LEX-as nu:

```text
slot 1 · TOPIC
slot 2 · V2/PV
trace op oude basispositie
Wissel-pijl tussen trace en gevuld slot
```

Gebruik de voorbeelden `HOND BIJT MAN`, `VROUW BREIT TRUI` of `TRUI BREIT VROUW`. In het laatste voorbeeld staat `TRUI` voorop, maar blijft het object/patiens.

---

## Lexicon en korte uitingen beheren

Open:

```text
lexicon-editor.html
```

Gebruik dit scherm voor twee bestanden:

```text
lexicon-config.html   = woorden/lexemen
examples-input.html   = korte voorbeeldzinnen
```

Vooralsnog ondersteunt de editor korte zinnen: hoofdzin, omdat-bijzin en perfectum. Na bewerken download je beide HTML-bestanden en vervang je ze in de viewer-map.

---

# Gebruikershandleiding — concept v4430

## Starten

1. Pak de ZIP uit.
2. Open `start-local-viewer.bat`.
3. Open `http://localhost:8088`.
4. Gebruik een harde reload als een oude tab nog actief is.

## Voorbeeld kiezen

Kies bovenin een voorbeeldzin. De zin wordt geladen in de centrale OPN-weergave en in LEX.

## Thematische rollen gebruiken

In de lexicon-editor krijgen nouns thematische rollen zoals `agens` en `patiens`. Voor de huidige korte actieve zinnen geldt: subject = agens, object = patiens. De editor filtert de keuzelijsten zodat onwaarschijnlijke combinaties, zoals `trui` als agens, niet worden aangeboden.

## Structuur bewerken

Open `Structure-editor`. Bewerk eerst syntax-config of functional-config. Download daarna `structure-config.html` en vervang het bestand in de viewer-map.

## Voorbeelden bewerken

Open `Voorbeeldeditor`. Voeg voorbeelden toe, wijzig tokens, kies source/rol en download `examples-input.html`.

## Lexicon bewerken

Open `Lexicon-editor`.

Gebruik:

```text
+ N      nieuw naamwoord
+ V      nieuw werkwoord
+ AUX    nieuw hulpwerkwoord
+ COMP   nieuw complementizerwoord
```

Na bewerking:

```text
Download lexicon-config.html
vervang het bestaande bestand in de viewer-map
herlaad examples-editor.html en de viewer
```

De editor valideert tegen `structure-config.html`: sources zoals `subject`, `object`, `predicate`, `pv`, `vdw` en slots zoals `comp`, `topic`, `aux`.



## Groei-presentatie

In het projectiepaneel staat `Groei`.

Gebruik:

```text
Groei aanzetten
0       = terug naar leeg raster/titels
← / →   = vorige/volgende stap
Play    = automatisch afspelen
slider  = direct naar een stap
```

Sneltoetsen:

```text
g = groei aan/uit
n = volgende stap
p = vorige stap
```

De viewer berekent eerst de volledige layout. Tijdens de groei verschijnen alleen meer onderdelen; bestaande knopen verschuiven niet.

## Documentatie openen

Gebruik de knop `Docs` in de viewer of open `docs/docs-home.html`.


## Boom passend maken

Gebruik in het projectiepaneel:

```text
Boomruimte: auto / compact / breed-lager / breed+groter font
Venster: automatisch passend / vast 1500×900
FIT: pas de viewBox onmiddellijk aan de getekende inhoud aan
```

`Boomruimte` verandert de visuele afstand tussen gridposities. De onderliggende boom- en LEX-regels blijven gelijk.



## v4430 takvolgorde

De standaardtakvolgorde is grammaticaal/normaal: `S → NP VP` en `VP → NP V`. De eerste child wordt links en hoger geplaatst; de tweede child rechts en lager. Hierdoor ligt de basisprojectie op de LEX-as in de verwachte volgorde: subject hoog, object daaronder, V/PV onderaan. Alleen expliciete vrije-slotregels zoals V2 of topicalisatie veroorzaken een Wissel en een trace.


## v4449 — eenvoudige documentatie LEX-plaatsingsregels

Toegevoegd: `docs/LEX_MOVEMENT_RULES.md`.

Kernregel:

```text
basisprojectie blijft staan
vrije slots worden gevuld
oude plek wordt trace
resultaat = voorbeeldzin
```

Beschreven zinstypen: hoofdzin, bijzin met OMDAT, topicalisatie, perfectum en voorlopige vraagzin.


## v4449 update

- `commit_and_push.bat` wordt vanaf deze versie standaard meegeleverd in de ZIP-root.
- LOG/FT toont thematische rollen expliciet: `AGENS` voor subject/handelende deelnemer en `PATIENS` voor object/ondergaande deelnemer.
- De syntaxrollen blijven `subject` en `object`; de functionele projectie benoemt dezelfde lexicale bronnen thematisch.

## Groei: tussenstappen binnen leaves

De groei-presentatie berekent eerst de volledige layout. Daarna wordt de boom zichtbaar in kleine stappen.

Volgorde:

1. lexicale knopen/leaves, één voor één;
2. kleine categorieknopen;
3. grotere categorieknopen;
4. OPN-slot;
5. LEX-as met lokale Wissels/traces;
6. projectiepanelen.

Bij gelijke soort knopen is de presentatievolgorde: boven naar beneden, daarna links naar rechts. De posities veranderen niet tijdens de groei.


## v4449 · stapsgewijze LEX-Wissels

- De boomgroei blijft deterministisch: binnen een groeilaag wordt gerenderd van boven naar beneden en daarna van links naar rechts.
- Flip/layout wijzigt de berekende posities; daardoor kan de groeivolgorde indirect veranderen, maar de renderregel blijft ruimtelijk: boven → beneden, links → rechts.
- In Assen verschijnt de LEX-as nu stapsgewijs: eerst de horizontale basisprojectie, daarna per stap één lokale Wissel met trace, daarna pas het volledige resultaat met projectiepanelen.
- Verplaatsingen blijven lokaal op de LEX-as; er komen geen verplaatsingslijnen vanuit de boom.

## Mobiel gebruik vanaf v4449

Op een telefoon staat het canvas bovenaan. Veeg horizontaal in het canvas om de volledige boom en LEX-as te zien. De bediening staat onder het canvas. De toolbar bovenaan is zelf ook horizontaal scrollbaar.


## v4449 - beweeglijke boom/LEX-view

- Boom en LEX-as zijn niet meer vast in het canvas.
- Sleep in het SVG-canvas om de view te verplaatsen.
- Ctrl + muiswiel zoomt rond de cursor.
- Shift + muiswiel pant horizontaal.
- FIT herstelt de automatische view.





### NOORD-as (PM)

Naast west/LEX, oost/SYNTAX en zuid/LOGICAL is ook een NOORD-as mogelijk. Die is genoteerd als uitbreiding, maar nog niet gebruikt.


Aanvulling v4504: LEX vrije slots zijn plaatsbare insertiepunten op de LEX-as voor later materiaal uit andere LEX-assen/bomen en anafora. Boom vrije rijen blijven apart.


## v4504 desktop LEX-insertie zichtbaar

De rechter desktop-config toont nu dezelfde LEX-insertieconfig als mobiel: LEX vrije slots, LEX insertie-inhoud en takverlenging door insertie. De insertie blijft een aparte box op de LEX-as; de gekozen takken/boxgrenzen worden alleen layoutmatig verlengd.


## v4504 · hoofdbeeld en config-scherm

Het hoofdbeeld is opnieuw ontworpen als grid-only view: boven het grid staan alleen het zinmenu en één knop **Config**. Alle andere instellingen zijn verplaatst naar een apart configuratiescherm met **Terug naar main**. Daardoor blijft de werkweergave schoon, terwijl projecties, Play/Groei, LEX-inserties, takverlenging, layout, export en documentatie in één config-scherm bereikbaar blijven.

## v4505 - OSV-! en LEX-rendering

OSV-! is bewust gemarkeerd met een uitroepteken. De box-aanpak kan nooit OSV opleveren als basisalternatief: de VP blijft object en werkwoord als subtree groeperen. Een pure flip van boxen is dan onvoldoende.

Voor een correcte zichtbare LEX-as moet altijd een expliciete verplaatsingsregel werken. OSV-! is dus geen basis-layout of taalkundig alternatief, maar een waarschuwing/testlabel bij een onmogelijke boxvariant. De andere volgordes en bestaande flips blijven hierdoor ongemoeid.



## v4506 - LEX-bijwoordslots

Vrije LEX-inserts voor bijwoorden zijn nu gedocumenteerd als slottypen met verschillende scope. De basisregel blijft: reserveer slots tussen zichtbare LEX-boxen en plaats het slot op verticale overlap als die bestaat. Daarna bepaalt het bijwoordtype de exacte plaatsing.

- Tijd: `GISTEREN`, `MORGEN` - meestal `VP-BETWEEN`, eventueel `S-LEFT` bij vooropplaatsing.
- Frequentie: `VAAK`, `SOMS`, `ALTIJD` - `VP-BETWEEN`.
- Negatie: `NIET` - apart `NEG`/`V-NEAR` slot.
- Wijze: `SNEL`, `HARD`, `ZACHTJES` - `V-NEAR` of `VP-RIGHT`.
- Zinsbijwoord: `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS` - hoog `S/VP` of `S-LEFT`.
- Focus: `ALLEEN`, `OOK`, `ZELFS` - bij de gefocuste phrase.
- Graad: `HEEL`, `ERG`, `ZEER` - intern in `AP/AdvP/NP`, dus geen algemeen tussenbox-slot.

De centrale boom wordt niet herschreven. Bijwoorden horen in deze fase in de LEX-renderlaag of in phrase-interne slots.

Zie ook: `docs/LEX_ADVERB_INSERT_SLOTS.md`.

## v4513 - OSV-!, VSO-! en VOS-!

`VSO` en `VOS` worden nu net als `OSV` gemarkeerd: `VSO-!` en `VOS-!`. Het uitroepteken betekent dat de box-aanpak deze volgorde niet als basisalternatief kan opleveren. Voor correcte rendering op de LEX-as is een expliciete verplaatsingsregel nodig. Bestaande bomen en bestaande flips blijven ongemoeid.




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
