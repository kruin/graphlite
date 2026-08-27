# OpenGraph Lite Viewer v2.0.0-rc.45

## Begin hier: van boom naar uiting

De documentatie volgt de werking van Open Graph Linguistics (OGL): **Tree
Build → gereserveerde HOR/VER-ruimte → LEX → Flip → Uiting/Story → PLAY**.

Tree Build reserveert vooraf HOR-ruimte voor vrije kolommen, vertakkingen,
Flip en verticale anaforen, en VER-ruimte voor bronhoogtes en vrije LEX-rijen
zoals V1, V2 en Comp. Zo hoeft een onverplaatst woord nooit achteraf mee te
schuiven om de juiste woordvolgorde te maken.

Voor `HOND BIJT MAN` blijven HOND en MAN op hun bronhoogte en krijgen zij geen
pijl. Alleen BIJT wisselt naar de vooraf vrijgehouden V2-rij. Het resultaat is
`HOND — BIJT — MAN`. Verplaatsingspijlen staan uitsluitend verticaal op de
LEX-as; er lopen geen verplaatsingslijnen vanuit de boom.

> Publiceren: als Playwright of Chromium lokaal ontbreekt, biedt
> `publish_checked.bat` vóór de controles aan om beide eenmalig met de
> vastgezette installer te installeren. Antwoord `J`; lokale hulpmiddelen
> blijven buiten Git en buiten de release-ZIP.

## Flip: structuur is geen woordvolgorde

Flip is, naast **Free Node**, essentieel voor de Language Tree. Free Node geeft
iedere knoop een vrije rasterplaats; Flip kiest de zichtbare links/rechts- en
kort/lang-variant van een binaire vertakking. De structuur blijft intact en
LEX blijft het ultieme resultaat: de volledige gerealiseerde uiting.

![Minimale Language Tree](../images/readme/flip-minimale-language-tree.png)

![Vrije vertakkingen: links/rechts en kort/lang](../images/readme/flip-vrije-vertakkingen.png)

![Kleinste veld met projecties](../images/readme/flip-projecties-kleinste-veld.png)

![Language Tree met LEX, SYN en LOG](../images/readme/flip-language-tree-lex-syn-log.png)

In de causale testcase flipt alleen K2: `HOND BIJT MAN`. Daardoor kunnen
`HOND ↔ HOND` en `JAN ↔ MAN` beide verticaal blijven. LEX realiseert daarna
onafhankelijk `JAN SLAAT JEK OMDAT DIE HEM BEET`. Zie
[`UITING_EN_KERNZINNEN.md`](UITING_EN_KERNZINNEN.md) en de technische
[`FLIP_CONSTRAINT_SOLVER.md`](FLIP_CONSTRAINT_SOLVER.md).

## Uitingen en kernzinnen

Een uiting bestaat uit één of meer verknoopte kernzinnen. Deze uitgave voegt
**Jan wast zichzelf**, **Jan slaat Jek omdat die hem beet** en **Ken uzelf**
toe als selecteerbare uitingen. Hun referenten, coreferentie, oorzaak,
rol-flip en impliciete geadresseerde staan in
[`UITING_EN_KERNZINNEN.md`](UITING_EN_KERNZINNEN.md) en
[`samples/uitingen-kernzinnen.v1.json`](samples/uitingen-kernzinnen.v1.json).
Iedere uiting opent als twee afzonderlijk berekende kernzinbomen: `K1` boven
`K2`, met gedeclareerde verticale anafoorverbindingen en één gezamenlijke
LEX-as voor de gerealiseerde uiting. De causale bronbomen tonen zowel
`HOND ↔ HOND` als `JAN ↔ MAN`; op LEX worden deze onder andere als `die` en
`hem` gerealiseerd. Bij de imperatief ontbreekt het impliciete
subject op LEX. Het bestaande `S1/S2`-anafoorvoorbeeld blijft beschikbaar.
De bronknoop HOND in K2 is rechtstreeks klikbaar en wisselt zijn LEX-vorm tussen
**hij / die / die hond / de hond / Jek**. Alle vormen verwijzen naar Jek;
`DIE HOND` en `DE HOND` blijven ieder één subject-NP, terwijl LEX twee woorden
toont. De werkelijke horizontale en verticale rastermaat is onafhankelijk
instelbaar van 60% tot 200%. K2 moet lokaal flippen wanneer JAN en JEK van subject/
object wisselen en beide verwijslijnen verticaal moeten blijven.
De zichtbare Play-balk bouwt iedere compositie op in vijf inhoudelijke stappen:
`K1`, `K2 vóór Flip`, de zichtbare `FLIP K2`, verticale uitlijning en de
gerealiseerde LEX-uiting. Tijdens de Flipstap staat de oude K2 rood-transparant
achter de nieuwe K2 en tonen stippellijnen de verplaatste knopen. `←`, `→` en
`Reset` ondersteunen handmatige opbouw en omgekeerd afspelen.
De actieve testuiting blijft bovenaan zichtbaar. Iedere kernzin gebruikt
`S → NP, VP` en `VP → NP, V`; LEX realiseert zelfstandig de uitgesproken
woordvolgorde. Elke binaire knoop vertakt ook zichtbaar links en rechts.
Config regelt boomkleur, taklijndikte, onafhankelijke horizontale/verticale
compactheid en **Flip**. Flip spiegelt de boom, maar verandert geen structuur,
LEX-woordvolgorde of verticale anaforen: structuur, tekenrichting en
woordvolgorde zijn afzonderlijke eigenschappen. Standaard zijn de boomtakken
compact, blauw en zwaar.
De optionele globale Flip spiegelt beide bomen en verschilt daarmee van de
noodzakelijke lokale K2-Flip bij een dubbele rolwisseling.
Iedere boomtak verbindt twee vrije OpenGraph-knopen op verschillende rijen én
kolommen. Ook korte takken blijven dus schuin; knoopsymbolen en labels passen
zich aan de compacte weergave aan. Alleen anafoorlijnen staan verticaal.

