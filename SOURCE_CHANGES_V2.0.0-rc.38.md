# Source changes v2.0.0-rc.38

## README op mobiel

- Hersteld dat de onderwerpenlijst door conflicterende oude
  `grid-template-rows`-regels tot 0 px werd ingeklapt.
- De definitieve `data-help-layout`-selectors hebben nu voldoende
  specificiteit.
- Portret toont lijst boven tekst; een echte telefoon in landschap toont lijst
  links en tekst rechts.
- De scheidingsbalk wijzigt de paneelhoogte of -breedte weer daadwerkelijk.
- Een eerder bewaarde paneelmaat wordt niet meer tot het minimum teruggebracht
  wanneer README tijdens initialisatie verborgen is.

## Mobiele en geforceerde Desktop-MAX

- Nieuwe fysieke handheld-detectie gebruikt schermmaat plus touch/coarse
  pointer en staat los van de gekozen interfacevorm.
- Daardoor blijft mobiele MAX actief wanneer een telefoon de Desktop-interface
  forceert.
- Mobiele MAX focust de stabiele Syntax/Functional-unie van het asgebied:
  breedtevullend in portret en met extra zoom in landschap, zodat ook de brede
  schermruimte wordt benut.
- Pan en pinch-zoom blijven beschikbaar voor labels en boxen buiten de eerste
  focus.

## Raster tot aan de assen

- De dynamische rasterbox gebruikt LEX als linkergrens, SYNT als rechtergrens
  en LOG als ondergrens.
- Begin- en eindstappen gebruiken `ceil` en een strikte bovengrens; er wordt
  geen extra halve rasterstap buiten de assen getekend.
- Het raster kan per actuele view verschillen, terwijl de mobiele MAX-viewBox
  bij Syntax ↔ Functional stabiel blijft.

## Controles

- Nieuw: `tools/check_mobile_layout_rc38.py`.
- Nieuw: `tools/check_mobile_layout_runtime.js`.
- Nieuw handmatig protocol: `RC38_MOBILE_LAYOUT_TEST.md`.
- De runtimecontrole gebruikt echte mobiele viewport-, touch- en
  geforceerde-Desktop-scenario’s en test ook de README-resizer.
