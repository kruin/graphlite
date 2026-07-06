@echo off
setlocal EnableExtensions DisableDelayedExpansion

cd /d "%~dp0"

echo.
echo ==============================
echo Commit en push - checked
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

if not exist "index.html" (
    echo FOUT: index.html ontbreekt in deze map.
    exit /b 1
)
if not exist "viewer.js" (
    echo FOUT: viewer.js ontbreekt in deze map.
    exit /b 1
)
if not exist "styles.css" (
    echo FOUT: styles.css ontbreekt in deze map.
    exit /b 1
)

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
echo Git status:
git status --short
echo.

git status --short | findstr /R "." >nul
if errorlevel 1 (
    echo Geen wijzigingen om te committen.
    exit /b 0
)

set /p "COMMITMSG=Geef commit message: "
if "%COMMITMSG%"=="" (
    echo.
    echo Geen commit message opgegeven. Afgebroken.
    exit /b 1
)

echo.
echo Staging wijzigingen...
git add -A
if errorlevel 1 (
    echo FOUT: git add mislukt.
    exit /b 1
)

git diff --cached --quiet
if not errorlevel 1 (
    echo Geen staged wijzigingen om te committen.
    exit /b 0
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

echo.
echo Klaar.
echo Branch: %BRANCH%
echo Commit : %COMMITMSG%
echo.
echo Open na deploy eventueel:
echo https://kruin.github.io/graphlite/reset-cache.html

echo.
endlocal
