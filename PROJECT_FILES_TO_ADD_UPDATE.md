# PROJECT_FILES_TO_ADD_UPDATE

Bestanden om als leidende projectbronnen toe te voegen of te vervangen.

## Volledige projectzip

```text
OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source.zip
```

De zip bevat de volledige bronset, documentatie, referenties, voorbeelden, OPN-voorbeeldbestand en releasecontroles.

Maak hem op Windows met `maak-volledige-zip.bat`. De ZIP-naam volgt altijd de
actuele projectmapnaam; een versienummer staat niet in de BAT vastgezet.

## Leidende losse bestanden

```text
VERSION.txt
README.md
LEESMIJ.md
PROJECT_STATE_CURRENT.md
projectie-master-spec.md
OPN_STORAGE_FORMAT.md
PRECONFIG_ARCHITECTURE.md
LAYOUT_RULES.md
LINGUISTIC_ACTIONS.md
DOCUMENTATION_RULES.md
HANDOVER_FOR_COLLABORATORS.md
DEPLOY_GITHUB_PAGES.md
RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md
OGN_CORE_PLACEMENT_ARCHITECTURE.md
GREEDY_GROW_RECONSTRUCTION.md
PUBLICATIE_README.md
SOURCE_CHANGES_V2.0.0-rc.45.md
SOURCE_CHANGES_V2.0.0-rc.44.md
SOURCE_CHANGES_V2.0.0-rc.43.md
SOURCE_CHANGES_V2.0.0-rc.42.md
SOURCE_CHANGES_V2.0.0-rc.41.md
SOURCE_CHANGES_V2.0.0-rc.40.md
SOURCE_CHANGES_V2.0.0-rc.39.md
SOURCE_CHANGES_V2.0.0-rc.38.md
RC36_BASE_PROFILE_TEST.md
RC37_PRECONFIG_TEST.md
RC38_MOBILE_LAYOUT_TEST.md
RC39_VIEWPORT_SWITCH_TEST.md
RC40_LANDSCAPE_COMPOSITION_TEST.md
RC41_RECURSIVE_LAYOUT_TEST.md
RC42_RESERVED_APPLICATIONS_TEST.md
RC42_README_CAROUSEL_EDITOR_TEST.md
RC43_CONFIG_README_PROJECT_TEST.md
RC44_PUBLICATION_CAROUSEL_TEST.md
RC45_OGN_CORE_EXPLANATION_TEST.md
greedy-grow.html
greedy-grow.css
greedy-grow-engine.js
greedy-grow.js
publicatie-carrousel/index.html
publicatie-carrousel/slides/01-every-node-owns-grid-lines.png
publicatie-carrousel/slides/02-free-places-first.png
publicatie-carrousel/slides/03-one-node-at-a-time.png
publicatie-carrousel/slides/04-node-projection-west-south-east.png
publicatie-carrousel/slides/05-direct-placement-greedy-grow.png
publicatie-carrousel/slides/06-calculated-placement-language-tree.png
publicatie-carrousel/slides/07-core-first-examples-follow.png
config/default-config.json
config/user-config.json
config/README.md
structure-config.html
viewer.js
index.html
viewer.html
server_nocache.py
start_local_viewer.bat
start_local_viewer.py
publish_checked.bat
images/readme/traditional-tree-flexible-wide.png
images/readme/traditional-tree-flexible-narrow.png
images/readme/ogn-free-grid.svg
images/readme/ogn-sequential-write.svg
images/readme/ogn-placement-strategies.svg
images/readme/ogn-three-layers.svg
images/readme/log-minor-spacing.svg
images/readme/play-log-space-lex.svg
tools/check_log_slot_distance.py
tools/check_greedy_grow_reconstruction.js
tools/check_feature_profiles.py
tools/check_feature_profiles_runtime.js
tools/check_readme_carousel_editor.py
tools/check_readme_carousel_editor_runtime.js
tools/check_readme_item_editor.py
tools/check_readme_item_editor_runtime.js
tools/check_project_config_layers.py
tools/check_project_config_layers_runtime.js
tools/check_publication_carousel.py
tools/export_publication_carousel.js
tools/check_mobile_layout_rc38.py
tools/check_mobile_layout_runtime.js
tools/check_viewport_switch_runtime.js
tools/check_landscape_composition_runtime.js
tools/check_recursive_box_fit_runtime.js
tools/check_local_start.py
docs/OGN_BASE_PROFILE.md
docs/OGN_CORE_PLACEMENT_ARCHITECTURE.md
docs/PRECONFIG_ARCHITECTURE.md
docs/RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md
tools/check_lex_horizontal_projection.py
tools/check_desktop_max_view.py
tools/check_linkedin_video_export.py
tools/check_linkedin_video_runtime.js
tools/check_release_zip_batch.py
maak-volledige-zip.bat
```

De standaard- en user-config blijven afzonderlijke bestanden. Schrijf lokale
keuzes vóór het zippen via `Config → Bestanden & export` naar
`config/user-config.json`; verwijder of vervang
`config/default-config.json` niet.

## Niet als leidende bron gebruiken

Oude projectzips en gedownloade kopieën met bijvoorbeeld `(1)` zijn
release-artefacten, geen bronbestanden, en worden daarom niet in de volledige
bronzip opgenomen. Losse screenshots en historische release notes mogen wel
aanwezig blijven, maar de bovenstaande bestanden zijn normatief.

`LEXICON_USAGE_PROFILES_AND_DISAMBIGUATION.md`,
`LEXICON_USAGE_PROFILE_TEST.md` en `SOURCE_CHANGES_V2.0.0-rc.29.md` zijn
historische of aanvullende bronnen, maar niet de eerste instap voor rc.45.
