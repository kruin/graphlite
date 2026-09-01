from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
README = (ROOT / "README.md").read_text(encoding="utf-8")
LEESMIJ = (ROOT / "LEESMIJ.md").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


for marker, label in [
    ("function isPhysicalHandheldViewport()", "fysieke mobiele detectie"),
    ("isPhysicalHandheldViewport();", "mobiel landschap in automatische modus"),
    ("function projectionAxisGridBox(", "rastergrens op projectie-assen"),
    ("function stableProjectionAxisFocusBox(", "stabiele mobiele Syntax/Functional-focus"),
    ("const startX = Math.ceil(", "geen rasterlijn links van de as"),
    ("const startY = Math.ceil(", "geen rasterlijn boven de grens"),
    ("function handheldMaximumViewBox(", "mobiele MAX-focus"),
    (": handheldMaximumViewBox(fit);", "mobiele MAX-toepassing buiten horizontale LEX"),
    ("Tijdens init is README nog verborgen", "veilige README-maatherstel"),
]:
    require(JS, marker, label)

for marker, label in [
    (
        'body.help-screen-active .help-screen.help-tree-screen[data-help-layout="stacked"]',
        "specifieke gestapelde README-regel",
    ),
    (
        'body.help-screen-active .help-screen.help-tree-screen[data-help-layout="side"]',
        "specifieke README-regel naast elkaar",
    ),
    ("grid-template-rows: var(--help-nav-size) .7rem", "verstelbare README-hoogte"),
    ("grid-template-columns: var(--help-nav-size) .7rem", "verstelbare README-breedte"),
]:
    require(CSS, marker, label)

require(README, "Mobile MAX", "Engelse uitleg mobiele MAX")
require(LEESMIJ, "Mobiele MAX", "Nederlandse uitleg mobiele MAX")

if errors:
    print("RC38 MOBILE LAYOUT CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("RC38 MOBILE LAYOUT CHECK: OK (README, mobile MAX en raster tot assen)")
