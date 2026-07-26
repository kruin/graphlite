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
Bij het basisprofiel ontbreken vrije LEX-insertieslots, bijwoordmetadata en
`log.insertion_interval` volledig.

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
- Oude platte viewer-JSON blijft als migratie-/debugformaat leesbaar.
- Oude hostvelden worden als scope-/compatibiliteitsmetadata geïmporteerd.

## Bestandsnamen

```text
hond-bijt-man.v2.0.0-rc.15.opn
hond-bijt-man.v2.0.0-rc.15.legacy.json
```
