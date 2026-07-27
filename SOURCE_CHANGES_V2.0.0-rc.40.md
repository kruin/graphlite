# Source changes v2.0.0-rc.40

## Volledige landscape-compositie

- Mobiel landschap gebruikt voortaan een eigen lagere, bredere MAX-layout.
- Het topmenu staat in twee compacte, volledig leesbare rijen.
- Menu, SVG en Play hebben ieder een gereserveerde verticale zone en
  overlappen elkaar niet.
- De werkelijk gerenderde SVG-rechthoek bepaalt de aspectratio en de
  clientcoördinaten; gereserveerde menu- en Play-ruimte telt niet als
  tekenruimte.

## Geen afgesneden assen

- De oude landscape-cover-zoom is verwijderd. Die vulde de breedte door de
  rastertop en de LOG-as buiten beeld te schuiven.
- MAX gebruikt nu een `contain`-fit van het volledige stabiele asgebied.
- Het raster begint op LEX, eindigt op SYNT en stopt op LOG; alle drie assen
  blijven tegelijk zichtbaar.
- De plattere celverhouding benut de brede viewport zonder semantische
  projecties af te snijden.

## Gelijke routes

- Een echte mobiele landscape-viewport gebruikt dezelfde schermvullende
  workspace als de desktop-simulatie van 844 × 390.
- Een oude `--main-grid-top`-offset kan de graph daardoor niet meer omlaag
  duwen.
- Dezelfde landschapregels blijven actief wanneer op een fysieke telefoon de
  Desktop-interface wordt geforceerd.

## Controle

- Nieuw: `tools/check_landscape_composition_runtime.js`.
- De echte Chromium-controle toetst desktopsimulatie, mobiele auto-detectie
  en geforceerde Desktop-interface.
- Per route worden Syntax en Functional getest op niet-overlappende zones,
  volledige LEX/SYNT/LOG-assen en voldoende rastervulling.
- `tools/check_mobile_layout_runtime.js` meet de rastervulling voortaan tegen
  de werkelijk beschikbare SVG-rechthoek.
