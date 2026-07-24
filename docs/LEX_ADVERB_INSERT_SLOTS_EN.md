# LEX adverb slots — v4540 rule

## Precomputed placement

All adverbial insertion groups are collected before the central tree is placed. The layout reserves their LEX slots, minor anchors, physical separation and any exchange corridors first. The host box or host subtree is placed afterwards, and the core sentence fills the resulting plan.

An insertion is therefore not added to accidental leftover space. Growth only reveals an already calculated slot.

This replaces the earlier “adverb above syntax box” interpretation.

## Current rule

All adverb placement stays on the **LEX axis**.

`above S`, `above NP`, `above VP`, `above V`, `above PP`, and `above AP` mean:

```text
external adverb -> LEX slot on the LEX axis, vertically just above the selected syntactic host box
```

The adverb is not drawn on the syntax tree. The host box/subtree is lowered to create space. The insertion has `source=external` and is not projected from the base tree.

See also: `docs/LEX_ADVERB_AXIS_SLOTS.md`.
