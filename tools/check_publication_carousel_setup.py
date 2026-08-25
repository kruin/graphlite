from __future__ import annotations

import json
import runpy
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def read(relative: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        errors.append(f"ontbreekt: {relative}")
        return ""
    return path.read_text(encoding="utf-8", errors="strict")


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


package_source = read("package.json")
lock_source = read("package-lock.json")
installer = read("installeer-carrousel-tools.bat")
maker = read("maak-publicatie-carrousel.bat")
publish = read("publish_checked.bat")
tooling_check = read("tools/check_publication_carousel_tooling.js")
builder_source = read("tools/build_publication_carousel_zip.py")

try:
    package = json.loads(package_source)
except Exception as exc:
    errors.append(f"ongeldige package.json: {exc}")
    package = {}

try:
    lock = json.loads(lock_source)
except Exception as exc:
    errors.append(f"ongeldige package-lock.json: {exc}")
    lock = {}

expected_playwright = "1.61.1"
if package.get("private") is not True:
    errors.append("package.json moet private=true bevatten")
if package.get("engines", {}).get("node") != ">=18":
    errors.append("package.json moet Node.js >=18 vastleggen")
if package.get("devDependencies", {}).get("playwright") != expected_playwright:
    errors.append(f"package.json moet Playwright exact op {expected_playwright} vastzetten")
if lock.get("packages", {}).get("node_modules/playwright", {}).get("version") != expected_playwright:
    errors.append(f"package-lock.json moet Playwright {expected_playwright} vergrendelen")

for marker, label in [
    ("npm ci --no-audit --no-fund", "reproduceerbare npm-installatie"),
    ('node "node_modules\\playwright\\cli.js" install chromium', "vastgezette Chromium-installatie"),
    ("Node.js 18 of hoger", "Node-minimum"),
    ("check_publication_carousel_tooling.js", "controle na installatie"),
]:
    require(installer, marker, label)
for marker, label in [
    ("check_publication_carousel_tooling.js", "toolcontrole vóór export"),
    ("installeer-carrousel-tools.bat", "leesbare installatie-instructie"),
]:
    require(maker, marker, label)
for marker, label in [
    ("call :ensure_playwright_runtime", "publish-preflight voor Playwright"),
    ("chromium.executablePath()", "publish-controle op Chromium"),
    ('choice /C JN /N /M "Nu eenmalig installeren? [J/N]: "', "installatiekeuze in publish"),
    ('call "%~dp0installeer-carrousel-tools.bat"', "installer vanuit publish"),
]:
    require(publish, marker, label)
for marker, label in [
    ("expectedPlaywright", "versiecontrole Playwright"),
    ("chromium.executablePath()", "Chromium-padcontrole"),
    ("await chromium.launch", "echte Chromium-startcontrole"),
]:
    require(tooling_check, marker, label)
for marker, label in [
    ("canonical_carousel_archive_name", "centrale carrouselzipnaam"),
    ("DOWNLOAD_COPY_SUFFIX_RE", "browser-downloadsuffixfilter"),
]:
    require(builder_source, marker, label)

if builder_source:
    try:
        namespace = runpy.run_path(
            str(ROOT / "tools" / "build_publication_carousel_zip.py"),
            run_name="opengraph_carousel_build_name_test",
        )
        canonical_name = namespace["canonical_carousel_archive_name"]
    except Exception as exc:
        errors.append(f"zipnaamfunctie kon niet worden geladen: {exc}")
    else:
        cases = {
            "OpenGraph_Lite_Viewer_v2.0.0-rc.45":
                "OpenGraph_Lite_Viewer_v2.0.0-rc.45_publicatie_carrousel",
            "OpenGraph_Lite_Viewer_v2.0.0-rc.45_publicatie_carrousel":
                "OpenGraph_Lite_Viewer_v2.0.0-rc.45_publicatie_carrousel",
            "OpenGraph_Lite_Viewer_v2.0.0-rc.45_publicatie_carrousel (6)":
                "OpenGraph_Lite_Viewer_v2.0.0-rc.45_publicatie_carrousel",
        }
        for folder_name, expected in cases.items():
            actual = canonical_name(folder_name)
            if actual != expected:
                errors.append(
                    f"zipnaam uit {folder_name!r}: verwacht {expected!r}, gevonden {actual!r}"
                )

if (ROOT / "maak-volledige-zip.bat").is_file():
    full_zip = read("maak-volledige-zip.bat")
    gitignore = read(".gitignore")
    release_check = read("tools/check_release.py")
    require(full_zip, "$parts -contains 'node_modules'", "node_modules-uitsluiting volledige zip")
    require(gitignore, "node_modules/", "node_modules-gitignore")
    require(release_check, '"node_modules" in parts', "node_modules-uitsluiting releasemanifest")

if errors:
    print("CARROUSEL-SETUPCHECK: FOUT")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("CARROUSEL-SETUPCHECK: OK")
print("- Node.js >=18 en Playwright 1.61.1 vastgezet")
print("- eenmalige Windows-installatie beschreven")
print("- correcte zipnaam vanuit project-, carrousel- en (n)-map")
print("- lokale afhankelijkheden blijven buiten releasezips")
