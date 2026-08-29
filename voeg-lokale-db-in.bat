@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0"

set "OG_DB_SOURCE=%~1"
if not defined OG_DB_SOURCE (
  echo Geef het volledige pad naar de nieuwe lokale database.
  set /p "OG_DB_SOURCE=Database: "
)
if not defined OG_DB_SOURCE (
  echo FOUT: geen database opgegeven.
  exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
  echo FOUT: Python ontbreekt.
  exit /b 1
)

python tools\install_local_database.py "%OG_DB_SOURCE%"
if errorlevel 1 exit /b 1

echo.
echo Start Graphlite opnieuw om de nieuwe lokale catalogus te laden.
exit /b 0
