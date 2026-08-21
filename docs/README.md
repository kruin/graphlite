# OpenGraph Lite Viewer v2.0.0-rc.45

## Language Tree extension 1: Anaphor

**Text** contains only the central utterance; **Context** comprises everything
around it. Both Text and Context are distinct Open Graph Notation structures;
Context is a minimized tree to be developed. Every insertion belongs to
Context, regardless of its origin.
Anaphor connects only central Text source nodes across independently
calculated S1 and S2 trees; `HIJ` and `HEM` realize those nodes on LEX.
`GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` and `OMDAT` are independent Context
insertions, never central tree nodes. **De boer slaat de ezel omdat hij hem
bezit.** contains both `BOER→HIJ` and `EZEL→HEM`; `BEZIT` remains
clause-final. Further
Context modeling remains p.m. The active flip fixture **De man slaat de hond
omdat die hem heeft gebeten.** links `HOND→DIE` and `MAN→HEM`. Its declared
binary branches each select normal, left–right, short–long or both in one joint
constraint solution. Only `linearization: "child-order"` also reverses LEX
children: `HEEFT GEBETEN` ↔ `GEBETEN HEEFT`. See
[`FLIP_CONSTRAINT_SOLVER.md`](FLIP_CONSTRAINT_SOLVER.md),
[`CONTEXT_TAXONOMY.md`](CONTEXT_TAXONOMY.md),
[`TEXT_AND_CONTEXT.md`](TEXT_AND_CONTEXT.md),
[`MULTI_OGN_ANAPHOR.md`](MULTI_OGN_ANAPHOR.md),
[`ANAPHOR_AND_S1_S2_RELATION_DEFINITIONS.md`](ANAPHOR_AND_S1_S2_RELATION_DEFINITIONS.md)
and [`S1_S2_RELATION_TEST_FIXTURES.md`](S1_S2_RELATION_TEST_FIXTURES.md).

OpenGraph Lite Viewer is a viewer and test environment for general Open Graph
Notation. This release is built exclusively on the uploaded
`v2.0.0-rc.26` source through rc.27; rc.28 restores the documented OGN/UI
contracts without importing source files from the abandoned alternate version
line.

Dutch documentation: [`LEESMIJ.md`](LEESMIJ.md).

> **Validation status:** rc.45 was manually approved on 2 August 2026,
> including the accepted Greedy Grow reconstruction and the derived
> publication slide. Automated checks continue to verify the geometry and
> feature invariants.

## OGN Core: free placement first

Open Graph Notation writes nodes one at a time into free positions on an open
grid. Every node owns one horizontal and one vertical grid line.

**Hard rule — A ≠ B:** two different nodes may never occupy the same
horizontal or vertical grid line.

```text
A ≠ B  ⇒  x(A) ≠ x(B)  and  y(A) ≠ y(B)
```

A new node may therefore be written only when both its row and its column are
unused. This also applies to applications. If placement cannot find a valid
row and column, no fallback node is rendered.

A violation is called **grid-line reuse**: horizontal reuse shares a row;
vertical reuse shares a column. Both are always invalid.

A rule set
determines which candidates are valid; a **Search Strategy** determines their
test order. Direct placement writes the first valid position found
immediately, so another search order may produce another picture.

**Greedy Grow has an accepted reconstruction.** It writes one dot
per step from the central grid point and stores no future layout. The
historical four-arm order exactly reproduces the preserved 12-, 31- and
96-node demos. Recovered experimental search orders can be compared in
[`greedy-grow.html`](../greedy-grow.html); the evidence boundary is documented
in the [`technical reconstruction`](GREEDY_GROW_RECONSTRUCTION.md).
Publication slide 5 is derived directly from the same engine.

The fixed order is **OGN Free Placement → OGN Projection → OGN Calculated
Placement**. The Two-Pass Language Tree appears only in the third layer as one
application. See
[`OGN_CORE_PLACEMENT_ARCHITECTURE.md`](OGN_CORE_PLACEMENT_ARCHITECTURE.md).

## Placement methods and line appearance

The **Language Tree** menu keeps Language Tree prominent as the primary
calculated application and places **Greedy Grow** and seeded **Random** below
it as direct OGN illustrations. Direct steps write one node immediately on an
unused row and column; switching modes does not change Language Tree data.

