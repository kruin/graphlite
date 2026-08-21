from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
VIEWER = (ROOT / "viewer.html").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


for marker, label in [
    ("DEFAULT_README_TOPICS = new Map()", "broninhoud per LEESMIJ-item"),
    ("readmeTopicEdits: {}", "lege item-overschrijvingen"),
    ("function captureDefaultReadmeTopics()", "vastleggen broninhoud"),
    ("function sanitizeReadmeTopicHtml(", "veilige HTML-filter"),
    ("function normalizeReadmeTopicEdits(", "snapshotnormalisatie"),
    ("function renderReadmeTopicEdits()", "renderen bewerkte items"),
    ('id="readmeTopicVisibilitySelect"', "Tonen ja/nee"),
    ('id="readmeTopicLabelNlInput"', "Nederlandse navigatietitel"),
    ('id="readmeTopicLabelEnInput"', "Engelse navigatietitel"),
    ('id="readmeTopicHtmlNlInput"', "Nederlandse itemtekst"),
    ('id="readmeTopicHtmlEnInput"', "Engelse itemtekst"),
    ("readmeTopicEdits: normalizeReadmeTopicEdits(state.readmeTopicEdits)", "Config-snapshotuitvoer"),
    ("normalizeReadmeTopicEdits(snapshot.readmeTopicEdits)", "Config-snapshotinvoer"),
    ("function resetReadmeTopicConfiguration()", "gezamenlijk herstel tekst en slides"),
    ("button.hidden = !available", "verborgen item blijft als DOM-item bestaan"),
    ("empty.className = 'help-topic-empty-state'", "lege LEESMIJ-melding"),
    ("MAX_README_EMBEDDED_IMAGE_BYTES = 1250000", "bestandslimiet"),
    ("README_EMBEDDED_IMAGE_TYPES", "toegestane beeldtypen"),
    ('id="readmeSlideFileInput"', "beeldkiezer in Bestanden"),
    ('id="readmeSlideFileTopicSelect"', "itemkeuze bij bestandsinvoer"),
    ("function insertReadmeSlideFile()", "bestandsinvoerfunctie"),
    ("safeReadmeEmbeddedImageSource(", "controle ingesloten beeldbron"),
    ("embedded: true", "ingesloten slide"),
    ("config-global-save-card", "globale Config-savebalk"),
    ("sidePanel.replaceChildren(tabList, saveSlot, ...panels.values())", "savebalk buiten de tabpanelen"),
]:
    require(JS, marker, label)

for marker, label in [
    (".readme-topic-fields", "itemtekstvelden"),
    (".readme-slide-file-grid", "bestandsinvoerlayout"),
    (".readme-slide-file-status.is-error", "bestandsfoutmelding"),
    (".config-global-save-card", "savebalk op ieder Config-onderdeel"),
    (".help-topic-empty-state", "lege LEESMIJ-weergave"),
]:
    require(CSS, marker, label)

if INDEX != VIEWER:
    errors.append("viewer.html verschilt van index.html")

if errors:
    print("README ITEM EDITOR CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("README ITEM EDITOR CHECK: OK (tekst; tonen ja/nee; bestand→slide; globale Config-save)")
