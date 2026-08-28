# Uiting, kernzinnen en verknoping

## Werkhypothese

### OGL: Deep Structure is meervoudig

In Open Graph Linguistics is DS geen enkele, al lineair geordende zin. Eén
uiting kan een **meervoudige Deep Structure** bevatten: meerdere zelfstandige
kernzinnen, elk met een eigen Language Tree. Het model bewaart apart welke
kernzinnen tot de DS behoren, hun opgeslagen DS-volgorde, hun verticale
tekenvolgorde en hun uiteindelijke LEX-volgorde.

Voor de beloningsuiting blijven beide volgordes expliciet bewaard:

- `K1 → K2`: **de man beloont … omdat de hond …**;
- `K2 → K1`: **omdat de hond …, beloont de man …**.

Dit zijn realisatiekeuzes boven dezelfde gekoppelde kernzinnen. Een andere
LEX-volgorde herschrijft de DS-bomen niet.

### Story: drie of meer kernzinnen

Vanaf drie kernzinnen heet de gekoppelde uiting een **story**. De eerste
actieve fixture is:

> Jan sloeg Jek omdat die hem beet, waarna hij hem ontweek.

Met de vastgelegde lezing `die=Jek`, `hem₁=Jan`, `hij=Jan`, `hem₂=Jek`:

| DS | Kernzin | Verwachte oriëntatie |
|---|---|---|
| K1 | JAN SLAAT HOND | normaal; anker |
| K2 | HOND BIJT MAN | Flip; beide rollen zijn gewisseld |
| K3 | MAN ONTWIJKT HOND | normaal; rollen zijn teruggewisseld |

De stresstest voegt in K3 een derde referentketen toe: MAN geeft BOT aan HOND.
Daar moet één starre K3-verschuiving tegelijk de MAN-, HOND- en BOT-kolom
oplossen. Als de drie vereiste `dx`-waarden na alle toegestane flips niet gelijk
zijn, rapporteert de solver **geen gezamenlijke verticale oplossing**. Hij mag
geen schuine anafoor tekenen en geen referent verwisselen.

Een **uiting** bestaat uit één of meer **kernzinnen**. Een kernzin (`k`) is
voorlopig de eenvoudigste syntactische `S` of functionele `CLAUSE` die voor de
interpretatie nodig is. De definitie blijft een werkhypothese: de verhouding
tussen syntactische, functionele en semantische kernzin ligt nog niet vast.

Een uiting is niet de optelsom van haar kernzinnen. Zij ontstaat uit hun
**verknoping**: referentidentiteit, functies, relaties en uiteindelijke
lexicale realisatie.

> **LEX is het ultieme resultaat:** LEX toont de volledige, uitgesproken of
> geschreven uiting in haar uiteindelijke woordvolgorde. De Language Tree is
> de structurele bron; LEX is niet nog een alternatieve boomweergave.

**Correctie van de anafoorbron:** in `Hond brengt bot naar man` verwijst
`hem` naar **man/Jan**. De tweede verticale bronrelatie is `MAN ↔ MAN` (op LEX:
`JAN ↔ HEM`), niet `BOT ↔ MAN`. BOT is thema/patiens en geen antecedent van
`hem`.

## Flip in één oogopslag

Begin minimaal met `is geweest` ↔ `geweest is`. De knopen en categorieën
blijven gelijk. Alleen een uitdrukkelijk lineariserende werkwoordclustertak mag
haar childvolgorde op LEX omkeren; bij gewone takken verandert Flip slechts de
links/rechts- en kort/lang-geometrie.

Flip is, naast **Free Node**, een kernbegrip van de Language Tree. Free Node
bepaalt dat iedere knoop een werkelijk vrije rasterplaats krijgt. Flip bepaalt
vervolgens hoe een binaire vertakking zichtbaar wordt geplaatst: links/rechts
en kort/lang. De grammaticale structuur blijft gelijk en LEX blijft de
uiteindelijk gerealiseerde uiting.

![Minimale Language Tree met twee schuine vrije takken](images/readme/flip-minimale-language-tree.png)

*Minimale boom: één ouder, twee kinderen, beide op een eigen rij en kolom. De
twee takken zijn schuin. Flip mag de kinderen visueel verwisselen zonder de
ouder-kindrelaties te wijzigen.*

