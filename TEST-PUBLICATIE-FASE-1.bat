@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "PYTHONDONTWRITEBYTECODE=1"

if not exist "public-phase-1.html" goto :not_extracted
if not exist "start_local_viewer.py" goto :not_extracted

py.exe -3 -c "import sys" >nul 2>nul
if not errorlevel 1 goto :run_py

python.exe -c "import sys" >nul 2>nul
if not errorlevel 1 goto :run_python

echo.
echo FOUT: Python 3 is niet gevonden.
echo Installeer Python 3 en start deze BAT daarna opnieuw.
goto :failed

:run_py
py.exe -3 start_local_viewer.py --no-browser
if errorlevel 1 goto :failed
goto :open_phase

:run_python
python.exe start_local_viewer.py --no-browser
if errorlevel 1 goto :failed

:open_phase
echo.
echo Open lokale test: publicatiefase 1 - Hond bijt man
start "" "http://127.0.0.1:8088/public-phase-1.html?localtest=%RANDOM%%RANDOM%"
exit /b 0

:not_extracted
echo.
echo FOUT: pak de ZIP eerst volledig uit.
echo Start deze BAT daarna vanuit de uitgepakte projectmap.

:failed
echo.
echo De lokale publicatietest is niet geopend.
echo.
pause
exit /b 1
