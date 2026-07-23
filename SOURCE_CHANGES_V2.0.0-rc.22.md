# SOURCE_CHANGES v2.0.0-rc.22

## Mobile landscape

- Automatische mobile-detectie gebruikt niet meer uitsluitend `max-width: 760px`.
- Een coarse/touch-scherm blijft mobile wanneer de korte viewportzijde maximaal 760 CSS-pixels is.
- Een telefoon van 844×390 wordt daardoor correct als compact landscape herkend.
- `actual-compact-screen`, `actual-compact-landscape` en `actual-compact-portrait` worden als runtimeklassen gezet.

## Maximale landscape-vulling

- Het compacte landscapeprofiel maakt de graph platter en breder.
- De tweerijige topbalk blijft behouden maar gebruikt minder verticale ruimte.
- De Play-balk en knoppen zijn in compact landscape kleiner.
- Portrait en echte desktop behouden hun bestaande afmetingen.

## Oriëntatiewissel

- `resize`, `visualViewport.resize` en `orientationchange` gebruiken één herfitprocedure.
- Na draaien volgt een directe fit en een tweede fit nadat browserchrome en safe-area zijn gestabiliseerd.
- Oude touch-, pan- en pinchstatus wordt gewist.

## Stabiliteit

- Syntax en FT blijven dezelfde viewport gebruiken.
- Projectiewissels blijven zonder horizontale of verticale sprong.
- Desktopgeometrie is niet gewijzigd.