![Vrije vertakkingen met verschillende richtingen en lengten](images/readme/flip-vrije-vertakkingen.png)

*Links/rechts en kort/lang zijn eigenschappen van de tekening. De langere
vertakkingen tonen dat een Language Tree geen vaste leesrichting afdwingt.*

![Kleinste veld met LEX-, SYN- en LOG-projecties](images/readme/flip-projecties-kleinste-veld.png)

*De projecties blijven aan hun eigen assen gekoppeld wanneer de centrale boom
flipt. Flip verandert dus niet automatisch de projectievolgorde.*

![Language Tree met LEX links, SYN rechts en LOG onder](images/readme/flip-language-tree-lex-syn-log.png)

*Volledige scheiding: de blauwe Language Tree levert de structuur; LEX links
levert woordvorm en woordvolgorde; SYN rechts en LOG onder behouden hun eigen
projecties.*

Voor de causale uiting zijn de bronbomen `JAN SLAAT HOND` en `HOND BIJT MAN`.
De lokale Flip slaat uitsluitend toe op de onderste Language Tree, zodat
`HOND ↔ HOND` en `JAN ↔ MAN` beide verticaal kunnen worden uitgelijnd. Pas
daarna realiseert LEX bijvoorbeeld `JAN SLAAT JEK OMDAT DIE HEM BEET`.

| Uiting | Kernzin 1 | Kernzin 2 | Verknoping |
| --- | --- | --- | --- |
| Jan wast zichzelf. | Jan wast Jan. | Jan wast zelf. | Jan als agens = Jan als patiens; `zich + zelf → zichzelf`. |
| Jan slaat Jek omdat die hem beet. | Jan slaat hond. | Hond bijt man. | Oorzaak `k₂ → k₁`; `hond = Jek`; `man = Jan`; rol-flip. |
| Jan slaat de hond omdat die hem gebeten heeft. | Jan slaat hond. | Hond bijt man. | Dezelfde bronbomen; `de hond`, `die`, `hem` en `gebeten heeft` verschijnen uitsluitend op LEX. |
| Jan beloonde zijn hond Jek omdat die het bot naar hem terugbracht. | Jan beloont hond. | Hond brengt het bot naar man. | `hond = Jek`; `man = Jan`; BOT is een eigen structureel thema; LEX realiseert terugbrengen. |
| Ken uzelf. | Ken zelf. | Ken u. | Impliciete geadresseerde = object; `u + zelf → uzelf`; imperatief. |

### Nieuwe variantgroepen

De sla-uiting ondersteunt `hij`, `die`, `die hond`, `de hond` en `Jek`, met
`beet`, `heeft gebeten` en `gebeten heeft`. De beloon-uiting ondersteunt
dezelfde subjectvormen, plus `terugbracht`, `heeft teruggebracht`,
`teruggebracht heeft`, `apporteerde`, `heeft geapporteerd` en
`geapporteerd heeft`. De bot-NP kan als `het bot` of `zijn bot` worden
gerealiseerd. Iedere keuze verandert LEX, niet de kernzinrollen.

Terugbrengen en apporteren zijn daarbij **geen gemengde analyse**:

- terugbrengen: `HOND BRENGT BOT NAAR MAN` → `die het bot naar hem terugbracht`;
- apporteren: `HOND APPORTEERT BOT` → `die het bot apporteerde`.

De boom maakt dit verschil nu eveneens structureel. Terugbrengen gebruikt een
recursieve binaire VP met `NP → DET N` voor HET BOT en `PP → P NP` voor
NAAR MAN. Apporteren gebruikt alleen de BOT-NP. De anafoor van JAN grijpt bij
terugbrengen aan op `goal=MAN`; `theme=BOT` blijft een afzonderlijke rol.

Alleen de terugbrengvariant bevat MAN als doel en dus de relatie `MAN ↔ MAN` /
`JAN ↔ HEM`. De apporteervariant bevat geen `naar hem` en alleen de
HOND-coreferentie tussen K1 en K2.

**TODO — ambiguïteit:** in `zijn bot` kan `zijn` naar Jan of naar Jek
verwijzen. De software en documentatie bewaren beide lezingen en mogen niet
stilzwijgend één antecedent kiezen. `Het bot` is de ondubbelzinnige standaard.

