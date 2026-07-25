# Source changes · v2.0.0-rc.19

## Desktop standaard op MAX

Het hoofdwerkvlak vulde het browservenster al, maar de standaard-`viewBox`
bevatte een groot onzichtbaar stabiliteitskader. Op een normaal
desktopvenster werd de zichtbare graph daardoor tot minder dan de helft
teruggeschaald en waren vooral regel-, as- en tracelabels onleesbaar klein.

Config → Boom heeft nu twee expliciete MAX-defaults:

```text
Boomruimte  = MAX · groot letterbeeld / lage boom
Hoofdvenster = MAX · volledig venster benut
```

## MAX-kadrering

- Raster, hulplabel en het oude onzichtbare stabiliteitskader tellen niet mee
  bij de MAX-fit.
- Alleen de werkelijk getekende boom en named projections bepalen het kader.
- Dat inhoudskader wordt aan de actuele desktop-aspectratio aangepast en
  gebruikt de volledige resterende breedte en hoogte onder de twee
  hoofdmenubalken.
- De desktop-SVG-fontschaal is in MAX `1.70`.
- Het zichtbare desktop-topmenu gebruikt geen 0,70-rem-tekst meer.

Tijdens Play wordt het complete MAX-inhoudskader bewaard. Daardoor blijven
schaal en positie stabiel terwijl achtereenvolgens LOG, ruimte, horizontale
LEX-projectie en de LEX-verplaatsingen verschijnen.

## Configmigratie

Een lokaal opgeslagen Config-snapshot uit een oudere release mag de nieuwe
leesbare default niet ongemerkt terugzetten naar `auto/window`. Bij de eerste
start van rc.19 worden daarom `Boomruimte` en `Hoofdvenster` op MAX gezet.
Daarna blijven expliciet in rc.19 opgeslagen keuzes gewoon bewaard.

## Regressiecontrole

`tools/check_desktop_max_view.py` controleert:

- dat beide MAX-opties als eerste optie en als state-default zijn ingesteld;
- dat de desktop-fontschaal groot genoeg is;
- dat het lege stabiliteitskader niet aan de MAX-fit deelneemt;
- dat Play hetzelfde MAX-inhoudskader gebruikt;
- en dat de desktopcanvasbreedte en -hoogte het venster vullen.
