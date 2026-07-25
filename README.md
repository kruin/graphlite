# OpenGraph Lite Viewer v2.0.0-rc.26

OpenGraph Lite Viewer is a demo/viewer for JAN, OPN and OpenGraph linguistic
structures. This release uses the complete v1.0.16 source set as its functional
base.

Dutch documentation: [`LEESMIJ.md`](LEESMIJ.md).

## Projection contract

```text
source node → horizontal LEX projection → one direct move to the resolved LEX target
```

`S`, `O` and `V` are majors. An adverb is a minor in a configurable LOG
interval. Every minor adds one fixed slot to the distance between its bounding
majors. LOG determines the neutral target row, but never the projection
origin: every lexical source first projects horizontally at its source height.
An explicit topic or V2 rule may replace that neutral target before drawing.
The viewer therefore shows at most one LEX-axis move and one source trace per
source word, without an intermediate LOG trace. The example sentence does not
determine layout. See `projectie-master-spec.md`.

## Start

```text
index.html
```

Or run locally:

```bat
start-local-viewer.bat
```

## Build the full source ZIP on Windows

Rename the project directory to the intended release name and double-click:

```bat
maak-volledige-zip.bat
```

The batch file derives the ZIP name from its own containing directory. A
directory named `OpenGraph_Lite_Viewer_v2.0.0-rc.26` therefore produces the
sibling file `OpenGraph_Lite_Viewer_v2.0.0-rc.26_full_source.zip`. An existing
ZIP with that exact name is replaced safely; the script never invents a
`(1)` suffix.

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.26
```

Cache reset:

```text
https://kruin.github.io/graphlite/reset-cache.html?ogv=v2.0.0-rc.26
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

## Config tabs

Config opens on the first of four tabs:

1. `Save & export`: LinkedIn/Play/SVG first, followed by OPN, Config
   save/restore and example management;
2. `View`: MAX, Syntax/FT, tree layout and projection colours;
3. `LOG & LEX`: LOG minors, interval selection, LEX order and rules;
4. `Advanced`: legacy branch-extension and top-menu placement options.

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

The `Lees mij / README` button opens immediately on the `Boom, gek` /
`A tree. Odd, really` introduction. Topic navigation is on the left and the
active text appears directly in the right-hand panel.

The introduction currently shows only the first image: traditional
sentence-tree examples. Carousel support remains ready for later
specification images, but no controls are shown while there is only one image.

The external example-search link opens in a separate browser window. Closing
that window returns the user to the still-open app.

## Play sequence

After the central tree has been built, Play presents the projection process in
three explicit phases:

```text
1. draw the LOG axis and place majors/minors
2. reserve the LOG-derived space on the LEX axis
3. project lexical sources horizontally onto LEX and move each source once to
   its resolved target
```

The target is the LOG-derived row unless an explicit topic/V2 rule replaces
it. SYNT and the remaining projection panels appear in the final step.
The previous-step button now reverses the same sequence exactly: the final
projection layer disappears first, followed by LEX moves, LEX space, LOG and
then the central tree.

## Central views

```text
1. Syntax
2. FT
```

Syntax shows the syntactic tree. FT shows the functional structure for the same
example sentence. LOG is not a central view.

## Named projections

```text
LEX    west axis
SYNT   east axis
LOG    south axis
```

LEX, SYNT and LOG are visible by default. Each projection can be disabled
independently. `Geen` shows only the central Syntax or FT view; `Alle` and Reset
restore every projection. Switching projections does not alter the central
graph, viewport or scale.

Adverb insertions first become minors on the LOG axis and do not mutate Syntax
or FT. Major source items project vertically to LOG without being pulled
towards the centre; minors use their own compact lower row. Source nodes still
project horizontally to LEX. LOG supplies each neutral target and an explicit
topic/V2 rule can replace it before one direct visible move is drawn.

The active sentence is printed above the graph, with clear space below it for
a possible future north axis.

## Limited multiword adverbials

The adverb list now includes four deliberately bounded multiword units:
`MISSCHIEN WEL`, `AF EN TOE`, `OP DIT MOMENT`, and
`MET VEEL AANDACHT`. Each complete phrase currently acts as one LOG minor and
one LEX unit; its internal syntax is not expanded yet. The set samples
modality, frequency, time, and manner without claiming a complete inventory of
adverbial phrases. See
[`docs/TALIGE_UITBREIDINGEN.md`](docs/TALIGE_UITBREIDINGEN.md).

## Top menu

```text
Zin · Bijwoord · Syntax/FT · Projecties · LOG-volgorde · NL/EN · Lees mij / README · Config
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
- With automatic placement, class configuration is authoritative:
  `MODALITEIT → S-O` and `FREQUENTIE → O-V`. Example-sentence order and
  legacy position hints cannot override it.
- `Opslaan als .opn` downloads the current analysis.
- `Importeer .opn` opens a previously exported document.
- Paradata is optional.