## Nieuwe berekende toepassing: Anafoor · multi-OGN

Het vaste eerste voorbeeld verbindt twee afzonderlijk berekende OGN-bomen:
**S1: Ik zie een man. S2: Hij draagt een hoed.** MAN is het antecedent en HIJ
de anafoor; beide zijn coreferentieel. Na afzonderlijke OGN-validatie staat S1
boven S2 en verschuift de complete S2 star totdat MAN en HIJ één gedeclareerde
kolom delen. Eén gezamenlijke LEX-as ordent S1 vóór S2. De MAN–HIJ-verbinding
is een rechte verticale lijn zonder pijl of richting. Zie
[`MULTI_OGN_ANAPHOR.md`](MULTI_OGN_ANAPHOR.md).

OpenGraph Lite Viewer is een viewer en testomgeving voor de algemene Open
Graph Notation. Deze versie gebruikt de volledige v1.0.16-bronset als
functionele basis.

Engelse documentatie: [`README.md`](README.md).

> **Controlestatus:** rc.45 is op 2 augustus 2026 handmatig goedgekeurd,
> inclusief de Greedy Grow-reconstructie, haar bewijsgrens, desktop, mobiel en
> publicatiecarrousel. De automatische controles blijven geometrie en
> feature-invarianten bewaken.

## OGN-kern: vrije plaatsing eerst

Open Graph Notation schrijft knopen één voor één op vrije plaatsen van een
open grid. Iedere knoop is baas op één eigen horizontale en één eigen verticale
gridlijn.

**Harde regel — A ≠ B:** twee verschillende knopen mogen nooit dezelfde
horizontale of verticale gridlijn bezetten.

```text
A ≠ B  ⇒  x(A) ≠ x(B)  én  y(A) ≠ y(B)
```

Dus: een nieuwe knoop mag pas worden geschreven als zowel zijn rij als zijn
kolom nog vrij is. Dit geldt ook voor toepassingen. Vindt de plaatsingslaag
geen geldige rij én kolom, dan wordt geen fallbackknoop getekend.

Een overtreding heet **gridlijnhergebruik**: horizontaal hergebruik deelt een
rij; verticaal hergebruik deelt een kolom. Beide zijn altijd ongeldig.

```text
bestaande bezetting
→ vrije plaatsen
→ ruleset
→ zoekstrategie test kandidaten
→ eerstgevonden geldige plek direct schrijven
```

Een ruleset bepaalt welke vrije kandidaten geldig zijn. Een
**zoekstrategie** bepaalt in welke volgorde kandidaten worden getest. Directe
plaatsing schrijft de eerstgevonden geldige plek meteen; een andere
zoekvolgorde kan daardoor een ander beeld opleveren.

**Greedy Grow heeft een geaccepteerde reconstructie.** De proef begint
bij het centrale gridpunt en schrijft per stap één dot zonder een toekomstig
eindbeeld op te slaan. De historische vierarmige volgorde reproduceert de
bewaarde demo's van 12, 31 en 96 knopen exact; vier teruggevonden
experimentele zoekvolgorden maken andere groeibeelden controleerbaar. Veldmaat
en omtrek zijn diagnosewaarden en geen bewezen wereldwijd optimum. Open
[`greedy-grow.html`](greedy-grow.html) en lees de
[`technische reconstructie`](GREEDY_GROW_RECONSTRUCTION.md).
Publicatieslide 5 wordt rechtstreeks uit dezelfde geaccepteerde engine
afgeleid.

De vaste uitlegvolgorde is:

1. **OGN Free Placement** — knopen één voor één op vrije gridplaatsen;
2. **OGN Projection** — markers of ordeningen afleiden van reeds geplaatste
   bronknopen;
3. **OGN Berekende Plaatsing** — een toepassing berekent eerst een
   plaatsingsplan.

Zie
[`OGN_CORE_PLACEMENT_ARCHITECTURE.md`](OGN_CORE_PLACEMENT_ARCHITECTURE.md).

## Plaatsingsmethoden en instelbaar lijnbeeld

