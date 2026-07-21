@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo FOUT: node ontbreekt.
  exit /b 1
)
node --check viewer.js
if errorlevel 1 exit /b 1
where python >nul 2>nul
if errorlevel 1 (
  echo FOUT: python ontbreekt.
  exit /b 1
)
python tools\check_release.py
exit /b %errorlevel%
