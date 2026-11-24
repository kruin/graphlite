# OGN first — UP-ONLY

Hypothesis: fixed Graph and source projections; only upward LEX operations. Down is a theoretical control, not an active feature. Merge is separate.

## Abstract geometry test (2026-11-25)
Source coordinates 0,2,4,...; allowed integer target coordinates from -2 to the respective source coordinate; distinct, strictly increasing in requested order. Exhaustive enumeration minimizes changed coordinates. This is an artificial grid, not actual Graphlite coordinates or a grammatical licensing test.

- SOV: S O V → S O V: 0 moves; targets 0, 2, 4
- V2: S O V → S V O: 1 moves; targets 0, 1, 2
- V1: S O V → V S O: 1 moves; targets -2, 0, 2
- object topic: S O V → O V S: 2 moves; targets -2, -1, 0
- OVS alternative: S O V → O S V: 1 moves; targets -2, 0, 4
- perfect V2: S O P V → S V O P: 1 moves; targets 0, 1, 2, 4
- perfect flip: S O P V → S O V P: 1 moves; targets 0, 2, 3, 4

Critical issue: the existing projectedV2SlotY uses the midpoint of original subject/object, so object topicalization can yield O S V instead of O V S. A V2 slot above S is needed in that case, if independently licensed. Do not change Graph to accommodate it. A geometrically feasible assignment is not evidence of grammatical licensing. Next: extract actual sourceMap and allowed slots for every fixture, compare expected surface order, record failures. No production viewer changes.
