# Projectie-master-spec · bronhoogte, planning en expliciete Wissels

Normatieve projectiespecificatie voor OpenGraph Lite Viewer `v2.0.0-rc.45`.

## 0. Text, Context en Language Tree · extensie 1

**Text** is de centrale uiting: in Syntax bijvoorbeeld `S–O–V`, in Functional
bijvoorbeeld `Agens–Predicaat–Patiens`. **Context** is alles rondom deze
centrale uiting en is zelf eveneens een **Open Graph Notation**-structuur.
Text-OGN en Context-OGN behouden ieder hun eigen knopen en eigen
gridinvariant. Context wordt behandeld als een nog te ontwikkelen
**geminimaliseerde boom**: uitsluitend relevante takken worden later gebouwd.
Iedere insertie behoort tot Context, ook wanneer zij op LEX verschijnt.
Nadere plaatsing en koppeling van Context blijven **p.m.**; de aangeleverde
Context-OGN staat in `CONTEXT_TAXONOMY.md`.

**Anafoor** is de eerste extensie van Language Tree. S1 en S2 worden eerst
afzonderlijk als centrale Text-OGN berekend. Daarna ordent één gezamenlijke
LEX-as de Text-projecties en Context-inserties van S1 vóór die van S2. De
compositor verschuift uitsluitend de complete S2 star. `relations[]` bevat
alleen expliciete coreferentie tussen centrale Text-bronknopen. Hun rechte
verticale lijnen zijn ongericht. De bron blijft bijvoorbeeld `BOER` of
`EZEL`; uitsluitend LEX realiseert `HIJ` of `HEM`.

`GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` en `OMDAT` zijn Context-inserties:
zij hebben een eigen `insertionId` en geen Text-boom-`nodeId`. In een
omdat-bijzin blijft de persoonsvorm achteraan; er is geen S2-V2-Wissel.
Normatief: `TEXT_AND_CONTEXT.md`,
`ANAPHOR_LANGUAGE_TREE_EXTENSION.md` en `MULTI_OGN_ANAPHOR.md`.

## 1. Autoriteit en afleidingsrichting

De afleiding loopt in deze volgorde:

```text
structure-config
→ LOG-majors en LOG-minors
→ LOG plant mogelijke LEX-plaatsen
→ horizontale LEX-bronprojectie
→ alleen expliciete regels mogen een bronwoord verplaatsen
→ voorbeeldzin als validatie
```

`LOG` is de autoriteit voor de lineaire plaatsingsplanning, niet voor een
zichtbare verplaatsing van een bronwoord. De projectieoorsprong én de
blijvende positie van een bronwoord zonder expliciete regel zijn altijd de
bronknoophoogte. De voorbeeldzin levert geen coördinaten.

## 2. Majors, minors en logische afstand

De basisposities `S`, `O` en `V` zijn **majors**. Een insertie met
`origin=LOG` of `origin=LOG+LEX` is een **minor**. Een insertie met
`origin=LEX` krijgt wel een LEX-doel, maar geen LOG-minor.

Alle drie de insertie-oorsprongen behoren architectonisch tot **Context**.
`origin` beschrijft uitsluitend hoe de Context-insertie een plaats krijgt;
een LOG-minor wordt daardoor geen centrale Text-knoop.

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
`HOND BIJT MAN` blijven `HOND` en `MAN` exact op hun eigen bronhoogte;
uitsluitend `BIJT` wisselt naar de vrije LEX-gridrij halverwege die twee
behouden bronrijen. De V2-doelhoogte is dus afgeleid uit de boom en niet uit
een vaste pixelafstand onder `S`.

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
  data-play-phases="LOG SPACE LEX"
  data-play-space-mode="reserve-empty-lex-rows">
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

De Play-presentatie gebruikt na de centrale boomopbouw drie afzonderlijke
configuratiefasen:

```text
LOG → SPACE → LEX
```

1. `LOG` tekent eerst de zuidas en plaatst majors/minors.
2. `SPACE` reserveert lege rijen op LEX volgens de LOG-slotvolgorde.
3. `LEX` toont de lexicale bronnen eerst op hun horizontale bronankers en
   voert daarna uitsluitend de expliciet geldige Wissels uit.

LOG reserveert mogelijke plaatsen; reservering alleen verplaatst geen woord.
Pas in de eindstap volgen de overige projectiepanelen. `SPACE` verandert het
aantal geplande slots, maar rekt de vaste gridstap niet uit.

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
- dezelfde LOG-sequentie als bron van de LEX-planning.

De releasetest `tools/check_log_slot_distance.py` verifieert onder meer dat
nul, één en twee minors de majorafstand respectievelijk met nul, één en twee
slots vergroten.

De releasetest `tools/check_lex_horizontal_projection.py` verifieert met
`BIJT` dat eerst de lage bronhoogte wordt gebruikt en daarna in één zichtbare
stap rechtstreeks de vrije LEX-gridrij tussen HOND en MAN wordt gevuld. Zij
bewaakt ook dat de bronprojectielijn geen verticale sectie bevat, dat `HOND`
en `MAN` exact op hun bronhoogte blijven, dat het V2-doel het midden van die
twee bronrijen is en dat `HOND BIJT MAN` precies één zichtbare verplaatsing
heeft.

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
