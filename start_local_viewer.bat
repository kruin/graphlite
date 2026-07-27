@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "PYTHONDONTWRITEBYTECODE=1"

if not exist "VERSION.txt" goto :not_extracted
if not exist "server_nocache.py" goto :not_extracted
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
py.exe -3 start_local_viewer.py
if errorlevel 1 goto :failed
exit /b 0

:run_python
python.exe start_local_viewer.py
if errorlevel 1 goto :failed
exit /b 0

:not_extracted
echo.
echo FOUT: de volledige viewerbestanden staan niet naast deze BAT.
echo Pak de gedownloade ZIP eerst volledig uit en start de BAT vanuit die map.
goto :failed

:failed
echo.
echo Lokale viewer is niet geopend. Lees de concrete fout hierboven.
echo.
pause
exit /b 1
