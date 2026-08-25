# Projectie-master-spec · bronhoogte, planning en expliciete Wissels

Normatieve projectiespecificatie voor OpenGraph Lite Viewer `v2.0.0-rc.45`.

## 0a. Uiting en kernzinnen

Een uiting bestaat uit één of meer verknoopte kernzinnen (`S` of `CLAUSE`).
LEX is het ultieme resultaat en toont de complete zichtbare uiting; SYN de syntactische constructie; LOG de
deelnemers, functies en relaties. Referentidentiteit, causale inbedding,
rol-flip en impliciete subjecten worden als uitingmetadata opgeslagen en bij
OPN-export/import bewaard. De vijf uitingen worden in **Anafoor · multi-OGN**
daadwerkelijk getekend als twee afzonderlijke kernzinbomen: `K1` boven `K2`.
Iedere kernzin volgt `S → NP, VP` en `VP → NP, V`. De onafhankelijke
LEX-realisatie mag hiervan afwijken, bijvoorbeeld `JAN SLAAT JEK` bij een
onderliggende VP-volgorde `JEK, SLAAT`; bron- en doelhoogte worden expliciet
in de projectielijn bewaard.
Iedere ouder splitst visueel naar een linker- en rechterkind.
Iedere boomtak volgt de schuine richting tussen twee vrije OpenGraph-knopen:
bron en doel hebben verschillende `x` én `y`. Inkorting gebeurt langs de
lijnrichting, nooit uitsluitend boven/onder; compacte knoopsymbolen mogen de
takken niet afvlakken. Alleen gedeclareerde anaforen mogen verticaal zijn.
De horizontale en verticale rastermaat zijn afzonderlijk instelbaar; raster,
knopen en projecties delen steeds dezelfde actuele celmaten.
Config-Flip bestaat uitsluitend in Language Tree en Anafoor/multiple Language
Trees. Zij spiegelt bomen zonder ouder-kindrelaties, LEX-woordvolgorde of
referentidentiteit te wijzigen: structuur, ruimtelijke richting en
woordvolgorde zijn afzonderlijke eigenschappen. Bij de causale rol-flip staat
K2 in de standaardweergave gespiegeld zodat zowel `HOND ↔ HOND` als `JAN ↔ MAN`
verticaal blijven; een gezamenlijke Flip bewaart beide verticale verbindingen.
De causale bronknoop `HOND` is rechtstreeks klikbaar; de klik selecteert op
LEX `HIJ`, `DIE`, `DIE HOND`, `DE HOND` of `JEK`, maar wijzigt de bronknoop
niet. Alle vijf verwijzen naar dezelfde hond; `DIE HOND` en `DE HOND`
projecteren ieder twee gerealiseerde LEX-woorden. Lokale K2-Flip is noodzakelijk bij de dubbele
subject/object-rolwisseling; globale interface-Flip is optioneel en spiegelt
beide bomen zonder structuur, woordvolgorde of verticale referentie te wijzigen.
Iedere boom behoudt zijn eigen unieke rijen en kolommen; tussen beide bomen
mogen uitsluitend expliciet gedeclareerde verticale anafoorkolommen samenvallen.
De gedeelde LEX-as volgt de gerealiseerde uiting; `OMDAT` is een verbindend
LEX-element en een impliciet subject krijgt geen afzonderlijk LEX-woord.
Compositie van willekeurig veel kernzinnen blijft vervolgwerk.
Play gebruikt de omkeerbare volgorde `K1 → K2 vóór Flip → lokale K2-Flip → starre K2-uitlijning en verticale anaforen → LEX`;
Reset keert terug naar uitsluitend raster en titel.
De actieve testuiting blijft boven Play en werkvlak zichtbaar. Boomkleur,
boomlijnzwaarte, boomruimte, onafhankelijke horizontale/verticale
vertakkingsruimte en Flip zijn configureerbaar; standaard zijn boomtakken
blauw, zwaar en in beide richtingen compact.
Normatief: `UITING_EN_KERNZINNEN.md`; corpus:
`samples/uitingen-kernzinnen.v1.json`.

## 0. Multi-OGN-discoursecompositie

