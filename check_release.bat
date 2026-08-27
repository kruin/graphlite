@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo FOUT: node ontbreekt.
  exit /b 1
)
node --check viewer.js
if errorlevel 1 exit /b 1
node --check greedy-grow-engine.js
if errorlevel 1 exit /b 1
node --check random-placement-engine.js
if errorlevel 1 exit /b 1
node --check multi-ogn-composition-engine.js
if errorlevel 1 exit /b 1
node --check greedy-grow.js
if errorlevel 1 exit /b 1
node tools\check_greedy_grow_reconstruction.js
if errorlevel 1 exit /b 1
node tools\check_random_placement.js
if errorlevel 1 exit /b 1
node tools\check_multi_ogn_anaphor.js
if errorlevel 1 exit /b 1
node tools\check_utterances.js
if errorlevel 1 exit /b 1
node tools\check_utterance_kernel_views.js
if errorlevel 1 exit /b 1
where python >nul 2>nul
if errorlevel 1 (
  echo FOUT: python ontbreekt.
  exit /b 1
)
python tools\normalize_text_files.py
if errorlevel 1 exit /b 1
python tools\check_text_normalization.py
if errorlevel 1 exit /b 1
python tools\check_release.py
if errorlevel 1 exit /b 1
python tools\check_local_start.py
if errorlevel 1 exit /b 1
python tools\check_examples_roundtrip.py
if errorlevel 1 exit /b 1
python tools\check_log_slot_distance.py
if errorlevel 1 exit /b 1
python tools\check_lex_horizontal_projection.py
if errorlevel 1 exit /b 1
python tools\check_projection_cleanup.py
if errorlevel 1 exit /b 1
python tools\check_config_tabs_and_menus.py
if errorlevel 1 exit /b 1
python tools\check_feature_profiles.py
if errorlevel 1 exit /b 1
python tools\check_readme_carousel_editor.py
if errorlevel 1 exit /b 1
python tools\check_readme_item_editor.py
if errorlevel 1 exit /b 1
python tools\check_project_config_layers.py
if errorlevel 1 exit /b 1
python tools\check_node_grid_invariant.py
if errorlevel 1 exit /b 1
node tools\check_lex_open_slots.js
if errorlevel 1 exit /b 1
python tools\check_line_style_and_direct_modes.py
if errorlevel 1 exit /b 1
python tools\check_direct_placement_config.py
if errorlevel 1 exit /b 1
python tools\check_publication_carousel.py
if errorlevel 1 exit /b 1
python tools\check_publication_carousel_setup.py
if errorlevel 1 exit /b 1
python tools\check_publication_phases.py
if errorlevel 1 exit /b 1
python tools\check_desktop_max_view.py
if errorlevel 1 exit /b 1
python tools\check_social_and_linguistic_export.py
if errorlevel 1 exit /b 1
python tools\check_linkedin_video_export.py
if errorlevel 1 exit /b 1
node tools\check_linkedin_video_runtime.js
if errorlevel 1 exit /b 1
node tools\check_multi_ogn_anaphor_runtime.js
if errorlevel 1 exit /b 1
python tools\check_play_reverse.py
if errorlevel 1 exit /b 1
python tools\check_release_zip_batch.py
if errorlevel 1 exit /b 1
python tools\check_opn_storage.py samples\hond-bijt-man.v1.opn samples\ik-zie-man-hij-draagt-hoed.multi-ogn.v1.opn
exit /b %errorlevel%