`Config → View → Line appearance` independently controls grid color, grid
weight, projection-line weight and box-line weight. LEX, SYNT and LOG each
have a separate color for their axes, projection lines and boxes. See
[`LINE_STYLE_AND_PLACEMENT_MODES.md`](LINE_STYLE_AND_PLACEMENT_MODES.md).

## Current calculated application: Two-Pass Language Tree

The current viewer's `OGN Base` profile is the base of its language
application. It contains the Syntax/Functional tree, grid, named LEX/SYNT/LOG
projections with S/O/V majors, and examples without optional insertions. It is
not the definition of OGN Core. Insertion defaults to off on LEX, SYNT and LOG.

`Config → Pre-config` enables insertion independently per axis without adding
linguistic content. `Config → Applications` then provides **Adverbs** as the
first application. It becomes available only after insertion on **LEX + LOG**
is enabled. When Adverbs is off, its examples, LOG minors, direct LEX
insertions, controls, runtime data, documentation links, and export fields are
absent. OPN exports record `profile: "base"`, `extras: []`, and all three axis
switches.

Config also shows three disabled reservations for later applications:
**Question sentence**, **Emphasis** (for example `juist díe trui`), and
**Incomplete sentence**. They are deliberately outside the active feature
catalogue and therefore add no state, samples, insertions, documentation,
storage, export fields, or rendering behaviour.

## Editable README topics and carousels

`Config → README topics` edits Show yes/no, NL/EN navigation titles, limited
safe HTML content, and the topic carousel. No hides a topic without deleting
it. Scripts, forms, styles, frames, event attributes, and unsafe link schemes
are removed before custom content is rendered.

Slides retain path/https, shape, NL/EN alt text and captions. Under
`Config → Files & export`, a local PNG, JPEG, WebP, or GIF can be embedded
directly as a slide, with a 1.25 MB per-image limit and a bounded combined
payload. Manually typed `data:` URLs remain blocked. The shared Config Save bar
is visible on every Config section.

## Project Config and publication carousel

Every project zip contains `config/default-config.json` and
`config/user-config.json`. The enabled user file overlays the default without
replacing it. Running through `start_local_viewer.bat` enables
`Write current Config to project`; the allow-listed endpoint writes the
current snapshot to `config/user-config.json`. A regular web version offers a
download fallback.

Precedence is code defaults → default config → project user config →
browser-local saved Config. The zip also includes seven numbered 1080 × 1080
PNG slides under
[`publicatie-carrousel/slides/`](../publicatie-carrousel/slides/) and an
single editable [`HTML source`](../publicatie-carrousel/index.html). Upload `01`
through `07` as one gallery.

Slide 4 shows nodes projecting to WEST, SOUTH and EAST. Slide 5 is the
**Direct — Greedy Grow** example; slide 6 is the
**Calculated — Language Tree** example, with `HOND · BIJT · MAN` on the west
LEX axis. Both example slides refer to `github.com/kruin/graphlite`.

The carousel is always derived: do not edit a PNG or carousel ZIP.
`publish_checked.bat` does not require Playwright; its optional Anafoor browser
check reports missing browser tools and continues. Run
`installeer-carrousel-tools.bat` once in an extracted work folder before the
first rebuild; Node.js 18 or newer is required. After an HTML change, run
`maak-publicatie-carrousel.bat`. It regenerates all seven slides, records their
relation to source, exporter and version in
`publicatie-carrousel/derived-manifest.json`, validates that proof, and rebuilds
the sibling carousel ZIP. Run `maak-volledige-zip.bat` from the full project
folder afterwards. The standalone carousel package can rebuild itself but does
not modify another full project folder. Local `node_modules` and browser files
are excluded from both ZIPs. Visual review remains a separate required step.

[`PUBLICATIE_README.md`](../PUBLICATIE_README.md) contains the exact order,
alt text, Reddit instructions, and publication copy for LinkedIn, Facebook,
YouTube, Bluesky, Mastodon, X, and GitHub. Use
[`RC45_OGN_CORE_EXPLANATION_TEST.md`](../RC45_OGN_CORE_EXPLANATION_TEST.md)
records the manual approval of the core explanation, Greedy Grow and the
publication carousel. The inherited Config and
project-zip checks remain in
[`RC43_CONFIG_README_PROJECT_TEST.md`](../RC43_CONFIG_README_PROJECT_TEST.md).

