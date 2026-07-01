# Render explanation

## Location

The render explanation belongs in **Help** and documentation, not in **Config**.

Config is for settings. Long explanation blocks must not interrupt active configuration options, because they break the configuration column and push options such as `Branch extension by insertion` downwards.

## Render order

1. First compute the central tree and its boxes.
2. Then draw the projection axes: LEX, SYNTAX and LOG/FT.
3. Project terminal nodes to the LEX axis.
4. Place free LEX inserts in reserved slots.
5. Draw any LEX movement rules or exchanges.

The central tree remains unchanged.

## Free LEX inserts

Adverbs and other LEX-axis inserts are not ordinary central tree nodes. They are placed in free slots, for example between boxes or in a domain slot.

Examples:

- `GISTEREN`, `MORGEN`: time; host box above VP/S.
- `VAAK`, `SOMS`, `ALTIJD`: frequency; VP slot.
- `NIET`: NEG / V-near slot.
- `SNEL`, `HARD`, `ZACHTJES`: manner; V-near.
- `MISSCHIEN`, `WAARSCHIJNLIJK`, `HELAAS`: high S/VP-HOST slot or S-left.
- `ALLEEN`, `OOK`, `ZELFS`: focus slot at the focused phrase.
- `HEEL`, `ERG`, `ZEER`: AP/AdvP/NP-internal.

## OSV-!

`OSV-!` is marked because it is not a base-tree alternative. The box approach cannot produce OSV. Correct rendering above syntax boxes always requires a movement rule.

## v4535 - OSV-!, VSO-! and VOS-!

`VSO` and `VOS` are now marked like `OSV`: `VSO-!` and `VOS-!`. The exclamation mark means that the box approach cannot produce the order as a base alternative. Correct rendering above syntax boxes requires an explicit movement rule. Existing trees and existing flip behaviour remain unchanged.