Voor uiting 2 mag de eerste kernzin ook worden genoteerd als
`hond(Jek) bijt man(Jan)`: de referenten blijven gelijk, terwijl de uiteindelijke
realisatie verleden tijd gebruikt: `beet`. Kernzinvolgorde hoeft niet samen te
vallen met de zichtbare woordvolgorde.

### Eén causale uiting, vijf verwijzende subjectvormen

De causale uiting blijft één beheerd testitem. De verwijzing naar Jek kan in
het hoofdscherm direct naast de uiting, of in **Config → Anafoor · multi-OGN
→ Causale anafoor**, op vijf manieren worden gerealiseerd. De subjectknoop in `K2` is bovendien
rechtstreeks klikbaar op zowel de vorm als de zichtbare tekst; Enter werkt
eveneens. De canvas-sleepbediening onderschept deze knoop niet. Iedere klik
toont de volgende vorm:

| Gekozen vorm | Gerealiseerde uiting | Bronverbinding | LEX-woorden |
| --- | --- | --- | --- |
| `hij` | Jan slaat Jek omdat hij hem beet. | `HOND ↔ HOND` | `HIJ` |
| `die` | Jan slaat Jek omdat die hem beet. | `HOND ↔ HOND` | `DIE` |
| `die hond` | Jan slaat Jek omdat die hond hem beet. | `HOND ↔ HOND` | `DIE`, `HOND` |
| `de hond` | Jan slaat Jek omdat de hond hem beet. | `HOND ↔ HOND` | `DE`, `HOND` |
| `Jek` | Jan slaat Jek omdat Jek hem beet. | `HOND ↔ HOND` | `JEK` |

In alle varianten blijft `JAN ↔ MAN` de tweede verticale bronverbinding. De
subjectknoop in K2 blijft altijd `HOND`; een klik verandert uitsluitend de
LEX-realisatie. `DIE HOND` en `DE HOND` zijn ieder één verwijzende NP met twee
afzonderlijke woorden op LEX, maar vervangen de bronknoop nooit. `JEK`
herhaalt dezelfde eigennaam op LEX; de referentkolom blijft
gedeeld, ook wanneer de vorm geen voornaamwoord is. De referenten, oorzaak,
syntactische relaties en rolwisseling
blijven gelijk. De standaardvorm is `die`; de keuze wordt opgeslagen in Config
en meegenomen in OPN-export.

## OGN-projecties

- **LEX** toont uitsluitend de werkelijk gerealiseerde woordvormen en vormt
  daarmee het ultieme resultaat: de complete uiting.
- **SYN** toont de syntactische constructie en, zodra ondersteund, inbedding.
- **LOG** beschrijft deelnemers, functies, gebeurtenissen en hun relaties.
- Identiteit tussen deelnemers mag niet worden verward met identiteit tussen
  zichtbare woordvormen: `Jan`, `hem` en `zichzelf` kunnen dezelfde referent
  vertegenwoordigen.
- Een impliciete deelnemer kan op LOG bestaan zonder eigen LEX-woord; in
  `Ken uzelf` is `u` de niet uitgesproken agens.

### Rol-flip

In `Jan slaat Jek omdat die hem beet` wisselen de rollen tussen de kernzinnen:

| Referent | k₁: slaan | k₂: bijten |
| --- | --- | --- |
| Jek / HOND | patiens | agens |
| Jan / MAN | agens | patiens |

Deze **rol-flip** betreft functionele rollen. Zij is niet hetzelfde als de
configureerbare **visuele Flip** van een boom en verandert evenmin zelfstandig
de gerealiseerde woordvolgorde. In de causale uiting wordt de onderste boom
wel gespiegeld geplaatst omdat uitsluitend zo zowel `HOND ↔ HOND` als
`JAN ↔ MAN` recht verticaal kunnen blijven terwijl de referenten van rol
wisselen. Dit is een geometrische oplossing, geen herschrijfregel.

## Opslag en beheer

`samples/uitingen-kernzinnen.v1.json` is de gestructureerde, leesbare
testverzameling. `examples-input.html` bevat dezelfde drie uitingen als
selecteerbare viewer-items. Elk item bewaart kernzinnen, verknopingen, type en
eventueel een impliciet subject in `data-*`-attributen.

