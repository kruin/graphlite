# OGN_STORAGE_FORMAT

Opslagcontract voor **Open Graph Notation**-documenten. `.ogn` gebruikt UTF-8
en JSON-syntaxis en is het heropenbare projectformaat van Graphlite.

```json
{
  "ogn": "Open Graph Notation",
  "document_type": "open-graph-notation-document",
  "ogn_version": "1.0",
  "metadata": {},
  "data": {},
  "paradata": {"included": false}
}
```

MIME-type: `application/vnd.opengraph.ogn+json`.

## Topniveau

`.ogn` gebruikt JSON-syntaxis en scheidt:

```text
metadata    documentidentiteit en generator
data        reproduceerbare graph- en projectieanalyse
paradata    optionele workspace en lokale sessie-events
```

Graphinhoud mag niet afhangen van de aanwezigheid van paradata.

## Profiel en extra's

Vanaf `v2.0.0-rc.36` legt metadata vast welk functieprofiel het document gebruikt:

```json
{
  "profile": "base",
  "extras": []
}
```

Het basisprofiel bevat alleen de kernanalyse. Velden voor een uitgeschakelde extra
worden niet als lege compatibiliteitsvelden bewaard, maar volledig weggelaten.
Met de extra Bijwoorden ingeschakeld wordt dit `"profile": "custom"` met
`"extras": ["adverbs"]`; pas dan mogen bijwoordinserties, LOG-minors en de
bijbehorende LEX- en LOG-velden voorkomen.

## Voorconfig

Vanaf `v2.0.0-rc.37` bewaart metadata de algemene insertiecapaciteit per as:

```json
{
  "preconfig": {
    "insertion": {
      "lex": false,
      "synt": false,
      "log": false
    }
  }
}
```

Deze schakelaars voegen zelf geen taalkundige inhoud toe. Ze moeten vooraf
actief zijn wanneer een toepassing insertiedata gebruikt. De toepassing
Bijwoorden vereist de combinatie `lex: true` en `log: true`. `synt` is
onafhankelijk gereserveerd voor een latere toepassing.

## LOG- en LEX-data

`data.projections.log` bewaart minimaal:

```json
{
  "axis": "south",
  "authority": "LOG",
  "order": "SOV",
  "position_unit": "slot",
  "sequence": [
    {"kind": "major", "short": "S", "logical_slot": 0},
    {"kind": "major", "short": "O", "logical_slot": 1},
    {"kind": "major", "short": "V", "logical_slot": 2}
  ],
  "distances": {"S_O": 1, "O_V": 1, "S_V": 2},
  "lex_position_source": "LOG",
  "lex_projection_origin": "SOURCE-Y",
  "lex_placement_mode": "horizontal-then-move",
  "example_controls_layout": false
}
```

`data.projections.lex.position_source` is `LOG` en
`data.projections.lex.projection_origin` is `SOURCE-Y`.
`data.projections.lex.placement_mode` is `horizontal-then-move`.
`data.projections.lex.logical_sequence` bewaart dezelfde doelvolgorde.

`data.example.sentence_type` bewaart de afzonderlijke clausale keuze. Geldige
waarden zijn:

```json
"main-declarative"
"polar-question"
"subordinate-dat"
"subordinate-omdat"
```

Perfectum is een werkwoordsvorm en geen waarde van `sentence_type`.

Het actieve LEX-profiel bewaart uitsluitend upward-Wissels,
toepassingsgebonden inserties en rechtstreeks geschreven Comp. De oude velden
`additional_open_slot_count` en `additional_open_slot_placement` voor
generieke plaatsen vóór, na of tussen zijn no-show: de import mag ze uit een
ouder document negeren, maar een nieuw document schrijft ze niet. Ook een
downward/post-V2-plan wordt niet opgeslagen als actief plaatsingscontract.
Bij het basisprofiel ontbreken vrije LEX-insertieslots, bijwoordmetadata en
`log.insertion_interval` volledig.

+
## Multi-OGN-compositie

De toepassing Anafoor · multi-OGN gebruikt profiel `multi-ogn` met extra
`multi-ogn-anaphor`. De reproduceerbare inhoud staat onder
`data.composition`:

