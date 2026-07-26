# Source changes v2.0.0-rc.37

- Config begint met `Voorconfig`; `Toepassingen` volgt daarna.
- Insertie is een algemene capaciteit met onafhankelijke schakelaars voor LEX,
  SYNT en LOG.
- De knop `LEX + LOG aan` bereidt in één stap de combinatie voor die
  Bijwoorden nodig heeft.
- Bijwoorden kan pas worden ingeschakeld wanneer insertie op LEX én LOG actief
  is.
- Uitschakelen van LEX of LOG schakelt Bijwoorden automatisch uit en wist alle
  bijwoordstaat.
- Een ingeschakelde insertie-as voegt zonder toepassing geen inhoud toe.
- OPN, Legacy JSON en Config-snapshots bewaren
  `preconfig.insertion.{lex,synt,log}`.
- Import controleert ontbrekende insertiecapaciteiten vóór toepassingsdata
  wordt geladen.
- Vier volgende voorconfig-kandidaten zijn gedocumenteerd: verplaatsing, lege
  posities/sporen, asroutes en host/scope.
- De profiel- en Config-regressietests controleren de nieuwe
  afhankelijkheidsvolgorde.
- De bestaande startfout door de niet-bestaande README-helper
  `isActualCompactScreen()` is hersteld met de aanwezige viewportfunctie.