De uitingeneditor bewaart deze velden bij laden, wijzigen, opslaan en export.
Ook OPN-export en -import behouden de uitingmetadata. De bestaande
multi-OGN-toepassing met `Ik zie een man. Hij draagt een hoed.` blijft intact.

### Weergave: twee kernzinnen onder elkaar

Iedere nieuwe uiting opent in **Anafoor · multi-OGN** als twee afzonderlijk
berekende bomen: `K1` boven `K2`. Iedere boom behoudt zijn eigen harde regel:
verschillende knopen delen geen horizontale of verticale gridlijn. Tussen de
bomen mogen uitsluitend expliciet gedeclareerde antecedent–anafoorkolommen
samenvallen. De verbindingen zijn recht, verticaal, ongericht en pijlloos.

Iedere kernzin volgt dezelfde onderliggende syntactische regels:

- `S → NP, VP`: subject vóór de werkwoordgroep.
- `VP → NP, V`: object vóór het werkwoord.

Beide regels zijn ook **zichtbaar binaire vertakkingen**: bij `S` liggen `NP`
en `VP` aan tegenovergestelde zijden; bij `VP` liggen `NP` en `V` aan
tegenovergestelde zijden. De causale onderste boom kan links/rechts gespiegeld
staan, maar houdt exact dezelfde ouder-kindrelaties.

Iedere getekende boomtak verbindt twee **vrije OpenGraph-knopen**: de
eindpunten hebben verschillende horizontale én verticale coördinaten. Een
boomtak mag daarom nooit horizontaal of verticaal worden weergegeven, ook
niet wanneer de compacte layout een korte tak oplevert. De tekenlaag kort
ieder lijnstuk in langs zijn eigen schuine richting; knoopsymbolen en labels
worden passend verkleind. Alleen expliciete anafoorverbindingen tussen K1 en
K2 zijn verticaal, omdat zij gedeclareerde gedeelde referentkolommen tonen.

De structuurvolgorde is niet gelijk aan de zichtbare woordvolgorde. LEX
realiseert bijvoorbeeld `JAN SLAAT JEK`, terwijl de onderliggende VP de
volgorde `JEK, SLAAT` bewaart. Een projectielijn kan daarom van bronhoogte
naar een andere gerealiseerde LEX-hoogte lopen.

### Flexibele rastermaten

**Rastermaat horizontaal** en **Rastermaat verticaal** zijn afzonderlijk
instelbaar op 60%, 80%, 100%, 125%, 150% of 200%. Beide keuzes staan onder
**Config → Algemeen → Lijnbeeld** en bij **Anafoor · multi-OGN**. De
horizontale maat verandert de werkelijke celbreedte; de verticale maat de
werkelijke celhoogte. Rasterlijnen, knoopposities, boomtakken, projecties en
anaforen gebruiken dezelfde actuele celmaten. De afzonderlijke instellingen
voor vertakkingscompactheid blijven daarnaast beschikbaar. De standaard is
100% in beide richtingen.

## Flip: structuur los van woordvolgorde

**Waar is Flip nodig?** In de onderste kernzin `K2` van de causale uiting:
`HOND BIJT MAN`. De vormen `hij`, `die`, `die hond` en `hem` horen bij LEX,
niet bij de kernzinboom.

**Wanneer is Flip nodig?** Wanneer dezelfde twee deelnemers in de bovenste en
onderste kernzin van functie wisselen: in `K1` is Jan subject en Jek object;
in `K2` is Jek subject en Jan object. Tegelijk moeten beide gedeclareerde
referentverbindingen verticaal blijven.

**Waarom is Flip nodig?** Een ongespiegelde `K2` zet haar subject en object
in dezelfde ruimtelijke volgorde als `K1`. Daardoor kan hoogstens één van de
twee referenten zijn kolom behouden; de andere verbinding wordt schuin of de
lijnen kruisen. Door `K2` automatisch links/rechts te spiegelen, komt Jek
recht onder Jek en Jan recht onder Jan. De twee anaforen blijven dan tegelijk
verticaal en iedere boom blijft afzonderlijk een geldige OGN.

Deze automatische, noodzakelijke **lokale Flip van K2** is iets anders dan
de optionele **globale interface-Flip** hieronder. Bij `Jan wast zichzelf`,
`Ken uzelf` en het oorspronkelijke `MAN ↔ HIJ`-voorbeeld is zo’n lokale
rolwisselingsflip niet nodig: daar is geen dubbele kruisende subject/object-
wisseling die twee verticale referentkolommen tegelijk moet behouden.

