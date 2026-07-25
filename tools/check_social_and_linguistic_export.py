from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
ADVERBS = (ROOT / "examples-adverbs.html").read_text(encoding="utf-8")
README = (ROOT / "README.md").read_text(encoding="utf-8")
LEESMIJ = (ROOT / "LEESMIJ.md").read_text(encoding="utf-8")

errors: list[str] = []

tbody = re.search(r"<tbody>(.*?)</tbody>", ADVERBS, re.S)
row_count = len(re.findall(r"<tr\b", tbody.group(1))) if tbody else 0
if row_count != 25:
    errors.append(f"examples-adverbs.html moet exact 25 voorbeelden bevatten: {row_count}")

phrases = {
    "MISSCHIEN WEL": ("MODALITEIT", "S–O"),
    "AF EN TOE": ("FREQUENTIE", "O–V"),
    "OP DIT MOMENT": ("TIJD", "O–V"),
    "MET VEEL AANDACHT": ("WIJZE", "O–V"),
}
linguistic_doc = ROOT / "docs" / "TALIGE_UITBREIDINGEN.md"
linguistic_text = linguistic_doc.read_text(encoding="utf-8") if linguistic_doc.is_file() else ""
for phrase, (category, interval) in phrases.items():
    for source_name, source in [
        ("viewer.js", JS),
        ("examples-adverbs.html", ADVERBS),
        ("TALIGE_UITBREIDINGEN.md", linguistic_text),
    ]:
        if phrase not in source:
            errors.append(f"{source_name} mist meerwoordige eenheid {phrase}")
    if category not in linguistic_text or interval not in linguistic_text:
        errors.append(f"talige documentatie mist klasse/interval voor {phrase}")

required_ids = [
    'id="downloadGraphSvgButton"',
    'id="downloadGraphPngButton"',
    'id="recordPlayWebmButton"',
    'id="graphExportStatus"',
]
for marker in required_ids:
    if marker not in INDEX:
        errors.append(f"export-UI mist {marker}")

required_js = [
    "function standaloneSvgText(",
    "function inlineStandaloneSvgPresentation(",
    "function downloadGraphSvg(",
    "async function downloadGraphPng(",
    "async function recordPlayWebm(",
    "width = 1200",
    "height = 628",
    "video/mp4;codecs=avc1.424028",
    "'video/webm;codecs=vp9'",
    "canvas.captureStream(0)",
    "track.requestFrame()",
    "PLAY_VIDEO_FRAME_RATE = 30",
    "videoBitsPerSecond: 4000000",
    "export-play-video",
]
for marker in required_js:
    if marker not in JS:
        errors.append(f"viewer.js mist exportmarker {marker!r}")

social_doc = ROOT / "docs" / "SOCIAL_EXPORT.md"
if not social_doc.is_file():
    errors.append("docs/SOCIAL_EXPORT.md ontbreekt")
else:
    social_text = social_doc.read_text(encoding="utf-8")
    for marker in ["1200 × 628", "MP4/H.264", "WebM", "30 fps", "Video", "linkedin.com/help/linkedin"]:
        if marker not in social_text:
            errors.append(f"SOCIAL_EXPORT.md mist {marker!r}")

for name, text, markers in [
    ("README.md", README, ["Social export", "Limited multiword adverbials"]),
    ("LEESMIJ.md", LEESMIJ, ["Publiceren op sociale media", "Beperkte meerwoordige"]),
]:
    for marker in markers:
        if marker not in text:
            errors.append(f"{name} mist {marker!r}")

if errors:
    print("SOCIAL/TALIG-CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print(
    "SOCIAL/TALIG-CHECK: OK "
    "(25 bijwoordvoorbeelden; 4 beperkte groepen; SVG + LinkedIn-PNG + Play-video)"
)
