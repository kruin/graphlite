# SOURCE_CHANGES_V2.0.0-rc.13

## Git-uploadprocedure

- De bevestigingsvraag `Reset-cache openen` is verwijderd.
- De resetpagina opent automatisch na een geslaagde `git push`.
- Zonder wijzigingen, zonder staged wijzigingen of na een mislukte push wordt geen reset gestart.
- De reset opent maximaal eenmaal per versie op dezelfde computer.
- De lokale marker staat buiten de repository in `%LOCALAPPDATA%\OpenGraphLiteViewer\last-reset-version.txt`.
- De automatische opening wordt kort uitgesteld zodat GitHub Pages de push kan verwerken.
- `RELEASE_ZIP` wordt voortaan uit `VERSION.txt` opgebouwd in plaats van hard gecodeerd.

## Ongewijzigd

- Mobile full view en automatische interfacekeuze uit rc.12 blijven behouden.
- Syntax is de eerste centrale view; FT de tweede.
- LOG blijft uitsluitend de zuidas.
- Standaard zijn LEX + SYNT + LOG zichtbaar.
- De topmenustructuur en dunne lijnhiërarchie blijven gelijk.
