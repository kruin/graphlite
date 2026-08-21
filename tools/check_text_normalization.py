from __future__ import annotations

import sys
from pathlib import Path

from normalize_text_files import normalized_bytes, project_text_files


errors: list[str] = []


def expect(name: str, path: str, given: bytes, expected: bytes) -> None:
    actual = normalized_bytes(Path(path), given)
    if actual != expected:
        errors.append(f"{name}: verwacht {expected!r}, gevonden {actual!r}")


expect("dubbele LF aan EOF", "example.md", b"inhoud\n\n", b"inhoud\n")
expect("dubbele CRLF aan EOF", "example.md", b"inhoud\r\n\r\n", b"inhoud\n")
expect("Windows-script", "example.bat", b"@echo off\n\n", b"@echo off\r\n")
expect("interne lege regel", "example.md", b"a\n\nb\n\n", b"a\n\nb\n")
expect("UTF-8 BOM", "example.txt", b"\xef\xbb\xbftekst\r\n\r\n", b"\xef\xbb\xbftekst\n")
expect(
    "Markdown witruimte aan regeleinde",
    "TEXT_AND_CONTEXT.md",
    b"S1: **Ik zag de man gisteren.**  \nS2: **Vandaag was hij er niet meer.**\n",
    b"S1: **Ik zag de man gisteren.**\nS2: **Vandaag was hij er niet meer.**\n",
)
expect("tab aan regeleinde", "example.py", b"value = 1\t\n", b"value = 1\n")
expect("inspringing blijft behouden", "example.py", b"    value = 1  \n", b"    value = 1\n")
expect("Windows witruimte aan regeleinde", "example.bat", b"@echo off  \r\n", b"@echo off\r\n")
expect("interne lege witruimteregel", "example.md", b"a\n  \n b \n", b"a\n\n b\n")

for path in project_text_files():
    data = path.read_bytes()
    if data != normalized_bytes(path, data):
        errors.append(f"projectbestand niet genormaliseerd: {path.as_posix()}")

if errors:
    print("TEXT NORMALIZATION REGRESSION CHECK: FOUT")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("TEXT NORMALIZATION REGRESSION CHECK: OK")
