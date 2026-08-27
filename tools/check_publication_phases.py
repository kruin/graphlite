from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []

def require(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)

manifest_path = ROOT / "publicatie" / "phases.json"
page_path = ROOT / "public-phase-1.html"
script_path = ROOT / "publicatie" / "public-phase.js"

for path in (manifest_path, page_path, script_path, ROOT / "publicatie" / "public-phase.css", ROOT / "PUBLICATION_PHASES.md"):
    require(path.is_file(), f"ontbreekt: {path.relative_to(ROOT)}")

manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.is_file() else {}
require(manifest.get("schema") == "opengraph-publication-phases-v1", "onbekend publicatiefasen-schema")
require(manifest.get("current_phase") == 1, "fase 1 is niet actueel")
phases = manifest.get("phases") or []
require([item.get("id") for item in phases] == [1, 2, 3, 4, 5, 6], "publicatiefasen zijn niet compleet of niet geordend")
require(sum(item.get("status") == "current" for item in phases) == 1, "precies één actuele fase vereist")

page = page_path.read_text(encoding="utf-8") if page_path.is_file() else ""
for marker in ("Hond bijt man", "Speel de opbouw af", "Open de interactieve graph", "publicatie/public-phase.js"):
    require(marker in page, f"fase-1-pagina mist: {marker}")
require("utm_source" not in page, "canonieke fasepagina mag geen vaste platformbron bevatten")

script = script_path.read_text(encoding="utf-8") if script_path.is_file() else ""
for event in ("view-phase-1", "play-phase-1", "open-interactive-graph"):
    require(event in script, f"meetgebeurtenis ontbreekt: {event}")

links = manifest.get("campaign_links") or {}
require("utm_source=linkedin" in links.get("linkedin", ""), "LinkedIn-campagnelink ontbreekt")
require("utm_source=reddit" in links.get("reddit", ""), "Reddit-campagnelink ontbreekt")

if errors:
    print("PUBLICATION PHASE CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("PUBLICATION PHASE CHECK: OK (fase 1, Hond bijt man)")
