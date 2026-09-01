@echo off
rem Compatibiliteitsnaam voor de lokale werkwijze van de gebruiker.
rem Alle server-, bronstand- en cachecontroles blijven in de ene echte starter.
call "%~dp0start_local_viewer.bat" %*
exit /b %errorlevel%
