# Source changes · v2.0.0-rc.35

## Basis

This release is built exclusively from the user-supplied
`OpenGraph_Lite_Viewer_v2.0.0-rc.26_full_source.zip`. No files from the
accidental `v2.0.x` branch were merged.

## Lexicon architecture

- one lemma can contain multiple usage profiles;
- profile origin is `LOG`, `LEX` or `LOG+LEX`;
- multiword constructions refer to lemmas and can offer group profiles;
- the concrete sentence selects a profile per insertion instance;
- the global lexicon is not rewritten by that choice.

Added lexicon profiles for `misschien`, `wel` and `vaak`, plus the construction
`misschien-wel`.

## User disambiguation

The viewer asks only when competing profiles change OGN notation. The
recommended profile is rendered provisionally. Choices are stored per
`example-id::insertion-id` and can be cleared for the active example from
Config.

## Separate placement mechanisms

- LOG and LOG+LEX profiles participate in the LOG south projection;
- direct LEX profiles do not create a LOG minor;
- all origins participate in the precomputed LEX placement sequence;
- one mixed construction can still occupy one visible LEX slot.

## Editors and storage

- lexicon editor supports usage-profile lines and construction JSON;
- examples editor preserves sentence-instance profile metadata;
- OPN export records the effective profile/origin/components;
- Config save workflow is unchanged.

## Documentation

Added:

- `LEXICON_USAGE_PROFILES_AND_DISAMBIGUATION.md`;
- `LEXICON_USAGE_PROFILE_TEST.md`.

Updated README/LEESMIJ, project state, layout rules, linguistic actions,
project master specification and lexicon/example specification.
