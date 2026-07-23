# SOURCE_CHANGES_V2.0.0-rc.20

## Doel

Het grid en de graph passen hun geometrie aan de werkelijke schermverhouding aan, zodat portrait, landscape en desktop zoveel mogelijk van de beschikbare ruimte gebruiken.

## Wijzigingen

### Continue viewportcurve

De vaste presets voor mobile portrait, mobile landscape en desktop zijn vervangen door één continue berekening op basis van de actuele verhouding van `canvasWrap`.

De automatische profielberekening stuurt:

- horizontale celafstand `cellX`;
- verticale celafstand `cellY`;
- fontscale;
- afstand tot LEX- en SYNT-as;
- minimale westaspositie;
- maximale breedte van de SYNT-/FT-regelboxen.

Portrait wordt smaller/hoger; landscape breder/lager; desktop volgt de actuele vensterverhouding.

### Raster en viewBox

- `stableProjectionViewBox()` wordt aan de canvasverhouding aangepast.
- Het dynamische raster gebruikt dezelfde verhouding.
- De inhoudsgeometrie wordt vóór de aspectcorrectie aangepast, zodat aspectmatching niet alleen lege rasterbanden toevoegt.
- Alle projectiecombinaties en beide centrale views delen binnen één viewport hetzelfde profiel.

### Herfit

Resize en oriëntatiewissel wissen een handmatige fit en voeren één volledige herberekening uit. Projectiewissels zelf blijven stabiel.

## Ongewijzigd

- Syntax blijft de eerste centrale view.
- FT blijft de tweede centrale view.
- LOG blijft uitsluitend de zuidas.
- Raster staat standaard aan.
- Projecties groeien standaard direct mee.
- LEX-Wissels volgen na de structurele groei.
