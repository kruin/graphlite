@echo off
if not exist "%~dp0start_local_viewer.bat" (
  echo.
  echo FOUT: pak de gedownloade ZIP eerst volledig uit.
  echo start_local_viewer.bat ontbreekt naast deze compatibiliteitsstarter.
  echo.
  pause
  exit /b 1
)
call "%~dp0start_local_viewer.bat"
exit /b %errorlevel%