**Config → Anafoor · multi-OGN → Flip · links/rechts** schakelt tussen
`auto · structuur` en `flip · spiegel links/rechts`. Deze optionele Flip spiegelt beide
kernzinbomen gezamenlijk. Daardoor blijven referentkolommen en verticale
anafoorlijnen behouden. De structurele relaties `S → NP, VP` en `VP → NP, V`
veranderen niet; evenmin veranderen de uiting, de gerealiseerde LEX-volgorde,
de kernzinnen of hun betekenis.

Flip maakt daarmee het onderscheid rechtstreeks controleerbaar:

- **Structuur:** welke constituent van welke ouder afhangt.
- **Geometrie:** of een tak links of rechts wordt getekend.
- **Woordvolgorde:** in welke volgorde LEX de uiting realiseert.

Een gespiegeld beeld betekent dus niet dat de woorden worden omgedraaid.

Flip behoort uitsluitend tot **Language Tree** en tot **Anafoor · multiple
Language Trees**. Free Node levert de vrije knoopposities; Flip kiest bij een
gedeclareerde binaire Language-Tree-vertakking de zichtbare links/rechts- en
kort/lang-plaatsing. Greedy, Random en algemene Direct-weergaven krijgen geen
zelfstandige Flip-betekenis.

| Uiting | Bovenste boom K1 | Onderste boom K2 | Verticale verknoping |
| --- | --- | --- | --- |
| Jan wast zichzelf. | Jan wast Jan. | Jan wast zelf. | `JAN ↔ JAN`; `JAN ↔ ZELF`. |
| Jan slaat Jek omdat die hem beet. | Jan slaat hond. | Hond bijt man. | `HOND ↔ HOND`; `JAN ↔ MAN`. |
| Ken uzelf. | Ken u. | Ken zelf. | Impliciet `U ↔ U`; `U ↔ ZELF`. |

De gezamenlijke **LEX**-as toont uitsluitend de gerealiseerde uiting, dus
respectievelijk `JAN WAST ZICHZELF`, `JAN SLAAT JEK OMDAT DIE HEM BEET` en
`KEN UZELF`. `OMDAT` is een verbindend LEX-element zonder eigen boomknoop; het
impliciete subject `U` blijft in beide bomen zichtbaar maar krijgt geen eigen
LEX-woord. De analytische volgorde van kernzinnen mag afwijken van hun
zichtbare presentatie: bij de causale uiting staat de hoofdzin boven de bijzin.

De bestaande `S1/S2`-demo met `MAN ↔ HIJ` blijft zelfstandig selecteerbaar.

### Play: stapsgewijze opbouw

De Play-balk blijft zichtbaar in **Anafoor · multi-OGN**. `Play` toont de
opbouw automatisch; `←` en `→` lopen handmatig terug of vooruit en `Reset`
begint opnieuw bij het raster. De reeks wordt uit het werkelijke aantal
kernzinnen opgebouwd:

1. **K1 berekenen:** de bovenste Language Tree verschijnt in haar eigen geldige
   free-node-layout.
2. **LEX K1:** bij ieder werkelijk verplaatst woord wordt de bronhoogte uitsluitend op
   de LEX-as gemarkeerd. Een afzonderlijke verticale pijl loopt op diezelfde
   as naar de doelpositie. Er wordt geen verplaatsingslijn vanuit de boom
   getekend. Een woord dat op bronhoogte blijft, krijgt geen pijl. Het label vermeldt `bronknoop → woord · positie`; zo is zichtbaar wanneer
   één NP-bron meer dan één LEX-woord realiseert.
3. **K2 vóór Flip:** de onderste Language Tree verschijnt eerst met haar eigen
   ongespiegelde takrichting. Anafoorlijnen en LEX zijn nog verborgen.