De berekende toepassing **Anafoor · multi-OGN** staat naast Language Tree en
gebruikt een eigen compositielaag. S1 en S2 worden eerst afzonderlijk als OGN
berekend. Daarna ordent één gezamenlijke LEX-as alle S1-items vóór alle
S2-items. De compositor verschuift de complete S2 star totdat antecedent MAN
en anafoor HIJ exact dezelfde kolom bezetten. Hun rechte verticale lijn is
ongericht en heeft geen pijlpunt. De normale Language-Tree-keten hieronder
wordt hierdoor niet gewijzigd. De drie nieuwe uitingen gebruiken dezelfde
architectuur met `K1/K2` en meerdere gedeclareerde anafoorverbindingen,
waaronder gelijktijdig `JEK ↔ DIE` en `JAN ↔ HEM`.
Normatief: `MULTI_OGN_ANAPHOR.md` en `UITING_EN_KERNZINNEN.md`.

## 1. Autoriteit en afleidingsrichting

De afleiding loopt in deze volgorde:

```text
structure-config
→ LOG-majors en LOG-minors
→ LOG plant mogelijke LEX-plaatsen
→ horizontale LEX-bronprojectie op bronhoogte
→ alleen expliciete regels mogen een bronknoop verplaatsen
→ voorbeeldzin als validatie
```

`LOG` is de autoriteit voor de lineaire plaatsingsplanning, niet voor een
zichtbare verplaatsing van een bronknoop. De projectieoorsprong én de blijvende
positie van een bronknoop zonder expliciete regel zijn altijd de
bronknoophoogte. De voorbeeldzin levert geen coördinaten.

## 2. Majors, minors en logische afstand

De basisposities `S`, `O` en `V` zijn **majors**. Een insertie met
`origin=LOG` of `origin=LOG+LEX` is een **minor**. Een insertie met
`origin=LEX` krijgt wel een LEX-doel, maar geen LOG-minor.

Iedere major en minor bezet een LOG-slot met een vaste breedte. De logische
afstand tussen twee majors is:

```text
dLOG(A,B) = |slot(B) - slot(A)|
```

Voorbeeld:

```text
S O V            dLOG(S,O) = 1
S m1 O V         dLOG(S,O) = 2
S m1 m2 O V      dLOG(S,O) = 3
```

Een minor tussen `S` en `O` maakt de afstand tussen die majors dus exact één
slot groter. Een minor tussen `O` en `V` verandert `dLOG(S,O)` niet.

`logische afstand` is in dit project de operationele naam voor deze
slotafstand. Het is geen claim dat de term buiten dit model al een
gestandaardiseerde taalkundige maat is.

## 3. Intervallen

Een minor wordt geplaatst met zowel een linker- als een rechtergrens:

| Interval | `after` | `before` |
|---|---:|---:|
| vóór S | `START` | `S` |
| tussen S en O | `S` | `O` |
| tussen O en V | `O` | `V` |
| na V | `V` | `END` |

De dubbele begrenzing is normatief. Bij een andere LOG-majorvolgorde gebruikt
de resolver eerst een aangrenzend paar. Als het paar niet aangrenzend is,
blijft `after` leidend en wordt de plaats direct na die major gekozen.

Meerdere minors in hetzelfde interval worden geordend op hun expliciete
`order`; die volgorde is stabiel.

## 4. Bron → LEX; LOG plant, een regel verplaatst

Iedere lexicale bron projecteert eerst exact horizontaal naar de LEX-as:

```text
y(LEX-bronanker) = y(bronknoop)
```

De projectielijn bevat dus geen verticale sectie. De LOG-slotvolgorde levert
vervolgens geplande plaatsen op LEX. Die planning is geen
verplaatsingsopdracht. Zonder expliciete Language-Tree-regel blijft het woord
op het horizontale bronanker en verschijnt geen trace.

Majors kunnen meer dan één lexicaal bronitem leveren, bijvoorbeeld `pv` en
`vdw` binnen major `V`; die items krijgen opeenvolgende LOG-doelrijen binnen
de majorzone.

Pas daarna worden expliciete LEX-regels logisch toegepast:

- `Comp`;
- topic/vooropplaatsing;
- V2/persoonsvorm;
- andere later gespecificeerde Wissels.

Alleen wanneer zo'n expliciete regel geldt, verplaatst het woord rechtstreeks
van zijn bronanker naar het bijbehorende doel. Er verschijnt dan één pijl en
één trace. De SYNT- en Functional-bronstructuren worden niet gemuteerd. In
`HOND BIJT MAN` blijven `HOND` en `MAN` op hun eigen bronhoogte; uitsluitend
`BIJT` wisselt naar V2.

