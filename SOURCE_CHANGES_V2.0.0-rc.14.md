# Source changes · v2.0.0-rc.14

## LOG-slotafstand

- `structure-config.html` bevat een normatieve `opengraph-log-config`.
- `S`, `O` en `V` zijn LOG-majors; bijwoorden zijn LOG-minors.
- Iedere minor vergroot de afstand tussen de begrenzende majors met één vast
  slot.
- De LOG-volgorde bepaalt de neutrale LEX-rijen.
- De voorbeeldzin valideert de uitkomst en bepaalt de layout niet.

## Viewer

- LOG toont majors, minors, slotnummers en actuele majorafstanden.
- LEX toont de LOG-afgeleide basis vóór topic-/V2-Wissels.
- De configuratie heeft een expliciete keuze voor het LOG-interval.
- De vroegere hostkeuze blijft alleen als scope-/compatibiliteitsmetadata.
- OPN- en Legacy JSON-export bewaren interval, sequentie en afstanden.

## Voorbeelden en tests

- De twee meervoudige bijwoordvoorbeelden annoteren hun minors expliciet als
  `O-V`.
- `tools/check_log_slot_distance.py` controleert de afstandsinvariant.
- `projectie-master-spec.md` is de normatieve specificatie.
