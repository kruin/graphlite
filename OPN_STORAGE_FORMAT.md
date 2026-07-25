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

## LOG- en LEX-data

`data.projections.log` bewaart minimaal:

```json
{
  "axis": "south",
  "authority": "LOG",
  "order": "SOV",
  "position_unit": "slot",
  "insertion_interval": "auto",
  "sequence": [
    {"kind": "major", "short": "S", "logical_slot": 0},
    {"kind": "minor", "short": "m1", "logical_slot": 1, "interval": "S-O"},
    {"kind": "major", "short": "O", "logical_slot": 2}
  ],
  "distances": {"S_O": 2, "O_V": 1, "S_V": 3},
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
Vrije slots en bijwoordmetadata blijven voor compatibiliteit aanwezig.

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