## Recursive content-sized layout

The structural tree is still placed bottom-up on the HOR/VER grid. Before
drawing, a second recursive pass measures each subtree from its actual node
shapes, labels, child boxes and caption. A small unary box such as
`NP → HOND` therefore uses only its required width and height; larger S, VP and
Functional structures expand independently.

Applications declare abstract layout demands rather than SVG coordinates.
Adverbs, for example, declares that it can add wide LEX insertion content.
The central layout policy reserves the corresponding space. Handheld MAX
includes the complete LEX content and the complete Syntax and Functional rule
boxes in portrait, landscape and forced desktop. LEX reserves only its active
slots and movement lanes, while Syntax and Functional share one stable east
axis over their combined structural grid envelope. See
`RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.

### What is recursive now—and what is not

| Stage | rc.42 behaviour |
|---|---|
| Structure and config | Decide which nodes, axes, majors, minors and application contributions exist. |
| Grid placement | Places structural nodes and subtrees on the HOR/VER cell grid. This is not yet text-aware pixel packing. |
| Visual subtree measurement | Measures node shapes, labels, descendant bounds, caption and central padding bottom-up. Only the visible subtree rectangle uses this result. |
| West/LEX placement | Starts from the measured left edge of the active root subtree, then reserves the active LEX slots and movement lanes plus a small clearance. |
| East/SYNT placement | Uses one shared **structural grid envelope** for Syntax and Functional, followed by the complete rule boxes. It is not derived from the measured right edge of every subtree. |
| Viewport fit | Keeps complete LEX content, the central structure, complete rule boxes and LOG inside a stable Syntax/Functional frame. |
| Rendering | Draws the resolved result; it does not add linguistic content or choose new positions. |

This distinction matters. rc.42 has recursive **box measurement**, but it is
not yet a general collision solver that repositions every node when a label
becomes wider. In portrait, the complete left-to-right composition uses the
available width; because that composition is intrinsically wide, text can
remain smaller and vertical whitespace can remain. Pan/zoom is available. A
stacked portrait composition would be a separate future layout decision.

For manual approval, use
[`../RC41_RECURSIVE_LAYOUT_TEST.md`](../RC41_RECURSIVE_LAYOUT_TEST.md).

## Lexical usage profiles and user disambiguation

This section applies when the Adverbs application is enabled.

OGN does not store an ambiguous form as uncontrolled duplicate dictionary
entries. The lexicon stores one lemma with multiple possible **usage
profiles**; the concrete sentence instance selects the applicable profile.

A profile records origin, function, scope and preferred interval. Origin is
`LOG`, `LEX` or `LOG+LEX`. Only LOG-containing profiles create a south-axis
minor, while all origins receive a destination in the precomputed LEX plan.

Multiword constructions such as `misschien wel` refer to existing lemmas and
may retain one visible LEX slot. When alternatives change OGN notation, the
viewer asks the user. The choice applies only to that sentence instance and
does not rewrite the global lexicon. Config can clear the choices for the
active example.

See `LEXICON_USAGE_PROFILES_AND_DISAMBIGUATION.md`.

## Projection contract

```text
source node → horizontal LEX projection → one direct move to the resolved LEX target
```

`S`, `O` and `V` are majors. An adverbial insertion may be a LOG minor, a direct LEX insertion, or a group combining both origins. Every minor adds one fixed slot to the distance between its bounding
majors. LOG plans possible LEX positions but does not move a source word:
every lexical source first projects horizontally at its source height. Only
an explicit topic, V1 or V2 rule creates a move. The viewer therefore shows at
most one LEX-axis move and one source trace per moved source word, without an
intermediate LOG trace. In `HOND BIJT MAN`, HOND and MAN stay put and only
BIJT moves to V2. The example sentence does not determine layout. See
`projectie-master-spec.md`.

## Start

```text
index.html
```

Or run locally:

```bat
start_local_viewer.bat
```

`start_local_viewer.bat` is the only starter. It uses one detected Python 3
installation. First choose **Extract all** for the downloaded ZIP; do not run
the BAT from inside the compressed folder. The BAT only checks that extraction
is complete and starts
`start_local_viewer.py`. That Python launcher controls server detection,
starting, waiting, version validation and opening the browser. It opens
`reset-cache.html` only after port 8088 serves both the exact version and the
exact `SOURCE_BUILD.txt` identity from the current folder. This also catches
an older source package carrying the same rc.45 version number. If the launcher
reports another source, close the old **OpenGraph local server** window and
start the BAT again. The concrete reason remains visible before `Press any key`.

On a large screen, the local `LOKAAL` selector appears at the bottom right.
`mobile portrait` stays inside a 390 × 844 frame and `mobile landscape`
inside an 844 × 390 frame. The large automatic view returns only after
selecting `auto`.

## Build the full source ZIP on Windows

Rename the project directory to the intended release name and double-click:

```bat
maak-volledige-zip.bat
```

The batch file derives the ZIP name from its own containing directory. A
directory named `OpenGraph_Lite_Viewer_v2.0.0-rc.45` therefore produces the
sibling file `OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source.zip`. An existing
ZIP with that exact name is replaced safely; the script never invents a
`(1)` suffix.

Files matching `*_full_source*.zip` are generated release artifacts, not
project source. This includes a browser download such as
`OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source (1).zip`. Such copies are
ignored by the manifest and publication checks, are not staged for GitHub
Pages, and are excluded when a new full-source ZIP is built. They may therefore
remain locally without blocking publication, although deleting old copies
keeps the project folder clearer.

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.45
```