Het menu **Language Tree** bevat nu de plaatsingshiërarchie zelf. Language
Tree blijft de prominente, primaire berekende toepassing. **Greedy Grow** en
**Random** staan er kleiner onder als directe OGN-illustraties. In een directe
modus schrijft iedere pijl-/Play-stap onmiddellijk één knoop op een nog vrije
rij én kolom; taalgebonden menu's verdwijnen en de Language-Tree-data blijven
ongewijzigd. Random gebruikt een afzonderlijke engine met seed en kan de
geaccepteerde Greedy-Grow-reconstructie dus niet veranderen.

Config heeft nu strikt gescheiden contexten: **Algemeen**, **Calculated →
Language Tree** en **Direct → Gedeeld / Greedy Grow / Random**. Algemeen bevat
alleen toepassingsonafhankelijke interface-, LEESMIJ- en bestandsinstellingen;
Voorconfig, boom, voorbeelden, LEX, SYNT en LOG staan uitsluitend bij Language
Tree. Per context zijn alle niet-relevante instellingen no-show. Greedy toont alleen strategie en
oriëntatie; Random alleen zijn eigen seed, resetbeleid, model, plaatsing,
gridgrootte, optionele vaste maten, snelheid, iteraties en asbeeld. Ieder
zichtbaar veld heeft in Config een compacte inklapbare uitleg. Een grotere seed
geeft niet meer toeval en verandert de snelheid niet; `20260802` is alleen de
herkenbare datum 2 augustus 2026. Zie
[`CONFIG_UI_EXPLANATION_STANDARD.md`](CONFIG_UI_EXPLANATION_STANDARD.md).

Open je Config vanuit een actieve Greedy-Grow- of Random-modus, dan is ook de
toepassingsbalk no-show. Je ziet alleen Terug naar Main, de eigen velden met
Uitleg en Config opslaan. Kies een andere toepassing eerst in Main.

Een nieuwe standaardconfig kiest **Uniform v1.0**, **Ergens in beschikbare
ruimte** en **Interface · beschikbare ruimte**. **Onzuiver uniform v0.1** is
een functioneel alternatief dat 20% voorkeur mengt voor asplekken die in
voltooide eerdere rondes vaker zijn geraakt. Vast grid, Compact,
Gebalanceerd, Ruim en het groeiende inhoudsveld blijven beschikbaar. v0.2 en
v0.3 blijven no-show totdat zij werkelijk werken. Play en Next lopen over
rungrenzen door totdat alle ingestelde iteraties klaar zijn; Previous kan over
de grens terug. Tien iteraties met
31 knopen leveren na voltooiing bijvoorbeeld
10 × 30 = 300 projectie-hits per as; de centrale knoop telt niet mee. Een ronde
voegt haar rijen pas na de laatste knoop als WEST-spots toe en haar kolommen
als SOUTH-spots. Een herhaalde hit maakt dezelfde spot donkerder en zwaarder;
toekomstige rondes worden niet vooraf getekend. Bij Bezettingskans wordt het
spotgewicht tegen het ingestelde rondetotaal afgezet; Relatief schaalt op de
hoogste telling van de voltooide rondes. Uniforme Random voorspelt op termijn
een vrijwel egaal beeld; v0.1 kan vroege verschillen mild versterken. Een ongewijzigde
Greedy-strategie is deterministisch en wordt daarom niet herhaald. Zie
[`DIRECT_PLACEMENT_CONFIG.md`](DIRECT_PLACEMENT_CONFIG.md).

Onder `Config → Algemeen → Interface & weergave → Lijnbeeld` zijn rasterkleur en de zwaarte van raster-,
projectie- en boxlijnen onafhankelijk instelbaar. LEX, SYNT en LOG hebben
daarnaast elk een eigen kleur—standaard blauw, groen en paars—die door hun as,
projectielijnen en boxen wordt gevolgd. Dit verandert alleen de presentatie,
nooit coördinaten of plaatsingsgeldigheid. Zie
[`LINE_STYLE_AND_PLACEMENT_MODES.md`](LINE_STYLE_AND_PLACEMENT_MODES.md) voor
de volledige koppeling en het structurele EOF/EOL-publicatiebeleid.

## Huidige berekende toepassing: Two-Pass Language Tree

De huidige viewer implementeert de **Two-Pass Language Tree** als één
berekende OGN-toepassing. Het profiel `OGN Basis` bevat de gewone
Syntax-/Functional-boom, het raster, de named projections LEX/SYNT/LOG met
S/O/V-majors en voorbeelden zonder optionele inserties. De profielnaam betekent
“basis van deze taaltoepassing” en definieert niet de algemene OGN-kern.
Insertie staat standaard uit op LEX, SYNT en LOG.

`Config → Voorconfig` schakelt insertie per as onafhankelijk aan of uit. Deze
voorconfig voegt zelf nog geen taalinhoud toe. Daarna bevat
`Config → Toepassingen` als eerste toepassing **Bijwoorden**. Die wordt pas
beschikbaar wanneer insertie op **LEX + LOG** actief is. Staat Bijwoorden uit,
dan ontbreken de bijbehorende voorbeelden, LOG-minors, directe LEX-inserties,
bediening, runtimegegevens, documentatielinks en exportvelden. Een OPN-export
vermeldt dan `profile: "base"`, `extras: []` en de drie asschakelaars.

