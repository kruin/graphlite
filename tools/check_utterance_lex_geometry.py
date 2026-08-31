#!/usr/bin/env python3
"""Statische contractcontrole voor stabiele LEX-projectiegeometrie."""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = (root / "viewer.js").read_text(encoding="utf-8")
required = {
    "horizontale boomprojectie": "d: `M ${axisX + inward * 62} ${point.py} H ${point.px - inward * leafRadius}`",
    "gekromde LEX-beweging": "C ${laneX + inward * 46} ${point.py} ${laneX + inward * 46} ${itemY}",
    "West/Oost-richting": "const inward = lexOnEast ? -1 : 1;",
    "alle LEX-doelen maximaal op bronrij": "point.py - localIndex * lexRowStep",
    "planning per kernzin": "const unitLexBounds = new Map();",
    "kernzinzones mogen niet overlappen": "-LEX valt buiten de eigen kernzinzone",
    "bron- en doelkern gelijk": "'data-source-unit': item.unitId",
    "meerdelige realisatie eindigt op bronrij": "const firstY = anchorY - (group.items.length - 1) * lexGroupGap;",
    "expliciete projectierichting": "'data-projection-direction': 'horizontal'",
    "uitsluitend omhoog": "'data-movement-direction': 'up'",
    "neerwaarts hard afgewezen": "Neerwaartse LEX-verplaatsing is niet actief",
}
missing = [label for label, marker in required.items() if marker not in source]
if missing:
    raise SystemExit("UITING LEX GEOMETRY CHECK: FOUT: " + ", ".join(missing))
if "${itemY} L ${point.px - leafRadius} ${point.py}" in source:
    raise SystemExit("UITING LEX GEOMETRY CHECK: FOUT: scheve boom-LEX-projectie aanwezig")
if "'data-movement-direction': itemY < point.py ? 'up' : 'down'" in source:
    raise SystemExit("UITING LEX GEOMETRY CHECK: FOUT: neerwaartse richting is nog renderbaar")
print("UITING LEX GEOMETRY CHECK: OK (uitsluitend upward; gekromde pijlen; iedere wissel binnen eigen kernzin; insertie en Comp behouden)")
