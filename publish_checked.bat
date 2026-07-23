@echo off
setlocal EnableExtensions DisableDelayedExpansion

cd /d "%~dp0"

set "PUSH_DONE=0"
set "RESET_DELAY_SECONDS=30"

echo.
echo ==============================
echo OpenGraph Lite Viewer - publiceren
echo ==============================
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo FOUT: git is niet gevonden in PATH.
    goto :failed
)

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
    echo FOUT: deze map is geen Git repository.
    echo Map: %CD%
    goto :failed
)

for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"
if "%BRANCH%"=="" (
    echo FOUT: kon actieve branch niet bepalen.
    goto :failed
)

echo Huidige branch: %BRANCH%
if /I not "%BRANCH%"=="main" (
    echo WAARSCHUWING: je zit niet op main. GitHub Pages gebruikt meestal main/root.
)
echo.

for %%f in (index.html viewer.html viewer.js styles.css reset-cache.html) do (
    if not exist "%%f" (
        echo FOUT: %%f ontbreekt in deze map.
        goto :failed
    )
)

set "APP_VERSION="
if not exist "VERSION.txt" (
    echo FOUT: VERSION.txt ontbreekt.
    goto :failed
)
set /p APP_VERSION=<VERSION.txt
if "%APP_VERSION%"=="" (
    echo FOUT: VERSION.txt is leeg.
    goto :failed
)
set "RELEASE_ZIP=OpenGraph_Lite_Viewer_%APP_VERSION%_full_source.zip"
echo App-versie: %APP_VERSION%
echo Release-zip: %RELEASE_ZIP%
echo.

call check_release.bat
if errorlevel 1 (
    echo FOUT: releasecontrole mislukt.
    goto :failed
)

echo.
echo Git status voor %APP_VERSION% - sitebestanden:
echo Release-zips en lokale mobile-testbestanden worden genegeerd; die horen niet in de Pages-root.

set "STATUS_ALL=%TEMP%\opengraph_status_all_%RANDOM%%RANDOM%.txt"
set "STATUS_SITE=%TEMP%\opengraph_status_site_%RANDOM%%RANDOM%.txt"

git status --short --untracked-files=normal > "%STATUS_ALL%"
findstr /V /I /R /C:"OpenGraph_Lite_Viewer_v.*\.zip" /C:"local-mobile-test\.js" /C:"local-mobile-test\.html" "%STATUS_ALL%" > "%STATUS_SITE%"

type "%STATUS_SITE%"
echo.

for %%A in ("%STATUS_SITE%") do set "STATUS_SIZE=%%~zA"
if "%STATUS_SIZE%"=="0" (
    echo Geen wijzigingen om te committen voor %APP_VERSION%.
    del "%STATUS_ALL%" >nul 2>nul
    del "%STATUS_SITE%" >nul 2>nul
    goto :no_push
)

del "%STATUS_ALL%" >nul 2>nul
del "%STATUS_SITE%" >nul 2>nul

set /p "COMMITMSG=Geef commit message: "
if "%COMMITMSG%"=="" (
    echo.
    echo Geen commit message opgegeven. Afgebroken.
    goto :failed
)

echo.
echo Staging tracked wijzigingen en verwijderingen voor %APP_VERSION%...
git add -u -- .
if errorlevel 1 (
    echo FOUT: git add -u mislukt.
    goto :failed
)

echo Verwijder release-zips en lokale testhulp uit Git-index als ze eerder getrackt waren...
for /f "delims=" %%f in ('git ls-files "OpenGraph_Lite_Viewer_v*.zip"') do (
    git rm --cached -- "%%f" >nul
)
for %%f in (local-mobile-test.js local-mobile-test.html) do (
    git ls-files --error-unmatch "%%f" >nul 2>nul
    if not errorlevel 1 git rm --cached -- "%%f" >nul
)

echo Staging nieuwe niet-genegeerde bestanden voor %APP_VERSION%...
for /f "delims=" %%f in ('git ls-files --others --exclude-standard') do (
    echo %%f| findstr /I /R /C:"^OpenGraph_Lite_Viewer_v.*\.zip$" /C:"^local-mobile-test\.js$" /C:"^local-mobile-test\.html$" >nul
    if errorlevel 1 (
        git add -- "%%f"
        if errorlevel 1 (
            echo FOUT: git add mislukt voor %%f
            goto :failed
        )
    )
)