4. **Flip slaat toe op K2:** uitsluitend bij een causale rolwisseling worden
   de binaire roltakken onder `S` en `VP` van K2 links/rechts gespiegeld. De
   knoop-id’s, categorieën, ouder-kindrelaties en LEX-volgorde veranderen niet.
   PLAY toont deze ingreep nadrukkelijk als een vóór/na-beeld: de ongeflipte K2
   blijft rood en transparant staan, de geflipte K2 staat er vol bovenop en
   gestippelde verplaatsingslijnen verbinden dezelfde knopen. Het rode label
   `FLIP K2 · LINKS/RECHTS` benoemt de bewerking. Deze stap blijft langer in
   beeld dan voorheen en kan met `←` en `→` onbeperkt opnieuw worden bekeken.
   Bij uitingen zonder zo’n rolwisseling meldt Play: `geen lokale Flip nodig`.
5. **LEX K2:** na de Flip worden nu ook voor K2 bronvorm, gerealiseerde vorm en
   positie afzonderlijk zichtbaar. Flip verandert de boomoriëntatie; deze
   LEX-stap toont onafhankelijk daarvan de woordvolgorde.
6. **Volgende kernzinnen:** een story herhaalt `K3-boom → LEX K3`, en hetzelfde
   patroon geldt voor iedere verdere kernzin.
7. **Compositie en uitlijning:** de complete bomen worden als
   één starre eenheid verschoven. Pas wanneer voor alle gedeclareerde relaties
   dezelfde verschuiving geldt, verschijnen de rechte verticale anaforen.
8. **LEX-resultaat:** de gezamenlijke LEX-as verschijnt met de volledige
   gerealiseerde uiting in woordvolgorde.

Het eindnummer is dynamisch: een paar zonder Flip eindigt op `6`, een paar met
Flip op `7`, en de huidige K1–K3-story op `9`. Bij K2 staat vóór de ingreep
**VÓÓR FLIP**; in de volgende aparte stop staat **FLIP SLAAT TOE OP K2**.
Het K2-kader bewaart bovendien de technische
status `before` of `applied`, zodat de overgang ook automatisch testbaar is.

### Lengte van een story en aantal Flips

Flip kent als lokale Language-Tree-bewerking geen taalkundig maximum: iedere
kernzin kan in beginsel haar eigen Flip-beslissing krijgen. Ook het OPN-model
accepteert opeenvolgende eenheden `K1 … Kn`, en PLAY maakt zijn stappenlijst
dynamisch uit de aanwezige kernzinnen.

De huidige automatische compositor levert en test echter maximaal **drie**
kernzinnen (`K1–K3`). De huidige automatische rol-Flip is bovendien bewust
beperkt tot `K2`. Een toekomstige algemene `Kn`-flipsolver moet voor iedere
kernzin afzonderlijk beide oriëntaties toetsen aan alle anafoorconstraints,
een consistente combinatie kiezen en daarna de volledige set bomen star
uitlijnen. Bij zeer lange stories is schermhoogte/paginering het praktische
knelpunt; niet de Flip-operatie zelf.

Terugspelen toont dezelfde toestanden in omgekeerde volgorde. Daardoor wordt
ook de overgang van geflipte K2 naar K2 vóór Flip zichtbaar. Het oorspronkelijke
`S1/S2`-voorbeeld gebruikt dezelfde afspeelstappen.

### Uiting bovenin en boomconfiguratie

De gekozen testzin of uiting blijft als aparte balk boven Play en het werkvlak
zichtbaar, ook tijdens alle afspeelfasen. In **Config → Algemeen → Lijnbeeld**
zijn boomkleur en boomlijnzwaarte afzonderlijk instelbaar. In
**Config → Anafoor · multi-OGN → Boomstructuur en layout** staan dezelfde
boomkleur, boomlijnzwaarte, algemene boomruimte, **Vertakking horizontaal**,
**Vertakking verticaal**, **Causale anafoor** en **Flip · links/rechts** rechtstreeks bij de
toepassing. Horizontaal en verticaal zijn onafhankelijk instelbaar als
`compact`, `normaal` of `ruim`; beide beginnen compact. Flip begint op `auto`.
De standaard is blauw met zware, goed zichtbare taklijnen; raster-, projectie-
en boxlijnen behouden hun eigen instellingen.

## Uitingenbeheer

Een afzonderlijk testitem heet voortaan **uiting**. De volledige verzameling
heet **testmateriaal**. Uitingen kunnen worden toegevoegd, bewerkt,
verwijderd, verplaatst en later in uitnodigende Reddit-batches worden
gegroepeerd. Een batch is een publicatieselectie en verandert de taalkundige
analyse niet.
