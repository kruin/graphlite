from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


layout_options = re.search(
    r"const LAYOUT_DENSITIES = \[(.*?)\n\s*\];", JS, re.S
)
view_options = re.search(
    r"const VIEW_FIT_MODES = \[(.*?)\n\s*\];", JS, re.S
)
if not layout_options or "id: 'max'" not in layout_options.group(1).splitlines()[1]:
    errors.append("Boomruimte moet MAX als eerste optie tonen")
if not view_options or "id: 'max'" not in view_options.group(1).splitlines()[1]:
    errors.append("Venstervulling moet MAX als eerste optie tonen")

for marker, label in [
    ("layoutDensity: 'max'", "standaard Boomruimte"),
    ("viewFitMode: 'max'", "standaard Venstervulling"),
    ("fontScale: 1.70", "leesbare desktopfontschaal"),
    ("function maximumProjectionFrameBox()", "compact stabiel projectiekader"),
    ("function computeMaximumContentFitBox()", "MAX-fitfunctie"),
    (
        "'.grid, .view-pan-hint, .projection-stability-frame'",
        "uitsluiting van leeg stabiliteitskader",
    ),
    ("validViewFitMode() === 'max'", "MAX-fitselectie"),
    ("state.maximumContentFit", "stabiele MAX-fit tijdens Play"),
]:
    require(JS, marker, label)

for marker, label in [
    ("body.main-screen-active.main-window-max .workspace", "MAX-werkvlak"),
    ("width: 100vw !important", "volledige vensterbreedte"),
    ("height: var(--main-grid-height", "volledige beschikbare vensterhoogte"),
    ("@media (min-width: 761px)", "desktopregel"),
    ("font-size: .88rem !important", "leesbaar desktop-topmenu"),
]:
    require(CSS, marker, label)

require(
    INDEX,
    "<span>Venstervulling</span><select id=\"viewFitSelect\"",
    "uitleg in Config",
)
require(JS, "config-max-callout", "zichtbare MAX-kaart in Config")

if errors:
    print("DESKTOP MAX CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("DESKTOP MAX CHECK: OK")
