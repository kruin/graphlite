# OpenGraph Lite Viewer v2.0.0-rc.23

OpenGraph Lite Viewer is a demo/viewer for JAN, OPN and OpenGraph linguistic
structures. Source nodes project horizontally to LEX; LOG supplies later
target rows for on-axis placement.

Dutch documentation: [`LEESMIJ.md`](LEESMIJ.md).

## Projection contract

```text
source node → horizontal LEX projection → one direct move to the resolved LEX target
```

`S`, `O` and `V` are majors. An adverb minor occupies a configurable LOG
interval and adds one fixed slot to the distance between its bounding majors.
Every lexical source first projects at its source height. LOG determines the
neutral target row, never the projection origin. An explicit topic/V2 rule may
replace that row before drawing, so each source word has at most one visible
move and one source trace. The example sentence validates the result and does
not supply layout coordinates.

## Play sequence

After the central tree has been built, Play uses three explicit phases:

```text
1. LOG axis
2. reserve LOG-derived space on LEX
3. project lexical sources horizontally and move each one once to its target
```

SYNT and the remaining projection panels appear in the final step.
Previous-step runs this process in exact reverse order; the final projection
layer is removed immediately on the first backward step.

## README carousel and external link

The introduction currently shows only the first image with traditional trees.
Carousel controls remain ready for later specification images and stay hidden
while there is only one image.

The example-search link opens in a separate browser window. Closing it leaves
the app open.

## Social export and limited phrases

`Config → Files → Publish graph` exports a self-contained SVG, a
1200 × 627 LinkedIn PNG, or a WebM recording of the complete Play sequence.
LinkedIn accepts WebM as native video. See `SOCIAL_EXPORT.md`.

The adverb list now also contains `MISSCHIEN WEL`, `AF EN TOE`,
`OP DIT MOMENT`, and `MET VEEL AANDACHT`. Each complete phrase currently
acts as one LOG minor; internal syntax is deferred. See
`TALIGE_UITBREIDINGEN.md`.

## Start

```text
index.html
start-local-viewer.bat
```

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.0-rc.23
```

## Central views and named projections

```text
central: Syntax, FT
west:    LEX
east:    SYNT
south:   LOG
```

LOG is a named south-axis projection, not a central view. LEX, SYNT and LOG are
visible by default and share one stable viewport.

## OPN storage

`.opn` is the primary round-trip document format and separates metadata, data
and optional paradata. See `OPN_STORAGE_FORMAT.md`.

## Validation

```bat
node --check viewer.js
check_release.bat
```
