# Bronwijzigingen v3.1.0-rc.10 · build 38

Bronstand: `v3.1.0-rc.10-horizontal-lex-start-20260905.38`.

- Iedere nieuwe paginalaad normaliseert de LEX-startstand naar een verticale
  as aan West of Oost.
- Een bewaarde West-keuze blijft West; Oost blijft Oost.
- Een bewaarde Noord- of Zuid-keuze start voortaan op Oost.
- De genormaliseerde waarde wordt ook teruggeschreven in de lokale
  Config-snapshot, zodat Noord/Zuid niet telkens opnieuw wordt ingelezen.
- Noord en Zuid blijven tijdens de actieve sessie beschikbaar.
- De regel geldt identiek voor `localserver.bat` en GitHub Pages.
