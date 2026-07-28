# Lexicon usage profiles and disambiguation · v2.0.0-rc.42

## Normative distinction

A lexical form is stored once as a **lemma**. A lemma may expose multiple
**usage profiles**. A concrete sentence instance selects one profile; it does
not duplicate or rewrite the global lexicon.

```text
lemma
  → zero, one or more usage profiles
  → optional multiword constructions
  → one selected profile per sentence instance
```

A profile records at least:

```text
id
origin = LOG | LEX | LOG+LEX
function
scope
preferred LOG interval
notation effects
recommended = true | false
```

## Two insertion mechanisms

The destination may be LEX in both cases, but the origin differs.

```text
origin=LOG
semantic operator/minor on the south axis → lexical realization on LEX

origin=LEX
placement plan reserves a direct lexical insertion → no LOG minor

origin=LOG+LEX
one visible lexical group combines components from both origins
```

Only `LOG` and `LOG+LEX` profiles are represented as minors on the LOG axis.
All three origins participate in the precomputed LEX placement plan.

## Multiword constructions

A construction refers to existing lemmas. It is not a second copy of those
lemmas. It may offer profiles at group level and may reserve one visible slot.

Example:

```text
construction: misschien-wel
members: misschien wel
visible slots: 1

profiles:
- mixed-modal-particle  origin=LOG+LEX  components=misschien:LOG wel:LEX
- group-modal-log       origin=LOG      components=misschien:LOG wel:LOG
- group-lexical-particle origin=LEX     components=misschien:LEX wel:LEX
```

## Disambiguation rule

The viewer asks the user only when all conditions are met:

1. the sentence instance is marked `analysis-status=ask`;
2. more than one candidate profile is available;
3. the choice changes OGN notation, such as origin, LOG projection, scope,
   grouping or component analysis;
4. no earlier choice exists for that sentence instance.

Until a choice is made, the recommended profile is rendered provisionally.
The choice is stored under `example-id::insertion-id`. It applies only to that
sentence instance. The user can clear the choices for the active example in
Config with **Vraag profielkeuze opnieuw**.

## Placement plan

Disambiguation precedes placement calculation:

```text
load lemma/profile candidates
→ resolve or provisionally select profile
→ determine LOG minors and direct LEX insertions
→ reserve all LEX destinations and movement corridors
→ place the central structure
→ fill the core sentence
→ render/grow the fixed plan
```

The renderer must not choose a profile, reserve new space or move a structural
node.

## Storage

Lexicon HTML:

```html
<div class="lexicon-entry" data-id="wel" data-lemma="wel">
  <ol class="usage-profiles">
    <li class="usage-profile"
        data-id="particle-local"
        data-origin="LEX"
        data-function="schakeringspartikel"
        data-scope="lokale-groep"
        data-effects="origin grouping">...</li>
  </ol>
</div>
```

Sentence instance HTML:

```html
<li class="lex-insertion"
    data-construction="misschien-wel"
    data-usage-profile="mixed-modal-particle"
    data-origin="LOG+LEX"
    data-analysis-status="ask"
    data-candidate-profiles="mixed-modal-particle group-modal-log group-lexical-particle"
    data-ambiguity-affects="origin log-projection scope components">...</li>
```

OPN export stores the effective profile, origin and component analysis in
`example.lex_insertions`.

## Editor contract

- `lexicon-editor.html` edits lemma profiles and preserves constructions.
- `examples-editor.html` round-trips sentence-instance profile metadata.
- A sentence choice never automatically becomes a global lexical preference.
- Config save/restore remains independent from lexical analysis choices.