Config toont daarnaast twee uitgeschakelde reserveringen voor latere
toepassingen: **Nadruk** (bijvoorbeeld `juist díe trui`) en **Onaffe zin**.
**Vraagzin** is geen toepassing meer, maar een actieve zinsoort binnen
Language Tree.

## Bewerkbare LEESMIJ-items en carousels

`Config → LEESMIJ-items` bewerkt het volledige item en niet alleen de beelden.
Ieder onderwerp heeft **Tonen: ja/nee**, een navigatietitel NL/EN en inhoud
NL/EN in beperkte veilige HTML. Nee verbergt het item zonder het te
verwijderen; in Config blijft het dus terugvindbaar. Scripts, formulieren,
styles, frames, event-attributen en onveilige linkschema’s worden vóór
weergave verwijderd.

Dezelfde editor beheert de carousel: actieve slide toevoegen/verwijderen,
vorige/volgende, breed/smal, alt-tekst en onderschrift NL/EN, live
voorvertoning en volledig herstel van het item. Een gewoon beeldpad of
https-URL blijft mogelijk. Onder `Config → Bestanden & export` kan daarnaast
een lokale PNG, JPEG, WebP of GIF rechtstreeks als ingesloten slide worden
ingevoegd. De grens is 1,25 MB per beeld en ook de totale ingesloten opslag is
begrensd. Een handmatig getypte `data:`-URL blijft geblokkeerd; alleen de
vertrouwde bestandsroute mag een ingesloten beeld maken.

De gezamenlijke Config-savebalk staat boven ieder Config-onderdeel. Titel,
itemtekst, Tonen ja/nee en carousel worden samen bewaard. Graph-sneltoetsen
blijven uit zolang Config of LEESMIJ openstaat en wanneer een invoerveld focus
heeft.

## Standaardconfig, project-user-config en browser-Config

Iedere volledige projectzip bevat
`config/default-config.json` én `config/user-config.json`. De viewer past eerst
de standaard toe en daarna de ingeschakelde user-config als overschrijving.
De standaard wordt dus niet fysiek vervangen.

Start via `start_local_viewer.bat` en kies
`Config → Bestanden & export → Schrijf huidige Config naar project`. De lokale
server schrijft de actuele snapshot via een vaste allowlist naar
`config/user-config.json`; dat bestand gaat daarna mee in de volgende
volledige bronzip. Op een gewone webserver gebruik je
`Download user-config` en plaats je het bestand handmatig in `config/`.

De voorrang is:

```text
code-defaults → config/default-config.json → config/user-config.json
→ lokaal bewaarde browser-Config
```

De laatste browsersnapshot blijft apparaatgebonden totdat hij naar het
projectbestand wordt geschreven.

## Kant-en-klare publicatiecarrousel

Iedere projectzip bevat zeven genummerde PNG-slides van 1080 × 1080 onder
[`publicatie-carrousel/slides/`](publicatie-carrousel/slides/) en de
zelfstandige, bewerkbare bron
[`publicatie-carrousel/index.html`](publicatie-carrousel/index.html). Upload
`01` tot en met `07` in die volgorde als één beeldgallery.

Slide 4 toont knopen die naar WEST, SOUTH en EAST projecteren. Slide 5 is het
voorbeeld **Direct — Greedy Grow**; slide 6 is
**Calculated — Language Tree**, met `HOND · BIJT · MAN` op de westelijke
LEX-as. Beide voorbeeldslides verwijzen naar `github.com/kruin/graphlite`.

Wil je alleen publiceren, gebruik dan de meegeleverde PNG's; installeren is
niet nodig. Wil je de carrousel wijzigen, werk dan bij voorkeur in de
uitgepakte volledige projectzip. Draai daar éénmalig
`installeer-carrousel-tools.bat`, bewerk uitsluitend de HTML-bron en draai
daarna `maak-publicatie-carrousel.bat`. Node.js 18 of hoger is vereist; jouw
Node.js 18.14 voldoet. Controleer de nieuwe PNG's en draai vervolgens
`maak-volledige-zip.bat`, zodat de wijziging ook in de projectzip terechtkomt.
De losse carrouselzip kan zichzelf eveneens opnieuw afleiden, maar wijzigt geen
afzonderlijke projectmap. Lokale `node_modules` en browserbestanden gaan nooit
mee in een zip.

[`PUBLICATIE_README.md`](PUBLICATIE_README.md) bevat de exacte volgorde,
alt-tekst per slide, Reddit-instructies en kopieerbare Nederlandse en Engelse
teksten voor de overige platforms. De live- en GitHub-links zijn ingevuld;
alleen een optionele videolink en afzender blijven te vervangen. rc.45 blijft door de versienaam een release
candidate en is op 2 augustus 2026 handmatig goedgekeurd. Gebruik
[`RC45_OGN_CORE_EXPLANATION_TEST.md`](RC45_OGN_CORE_EXPLANATION_TEST.md) voor
de kernuitleg en carrouselcontrole; de geërfde rc.43-Configcontrole blijft staan in
[`RC43_CONFIG_README_PROJECT_TEST.md`](RC43_CONFIG_README_PROJECT_TEST.md).

