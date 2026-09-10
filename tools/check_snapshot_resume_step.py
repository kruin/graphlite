import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "samples" / "hond-bijt-man-step-7.snapshot.ogn"
errors = []


try:
    document = json.loads(FIXTURE.read_text(encoding="utf-8"))
except Exception as error:
    raise SystemExit(f"SNAPSHOT RESUME STEP CHECK: FOUT\n- fixture onleesbaar: {error}")

snapshot = document.get("paradata", {}).get("snapshot", {})
play = snapshot.get("play", {})
syntax_nodes = document.get("data", {}).get("graphs", {}).get("syntax", {}).get("nodes", [])

if snapshot.get("schema") != "ogn-resumable-view-snapshot-v1":
    errors.append("fixture mist het hervatbare snapshot-schema")
if snapshot.get("placement_mode") != "language-tree":
    errors.append("fixture gebruikt niet de Language Tree-engine")
if play.get("step") != 7 or play.get("max") != 15:
    errors.append(f"fixture moet stap 7 van 15 bewaren, ontvangen {play!r}")
if len(syntax_nodes) <= int(play.get("step", 0)):
    errors.append("fixture bewijst niet dat volledig model en zichtbare stap apart zijn opgeslagen")

js = (ROOT / "viewer.js").read_text(encoding="utf-8", errors="ignore")
if "queueMicrotask(announceSnapshotWindowReady)" in js:
    errors.append("snapshot-ready wordt nog te vroeg vanuit registerEvents verstuurd")

init_start = js.find("async function init()")
init_end = js.find("\n  init();", init_start)
init_source = js[init_start:init_end]
init_markers = (
    "await loadPublicTestmateriaalCatalog()",
    "applyFullStartupState()",
    "render()",
    "window.__opengraphBoot = {",
    "announceSnapshotWindowReady();",
)
init_positions = [init_source.find(marker) for marker in init_markers]
if init_start < 0 or init_end < 0 or any(position < 0 for position in init_positions):
    errors.append("initialisatie bevat niet alle vereiste snapshot-ready markeringen")
elif init_positions != sorted(init_positions):
    errors.append("snapshotdocument wordt verstuurd voordat het interne venster volledig gestart is")

ready_start = js.find("function announceSnapshotWindowReady()")
ready_end = js.find("\n  function ", ready_start + 1)
ready_source = js[ready_start:ready_end]
if "window.__opengraphBoot?.loaded === true" not in ready_source:
    errors.append("snapshot-ready heeft geen expliciete boot-gereedheidscontrole")

restore_start = js.find("function restoreOgnResumeSnapshot(payload)")
restore_end = js.find("\n  function applyImportedDocumentText", restore_start)
restore_source = js[restore_start:restore_end]
restore_markers = (
    "state.growthEnabled = true;",
    "state.growthStep = clampGrowthStep(play.step);",
    "state.projectionBlockUnlocked = state.growthStep >= growthStepMax();",
)
restore_positions = [restore_source.find(marker) for marker in restore_markers]
if restore_start < 0 or restore_end < 0 or any(position < 0 for position in restore_positions):
    errors.append("Language Tree-PLAY-stap wordt niet volledig hersteld")
elif restore_positions != sorted(restore_positions):
    errors.append("Language Tree-PLAY-herstel staat in de verkeerde volgorde")

if errors:
    print("SNAPSHOT RESUME STEP CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("SNAPSHOT RESUME STEP CHECK: OK (volledige graph opgeslagen; zichtbaarheid hervat op stap 7/15)")
