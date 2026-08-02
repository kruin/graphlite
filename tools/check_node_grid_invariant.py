from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCES = [
    ROOT / "publicatie-carrousel" / "index.html",
    ROOT / "images" / "readme" / "ogn-free-grid.svg",
    ROOT / "images" / "readme" / "ogn-sequential-write.svg",
    ROOT / "images" / "readme" / "ogn-placement-strategies.svg",
]
EXPECTED_SETS = {
    "carousel-slide-2",
    "carousel-slide-4",
    "carousel-slide-6-language-tree",
    "readme-free-grid",
    "sequential-step-1",
    "sequential-step-2",
    "sequential-step-3",
    "search-order-a",
    "search-order-b",
}

errors: list[str] = []
found_sets: set[str] = set()


def attributes(tag: str) -> dict[str, str]:
    return dict(re.findall(r'([:\w-]+)="([^"]*)"', tag))


def position_tags(group: str) -> list[tuple[str, float, float]]:
    positions: list[tuple[str, float, float]] = []
    for tag in re.findall(r'<(?:circle|use)\b[^>]*>', group):
        attrs = attributes(tag)
        if tag.startswith("<circle") and "cx" in attrs and "cy" in attrs:
            positions.append((attrs.get("id", "circle"), float(attrs["cx"]), float(attrs["cy"])))
        elif tag.startswith("<use") and attrs.get("href", "").startswith("#node"):
            if "x" not in attrs or "y" not in attrs:
                errors.append(f"OGN-node-use mist x/y: {tag}")
                continue
            positions.append((attrs["href"], float(attrs["x"]), float(attrs["y"])))
    return positions


for path in SOURCES:
    if not path.is_file():
        errors.append(f"ontbreekt: {path.relative_to(ROOT)}")
        continue
    source = path.read_text(encoding="utf-8", errors="strict")
    groups = re.findall(
        r'(<g\b[^>]*data-ogn-node-set="([^"]+)"[^>]*>.*?</g>)',
        source,
        flags=re.S,
    )
    for group, set_id in groups:
        if set_id in found_sets:
            errors.append(f"dubbele data-ogn-node-set: {set_id}")
            continue
        found_sets.add(set_id)
        positions = position_tags(group)
        if not positions:
            errors.append(f"{set_id} bevat geen controleerbare OGN-knopen")
            continue
        columns: dict[float, str] = {}
        rows: dict[float, str] = {}
        for node_id, x, y in positions:
            if x in columns:
                errors.append(
                    f"{set_id}: verticaal gridlijnhergebruik door {columns[x]} en {node_id} op x={x:g}"
                )
            else:
                columns[x] = node_id
            if y in rows:
                errors.append(
                    f"{set_id}: horizontaal gridlijnhergebruik door {rows[y]} en {node_id} op y={y:g}"
                )
            else:
                rows[y] = node_id

missing_sets = sorted(EXPECTED_SETS - found_sets)
extra_sets = sorted(found_sets - EXPECTED_SETS)
if missing_sets:
    errors.append("niet gecontroleerde verwachte knoopsets: " + ", ".join(missing_sets))
if extra_sets:
    errors.append("nieuwe knoopsets vereisen expliciete opname: " + ", ".join(extra_sets))

if errors:
    print("OGN NODE GRID-INVARIANT CHECK: FOUT")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("OGN NODE GRID-INVARIANT CHECK: OK")
print("- A != B => x(A) != x(B) en y(A) != y(B)")
print(f"- {len(found_sets)} statische OGN-knoopsets gecontroleerd")
