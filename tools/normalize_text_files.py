from __future__ import annotations

import argparse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXCLUDED_PARTS = {".git", "node_modules", "__pycache__"}
WINDOWS_EOL_SUFFIXES = {".bat", ".cmd", ".ps1"}
TEXT_SUFFIXES = {
    ".bat", ".cmd", ".ps1",
    ".html", ".css", ".js", ".mjs", ".cjs", ".py",
    ".json", ".webmanifest", ".md", ".txt", ".svg", ".xml",
    ".yml", ".yaml", ".toml", ".ini", ".cfg", ".csv", ".tsv",
    ".graph", ".opn",
}
TEXT_NAMES = {".editorconfig", ".gitattributes", ".gitignore", ".nojekyll"}
UTF8_BOM = b"\xef\xbb\xbf"


def project_text_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or any(part in EXCLUDED_PARTS for part in path.parts):
            continue
        if path.name in TEXT_NAMES or path.suffix.lower() in TEXT_SUFFIXES:
            files.append(path)
    return sorted(files, key=lambda item: item.relative_to(ROOT).as_posix().lower())


def normalized_bytes(path: Path, data: bytes) -> bytes:
    bom = UTF8_BOM if data.startswith(UTF8_BOM) else b""
    body = data[len(bom):]
    if b"\x00" in body:
        return data

    universal = body.replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    # Git rejects trailing horizontal whitespace in staged diffs, including
    # Markdown's two-space hard breaks. Preserve indentation and internal
    # blank lines while removing only spaces and tabs at the end of each line.
    lines = [line.rstrip(b" \t") for line in universal.split(b"\n")]

    # Remove only empty lines at EOF. Intentional blank lines inside a
    # document remain untouched.
    while lines and not lines[-1]:
        lines.pop()

    normalized = b"\n".join(lines)
    if normalized:
        normalized += b"\n"

    if path.suffix.lower() in WINDOWS_EOL_SUFFIXES:
        normalized = normalized.replace(b"\n", b"\r\n")
    return bom + normalized


def expected_label(path: Path) -> str:
    eol = "CRLF" if path.suffix.lower() in WINDOWS_EOL_SUFFIXES else "LF"
    return f"{eol}; geen witruimte aan regeleinde; exact één afsluitende EOL"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Normaliseer projecttekst deterministisch voor Git en releasezips."
    )
    parser.add_argument(
        "--write",
        action="store_true",
        help="Schrijf de genormaliseerde bytes; standaard wordt alleen gecontroleerd.",
    )
    args = parser.parse_args()

    changed: list[Path] = []
    for path in project_text_files():
        data = path.read_bytes()
        normalized = normalized_bytes(path, data)
        if data == normalized:
            continue
        changed.append(path)
        if args.write:
            path.write_bytes(normalized)

    if changed and not args.write:
        print("TEXT NORMALIZATION CHECK: FOUT")
        for path in changed:
            rel = path.relative_to(ROOT).as_posix()
            print(f"- {rel}: verwacht {expected_label(path)}")
        print("Herstel automatisch met: python tools\\normalize_text_files.py --write")
        return 1

    if args.write:
        print(f"TEXT NORMALIZATION: OK ({len(changed)} bestand(en) hersteld)")
    else:
        print(f"TEXT NORMALIZATION CHECK: OK ({len(project_text_files())} tekstbestanden)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
