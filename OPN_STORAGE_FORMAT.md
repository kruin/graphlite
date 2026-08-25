# OPN_STORAGE_FORMAT

Opslagcontract voor OpenGraph-documenten vanaf `v2.0.0-rc.15`.

## Topniveau

`.opn` gebruikt JSON-syntaxis en scheidt:

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

- OPN-documenten zonder LOG-sequentie blijven leesbaar.
- Zonder minors is de afstand tussen opeenvolgende majors één slot.
- Zonder `sentence_type` leidt de import de zinsoort af uit `lex_rule` en het
  eerste Comp-item; zonder herkenbare aanwijzing geldt `main-declarative`.
- Oude platte viewer-JSON blijft als migratie-/debugformaat leesbaar.
- Oude hostvelden worden als scope-/compatibiliteitsmetadata geïmporteerd.
- Oude `additional_open_slot_*`-velden worden zonder runtime-effect genegeerd.

## Bestandsnamen

```text
hond-bijt-man.v2.0.0-rc.15.opn
hond-bijt-man.v2.0.0-rc.15.legacy.json
```