git diff --cached --quiet
if not errorlevel 1 (
    echo Geen staged wijzigingen om te committen.
    goto :no_push
)

echo.
echo Committen...
git commit -m "%COMMITMSG%"
if errorlevel 1 (
    echo FOUT: git commit mislukt.
    goto :failed
)

echo.
echo Push naar origin/%BRANCH% ...
git push -u origin "%BRANCH%"
if errorlevel 1 (
    echo FOUT: git push mislukt.
    goto :failed
)
set "PUSH_DONE=1"

echo.
echo Push geslaagd.
echo Branch: %BRANCH%
echo Commit : %COMMITMSG%

goto :automatic_reset

:no_push
echo.
echo Geen push uitgevoerd; cache-reset wordt niet geopend.
goto :show_urls

:automatic_reset
set "USER_RESET_URL=https://kruin.github.io/graphlite/reset-cache.html?ogv=%APP_VERSION%^&nocache=%RANDOM%%RANDOM%"
set "USER_INDEX_URL=https://kruin.github.io/graphlite/index.html?ogv=%APP_VERSION%^&nocache=%RANDOM%%RANDOM%"

set "RESET_STATE_DIR=%LOCALAPPDATA%\OpenGraphLiteViewer"
if not defined LOCALAPPDATA set "RESET_STATE_DIR=%TEMP%\OpenGraphLiteViewer"
if not exist "%RESET_STATE_DIR%" mkdir "%RESET_STATE_DIR%" >nul 2>nul
set "RESET_MARKER=%RESET_STATE_DIR%\last-reset-version.txt"
set "LAST_RESET_VERSION="
if exist "%RESET_MARKER%" set /p LAST_RESET_VERSION=<"%RESET_MARKER%"

if /I "%LAST_RESET_VERSION%"=="%APP_VERSION%" (
    echo.
    echo Cache-reset voor %APP_VERSION% is op deze computer al eenmalig geopend.
    goto :show_urls
)

where powershell.exe >nul 2>nul
if errorlevel 1 (
    echo.
    echo WAARSCHUWING: PowerShell ontbreekt; resetpagina kan niet automatisch worden geopend.
    echo Open de onderstaande reset-URL handmatig.
    goto :show_urls
)

echo.
echo Cache-reset voor %APP_VERSION% wordt na %RESET_DELAY_SECONDS% seconden automatisch eenmalig geopend.
set "PS_RESET_COMMAND=Start-Sleep -Seconds %RESET_DELAY_SECONDS%; Start-Process '%USER_RESET_URL%'; Set-Content -LiteralPath '%RESET_MARKER%' -Value '%APP_VERSION%' -Encoding ASCII"
start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "%PS_RESET_COMMAND%"
if errorlevel 1 (
    echo WAARSCHUWING: automatisch openen kon niet worden gestart.
    echo Open de onderstaande reset-URL handmatig.
) else (
    echo Geen bevestigingsvraag nodig. De reset loopt alleen na een geslaagde push en maximaal eenmaal per versie.
)

:show_urls
if not defined USER_RESET_URL set "USER_RESET_URL=https://kruin.github.io/graphlite/reset-cache.html?ogv=%APP_VERSION%^&nocache=HANDMATIG"
if not defined USER_INDEX_URL set "USER_INDEX_URL=https://kruin.github.io/graphlite/index.html?ogv=%APP_VERSION%"

echo.
echo GitHub Pages reset:
echo %USER_RESET_URL%
echo.
echo GitHub Pages index:
echo %USER_INDEX_URL%
echo.
echo Klaar.
echo.
echo Druk op een toets om dit venster te sluiten.
pause >nul
endlocal
exit /b 0

:failed
echo.
echo Publicatie afgebroken. Controleer de melding hierboven.
echo Druk op een toets om dit venster te sluiten.
pause >nul
endlocal
exit /b 1