Cache reset:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.45
```

## Desktop view

The readable full-window view is the default. It is shown first under
`Config → View`:

```text
Tree spacing = MAX · large text / low tree
Window fit   = MAX · use full window
```

MAX fits the actually drawn tree and projections to all available desktop
space. The invisible stability frame, grid and helper labels no longer make
the graph and its text artificially small. The same MAX frame remains stable
throughout the phased Play sequence.

### Mobile MAX

On a physical phone, MAX includes the complete LEX content, central structure,
SYNT axis and full rule boxes in both portrait and landscape. Landscape uses a
genuinely lower, wider layout and a contain fit, so the grid top and the
complete LEX, SYNT and LOG axes remain visible at the same time. Two compact
menu rows, the SVG and the Play bar use separate vertical zones. This also
applies when `Interface → Desktop` is forced on the phone. Pan and pinch zoom
remain available for closer inspection.

The grid itself now ends at LEX on the left, SYNT on the right and LOG at the
bottom; it no longer continues past those axes.

## Config tabs

Config follows the dependency order and links to these focused sections:

1. `Pre-config`: insertion independently on LEX, SYNT and LOG;
2. `Applications`: Adverbs requires LEX + LOG;
3. `Overview` and `JaN · TODO`;
4. `Save & export`: LinkedIn/Play/SVG first, followed by OPN, Config
   save/restore and example management;
5. `View`: MAX, Syntax / Functional, tree layout and projection colours;
6. `LOG & LEX`: core LEX order and, when enabled, optional insertions;
7. `Advanced`: legacy branch-extension and top-menu placement options.

`Window fit` means how the tree uses the available app window. It is not a
second application window.

## Social export

Open `Config → Save & export`. The first, highlighted card provides three
local exports:

- `LinkedIn PNG`: a white 1200 × 627 image for an image post;
- `Play video`: an automatic 1200 × 628, fixed-30-fps recording of the
  complete phased Play sequence;
- `Graph as SVG`: a self-contained vector file of the complete current graph.

The recorder now prefers MP4/H.264 when the browser supports it and otherwise
uses WebM. It actively requests all 30 frames per second; the old recorder
captured only changed canvas frames and could therefore fall below LinkedIn's
10-fps minimum. Keep the browser window active until the recording downloads,
then upload it through LinkedIn's Video action. See
[`docs/SOCIAL_EXPORT.md`](docs/SOCIAL_EXPORT.md).

## Read me / README

The `README` / `LEESMIJ` button opens immediately on **Start · OGN Core**. The
first carousel explains free grid positions, sequential node writing, search
order, and the fixed layer order. It introduces no specialized extension.

The external example-search link opens in a separate browser window. Closing
that window returns the user to the still-open app.

## Play sequence

After the central tree has been built, Play presents the projection process in
three explicit phases:

```text
1. draw the LOG axis and place majors/minors
2. reserve LOG-planned space on the LEX axis
3. project lexical sources horizontally at source height and execute only
   explicit topic/V1/V2 moves
