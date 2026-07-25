# LEX adverb slots — v4540 rule

This replaces the earlier “adverb above syntax box” interpretation.

## Current rule

All adverb placement stays on the **LEX axis**.

`above S`, `above NP`, `above VP`, `above V`, `above PP`, and `above AP` mean:

```text
external adverb -> LEX slot on the LEX axis, vertically just above the selected syntactic host box
```

The adverb is not drawn on the syntax tree. The host box/subtree is lowered to create space. The insertion has `source=external` and is not projected from the base tree.

See also: `docs/LEX_ADVERB_AXIS_SLOTS.md`.
