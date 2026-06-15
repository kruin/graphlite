@echo off
setlocal
cd /d "%~dp0"
set PYTHONDONTWRITEBYTECODE=1
echo.
echo OpenGraph Lite Viewer v4464
echo.
echo Start lokale server op alle netwerkadapters: http://0.0.0.0:8088
echo PC lokaal:   http://127.0.0.1:8088/reset-cache.html?v4464
echo Telefoon:    gebruik http://PC-IP:8088  ^(zelfde wifi, geen gastnetwerk-isolatie^)
echo.
echo Mogelijke IPv4-adressen van deze PC:
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /R /C:"IPv4.*:"') do echo   %%A
echo.
echo Gebruik 8088. Deze server stuurt no-cache headers mee.
echo Bij oude PWA/cache: reset-cache.html wordt automatisch geopend.
echo.
start "" cmd /c "timeout /t 2 /nobreak >nul && start "" http://127.0.0.1:8088/reset-cache.html?v4464"
where py >nul 2>nul
if %errorlevel%==0 (
  py server_nocache.py
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  python server_nocache.py
  goto :eof
)
echo FOUT: Python niet gevonden. Installeer Python of publiceer deze map via GitHub Pages.
pause