## Recursieve layout op inhoudsmaat

De structurele boom wordt nog steeds bottom-up op het HOR/VER-grid geplaatst.
Vóór het tekenen meet een tweede recursieve pass iedere subtree uit de
werkelijke nodevormen, labels, child-boxen en het caption. Een kleine unary box
zoals `NP → HOND` gebruikt daardoor alleen de benodigde breedte en hoogte;
grotere S-, VP- en Functional-structuren groeien onafhankelijk.

Toepassingen declareren abstracte layout-eisen en geen SVG-coördinaten.
Bijwoorden meldt bijvoorbeeld dat brede LEX-insertie-inhoud mogelijk is. De
centrale layout-policy reserveert de bijbehorende ruimte. Handheld MAX bevat
volledige LEX-inhoud en volledige Syntax- en Functional-regelboxen in portret,
landschap en forced desktop. LEX reserveert alleen de actieve slots en
Wissellanes; Syntax en Functional delen één stabiele oostas over hun
gezamenlijke structurele grid-envelop. Zie
`RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.

### Wat is nu recursief—en wat nog niet?

| Fase | Gedrag in rc.42 |
|---|---|
| Structuur en config | Bepalen welke knopen, assen, majors, minors en toepassingsbijdragen bestaan. |
| Gridplaatsing | Plaatst structurele knopen en subtrees op het HOR/VER-celgrid. Dit is nog geen tekstbewuste pixelpakking. |
| Visuele subtree-meting | Meet bottom-up nodevormen, labels, afstammelingsgrenzen, caption en centrale marge. Alleen de zichtbare subtree-rechthoek gebruikt deze uitkomst. |
| West/LEX-plaatsing | Begint bij de gemeten linkerrand van de actieve root-subtree en reserveert daarna de actieve LEX-slots, Wissellanes en een smalle goot. |
| Oost/SYNT-plaatsing | Gebruikt één gezamenlijke **structurele grid-envelop** voor Syntax en Functional, gevolgd door de volledige regelboxen. Zij komt niet uit de gemeten rechterrand van iedere subtree. |
| Viewport-fit | Houdt volledige LEX-inhoud, centrale structuur, volledige regelboxen en LOG binnen één stabiel Syntax/Functional-kader. |
| Render | Tekent het opgeloste resultaat; voegt geen taalinhoud toe en kiest geen nieuwe posities. |

Dat onderscheid is belangrijk. rc.42 heeft recursieve **boxmeting**, maar nog
geen algemene botsingssolver die bij een breder label alle knopen opnieuw
plaatst. In portret gebruikt de volledige links-naar-rechtscompositie de
beschikbare breedte. Omdat die compositie van nature breed is, kan tekst klein
blijven en kan verticale witruimte overblijven. Pan/zoom blijft beschikbaar.
Een gestapelde portretcompositie is een afzonderlijke toekomstige layoutkeuze.

Gebruik voor de handmatige goedkeuring
[`RC41_RECURSIVE_LAYOUT_TEST.md`](RC41_RECURSIVE_LAYOUT_TEST.md).

## Lexicale gebruiksprofielen en gebruikerskeuze

Dit onderdeel geldt wanneer de toepassing Bijwoorden is ingeschakeld.

OGN bewaart een woord niet meerdere keren als losse woordenboekregel. Het
lexicon bevat één lemma met meerdere mogelijke **gebruiksprofielen**. De
concrete zinsinstantie kiest het passende profiel.

```text
lemma → gebruiksprofielen → keuze per zinsinstantie
```

Een profiel legt onder meer bron, functie, scope en voorkeursinterval vast. De
bron is `LOG`, `LEX` of `LOG+LEX`:

- `LOG`: semantische operator op de zuidas met realisatie op LEX;
- `LEX`: directe lexicale insertie zonder LOG-minor;
- `LOG+LEX`: één zichtbare groep met componenten uit beide bronnen.

Meerwoordconstructies, zoals `misschien wel`, verwijzen naar bestaande lemma's
en kunnen één zichtbaar LEX-slot houden. De woorden worden dus niet
verdubbeld in het lexicon.

Wanneer meerdere analyses mogelijk zijn en de keuze de OGN-notatie werkelijk
verandert, vraagt de viewer de gebruiker. Het voorgestelde profiel wordt tot
dan voorlopig getekend. De keuze geldt alleen voor die voorbeeldzin en kan in
Config met **Vraag profielkeuze opnieuw** worden gewist. Zij herschrijft het
globale lexicon niet.

Zie `LEXICON_USAGE_PROFILES_AND_DISAMBIGUATION.md`.

## Projectiecontract

```text
bronknoop → horizontale LEX-projectie op bronhoogte → alleen een expliciete Wissel kan verplaatsen
```

`S`, `O` en `V` zijn majors. Een bijwoordelijke insertie kan een LOG-minor zijn, een directe LEX-insertie zijn, of beide bronnen combineren. Iedere minor vergroot de afstand tussen de begrenzende majors met
één vast slot. LOG plant mogelijke LEX-plaatsen, maar verplaatst daarmee geen
bronknoop: iedere lexicale bron projecteert horizontaal op zijn bronhoogte.
Alleen een expliciet doel dat werkelijk hoger ligt dan die zichtbare bron mag
een Wissel uitvoeren. In `HOND BIJT MAN` blijft `MAN` exact op MAN-hoogte;
alleen `BIJT` kan omhoog naar V2. LOG-reserveringen veranderen deze harde
bronreferentie niet. Zie `projectie-master-spec.md`.

### Actief LEX-profiel en zinsoort

LEX bevat voorlopig uitsluitend upward-Wissels, toepassingsgebonden inserties
en rechtstreeks geschreven Comp. Generieke lege plekken vóór, na of tussen
en iedere downward/post-V2-Wissel zijn no-show: geen Config, rendering of
nieuwe opslag. Hun mogelijke gebruik wordt later afzonderlijk geëvalueerd.

Zinsoort is een eigen Language-Tree-keuze: **mededelende hoofdzin**,
**ja/nee-vraagzin**, **dat-zin** of **omdat-zin**. De vraagzin gebruikt V1;
DAT en OMDAT worden rechtstreeks in Comp geschreven. Perfectum is een
werkwoordsvorm en geen zinsoort. Zie `LEX_MOVEMENT_RULES.md`.

## Start

```text
index.html
```

Of lokaal:

```bat
start_local_viewer.bat
```

`start_local_viewer.bat` is de enige starter en gebruikt één gevonden Python
3-installatie. Kies bij de gedownloade ZIP eerst **Alles uitpakken**; start de
BAT niet vanuit de gecomprimeerde map. De BAT controleert alleen of alles is
uitgepakt en start daarna
`start_local_viewer.py`. Die Python-launcher regelt serverdetectie, starten,
wachten, broncontrole en browseropening. `reset-cache.html` opent pas wanneer
poort 8088 zowel de exacte versie als de identiteit uit `SOURCE_BUILD.txt` van
de huidige map bedient. Zo wordt ook een ouder bronpakket met hetzelfde
rc.45-versienummer herkend. Meldt de launcher een andere bron, sluit dan eerst
het oude venster **OpenGraph local server** en start de BAT opnieuw. De concrete
reden blijft zichtbaar vóór `Press any key`.

Op een groot scherm verschijnt lokaal rechtsonder de keuzeknop `LOKAAL`.
`mobile staand` toont blijvend een frame van 390 × 844 en `mobile liggend`
een frame van 844 × 390. Het grote scherm keert pas terug na `auto`.

## Volledige bron-ZIP maken in Windows

Hernoem de projectmap naar de bedoelde releasenaam en dubbelklik daarna op:

```bat
maak-volledige-zip.bat
```

De BAT leidt de ZIP-naam af uit de map waarin hij zelf staat. De map
`OpenGraph_Lite_Viewer_v2.0.0-rc.45` maakt dus daarnaast automatisch
`OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source.zip`. Een bestaande ZIP met
precies die naam wordt veilig vervangen; het script verzint nooit zelf een
achtervoegsel `(1)`.

Bestanden met het patroon `*_full_source*.zip` zijn gegenereerde
release-artefacten en geen projectbron. Daaronder valt ook een browserdownload
als `OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source (1).zip`. Zulke kopieën
worden genegeerd door de manifest- en publicatiecontrole, niet voor GitHub
Pages gestaged en niet in een nieuwe volledige bronzip opgenomen. Ze mogen dus
lokaal blijven staan zonder de publicatie te blokkeren; oude kopieën
verwijderen houdt de projectmap wel overzichtelijker.

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.45
```

