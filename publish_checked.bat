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

set "APP_VERSION=v1.0"
set "RELEASE_ZIP=OpenGraph_Lite_Viewer_v1.0.zip"
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
echo Release-zips OpenGraph_Lite_Viewer_v*.zip worden hier genegeerd; die horen niet in de Pages-root.
git status --short -- . ":(exclude)OpenGraph_Lite_Viewer_v*.zip"
echo.

git status --short -- . ":(exclude)OpenGraph_Lite_Viewer_v*.zip" | findstr /R "." >nul
if errorlevel 1 (
    echo Geen wijzigingen om te committen voor %APP_VERSION%.
    goto :after_push_info
)

set /p "COMMITMSG=Geef commit message: "
if "%COMMITMSG%"=="" (
    echo.
    echo Geen commit message opgegeven. Afgebroken.
    exit /b 1
)

echo.
echo Staging wijzigingen voor %APP_VERSION%...
git add -A -- . ":(exclude)OpenGraph_Lite_Viewer_v*.zip"
if errorlevel 1 (
    echo FOUT: git add mislukt.
    exit /b 1
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
set "RESET_URL=https://kruin.github.io/graphlite/reset-cache.html?ogv=%APP_VERSION%^&nocache=%RANDOM%%RANDOM%"
set "INDEX_URL=https://kruin.github.io/graphlite/index.html?ogv=%APP_VERSION%^&nocache=%RANDOM%%RANDOM%"
echo Reset-cache URL:
echo %RESET_URL%
echo.
echo Daarna eventueel:
echo %INDEX_URL%
echo.
choice /C JN /M "Reset-cache pagina nu openen"
if errorlevel 2 goto :done
start "" "%RESET_URL%"

:done
echo.
endlocal
