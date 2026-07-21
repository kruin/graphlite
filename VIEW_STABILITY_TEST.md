# VIEW_STABILITY_TEST

Versie: v2.0.0-rc.4

## Matrix

Getest in Chromium voor:

- desktop 1440 × 1000;
- mobiel staand 390 × 844;
- mobiel liggend 844 × 390;
- centrale view Syntax;
- centrale view FT;
- projecties Alle, Bron, LEX, SYNT en LOG.

## Resultaat

Voor iedere viewport en centrale view:

- `unique_viewboxes = 1`;
- SVG-kader stabiel;
- centrale boom stabiel;
- geen horizontale verschuiving;
- geen verticale verschuiving;
- geen schaalverschil.

De test gebruikte dezelfde HTML, CSS, JavaScript en configuratiebestanden als het bronpakket.
