import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VERSION = (ROOT / "VERSION.txt").read_text(encoding="utf-8").strip()
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
SERVER = (ROOT / "server_nocache.py").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


for relative, kind in [
    ("config/default-config.json", "default"),
    ("config/user-config.json", "user"),
]:
    path = ROOT / relative
    if not path.is_file():
        errors.append(f"ontbreekt: {relative}")
        continue
    try:
        document = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"ongeldige JSON in {relative}: {exc}")
        continue
    if document.get("schema") != "opengraph-project-config":
        errors.append(f"{relative} mist schema opengraph-project-config")
    if document.get("version") != VERSION:
        errors.append(f"{relative} versie {document.get('version')!r} wijkt af van {VERSION!r}")
    if document.get("kind") != kind:
        errors.append(f"{relative} kind moet {kind!r} zijn")
    if not isinstance(document.get("config"), dict):
        errors.append(f"{relative} mist config-object")

default_document = json.loads((ROOT / "config/default-config.json").read_text(encoding="utf-8"))
user_document = json.loads((ROOT / "config/user-config.json").read_text(encoding="utf-8"))
if default_document.get("enabled") is not True:
    errors.append("standaardconfig moet enabled=true zijn")
if not isinstance(user_document.get("enabled"), bool):
    errors.append("user-config enabled moet true of false zijn")
elif user_document.get("enabled") is False and user_document.get("config") != {}:
    errors.append("uitgeschakelde placeholder-user-config moet een leeg config-object hebben")

for marker, label in [
    ("PROJECT_DEFAULT_CONFIG_PATH = 'config/default-config.json'", "standaardconfigpad"),
    ("PROJECT_USER_CONFIG_PATH = 'config/user-config.json'", "user-configpad"),
    ("function mergeProjectConfigSnapshots(", "voorrangsmerge"),
    ("function loadProjectConfigLayers()", "projectconfig-loader"),
    ("mergeProjectConfigSnapshots(merged || {}, userSnapshot)", "user over standaard"),
    ("projectConfigStatus.browserLoaded = loadSavedConfigSnapshot()", "browsersnapshot als laatste"),
    ("function currentProjectUserConfigDocument()", "projectconfig-export"),
    ("async function writeProjectUserConfig()", "directe projectschrijver"),
    ("filename: PROJECT_USER_CONFIG_PATH", "exact projectdoel"),
    ('id="writeProjectUserConfigButton"', "schrijfknop in Bestanden"),
    ('id="downloadProjectUserConfigButton"', "downloadfallback"),
]:
    require(JS, marker, label)

for marker, label in [
    ("'config/user-config.json': ROOT / 'config' / 'user-config.json'", "toegestaan serverdoel"),
    ("document.get('schema') != 'opengraph-project-config'", "servervalidatie schema"),
    ("document.get('version') != APP_VERSION", "servervalidatie versie"),
    ("document.get('kind') != 'user'", "servervalidatie user-kind"),
    ("document.get('enabled') is not True", "servervalidatie actieve user-config"),
]:
    require(SERVER, marker, label)

if not (ROOT / "config/README.md").is_file():
    errors.append("config/README.md ontbreekt")

if errors:
    print("PROJECT CONFIG LAYERS CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("PROJECT CONFIG LAYERS CHECK: OK (default → user → browser; direct project write)")