## 5. Configuratiecontract

De gebruikersconfig gaat aan de toepassing vooraf:

```text
Voorconfig · Insertie LEX + LOG
→ Toepassing · Bijwoorden
→ LOG-minors en/of directe LEX-inserties
```

LEX, SYNT en LOG zijn in Voorconfig onafhankelijk schakelbaar. De toepassing
Bijwoorden vereist LEX + LOG. De asschakelaars voegen zelf geen inserties toe;
ze stellen alleen de infrastructuur beschikbaar. SYNT is in rc.37 nog niet
aan een insertietoepassing gekoppeld.

De normatieve HTML-config staat in `structure-config.html`:

```html
<section
  id="opengraph-log-config"
  data-authority="LOG"
  data-position-unit="slot"
  data-major-gap="1"
  data-minor-width="1"
  data-expands-major-gap="true"
  data-axis-slot-pixels="176"
  data-lex-slot-pixels="64"
  data-lex-position-source="LOG"
  data-lex-projection-origin="SOURCE-Y"
  data-lex-placement-mode="horizontal-then-move"
  data-example-controls-layout="false"
  data-play-phases="LOG LEX"
  data-play-space-mode="none">
</section>
```

Binnen deze sectie:

- `.log-major-config` definieert majors en hun lexicale sources;
- `.log-interval-config` definieert `after`/`before`;
- `.log-class-config` koppelt een bijwoordklasse aan een standaardinterval.

Een voorbeeld kan voor compatibiliteit een structurele annotatie dragen:

```html
data-log-interval="O-V"
data-log-after="O"
data-log-before="V"
```

Bij `data-example-controls-layout="false"` negeert de renderer deze
positiehints en kiest hij het LOG-interval via `.log-class-config`. Daardoor
kan de lineaire positie in een voorbeeldzin de LOG- of LEX-layout niet
terugsturen. Alleen bij `data-example-controls-layout="true"` mogen zulke
annotaties de automatische klassekeuze vervangen. Een expliciete keuze in de
Config-UI heeft altijd voorrang.

## 6. Rendering

- Eén LOG-slot is een vaste logische afstandseenheid. De waarde
  `data-axis-slot-pixels` wordt gebruikt wanneer een slot buiten de aanwezige
  majorankers moet worden geëxtrapoleerd.
- Met een centrale boom behouden majors hun eigen bron-x. De fysieke
  pixelafstand mag daardoor variëren; de `logical_slot`-afstand blijft
  normatief voor de afleiding naar LEX.
- Major- en minorlabels hebben geen invloed op de slotafstand.
- Een LOG-major behoudt de horizontale positie van zijn bron en projecteert
  rechtstreeks verticaal naar de zuidas; hij wordt niet naar het midden
  getrokken.
- LOG-minors zonder eigen boombron staan op een compacte tweede labelrij.
- De LEX-rijstap komt uit `data-lex-slot-pixels`.
- Bron → LEX blijft altijd horizontaal; verticale trajecten bestaan alleen
  als Wissel op de LEX-as.
- Gevulde TOPIC- en V2-rijen tonen geen onderliggend leeg-slotvak.
- Bewegingslabels zijn compact genummerd; de volledige betekenis staat in het
  trajectelement.
- De actieve zin staat boven de graph, met vrije ruimte eronder voor een
  mogelijke noord-as.
- Het vaste projectieframe omvat de maximale actuele LOG-spanne, zodat
  projectiekeuzes de centrale graph niet laten verspringen.

De Play-presentatie gebruikt na de centrale boomopbouw twee afzonderlijke
configuratiefasen:

```text
LOG → LEX
```

1. `LOG` tekent eerst de zuidas en plaatst majors/minors.
2. `LEX` toont de lexicale bronnen eerst op hun horizontale bronankers en
   voert uitsluitend expliciete upward-Wissels naar topic, V1 of V2 uit.

LOG plant ruimte maar verplaatst niets. Pas in de eindstap volgen de overige
projectiepanelen. Er bestaat geen afzonderlijke lege ruimtefase.

