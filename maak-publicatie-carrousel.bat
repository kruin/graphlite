@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0"

echo.
echo =====================================
echo OpenGraph publicatiecarrousel afleiden
echo =====================================
echo.
echo Bewerkbare bron: publicatie-carrousel\index.html
echo Afgeleiden    : zeven PNG's, manifest en carrousel-ZIP
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo FOUT: Node.js ontbreekt.
  exit /b 1
)
where python >nul 2>nul
if errorlevel 1 (
  echo FOUT: Python ontbreekt.
  exit /b 1
)

node tools\check_publication_carousel_tooling.js
if errorlevel 1 (
  echo.
  echo EENMALIG NODIG: draai installeer-carrousel-tools.bat.
  echo Draai daarna maak-publicatie-carrousel.bat opnieuw.
  exit /b 1
)

node tools\export_publication_carousel.js
if errorlevel 1 (
  echo.
  echo FOUT: de zeven slides konden niet uit de HTML-bron worden afgeleid.
  echo De exporter gebruikt Playwright met Chromium.
  exit /b 1
)

python tools\check_publication_carousel.py
if errorlevel 1 (
  echo.
  echo FOUT: bron, manifest en afgeleide PNG's horen niet aantoonbaar bij elkaar.
  exit /b 1
)

python tools\check_publication_carousel_setup.py
if errorlevel 1 (
  echo.
  echo FOUT: de herbouwbare carrouselverpakking is niet compleet.
  exit /b 1
)

python tools\build_publication_carousel_zip.py
if errorlevel 1 exit /b 1

echo.
echo GEREED. Bewerk PNG's en de ZIP nooit rechtstreeks.
echo Controleer de zeven beelden nog wel visueel voor publicatie.
exit /b 0
