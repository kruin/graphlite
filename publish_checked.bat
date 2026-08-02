@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0"
set "DID_PUSH=0"

echo.
echo ==============================
echo OpenGraph Lite Viewer - publiceren
echo ==============================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo FOUT: git is niet gevonden in PATH.
  goto :fail
)

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo FOUT: deze map is geen Git-repository.
  echo Map: %CD%
  goto :fail
)

for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"
if not defined BRANCH (
  echo FOUT: kon actieve branch niet bepalen.
  goto :fail
)
echo Huidige branch: %BRANCH%
if /I not "%BRANCH%"=="main" echo WAARSCHUWING: je zit niet op main.
echo.

for %%f in (index.html viewer.html viewer.js styles.css reset-cache.html VERSION.txt SOURCE_BUILD.txt RELEASE_MANIFEST.txt) do (
  if not exist "%%f" (
    echo FOUT: %%f ontbreekt.
    goto :fail
  )
)

set /p APP_VERSION=<VERSION.txt
if not defined APP_VERSION (
  echo FOUT: VERSION.txt is leeg.
  goto :fail
)
for %%I in ("%~dp0.") do set "OG_PUBLISH_PROJECT_NAME=%%~nxI"
set "RELEASE_ZIP=%OG_PUBLISH_PROJECT_NAME%_full_source.zip"
echo App-versie: %APP_VERSION%
set /p SOURCE_BUILD=<SOURCE_BUILD.txt
echo Bronstand  : %SOURCE_BUILD%
echo Release-zip: %RELEASE_ZIP%
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo FOUT: python ontbreekt; tekstnormalisatie kan niet worden uitgevoerd.
  goto :fail
)

echo Tekstbestanden normaliseren ^(Git + EOF/EOL^)...
python tools\normalize_text_files.py --write
if errorlevel 1 (
  echo FOUT: tekstnormalisatie mislukt.
  goto :fail
)

call check_release.bat
if errorlevel 1 (
  echo FOUT: releasecontrole mislukt.
  goto :fail
)

echo.
echo Git-status voor %APP_VERSION%:
set "STATUS_ALL=%TEMP%\opengraph_status_all_%RANDOM%%RANDOM%.txt"
set "STATUS_SITE=%TEMP%\opengraph_status_site_%RANDOM%%RANDOM%.txt"
git status --short --untracked-files=normal > "%STATUS_ALL%"
findstr /V /I /R /C:".*_full_source.*\.zip" /C:"local-mobile-test\.js" /C:"local-mobile-test\.html" /C:"opengraph-local-config-log-.*\.txt" /C:"local-config-log.*\.txt" "%STATUS_ALL%" > "%STATUS_SITE%"
type "%STATUS_SITE%"
for %%A in ("%STATUS_SITE%") do set "STATUS_SIZE=%%~zA"
del "%STATUS_ALL%" >nul 2>nul

if "%STATUS_SIZE%"=="0" (
  del "%STATUS_SITE%" >nul 2>nul
  echo.
  echo Geen sitewijzigingen om te committen of pushen.
  goto :success
)
del "%STATUS_SITE%" >nul 2>nul

set /p "COMMITMSG=Geef commit message: "
if not defined COMMITMSG (
  echo FOUT: geen commit message opgegeven.
  goto :fail
)

echo.
echo Staging sitebestanden...
git add --renormalize -- .
if errorlevel 1 (
  echo FOUT: Git-renormalisatie mislukt.
  goto :fail
)
git add -A -- .
if errorlevel 1 (
  echo FOUT: git add mislukt.
  goto :fail
)

rem Release-zips en lokale test/logbestanden horen niet in de Pages-root.
git rm --cached --ignore-unmatch -- "*_full_source*.zip" >nul 2>nul
for %%f in (local-mobile-test.js local-mobile-test.html) do (
  git ls-files --error-unmatch "%%f" >nul 2>nul
  if not errorlevel 1 git rm --cached -- "%%f" >nul 2>nul
)
for /f "delims=" %%f in ('git ls-files "opengraph-local-config-log-*.txt" "local-config-log*.txt"') do git rm --cached -- "%%f" >nul 2>nul

git diff --cached --check
if errorlevel 1 (
  echo FOUT: staged diff bevat whitespace- of conflictproblemen.
  goto :fail
)

git diff --cached --quiet
if not errorlevel 1 (
  echo Geen staged wijzigingen om te committen.
  goto :success
)

echo.
echo Committen...
git commit -m "%COMMITMSG%"
if errorlevel 1 (
  echo FOUT: git commit mislukt.
  goto :fail
)

echo.
echo Push naar origin/%BRANCH% ...
git push -u origin "%BRANCH%"
if errorlevel 1 (
  echo FOUT: git push mislukt.
  goto :fail
)
set "DID_PUSH=1"

:success
echo.
echo Klaar.
echo Branch: %BRANCH%
if defined COMMITMSG echo Commit : %COMMITMSG%
if "%DID_PUSH%"=="1" call :open_reset_after_push
if not "%DID_PUSH%"=="1" echo Geen succesvolle nieuwe push; reset-cache wordt niet geopend.
echo.
pause
endlocal
exit /b 0

:fail
echo.
echo Publicatie afgebroken. Geen succesvolle push bevestigd.
pause
endlocal
exit /b 1

:open_reset_after_push
set "USER_RESET_URL=https://kruin.github.io/graphlite/reset-cache.html?ogv=%APP_VERSION%&nocache=%RANDOM%%RANDOM%"
set "RESET_MARKER=.git\opengraph-reset-%APP_VERSION%.flag"
if exist "%RESET_MARKER%" (
  echo Reset-cache is voor %APP_VERSION% al eenmaal geopend.
  exit /b 0
)
echo Reset-cache wordt eenmaal automatisch geopend voor %APP_VERSION%.
start "" "%USER_RESET_URL%"
if errorlevel 1 (
  echo WAARSCHUWING: de browser kon niet automatisch worden geopend.
  echo Open handmatig: %USER_RESET_URL%
  exit /b 0
)
> "%RESET_MARKER%" echo %DATE% %TIME%
if errorlevel 1 echo WAARSCHUWING: resetmarkering kon niet worden geschreven.
exit /b 0
