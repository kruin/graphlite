from __future__ import annotations

import subprocess
import sys
import zipfile
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VERSION = (ROOT / "VERSION.txt").read_text(encoding="utf-8").strip()
RC_NUMBER = VERSION.rsplit(".", 1)[-1]
CAROUSEL_SUFFIX = "_publicatie_carrousel"
DOWNLOAD_COPY_SUFFIX_RE = re.compile(r" \(\d+\)$")


def canonical_carousel_archive_name(folder_name: str) -> str:
    clean_name = DOWNLOAD_COPY_SUFFIX_RE.sub("", folder_name)
    if clean_name.endswith(CAROUSEL_SUFFIX):
        return clean_name
    return f"{clean_name}{CAROUSEL_SUFFIX}"


ARCHIVE_ROOT = canonical_carousel_archive_name(ROOT.name)
OUTPUT = ROOT.parent / f"{ARCHIVE_ROOT}.zip"
TEMP = ROOT.parent / f"{ARCHIVE_ROOT}.tmp.zip"

SLIDE_NAMES = [
    "01-every-node-owns-grid-lines.png",
    "02-free-places-first.png",
    "03-one-node-at-a-time.png",
    "04-node-projection-west-south-east.png",
    "05-direct-placement-greedy-grow.png",
    "06-calculated-placement-language-tree.png",
    "07-core-first-examples-follow.png",
]

FILES = [
    "VERSION.txt",
    "SOURCE_BUILD.txt",
    "package.json",
    "package-lock.json",
    "PUBLICATIE_README.md",
    "OGN_CORE_PLACEMENT_ARCHITECTURE.md",
    "GREEDY_GROW_RECONSTRUCTION.md",
    "greedy-grow-engine.js",
    f"SOURCE_CHANGES_V{VERSION[1:]}.md",
    "maak-publicatie-carrousel.bat",
    "installeer-carrousel-tools.bat",
    "publicatie-carrousel/index.html",
    "publicatie-carrousel/derived-manifest.json",
    "tools/export_publication_carousel.js",
    "tools/check_publication_carousel.py",
    "tools/check_publication_carousel_setup.py",
    "tools/check_publication_carousel_tooling.js",
    "tools/build_publication_carousel_zip.py",
    *[f"publicatie-carrousel/slides/{name}" for name in SLIDE_NAMES],
]
FILES.extend(
    path.relative_to(ROOT).as_posix()
    for path in sorted(ROOT.glob(f"RC{RC_NUMBER}_*_TEST.md"))
)


def main() -> None:
    subprocess.run(
        [sys.executable, str(ROOT / "tools" / "check_publication_carousel.py")],
        cwd=ROOT,
        check=True,
    )
    subprocess.run(
        [sys.executable, str(ROOT / "tools" / "check_publication_carousel_setup.py")],
        cwd=ROOT,
        check=True,
    )

    missing = [relative for relative in FILES if not (ROOT / relative).is_file()]
    if missing:
        raise SystemExit("CAROUSEL-ZIP FOUT: ontbreekt: " + ", ".join(missing))

    TEMP.unlink(missing_ok=True)
    try:
        with zipfile.ZipFile(TEMP, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for relative in FILES:
                archive.write(ROOT / relative, Path(ARCHIVE_ROOT) / relative)
        TEMP.replace(OUTPUT)
    finally:
        TEMP.unlink(missing_ok=True)

    print("PUBLICATION CAROUSEL ZIP: OK")
    print(OUTPUT)


if __name__ == "__main__":
    main()
