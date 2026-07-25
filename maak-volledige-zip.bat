@echo off
setlocal EnableExtensions DisableDelayedExpansion

rem De map waarin dit script staat is leidend voor map- en zipnaam.
for %%I in ("%~dp0.") do set "OG_ZIP_PROJECT_DIR=%%~fI"
for %%I in ("%OG_ZIP_PROJECT_DIR%") do set "OG_ZIP_PROJECT_NAME=%%~nxI"
for %%I in ("%OG_ZIP_PROJECT_DIR%\..") do set "OG_ZIP_PARENT_DIR=%%~fI"

set "OG_ZIP_PATH=%OG_ZIP_PARENT_DIR%\%OG_ZIP_PROJECT_NAME%_full_source.zip"
set "OG_ZIP_TEMP=%OG_ZIP_PARENT_DIR%\%OG_ZIP_PROJECT_NAME%_full_source.tmp.%RANDOM%%RANDOM%.zip"

echo.
echo ==============================
echo OpenGraph volledige bron-ZIP
echo ==============================
echo.
echo Bronmap : %OG_ZIP_PROJECT_DIR%
echo ZIP-naam: %OG_ZIP_PROJECT_NAME%_full_source.zip
echo Doelmap : %OG_ZIP_PARENT_DIR%
echo.

set "OG_ZIP_APP_VERSION="
if exist "%OG_ZIP_PROJECT_DIR%\VERSION.txt" set /p OG_ZIP_APP_VERSION=<"%OG_ZIP_PROJECT_DIR%\VERSION.txt"
if defined OG_ZIP_APP_VERSION call :show_version

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo FOUT: Windows PowerShell is niet gevonden.
  goto :failed
)

if exist "%OG_ZIP_TEMP%" del /F /Q "%OG_ZIP_TEMP%" >nul 2>nul

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "Add-Type -AssemblyName System.IO.Compression.FileSystem;" ^
  "[System.IO.Compression.ZipFile]::CreateFromDirectory($env:OG_ZIP_PROJECT_DIR,$env:OG_ZIP_TEMP,[System.IO.Compression.CompressionLevel]::Optimal,$true)"

if errorlevel 1 (
  echo FOUT: het maken van de ZIP is mislukt.
  goto :failed
)

move /Y "%OG_ZIP_TEMP%" "%OG_ZIP_PATH%" >nul
if errorlevel 1 (
  echo FOUT: de nieuwe ZIP kon niet naar de doelnaam worden verplaatst.
  goto :failed
)

if not exist "%OG_ZIP_PATH%" (
  echo FOUT: de verwachte ZIP ontbreekt na afloop.
  goto :failed
)

echo GEREED:
echo %OG_ZIP_PATH%
echo.
echo Hernoem je de projectmap, dan volgt de ZIP-naam die mapnaam automatisch.
echo Een bestaande ZIP met dezelfde naam wordt vervangen; dit script maakt geen (1)-naam.
echo.
pause
exit /b 0

:show_version
echo App-versie volgens VERSION.txt: %OG_ZIP_APP_VERSION%
echo(%OG_ZIP_PROJECT_NAME%| findstr /L /E /C:"%OG_ZIP_APP_VERSION%" >nul
if errorlevel 1 (
  echo WAARSCHUWING: de mapnaam eindigt niet op de versie uit VERSION.txt.
  echo De ZIP volgt zoals gevraagd toch exact de huidige mapnaam.
)
echo.
exit /b 0

:failed
if exist "%OG_ZIP_TEMP%" del /F /Q "%OG_ZIP_TEMP%" >nul 2>nul
echo.
echo Er is geen nieuwe volledige bron-ZIP opgeleverd.
echo.
pause
exit /b 1