LEX activeert voorlopig drie plaatsingsmechanismen: upward-Wissels vanaf een
zichtbare bron, toepassingsgebonden insertieplaatsen en rechtstreeks
geschreven Comp. Generieke lege kandidaten vóór, na of tussen actieve rijen
en iedere downward/post-V2-Wissel zijn no-show. Ze hebben geen Config-optie,
rendering of nieuwe opslagwerking. Oude velden mogen uitsluitend compatibel
worden genegeerd; het gebruik van vóór, na en tussen wordt later geëvalueerd.

### 6.1 Richting van een Wissel

Voor een echte Wissel is de zichtbare bronprojectie de harde referentie:

```text
toY < fromY  → data-display-direction="up" → voer de Wissel uit
toY ≥ fromY  → geen traject              → blijf op de bronhoogte
```

`Up` beschrijft SVG-geometrie en geen syntactische upward-movementclaim.
`TRUI BREIT VROUW` illustreert topic/V2, `BIJT HOND MAN?` V1,
`HOND BIJT MAN` laat HOND en MAN op bronhoogte, en `DAT`/`OMDAT` worden zonder
bronpijl rechtstreeks in Comp geschreven. Een LOG-reservering mag de
bronreferentie niet vervangen en kan dus geen lager doel legitimeren.

Heavy NP Shift, extrapositie en morfologische Lowering vallen buiten rc.45.
Een toekomstige regelspecificatie moet bron, lineair doel, structurele status,
fase en trace-/kopiegedrag expliciet toevoegen. Geen daarvan mag uit
schermrichting of uit de aanwezigheid van een lege kandidaat worden afgeleid.

## 7. Opslag en validatie

Een `.opn`-document bewaart:

- `log.authority`;
- `log.position_unit`;
- `log.insertion_interval`;
- de major/minor-`sequence` met `logical_slot`;
- `d(S,O)`, `d(O,V)` en `d(S,V)`;
- `log.lex_position_source`;
- `log.lex_projection_origin`;
- `log.lex_placement_mode`;
- `log.example_controls_layout`;
- `example.sentence_type`;
- dezelfde LOG-sequentie als bron van de LEX-doelrijen.

Nieuwe documenten bewaren geen generieke `additional_open_slot_*`-velden.
Geldige zinsoorten zijn `main-declarative`, `polar-question`,
`subordinate-dat` en `subordinate-omdat`.

De releasetest `tools/check_log_slot_distance.py` verifieert onder meer dat
nul, één en twee minors de majorafstand respectievelijk met nul, één en twee
slots vergroten.

De releasetest `tools/check_lex_horizontal_projection.py` verifieert met
`BIJT` dat eerst de lage bronhoogte wordt gebruikt en daarna in één zichtbare
stap rechtstreeks het V2-einddoel. Zij bewaakt ook dat de bronprojectielijn
geen verticale sectie bevat, dat `HOND BIJT MAN` uitsluitend `BIJT` verplaatst
en dat `MAN` exact op de bronhoogte van de centrale MAN-knoop blijft.
Dezelfde test bewaakt dat een doel onder een hoge bron wordt geweigerd, ook
wanneer een LOG-reservering dat doel intern als eerdere rij zou behandelen.

`tools/check_projection_cleanup.py` bewaakt daarnaast de directe verticale
LOG-projectie, het opruimen van gevulde lege slots, de ingebouwde
bijwoordkeuzes, het ene introbeeld en de zinkop boven de graph.

## 8. Oude notatie zonder minors

Bestanden zonder LOG-minors blijven geldig. Dan zijn opeenvolgende majors
één slot van elkaar verwijderd. Oude `LEX`-hostvelden worden als
scope-/compatibiliteitsmetadata gelezen, maar zijn niet langer
plaatsingsautoriteit zodra `data-authority="LOG"` en
`data-lex-position-source="LOG"` actief zijn. Ook dan blijft
`data-lex-projection-origin="SOURCE-Y"` de projectieoorsprong bepalen.

## Profielbron en projectieselectie

Voor iedere insertie wordt eerst het effectieve gebruiksprofiel bepaald. `origin=LOG` en `origin=LOG+LEX` worden in de LOG-slotsequentie opgenomen; `origin=LEX` niet. De afzonderlijke LEX-plaatsingssequentie bevat alle origins. Hierdoor kan dezelfde lineaire bestemming twee verschillende afleidingsmechanismen hebben zonder dat de centrale boom verandert.