```

LOG planning alone never moves a source word. In `HOND BIJT MAN`, HOND and MAN
stay at source height and only BIJT moves to the free V2 position. SYNT and the
remaining projection panels appear in the final step.
The previous-step button now reverses the same sequence exactly: the final
projection layer disappears first, followed by LEX moves, LEX space, LOG and
then the central tree.

## Central views

```text
1. Syntax
2. Functional
```

Syntax shows the syntactic tree. Functional shows the functional structure for the same
example sentence. LOG is not a central view.

## Named projections

```text
LEX    west axis
SYNT   east axis
LOG    south axis
```

LEX, SYNT and LOG are visible by default. Each projection can be disabled
independently. `Geen` shows only the central Syntax or Functional view; `Alle` and Reset
restore every projection. Switching projections does not alter the central
graph, viewport or scale.

Adverbial insertions do not mutate Syntax or Functional. The selected usage profile
determines origin: LOG and LOG+LEX produce a south-axis minor, while a direct
LEX insertion does not. Source nodes project horizontally to LEX. LOG plans
available positions, while only an explicit topic/V1/V2 rule creates one
direct visible move.

The active sentence is printed above the graph, with clear space below it for
a possible future north axis.

## Limited multiword adverbials

The adverb list now includes four deliberately bounded multiword units:
`MISSCHIEN WEL`, `AF EN TOE`, `OP DIT MOMENT`, and
`MET VEEL AANDACHT`. Each complete phrase currently acts as one visible LEX
unit. Its usage profile determines whether it also has a LOG minor, a direct
LEX origin, or a mixed origin; internal syntax is not expanded yet. The set samples
modality, frequency, time, and manner without claiming a complete inventory of
adverbial phrases. See
[`docs/TALIGE_UITBREIDINGEN.md`](docs/TALIGE_UITBREIDINGEN.md).

## Top menu

```text
OGN Base: Sentence · Syntax/Functional · Interface · Projections · LOG order · Language · README · Config
Adverbs on: Sentence · Adverb · Syntax/Functional · Interface · Projections · LOG order · Language · README · Config
```

There is no generic `Menu` button and there are no nested submenus. Choice
items open their own wide panel directly.

## OPN storage

`.opn` is the primary round-trip document format. It separates:

```text
metadata    document identity, format and generator

data        graph, projections and analysis choices

paradata    optional workspace and local session events
```

Paradata may be omitted during export. Older JSON files remain readable as a
migration format; Legacy JSON export remains temporarily available for
debugging. See `OPN_STORAGE_FORMAT.md`.

## Version source

`VERSION.txt` is authoritative for HTML, JavaScript, the service worker, cache
queries, the publication script and the release ZIP name.

## Validation

```bat
node --check viewer.js
check_release.bat
```

## Examples and file controls (rc.18)

- The viewer contains 14 example sentences, including two examples with
  multiple LOG minors.
- With automatic placement, an explicit sentence-instance landing position such as `post-object-pre-vcluster` takes priority over a broad class default. Scope and linear position remain separate.
- `Opslaan als .opn` downloads the current analysis.
- `Importeer .opn` opens a previously exported document.
- Paradata is optional.

## What problem OGN solves

A classical constituent tree often makes horizontal branch order perform two
representational tasks at once: it encodes structural relations and also
suggests the linear order in which the sentence is pronounced. OGN separates
those tasks.

```text
central branching under S = structural relations
LEX projection           = linear sentence word order
```

The same central structure can therefore support different surface strings
without mirroring or rebuilding the tree, or treating word order as a
transformation of the central tree.

## Placement plan before rendering

The viewer calculates one complete placement plan before drawing:

1. determine structural hosts;
2. determine lexical insertions and landing positions;
3. reserve grid space and exchange corridors;
4. place the central tree;
5. fill the core sentence lexically;
6. fix projections, traces and exchange paths;
7. assign growth/render steps;
8. render the fixed result.

The renderer does not choose new positions or reserve new space. Play/Growth
reveals the precomputed layout step by step.

## JaN TODO

- Working notation: `S:np-VP`, explicitly not `S:NP-VP`.
- Research notation: `S+ np-VP`.
- Binary trees first; non-binary multi-branching trees later.
- Verbal-cluster flip: `heeft gebeten` ↔ `gebeten heeft`.