Cache-reset:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.45
```

## Desktopweergave

De leesbare weergave over het volledige venster is de standaard. Deze staat
direct bovenaan onder `Config → Calculated → Language Tree → Boom & projecties`:

```text
Boomruimte   = MAX · groot letterbeeld / lage boom
Venstervulling = MAX · volledig venster benut
```

MAX past alleen de werkelijk getekende boom en projecties in alle beschikbare
desktopruimte. Het onzichtbare stabiliteitskader, raster en hulplabels maken
de graph en tekst dus niet meer kunstmatig klein. Tijdens de gefaseerde
Play-volgorde blijft hetzelfde MAX-kader stabiel.

### Mobiele MAX

Op een fysieke telefoon gebruikt MAX in portret én landschap het gebied tussen
de projectie-assen als eerste focus. In portret vult dit asgebied de beschikbare
breedte. Landschap gebruikt een werkelijk lagere, bredere layout en een
`contain`-fit, zodat rastertop en de volledige LEX-, SYNT- en LOG-as tegelijk
zichtbaar blijven. Twee compacte menurijen, het SVG en de Play-balk hebben elk
een eigen verticale zone. Dat blijft zo wanneer `Interface → Desktop` op de
telefoon wordt geforceerd. Inhoud buiten het initiële beeld blijft met pan en
pinch-zoom bereikbaar.

Het raster zelf eindigt links op LEX, rechts op SYNT en onder op LOG. Het loopt
niet langer voorbij die assen.

## Config-tabbladen

Config volgt de afhankelijkheidsvolgorde en bevat daarna gerichte secties:

1. `Voorconfig`: insertie afzonderlijk op LEX, SYNT en LOG;
2. `Toepassingen`: Bijwoorden vereist LEX + LOG;
3. `Overzicht` en `JaN · TODO`;
4. `Opslaan & exporteren`: eerst LinkedIn/Play/SVG, daarna OPN, Config
   bewaren/herstellen en voorbeeldbeheer;
5. `Beeld`: MAX, Syntax / Functional, boomlayout en projectiekleuren;
6. `LOG & LEX`: de kernvolgorde van LEX en, indien actief, optionele
   inserties;
7. `Geavanceerd`: compatibiliteitsopties voor tak- en menuplaatsing.

Bij zoveel mogelijk instellingen staat direct een korte uitleg van het effect.
De bestaande save-werkwijze blijft ongewijzigd.

`Venstervulling` betekent hoe de boom het beschikbare appvenster gebruikt.
Het is dus geen tweede venster.

## Publiceren op sociale media

Open `Config → Opslaan & exporteren`. De eerste, duidelijk gemarkeerde kaart
bevat drie lokale exports:

- `LinkedIn-PNG`: een witte afbeelding van 1200 × 627 voor een beeldpost;
- `Play-video`: een automatische opname van de volledige gefaseerde
  Play-reeks in 1200 × 628 en een vaste 30 fps;
- `Graph als SVG`: een zelfstandig vectorbestand van de volledige actuele
  graph.

De recorder kiest waar de browser dat ondersteunt eerst MP4/H.264 en gebruikt
anders WebM. Hij vraagt nu actief alle 30 frames per seconde op; de oude
recorder bewaarde alleen gewijzigde canvasframes en kon daardoor onder
LinkedIns minimum van 10 fps vallen. Houd het browservenster actief tot de
download klaar is en upload de uitvoer via LinkedIns Video-actie. Zie
[`docs/SOCIAL_EXPORT.md`](docs/SOCIAL_EXPORT.md).

## Lees mij / README

De knop `README` / `LEESMIJ` opent onmiddellijk op
**Start · OGN-kern**. De onderwerpenlijst en geselecteerde tekst blijven in
iedere interfacevorm onafhankelijk scrollbaar.

De eerste carousel verklaart de toepassingsonafhankelijke kern in vier
stappen: vrije gridplaatsen, knopen sequentieel schrijven, zoekvolgorde en de
vaste laagvolgorde. Er wordt nog geen gespecialiseerde uitbreiding
geïntroduceerd.

![OGN-kern: vrije gridplaatsen](../images/readme/ogn-free-grid.svg)

![OGN-kern: schrijf één knoop per stap](../images/readme/ogn-sequential-write.svg)

![OGN-kern: verschillende zoekvolgorden leveren verschillende directe plaatsingen](../images/readme/ogn-placement-strategies.svg)

![OGN-lagen: vrije plaatsing, projectie, berekende plaatsing](../images/readme/ogn-three-layers.svg)

De externe voorbeeldzoekopdracht opent in een apart browservenster. Na het
sluiten van dat venster staat de app nog open.

## Play-volgorde

Na de opbouw van de centrale boom toont Play het projectieproces in twee
afzonderlijke fasen:

```text
1. LOG-as tekenen en majors/minors plaatsen
2. lexicale bronnen horizontaal op bronhoogte projecteren en uitsluitend
   expliciete upward-Wissels naar topic, V1 of V2 uitvoeren
