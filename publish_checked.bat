@echo off
setlocal EnableExtensions DisableDelayedExpansion

cd /d "%~dp0"

echo.
echo ==============================
echo OpenGraph publish - checked
echo ==============================
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo FOUT: git is niet gevonden in PATH.
    exit /b 1
)

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
    echo FOUT: deze map is geen Git repository.
    echo Map: %CD%
    exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"
if "%BRANCH%"=="" (
    echo FOUT: kon actieve branch niet bepalen.
    exit /b 1
)

echo Huidige branch: %BRANCH%
if /I not "%BRANCH%"=="main" (
    echo WAARSCHUWING: je zit niet op main. GitHub Pages gebruikt meestal main/root.
)
echo.

for %%f in (index.html viewer.html viewer.js styles.css reset-cache.html) do (
    if not exist "%%f" (
        echo FOUT: %%f ontbreekt in deze map.
        exit /b 1
    )
)

set "APP_VERSION=v1.0.7"
set "RELEASE_ZIP=OpenGraph_Lite_Viewer_v1.0.7.zip"
echo App-versie: %APP_VERSION%
echo Release-zip: %RELEASE_ZIP%
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo WAARSCHUWING: node is niet gevonden; JavaScript syntax-check wordt overgeslagen.
) else (
    echo Controle: node --check viewer.js
    node --check "viewer.js"
    if errorlevel 1 (
        echo FOUT: viewer.js bevat een JavaScript syntaxfout. Niet committen.
        exit /b 1
    )
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
    goto :after_push_info
)

del "%STATUS_ALL%" >nul 2>nul
del "%STATUS_SITE%" >nul 2>nul

set /p "COMMITMSG=Geef commit message: "
if "%COMMITMSG%"=="" (
    echo.
    echo Geen commit message opgegeven. Afgebroken.
    exit /b 1
)

echo.
echo Staging tracked wijzigingen en verwijderingen voor %APP_VERSION%...
git add -u -- .
if errorlevel 1 (
    echo FOUT: git add -u mislukt.
    exit /b 1
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
            exit /b 1
        )
    )
)

git diff --cached --quiet
if not errorlevel 1 (
    echo Geen staged wijzigingen om te committen.
    goto :after_push_info
)

echo.
echo Committen...
git commit -m "%COMMITMSG%"
if errorlevel 1 (
    echo FOUT: git commit mislukt.
    exit /b 1
)

echo.
echo Push naar origin/%BRANCH% ...
git push -u origin "%BRANCH%"
if errorlevel 1 (
    echo FOUT: git push mislukt.
    exit /b 1
)

:after_push_info
echo.
echo Klaar.
echo Branch: %BRANCH%
if defined COMMITMSG echo Commit : %COMMITMSG%
echo.
echo Reset-cache heeft zin als browser/PWA-cache nog oude assets toont.
echo Het wist GEEN GitHub Pages deploy-cache op afstand; het opent alleen de client-resetpagina.
echo Wacht na push meestal 30-90 seconden tot GitHub Pages klaar is.
echo.
set "USER_RESET_URL=https://kruin.github.io/graphlite/reset-cache.html?ogv=%APP_VERSION%^&nocache=%RANDOM%%RANDOM%"
set "USER_INDEX_URL=https://kruin.github.io/graphlite/index.html?ogv=%APP_VERSION%^&nocache=%RANDOM%%RANDOM%"
echo GitHub Pages reset:
echo %USER_RESET_URL%
echo.
echo GitHub Pages index:
echo %USER_INDEX_URL%
echo.
choice /C JN /M "Reset-cache openen"
if errorlevel 2 goto :done
if errorlevel 1 start "" "%USER_RESET_URL%"

:done
echo.
endlocal
