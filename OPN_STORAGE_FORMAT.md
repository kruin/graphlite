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

## Language Tree · extensie 1 · Anafoor

De eerste Language Tree-extensie gebruikt profiel `multi-ogn` met extra
`multi-ogn-anaphor`. De reproduceerbare inhoud staat onder
`data.composition`:

```json
{
  "schema": "ogn-multi-composition-v2",
  "extension": {
    "id": "language-tree-anaphor",
    "order": 1,
    "extends": "language-tree",
    "combination_schema": "ogn-anaphor-combination-v1",
    "combination_id": "ik-zag-man-gisteren-vandaag-was-hij-er-niet-meer",
    "interpretation_id": "man-hij",
    "surface_template": "Vandaag was {ANAPHOR} er niet meer."
  },
  "order": ["S1", "S2"],
  "calculation": "independent-before-composition",
  "rigid_shift_only": true,
  "grid_invariant_scope": "per-ogn",
  "cross_ogn_column_semantics": "column-sharing-alone-does-not-declare-coreference",
  "relation_authority": "relations-array",
  "units": [
    {"id": "S1", "order": 1, "rigid_shift": {"dx": 0, "dy": 0}, "graph": {},
     "lex_insertions": [{"id": "lex-s1-gisteren", "layer": "Context", "label": "GISTEREN"}]},
    {"id": "S2", "order": 2, "rigid_shift": {"dx": 4, "dy": 7}, "graph": {},
     "lex_insertions": [
       {"id": "lex-s2-vandaag", "layer": "Context", "label": "VANDAAG"},
       {"id": "lex-s2-er", "layer": "Context", "label": "ER"},
       {"id": "lex-s2-niet-meer", "layer": "Context", "label": "NIET MEER"}
     ]}
  ],
  "relations": [
    {
      "schema": "ogn-referent-anaphor-v1",
      "id": "man-hij",
      "status": "intended-reading",
      "dependency_direction": "referent-to-anaphor",
      "referent": {"unit_id": "S1", "node_id": "tm-s1-man"},
      "anaphor": {"unit_id": "S2", "node_id": "tm-s2-man"},
      "alignment": {"type": "shared-column", "required": true},
      "rendered_in_this_version": true
    }
  ],
  "context": {
    "notation": "Open Graph Notation",
    "representation": "minimized-tree",
    "status": "p.m."
  },
  "layout_resolution": {
    "schema": "ogn-joint-flip-constraints-v1",
    "mode": "joint",
    "objective": ["satisfy-required-relations", "minimize-flip-count", "minimize-rigid-shift"],
    "currentSupport": {
      "status": "multiple-relation-rendering-context-pro-memorie",
      "active": ["existing-layout", "rigid-shift-s2", "check-all-relation-alignments", "render-satisfied-coreferences"],
      "deferred": ["joint-branch-flip-search"]
    }
  },
  "play": {
    "schema": "ogn-anaphor-play-v1",
    "order": ["S1-tree", "S1-lex-source", "S1-lex-insertions", "S1-v2", "S2-tree", "S2-lex-source", "S2-lex-insertions", "S2-v2", "S1-S2-coreferences", "S2-anaphor-lexicalizations"],
    "coreference_step": 16,
    "lexicalization_step": 17,
    "max_step": 20,
    "reverse": "exact"
  },
  "relation": {
    "type": "coreference",
    "direction": "none",
    "line": "straight-vertical-no-arrow",
    "antecedent": {"unitId": "S1", "nodeId": "s1-man"},
    "referent": {"unitId": "S2", "nodeId": "s2-man"},
    "lexicalization": {
      "type": "anaphor-lex-projection",
      "source_node_id": "s2-man",
      "antecedent_lexeme": "man",
      "profile_id": "hij",
      "surface": "HIJ"
    }
  },
  "shared_lex_axis": {
    "axis": "west",
    "order": "S1-before-S2",
    "items": []
  }
}
```

`units[].graph` bewaart voor iedere zin uitsluitend de centrale **Text**-OGN
met unieke rijen en kolommen. `units[].lex_insertions` bewaart **Context**
afzonderlijk; geen insertion-id mag in `graph.nodes[]` voorkomen. Op de
gedeelde LEX-as gebruikt Text `node_id` plus `source_layer: "Text"`; Context
gebruikt `insertion_id` plus `source_layer: "Context"`. De opgeslagen shift is
één starre delta voor de hele eenheid. Import weigert een richting op de
relatie, een niet-verticale MAN–MAN-lijn, gedeelde rijen of een
niet-toepasselijk LEX-profiel. `data.example.source_sentences` bewaart S2 met
MAN; `surface_sentences` bewaart de gerealiseerde anafoor. Schema v1 met
`s2-hij` blijft alleen voor import ondersteund.

`composition.play` bewaart de didactische tijdlijn afzonderlijk van de
bronbomen. Eerst wordt S1 voltooid, daarna S2. Context-inserties hebben een
eigen Play-stap. Een hoofdzin krijgt V2; een omdat-bijzin houdt V-finaal en
heeft geen V2-stap. Daarna volgen alle Text-coreferenties en hun LEX-vormen.
`reverse=exact` betekent dat
pijl-terug precies de laatst toegevoegde laag verwijdert.

`composition.relations[]` bewaart uitsluitend Text–Text-coreferentie uit de
actieve combinatie. Context blijft p.m.
De bestaande enkelvoudige `composition.relation` blijft daarnaast aanwezig
voor de primair gerenderde relatie en backward compatibility. De huidige
importvalidator controleert die primaire relatie; alle reeds uitgelijnde
coreferenties worden gerenderd. Joint flipsearch blijft toekomstig werk.

`composition.layout_resolution` bewaart de gezamenlijke variabelen,
constraints, doelen en de machineleesbare implementatiegrens. Zie
`ANAPHOR_LANGUAGE_TREE_EXTENSION.md` en `FLIP_CONSTRAINT_SOLVER.md`.


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
