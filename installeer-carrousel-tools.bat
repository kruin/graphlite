@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0"

echo.
echo =========================================
echo OpenGraph carrouseltools - eenmalig gereedmaken
echo =========================================
echo.
echo Dit installeert lokaal de vastgezette Playwright-versie en de
echo bijbehorende Chromium-browser. Internet is alleen voor deze stap nodig.
echo node_modules en de browser worden niet in project- of carrouselzips gezet.
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo FOUT: Node.js ontbreekt.
  echo Installeer Node.js 18 of hoger en draai dit bestand daarna opnieuw.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo FOUT: npm ontbreekt. Installeer een volledige Node.js-installatie.
  exit /b 1
)

node -e "const major=Number(process.versions.node.split('.')[0]); console.log('Node.js '+process.version); if (major < 18) { console.error('FOUT: Node.js 18 of hoger is vereist.'); process.exit(1); }"
if errorlevel 1 exit /b 1

if not exist "package.json" (
  echo FOUT: package.json ontbreekt. Pak de complete nieuwe zip opnieuw uit.
  exit /b 1
)
if not exist "package-lock.json" (
  echo FOUT: package-lock.json ontbreekt. Pak de complete nieuwe zip opnieuw uit.
  exit /b 1
)

echo.
echo Stap 1/2: lokale Node-hulpmiddelen installeren...
call npm ci --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo FOUT: npm ci is mislukt. Controleer de internetverbinding en probeer opnieuw.
  exit /b 1
)

echo.
echo Stap 2/2: bijpassende Chromium-browser installeren...
node "node_modules\playwright\cli.js" install chromium
if errorlevel 1 (
  echo.
  echo FOUT: Chromium kon niet worden geinstalleerd.
  echo Controleer de internetverbinding en draai dit bestand opnieuw.
  exit /b 1
)

echo.
node tools\check_publication_carousel_tooling.js
if errorlevel 1 exit /b 1

echo.
echo GEREED. Draai nu maak-publicatie-carrousel.bat.
exit /b 0
