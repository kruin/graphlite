# SOURCE_CHANGES v2.0.0-rc.21

## Herstel

- Mobile raster niet langer verbreed tot de aspectratio van het volledige canvas.
- Rastergrens volgt op compacte fysieke schermen uitsluitend centrale boom en uiteinden van zichtbare projectielijnen.
- Geldt op een telefoon voor Automatisch, Desktop, Mobiel staand en Mobiel liggend.
- Desktoplayout en desktopraster uit rc.20 blijven ongewijzigd.
- ViewBox, schaal, pan/zoom en projectiestabiliteit zijn niet gewijzigd.

## Techniek

- Nieuwe detectie `isActualCompactScreen()` gebruikt de fysieke `visualViewport`/browserafmetingen en staat los van de geforceerde interfacekeuze.
- Nieuwe `projectionGridBoxForViewport()` voorkomt aspectratio-opvulling van `state.lastGridBox` op compacte schermen.
