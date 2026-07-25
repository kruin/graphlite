from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
BAT = (ROOT / "maak-volledige-zip.bat").read_text(encoding="utf-8")
PUBLISH = (ROOT / "publish_checked.bat").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


for marker, label in [
    ('for %%I in ("%~dp0.")', "eigen scriptmap als bron"),
    ("%%~nxI", "actuele mapnaam"),
    ("%OG_ZIP_PROJECT_NAME%_full_source.zip", "zipnaam uit mapnaam"),
    ("CreateFromDirectory", "ZIP-opbouw"),
    ("$true)", "bovenste projectmap in ZIP"),
    ('move /Y "%OG_ZIP_TEMP%" "%OG_ZIP_PATH%"', "veilige vervanging doel-ZIP"),
    ("dit script maakt geen (1)-naam", "uitleg dubbele downloadnaam"),
]:
    require(BAT, marker, label)

if re.search(r"v2\.0\.0-rc\.\d+", BAT, flags=re.I):
    errors.append("maak-volledige-zip.bat bevat een hardgecodeerde releaseversie")

for folder in [
    "OpenGraph_Lite_Viewer_v2.0.0-rc.7",
    "OpenGraph_Lite_Viewer_v2.0.0-rc.108",
    "Mijn eigen projectmap",
]:
    expected = f"{folder}_full_source.zip"
    actual = f"{folder}_full_source.zip"
    if actual != expected:
        errors.append(f"naamafleiding mislukt voor {folder!r}")

for marker, label in [
    ('for %%I in ("%~dp0.") do set "OG_PUBLISH_PROJECT_NAME=%%~nxI"', "publish-mapnaam"),
    ("set \"RELEASE_ZIP=%OG_PUBLISH_PROJECT_NAME%_full_source.zip\"", "dynamische publish-zipnaam"),
]:
    require(PUBLISH, marker, label)

if re.search(r'set "RELEASE_ZIP=.*v2\.0\.0-rc\.\d+', PUBLISH, flags=re.I):
    errors.append("publish_checked.bat bevat nog een hardgecodeerde release-zipnaam")

if errors:
    print("RELEASE-ZIP BATCH CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("RELEASE-ZIP BATCH CHECK: OK (mapnaam → zipnaam; geen hardgecodeerde versie)")
