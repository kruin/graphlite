from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors = []


def text(name):
    return (ROOT / name).read_text(encoding="utf-8", errors="ignore")


js = text("viewer.js")
css = text("styles.css")
docs = text("OGN_STORAGE_FORMAT.md") + text("docs/OGN_STORAGE_FORMAT.md")
default_config = text("config/default-config.json")

for html_name in ("index.html", "viewer.html"):
    html = text(html_name)
    for marker in (
        'id="mainSaveOgnSnapshotButton"',
        'id="mainOpenOgnSnapshotButton"',
        'id="mainSnapshotOpenInput"',
        'id="snapshotOpenModeSelect"',
        'id="ognSnapshotDragHandle"',
        'id="ognSnapshotWorkspaceWindow"',
        'id="ognSnapshotWorkspaceDragHandle"',
        'id="ognSnapshotWorkspaceFrame"',
        'id="closeOgnSnapshotWorkspaceButton"',
        'id="ognSnapshotViewChoices"',
        'id="ognSnapshotActionChoices"',
        'id="ognSnapshotNameProposals"',
        'id="ognSnapshotFilenameInput"',
        'id="confirmOgnSnapshotButton"',
        'id="configSaveOgnSnapshotButton"',
        'id="mobileSaveOgnSnapshotButton"',
    ):
        if marker not in html:
            errors.append(f"{html_name} mist {marker}")

for marker in (
    "ogn-resumable-view-snapshot-v1",
    "function recentSnapshotParadata()",
    "function renderSnapshotNameProposals()",
    "function snapshotDescriptor(",
    "function attachOgnResumeSnapshot(",
    "document.paradata.snapshot = snapshot",
    "function restoreOgnResumeSnapshot(",
    "paused-at-saved-step",
    "resume-ogn-snapshot",
    "save-ogn-snapshot",
    "snapshotCounter(true)",
    "buildOgnDocument(true, { snapshot })",
    "function bindSnapshotDialogDrag()",
    "handle.setPointerCapture?.(event.pointerId)",
    "function reportSnapshotOpenError(",
    "els.mainSnapshotOpenInput.click()",
    "function bindSnapshotWorkspaceDrag()",
    "function openSnapshotWorkspace(",
    "function openSnapshotBrowserWindow(",
    "window.open(url.href, '_blank')",
    "preparedSnapshotForBrowserWindow",
    "snapshotOpenMode: validSnapshotOpenMode(state.snapshotOpenMode)",
    "change-snapshot-open-mode",
    "frame.src = url.href",
    "event.source !== pending.targetWindow",
    "window.parent !== window ? window.parent : window.opener",
    "graphlite-snapshot-window-ready",
    "graphlite-snapshot-window-payload",
    "window.addEventListener('message', receiveSnapshotWindowMessage)",
    "els.mainOpenOgnSnapshotButton?.addEventListener('click', requestOgnSnapshotWorkspace)",
    "els.closeOgnSnapshotWorkspaceButton?.addEventListener('click', closeSnapshotWorkspace)",
    "window.__opengraphBoot?.loaded === true",
    "announceSnapshotWindowReady();",
):
    if marker not in js:
        errors.append(f"viewer.js mist {marker}")

if "document.data.snapshot" in js or "`data.snapshot`" in docs:
    errors.append("snapshot mag niet in data.snapshot staan; paradata.snapshot is leidend")
if "queueMicrotask(announceSnapshotWindowReady)" in js:
    errors.append("snapshotvenster mag zich niet tijdens de vroege eventregistratie gereed melden")
init_source = js[js.find("async function init()") : js.find("\n  init();")]
ordered_markers = (
    "await loadPublicTestmateriaalCatalog()",
    "applyFullStartupState()",
    "render()",
    "window.__opengraphBoot = {",
    "announceSnapshotWindowReady();",
)
positions = [init_source.find(marker) for marker in ordered_markers]
if any(position < 0 for position in positions) or positions != sorted(positions):
    errors.append("snapshot-ready moet pas na volledige initialisatie en de eerste render worden gemeld")
snapshot_flow = js[js.find("function openSnapshotWorkspace"):js.find("function receiveSnapshotWindowMessage")]
if "window.open(" in snapshot_flow or "showOpenFilePicker" in snapshot_flow:
    errors.append("intern snapshotvenster mag geen browserpopup of tweede bestandskiezer gebruiken")
if "ogn-snapshot-workspace-window" not in css or "resize: both" not in css:
    errors.append("verplaatsbaar/schaalbaar intern snapshotvenster ontbreekt")
if "ogn-snapshot-dialog" not in css:
    errors.append("snapshotdialoog-CSS ontbreekt")
if "minstens drie" not in docs:
    errors.append("documentatie van meerdere naamvoorstellen ontbreekt")
if "GitHub Pages" not in docs or "binnen de app" not in docs:
    errors.append("documentatie van intern Graphlite-snapshotvenster ontbreekt")
if "nieuw browservenster" not in docs or ("twee expliciete" not in docs and "tweede expliciete" not in docs):
    errors.append("documentatie van de popupveilige browservensterroute ontbreekt")
if '"snapshotOpenMode": "in-app"' not in default_config:
    errors.append("projectdefault voor snapshot-openmodus ontbreekt")

if errors:
    print("OGN SNAPSHOT CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)
print("OGN SNAPSHOT CHECK: OK")
