@echo off
setlocal

cd /d "%~dp0"

echo.
echo ==============================
echo Commit en push
echo ==============================
echo.

for /f "delims=" %%b in ('git branch --show-current') do set BRANCH=%%b

if "%BRANCH%"=="" (
    echo Kon actieve branch niet bepalen.
    exit /b 1
)

echo Huidige branch: %BRANCH%
echo.

set /p COMMITMSG=Geef commit message: 

if "%COMMITMSG%"=="" (
    echo.
    echo Geen commit message opgegeven. Afgebroken.
    exit /b 1
)

echo.
git status
echo.

git add .
if errorlevel 1 (
    echo git add mislukt.
    exit /b 1
)

git commit -m "%COMMITMSG%"
if errorlevel 1 (
    echo git commit mislukt of er was niets te committen.
    exit /b 1
)

git push origin %BRANCH%
if errorlevel 1 (
    echo git push mislukt.
    exit /b 1
)

echo.
echo Klaar.
echo Branch: %BRANCH%
echo Commit : %COMMITMSG%
echo.

endlocal
