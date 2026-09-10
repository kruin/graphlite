from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8", errors="ignore")


viewer = read("viewer.js")
index = read("index.html")
spec = read("OGN_STORAGE_FORMAT.md")

for marker, label in [
    ("const OGN_DOCUMENT_TYPE = 'open-graph-notation-document'", "eigen OGN-documenttype"),
    ("const OGN_FORMAT_VERSION = '1.0'", "OGN-formaatversie"),
    ("application/vnd.opengraph.ogn+json", "OGN-MIME-type"),
    ("`${exampleId}.${VERSION}.ogn`", "OGN-bestandsextensie"),
    ("async function openOgnFromExportDirectory()", "openen uit exportmap"),
    ("window.showOpenFilePicker(options)", "OGN-bestandskiezer"),
    ("async function chooseExportDirectory()", "exportmap kiezen"),
    ("window.showDirectoryPicker", "directory-API"),
    ("async function writeBlobToExportDirectory", "gedeelde bestandsuitvoer"),
    ("browserDownloadBlob(filename, blob)", "browserdownloadfallback"),
]:
    if marker not in viewer:
        errors.append(f"{label} ontbreekt")

for element_id in [
    "chooseExportFolderButton",
    "clearExportFolderButton",
    "openOgnFromExportFolderButton",
    "exportFolderStatus",
]:
    if f'id="{element_id}"' not in index:
        errors.append(f"interface-element ontbreekt: {element_id}")
    if f"els.{element_id}?.addEventListener" not in viewer and element_id != "exportFolderStatus":
        errors.append(f"interface-element is niet gekoppeld: {element_id}")

file_accepts = re.findall(r'<input[^>]+type="file"[^>]*>', index)
ogn_inputs = [tag for tag in file_accepts if ".ogn" in tag]
if not ogn_inputs:
    errors.append("OGN-importinput ontbreekt")
for tag in ogn_inputs:
    if any(media in tag for media in ("image/svg+xml", "image/png", "video/")):
        errors.append("afgeleid exportformaat wordt ten onrechte als import aangeboden")

for extension in (".svg", ".png"):
    if extension not in viewer or "downloadBlob" not in viewer:
        errors.append(f"{extension}-export ontbreekt")
if not all(marker in viewer for marker in ("video/mp4", "video/webm", "completedBlob")):
    errors.append("MP4/WebM-export ontbreekt")

for relative in [
    "samples/hond-bijt-man.v1.ogn",
    "samples/ik-zie-man-hij-draagt-hoed.multi-ogn.v1.ogn",
    "samples/ik-zie-man-hij-draagt-hoed.multi-ogn.v2.ogn",
]:
    document = json.loads(read(relative))
    if document.get("ogn") != "Open Graph Notation":
        errors.append(f"OGN-identificatie ontbreekt: {relative}")
    if document.get("document_type") != "open-graph-notation-document":
        errors.append(f"OGN-documenttype is ongeldig: {relative}")

for marker in ["metadata", "data", "paradata", "Exportmap", "SVG", "PNG", "niet importeerbaar"]:
    if marker not in spec:
        errors.append(f"opslagdocumentatie mist: {marker}")

retired_token = "o" + "p" + "n"
retired_extension = "." + retired_token
text_suffixes = {".md", ".html", ".js", ".py", ".bat", ".json", ".txt", ".css"}
for path in ROOT.rglob("*"):
    if not path.is_file() or path.suffix.lower() not in text_suffixes or "node_modules" in path.parts:
        continue
    content = path.read_text(encoding="utf-8", errors="ignore").lower()
    if retired_extension in content or re.search(rf"\b{retired_token}\b", content):
        errors.append(f"vervallen formaatnaam staat nog in {path.relative_to(ROOT)}")

if errors:
    print("OGN FORMAT/EXPORT CHECK: FAIL")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("OGN FORMAT/EXPORT CHECK: OK")
