@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
set "PYTHONDONTWRITEBYTECODE=1"
set "OG_HOST=127.0.0.1"
set "OG_PORT=8088"
set "OG_APP_VERSION="
if exist "VERSION.txt" set /p OG_APP_VERSION=<"VERSION.txt"
if not defined OG_APP_VERSION (
  echo FOUT: VERSION.txt ontbreekt of is leeg in:
  echo %CD%
  echo.
  pause
  exit /b 1
)
set "OG_NONCE=%RANDOM%%RANDOM%%RANDOM%"

echo.
echo ==============================
echo OpenGraph Lite Viewer - lokaal
echo ==============================
echo.
echo Bronmap    : %CD%
echo App-versie: !OG_APP_VERSION!
echo Poort      : !OG_PORT!
echo.

call :probe_server
if /I "!OG_PROBE_STATE!"=="wrong" goto :wrong_server
if /I "!OG_PROBE_STATE!"=="down" call :start_server
if errorlevel 1 goto :failed

call :wait_for_server
if errorlevel 1 goto :failed

set "OG_RESET_URL=http://!OG_HOST!:!OG_PORT!/reset-cache.html?ogv=!OG_APP_VERSION!^&nocache=!OG_NONCE!"
echo.
echo Verplichte cache-reset wordt nu geopend:
echo !OG_RESET_URL!
echo.
echo De viewer wordt pas vanuit reset-cache.html geopend.
start "" "!OG_RESET_URL!"
exit /b 0

:probe_server
set "OG_PROBE_STATE=down"
set "OG_SERVED_VERSION="
for /f "usebackq delims=" %%V in (`powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; try { $u='http://127.0.0.1:8088/VERSION.txt?nocache=!OG_NONCE!'; $v=(Invoke-WebRequest -UseBasicParsing -Uri $u -Headers @{'Cache-Control'='no-cache'} -TimeoutSec 2).Content.Trim(); if($v){Write-Output $v} } catch {}"`) do set "OG_SERVED_VERSION=%%V"
if defined OG_SERVED_VERSION (
  if /I "!OG_SERVED_VERSION!"=="!OG_APP_VERSION!" (
    set "OG_PROBE_STATE=ok"
  ) else (
    set "OG_PROBE_STATE=wrong"
  )
)
exit /b 0

:start_server
where py.exe >nul 2>nul
if not errorlevel 1 (
  echo Lokale server starten met py.exe...
  start "OpenGraph local server !OG_APP_VERSION!" /D "%~dp0" cmd /k "set PYTHONDONTWRITEBYTECODE=1&& py server_nocache.py !OG_PORT!"
  exit /b 0
)
where python.exe >nul 2>nul
if not errorlevel 1 (
  echo Lokale server starten met python.exe...
  start "OpenGraph local server !OG_APP_VERSION!" /D "%~dp0" cmd /k "set PYTHONDONTWRITEBYTECODE=1&& python server_nocache.py !OG_PORT!"
  exit /b 0
)
echo FOUT: Python is niet gevonden.
echo Installeer Python of start server_nocache.py handmatig.
exit /b 1

:wait_for_server
for /L %%N in (1,1,20) do (
  timeout /t 1 /nobreak >nul
  call :probe_server
  if /I "!OG_PROBE_STATE!"=="ok" exit /b 0
  if /I "!OG_PROBE_STATE!"=="wrong" goto :wrong_server
)
echo FOUT: de lokale server met !OG_APP_VERSION! reageert niet op poort !OG_PORT!.
exit /b 1

:wrong_server
echo.
echo FOUT: poort !OG_PORT! bedient een andere OpenGraph-versie.
echo Verwacht : !OG_APP_VERSION!
echo Gevonden : !OG_SERVED_VERSION!
echo.
echo Sluit het oude venster "OpenGraph local server" en start deze BAT opnieuw.
echo Zo wordt voorkomen dat een oude projectmap, bijvoorbeeld rc.24, wordt geopend.
echo.
pause
exit /b 1

:failed
echo.
echo Lokale viewer is niet geopend.
echo.
pause
exit /b 1
