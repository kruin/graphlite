# LEX adverb insertion slots - placement differences

Version: v4506

This note documents where free LEX insertion slots for adverbs are reserved. The central tree remains the source structure. In this phase, adverbs are not added as extra central tree nodes. They are rendered as **external LEX insertions** or as **phrase-internal slots** on the LEX axis.

## Main rule

1. Reserve free slots **between visible LEX boxes** by default.
2. If two relevant boxes overlap vertically, place the slot at the middle of that overlap.
3. Then correct the placement by **scope**: the adverb type determines whether the slot is high, VP-internal, V-near, or phrase-internal.

```text
slot = box boundary + vertical overlap + adverb scope
```

## Placement classes

| class | LEX-axis position | function |
|---|---|---|
| `S-LEFT` | before the clause / high left | fronted sentence adverbs |
| `S/VP` | transition between clause and VP | sentence adverbs with propositional scope |
| `VP-BETWEEN` | between argument boxes or between V and object | time and frequency |
| `VP-RIGHT` | right edge inside VP | time/frequency/particles at VP edge |
| `V-NEAR` | close to V/predicate | manner and verb-near material |
| `NEG` | separate V-near negation slot | `NIET` |
| `FOCUS` | beside the focused phrase | `ALLEEN`, `OOK`, `ZELFS` |
| `AP/AdvP-INTERNAL` | inside AP/AdvP/NP | degree words |

## Adverbs and preferred placement

| adverb | type | preferred placement | note |
|---|---|---|---|
| `GISTEREN` | time | `VP-BETWEEN` or `S-LEFT` | `HOND BIJT GISTEREN MAN`; fronting requires a LEX rule. |
| `MORGEN` | time | `VP-BETWEEN` or `S-LEFT` | Same pattern; not a central tree node. |
| `VAAK` | frequency | `VP-BETWEEN` | In subordinate clauses often subject - `VAAK` - object. |
| `SOMS` | frequency | `VP-BETWEEN` | VP scope; lower than sentence adverbs. |
| `ALTIJD` | frequency | `VP-BETWEEN` | VP scope; not AP/NP-internal. |
| `NIET` | negation | `NEG` / `V-NEAR` | Separate slot, usually object - `NIET` - V or VP-right. |
| `SNEL` | manner | `V-NEAR` | Close to V/predicate; in perfect constructions often object - `SNEL` - participle. |
| `HARD` | manner | `V-NEAR` or `VP-RIGHT` | Not a high sentence adverb. |
| `ZACHTJES` | manner | `V-NEAR` | Close to the verbal core. |
| `MISSCHIEN` | sentence adverb | `S/VP` or `S-LEFT` | High scope; not V-near. |
| `WAARSCHIJNLIJK` | sentence adverb | `S/VP` | Scope over the proposition. |
| `HELAAS` | sentence adverb | `S-LEFT` or high `S/VP` | Often fronted; fronting requires a LEX rule. |
| `ALLEEN` | focus | `FOCUS` | Beside the subject, object or VP it focuses. |
| `OOK` | focus/particle | `FOCUS` or `VP-RIGHT` | Beside the phrase it scopes over. |
| `ZELFS` | focus | `FOCUS` | Directly with the focused phrase. |
| `HEEL` | degree | `AP/AdvP-INTERNAL` | For example `HEEL GROTE HOND`; not a general between-box slot. |
| `ERG` | degree | `AP/AdvP-INTERNAL` | For example `ERG HARD`; internal to manner/AP. |
| `ZEER` | degree | `AP/AdvP-INTERNAL` | Phrase-internal with AP/AdvP. |

## Implementation rule

```text
1. create free LEX slots between LEX boxes;
2. if a vertical overlap exists, place the slot on that overlap;
3. choose a preferred domain per adverb type;
4. add the adverb as an external LEX insertion or phrase-internal insertion;
5. do not rewrite the central tree.
```

## Relation to OSV-!

OSV-! confirms the same separation. The box approach cannot produce OSV as a base tree. If the LEX axis needs another surface ordering, a LEX movement rule must apply. Adverbs and OSV-! therefore belong to the LEX render layer, not to a base alternative of the central tree.

## v4512 - OSV-!, VSO-! and VOS-!

`VSO` and `VOS` are now marked like `OSV`: `VSO-!` and `VOS-!`. The exclamation mark means that the box approach cannot produce the order as a base alternative. Correct rendering on the LEX axis requires an explicit movement rule. Existing trees and existing flip behaviour remain unchanged.