```

Er is geen afzonderlijke lege ruimtefase. SYNT en de overige
projectiepanelen verschijnen in de laatste stap.
De knop voor de vorige stap keert exact dezelfde volgorde om: eerst verdwijnt
de laatste projectielaag, daarna volgen de LEX-verplaatsingen, LOG en ten
slotte de centrale boom.

## Centrale views

```text
1. Syntax
2. Functional
```

Syntax toont de syntactische boom. Functional toont de functionele structuur van
dezelfde voorbeeldzin. LOG is geen centrale view.

## Named projections

```text
LEX    westas
SYNT   oostas
LOG    zuidas
```

Standaard zijn LEX, SYNT en LOG zichtbaar. Iedere projectie kan afzonderlijk
worden uitgezet. `Geen` toont alleen de centrale Syntax- of Functional-view; `Alle` en
Reset herstellen alle projecties. Projectiewissels veranderen de centrale
graph, viewport en schaal niet.

Bijwoordelijke inserties muteren Syntax en Functional niet. Het gekozen gebruiksprofiel
bepaalt de bron: LOG en LOG+LEX leveren een minor op de zuidas; een directe
LEX-insertie niet. Bronknopen projecteren horizontaal naar LEX en alle origins
krijgen vooraf een neutraal LEX-doel. Een expliciete topic-/V2-regel kan dit
vóór het tekenen vervangen, waarna één rechtstreekse zichtbare verplaatsing
volgt.

De actieve zin staat boven de graph. Daaronder blijft ruimte vrij voor een
mogelijke latere noord-as.

## Beperkte meerwoordige bijwoordelijke eenheden

De bijwoordlijst bevat nu bewust vier beperkte meerwoordige eenheden:
`MISSCHIEN WEL`, `AF EN TOE`, `OP DIT MOMENT` en
`MET VEEL AANDACHT`. Iedere volledige groep geldt voorlopig als één zichtbare
LEX-eenheid. Het gebruiksprofiel bepaalt of de groep daarnaast een LOG-minor,
een directe LEX-insertie of een gemengde bron heeft; de interne syntaxis wordt
nog niet uitgewerkt. De set
illustreert modaliteit, frequentie, tijd en wijze, maar is geen volledige
inventaris van bijwoordelijke bepalingen. Zie
[`docs/TALIGE_UITBREIDINGEN.md`](docs/TALIGE_UITBREIDINGEN.md).

## Topmenu

```text
OGN Basis: Zin · Syntax / Functional · Interface · Projecties · LOG-volgorde
Taal · LEESMIJ/README · Config