```json
{
  "schema": "ogn-multi-composition-v1",
  "order": ["S1", "S2"],
  "calculation": "independent-before-composition",
  "rigid_shift_only": true,
  "grid_invariant_scope": "per-ogn",
  "cross_ogn_exception": "declared-coreference-column-only",
  "units": [
    {"id": "S1", "order": 1, "rigid_shift": {"dx": 0, "dy": 0}, "graph": {}},
    {"id": "S2", "order": 2, "rigid_shift": {"dx": 4, "dy": 7}, "graph": {}}
  ],
  "relation": {
    "type": "coreference",
    "direction": "none",
    "line": "straight-vertical-no-arrow",
    "antecedent": {"unitId": "S1", "nodeId": "s1-man"},
    "anaphor": {"unitId": "S2", "nodeId": "s2-hij"}
  },
  "shared_lex_axis": {
    "axis": "west",
    "order": "S1-before-S2",
    "items": []
  }
}
```

`units[].graph` bewaart voor iedere zin de complete afzonderlijke OGN met
unieke rijen en kolommen. De opgeslagen shift is één starre delta voor de hele
eenheid. Import weigert een richting op de relatie, een niet-verticale
MAN–HIJ-lijn, gedeelde rijen, of een tweede gedeelde kolom.


## Metadata en paradata

`metadata.schema` is `data-metadata-paradata`. Paradata bevat alleen de
actuele workspace, optionele sessie-events en exporttijd. Uitschakelen van
paradata schrijft:

```json
{"included": false}
```

## Compatibiliteit

- OGN-documenten zonder LOG-sequentie blijven leesbaar.
- Zonder minors is de afstand tussen opeenvolgende majors één slot.
- Zonder `sentence_type` leidt de import de zinsoort af uit `lex_rule` en het
  eerste Comp-item; zonder herkenbare aanwijzing geldt `main-declarative`.
- Oude platte viewer-JSON blijft als migratie-/debugformaat leesbaar.
- Oude hostvelden worden als scope-/compatibiliteitsmetadata geïmporteerd.
- Oude `additional_open_slot_*`-velden worden zonder runtime-effect genegeerd.

## Bestandsnamen

```text
hond-bijt-man.v2.0.0-rc.15.ogn
hond-bijt-man.v2.0.0-rc.15.legacy.json
```

## Import, export en exportmap

Alleen `.ogn` is round-trip: export bewaart de volledige analyse en import
reconstrueert input, graph en projecties. SVG, PNG en MP4/WebM zijn afgeleide
publicatieformaten en niet importeerbaar. Oude platte JSON blijft uitsluitend
als migratie-input leesbaar.

Onder **Config → Exportmap en uitvoer** kan de gebruiker één vaste map kiezen
voor OGN, SVG, PNG, video, Legacy JSON en logs. De browser bewaart de
directory-handle lokaal in IndexedDB. Toestemming blijft onder controle van de
gebruiker. Als de directory-API ontbreekt, toestemming vervalt of schrijven
mislukt, gebruikt Graphlite automatisch de normale browserdownload. De actie
**Gebruik browserdownload** wist de lokaal onthouden maphandle, maar verwijdert
geen bestanden. **Open .ogn uit exportmap** start waar mogelijk in die map en
accepteert uitsluitend `.ogn`.

## Hervatbare snapshots als paradata

De vaste knoppen **Snapshot opslaan** en **Snapshot openen** maken een
hervatbaar werkcheckpoint. Een snapshot bevat verplicht
`paradata.snapshot` met schema `ogn-resumable-view-snapshot-v1`: de actuele
view en projecties, graphkeuzes, spacing, PLAY-engine en PLAY-stap, plus bij
directe plaatsing configuratie, seed, iteratie en engine-snapshot. Openen
reconstrueert de graph en pauzeert op de opgeslagen stap; Play gaat daar
verder.

De snapshot bevat het volledige graphmodel, maar bewaart de zichtbare
PLAY-stap afzonderlijk. Daardoor kan de gebruiker na heropening verder bouwen
zonder dat nog niet bereikte stappen meteen zichtbaar worden. De overdracht
naar het interne venster begint pas wanneer dat venster volledig is gestart.

Voor de naam toont Graphlite de recente graph-acties uit de paradata. De
gebruiker kiest en combineert views en acties, kiest een van minstens drie
naamvoorstellen en kan de definitieve `.ogn`-naam aanpassen.

Het naamvenster is aan de titelbalk versleepbaar. Config kiest tussen een
verplaatsbaar en schaalbaar venster binnen de app en een nieuw browservenster.
De interne variant opent direct. Voor het browservenster kiest de gebruiker
eerst het bestand en klikt daarna **Open in nieuw venster**; die tweede echte
klik voorkomt popupblokkering. De overdracht blijft op GitHub Pages same-origin
en browserlokaal; er is geen serverupload nodig.
