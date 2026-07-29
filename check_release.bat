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
where python >nul 2>nul
if errorlevel 1 (
  echo FOUT: python ontbreekt.
  exit /b 1
)
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
python tools\check_desktop_max_view.py
if errorlevel 1 exit /b 1
python tools\check_social_and_linguistic_export.py
if errorlevel 1 exit /b 1
python tools\check_linkedin_video_export.py
if errorlevel 1 exit /b 1
node tools\check_linkedin_video_runtime.js
if errorlevel 1 exit /b 1
python tools\check_play_reverse.py
if errorlevel 1 exit /b 1
python tools\check_release_zip_batch.py
if errorlevel 1 exit /b 1
python tools\check_opn_storage.py samples\hond-bijt-man.v1.opn
exit /b %errorlevel%