Bijwoorden aan: Zin · Bijwoord · Syntax / Functional · Interface · Projecties · LOG-volgorde
Taal · LEESMIJ/README · Config
```

Er is geen algemene knop `Menu` en er zijn geen geneste submenu’s. Keuze-items
openen rechtstreeks hun eigen brede paneel.

## OPN-opslag

`.opn` is het primaire round-trip documentformaat. Het document scheidt:

```text
metadata    documentidentiteit, formaat en generator

data        graph, projecties en analysekeuzes

paradata    optionele workspace en lokale sessie-events
```

Paradata kan bij export worden weggelaten. Oudere JSON-bestanden blijven als
migratieformaat leesbaar; Legacy JSON-export blijft tijdelijk beschikbaar voor
debugging. Zie `OPN_STORAGE_FORMAT.md`.

## Versiebron

`VERSION.txt` is leidend voor HTML, JavaScript, service worker, cachequery,
publicatiescript en zipnaam.

## Controle

```bat
node --check viewer.js
check_release.bat
```

## Voorbeeldset en bestandsbediening (rc.18)

- De viewer bevat 14 voorbeeldzinnen, inclusief twee voorbeelden met meerdere
  LOG-minors.
- Bij automatische plaatsing heeft een expliciete zinsgebonden landingsplaats,
  zoals `post-object-pre-vcluster`, voorrang op een brede klasse-default.
  Zonder zo’n expliciete plaats gelden de klasse-defaults
  `MODALITEIT → S-O` en `FREQUENTIE → O-V`. Scope en lineaire plaats blijven
  afzonderlijke eigenschappen.
- `Opslaan als .opn` downloadt de huidige analyse.
- `Importeer .opn` opent een eerder geëxporteerd document.
- Paradata is optioneel.

## Welk probleem lost OGN op?

Een klassieke constituentboom laat de horizontale volgorde van vertakkingen
vaak twee representatietaken tegelijk uitvoeren: zij legt structurele relaties
vast en suggereert tevens de lineaire woordvolgorde van de zin. OGN ontkoppelt
die taken.

```text
centrale vertakkingen onder S = structurele relaties
LEX-projectie             = lineaire woordvolgorde
```

Dezelfde centrale structuur kan daardoor verschillende oppervlaktestrings
krijgen zonder de boom te spiegelen, opnieuw op te bouwen of woordvolgorde als
transformatie van de centrale boom te behandelen.

## Plaatsingsplan vóór rendering

De viewer berekent vóór het tekenen één volledig plaatsingsplan:

1. structurele hosts bepalen;
2. lexicale inserties en landingsplaatsen bepalen;
3. gridruimte en Wissel-corridors reserveren;
4. de centrale boom plaatsen;
5. de kernzin lexicaal invullen;
6. projecties, traces en Wisselpaden vastleggen;
7. groei- en renderstappen toekennen;
8. het vaste resultaat renderen.

De renderer kiest geen nieuwe posities en reserveert geen nieuwe ruimte.
Play/Groei onthult de vooraf berekende layout stap voor stap.

## JaN · TODO

- Werknotatie: `S:np-VP`, nadrukkelijk niet `S:NP-VP`.
- Onderzoeksnotatie: `S+ np-VP`.
- Eerst binaire bomen; later niet-binaire, meertakkige bomen.
- Flip van het verbale cluster: `heeft gebeten` ↔ `gebeten heeft`.

## Verstelbaar LEESMIJ-tekstscherm

Sleep in de ingebouwde LEESMIJ de scheidingslijn tussen de onderwerpenlijst en de geselecteerde tekst om het tekstscherm groter of kleiner te maken. Op desktop/landscape werkt dit horizontaal; op portrait verticaal.
