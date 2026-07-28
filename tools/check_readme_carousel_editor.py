from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
VIEWER = (ROOT / "viewer.html").read_text(encoding="utf-8")
LOCAL_MOBILE = (ROOT / "local-mobile-test.js").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


for marker, label in [
    ("MAX_README_CAROUSEL_SLIDES = 20", "maximum aantal slides"),
    ("DEFAULT_README_CAROUSELS = new Map()", "bronstandaarden"),
    ("readmeCarousels: {}", "lege editorstaat"),
    ("id: 'readme-carousels'", "Config-tab"),
    ("id=\"readmeCarouselTopicSelect\"", "onderwerpkeuze"),
    ("data-readme-carousel-field=\"src\"", "beeldpadveld"),
    ("data-readme-carousel-field=\"shape\"", "beeldvormveld"),
    ("data-readme-carousel-field=\"altNl\"", "Nederlandse alt-tekst"),
    ("data-readme-carousel-field=\"altEn\"", "Engelse alt-tekst"),
    ("data-readme-carousel-field=\"captionNl\"", "Nederlands onderschrift"),
    ("data-readme-carousel-field=\"captionEn\"", "Engels onderschrift"),
    ("id=\"readmeCarouselCaptionNlInput\" maxlength=\"1200\" type=\"text\"", "compact Nederlands onderschriftveld"),
    ("id=\"readmeCarouselCaptionEnInput\" maxlength=\"1200\" type=\"text\"", "compact Engels onderschriftveld"),
    ("function captureDefaultReadmeCarousels()", "inlezen broncarousel"),
    ("function normalizeReadmeCarousels(", "normalisatie opgeslagen carousels"),
    ("function renderReadmeTopicCarousels()", "renderen per onderwerp"),
    ("function syncReadmeCarouselEditorTopics()", "onderwerpeditor"),
    ("function addReadmeCarouselSlide()", "slide toevoegen"),
    ("function removeReadmeCarouselSlide()", "slide verwijderen"),
    ("function resetReadmeCarouselTopic()", "onderwerp herstellen"),
    ("readmeCarousels: normalizeReadmeCarousels(state.readmeCarousels)", "Config-snapshotuitvoer"),
    ("normalizeReadmeCarousels(snapshot.readmeCarousels)", "Config-snapshotinvoer"),
    ("/^(?:javascript|vbscript|data|file):/i", "onveilige beeldschema's blokkeren"),
    ("captureDefaultReadmeCarousels();\n    setupConfigTabs();", "bron vastleggen vóór editorbouw"),
    ("ensureHelpTopicCarouselSlots();\n    renderReadmeTopicCarousels();", "per-item-slots daarna renderen"),
    ("document.body.classList.contains('config-screen-active')", "sneltoetsblokkade in Config"),
    ("target.matches('input, textarea, select, [contenteditable]')", "sneltoetsblokkade in invoervelden"),
]:
    require(JS, marker, label)

for marker, label in [
    (".config-readme-carousel-card", "editorcard"),
    (".readme-carousel-editor-preview", "live voorvertoning"),
    (".readme-carousel-slide-fields", "slidevelden"),
    (".readme-carousel-image-placeholder", "lege beeldplaceholder"),
    ("body.config-screen-active .mobile-sentence-bar,", "mobiele hoofdbalk verborgen in Config"),
]:
    require(CSS, marker, label)

require(
    LOCAL_MOBILE,
    "body.config-screen-active #localMobileTestPanel,body.help-screen-active #localMobileTestPanel",
    "lokale viewportknop verborgen buiten Main",
)

if INDEX != VIEWER:
    errors.append("viewer.html verschilt van index.html")

topic_count = INDEX.count('class="help-topic-panel')
if topic_count < 20:
    errors.append(f"verwacht minstens 20 LEESMIJ-items, gevonden {topic_count}")
require(INDEX, 'data-help-topic="carousel"', "LEESMIJ-uitleg over carousels")
require(INDEX, 'data-readme-carousel=""', "bestaande broncarousel")

if errors:
    print("README CAROUSEL EDITOR CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("README CAROUSEL EDITOR CHECK: OK (per item; add/remove; NL/EN; preview; Config-save)")
