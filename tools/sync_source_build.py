from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def rewrite(path: Path, substitutions: list[tuple[str, str]]) -> bool:
    original = path.read_text(encoding="utf-8")
    updated = original
    for pattern, replacement in substitutions:
        updated, count = re.subn(pattern, replacement, updated)
        if count == 0:
            raise RuntimeError(f"{path.name}: verwachte SOURCE_BUILD-markering ontbreekt")
    if updated == original:
        return False
    path.write_text(updated, encoding="utf-8", newline="")
    return True


def main() -> None:
    source_build = (ROOT / "SOURCE_BUILD.txt").read_text(encoding="utf-8-sig").strip()
    if not re.fullmatch(r"v\d+\.\d+\.\d+-rc\.\d+-[A-Za-z0-9._-]+", source_build):
        raise RuntimeError(f"ongeldige SOURCE_BUILD.txt: {source_build!r}")
    short_build = source_build.rsplit("-", 1)[-1]

    updated_files: list[str] = []
    html_substitutions = [
        (
            r"((?:var|const) SOURCE_BUILD\s*=\s*')[^']+(';)",
            rf"\g<1>{source_build}\g<2>",
        ),
        (
            r"(sourceBuild:\s*')[^']+(')",
            rf"\g<1>{source_build}\g<2>",
        ),
        (
            r"(viewer\.js\?[^\"']*?source=)[^&\"']+",
            rf"\g<1>{short_build}",
        ),
    ]
    for name in ("index.html", "viewer.html"):
        if rewrite(ROOT / name, html_substitutions):
            updated_files.append(name)

    if rewrite(
        ROOT / "reset-cache.html",
        [(r"(const SOURCE_BUILD\s*=\s*')[^']+(';)", rf"\g<1>{source_build}\g<2>")],
    ):
        updated_files.append("reset-cache.html")

    if rewrite(
        ROOT / "viewer.js",
        [(r"(const SOURCE_BUILD\s*=\s*')[^']+(';)", rf"\g<1>{source_build}\g<2>")],
    ):
        updated_files.append("viewer.js")

    if rewrite(
        ROOT / "sw.js",
        [
            (
                r"(const OPENGRAPH_SW_VERSION\s*=\s*')[^']+(-cleanup';)",
                rf"\g<1>{source_build}\g<2>",
            ),
            (
                r"(url\.searchParams\.set\('source',\s*')[^']+('\);)",
                rf"\g<1>{source_build}\g<2>",
            ),
        ],
    ):
        updated_files.append("sw.js")

    detail = ", ".join(updated_files) if updated_files else "alles was al gelijk"
    print(f"SOURCE_BUILD SYNC: OK ({source_build}; {detail})")


if __name__ == "__main__":
    main()
