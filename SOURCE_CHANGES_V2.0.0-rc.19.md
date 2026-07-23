# SOURCE_CHANGES_V2.0.0-rc.19

## Doel

Projecties groeien tijdens Play/Groei direct mee met de centrale structuur.

## Gewijzigd

- Nieuwe Config-optie onder `Boom → Weergave`:
  - `Projecties groeien direct mee`;
  - Engels: `Projections grow immediately`;
  - standaard ingeschakeld.
- Groeimodus is nu beschikbaar in:
  - Alle;
  - Bron/Geen met iedere gekozen assencombinatie;
  - LEX;
  - SYNT;
  - LOG.
- LEX:
  - projectielijn en projectiemerker verschijnen zodra de bronknoop zichtbaar is;
  - LEX-Wissels blijven vervolgstappen na de volledige structurele groei.
- SYNT/FT-regelprojectie:
  - iedere regel verschijnt tegelijk met de bijbehorende centrale categorieknoop.
- LOG:
  - S, O en V verschijnen afzonderlijk wanneer hun bronknoop zichtbaar wordt;
  - markerposities blijven vanaf hun eerste verschijning definitief.
- Wisselen van projectiekeuze beëindigt de actieve groeimodus niet.
- Compatibiliteitsmodus:
  - checkbox uit: projecties verschijnen na voltooiing van de structuur;
  - checkbox aan: directe meegroei, de standaard.

## Ongewijzigd

- Syntax blijft de eerste centrale view.
- FT blijft de tweede centrale view.
- LOG blijft uitsluitend de zuidas.
- Projectiewissels wijzigen viewBox, pan, zoom of schaal niet.
- LEX-Wissels wijzigen de centrale Syntax- of FT-structuur niet.
