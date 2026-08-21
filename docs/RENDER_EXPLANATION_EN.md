# Render explanation

## Location

The render explanation belongs in **Help** and documentation, not in **Config**.

Config is for settings. Long explanation blocks must not interrupt active configuration options, because they break the configuration column and push options such as `Branch extension by insertion` downwards.

## Render order

1. First compute the central tree and its boxes.
2. Then draw the projection axes: LEX, SYNTAX and LOG.
3. Project terminal nodes horizontally to the LEX axis at source height.
4. Place free LEX inserts in reserved slots.
5. Draw only explicit topic/V1/V2 movement rules or exchanges. LOG planning
   alone never moves a source word.

In `HOND BIJT MAN`, HOND and MAN remain at their exact source heights; only
BIJT moves to the free LEX grid row halfway between them. This target is
derived from the tree heights, not from a fixed `S + 64 px` offset.

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

## Placement before render

The complete placement plan is calculated first: hosts, insertions, landing positions, grid space, corridors, projections and traces. The core sentence is then filled lexically. The renderer draws only the fixed result and reserves no space.
