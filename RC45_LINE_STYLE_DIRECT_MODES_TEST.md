# Handmatige controle — lijnbeeld en directe plaatsingsmodi

Source build:
`v2.0.0-rc.45-grid-style-direct-modes-eol-20260802.2`.

## Lijnbeeld

- [ ] Open Language Tree met LEX, SYNT en LOG zichtbaar.
- [ ] Het raster tussen de buitenassen is duidelijk leesbaar.
- [ ] Kies onder `Config → Beeld → Lijnbeeld` Rasterlijnen `licht`, `normaal`
  en `zwaar`; het lijngewicht verandert zonder knopen te verplaatsen.
- [ ] Herhaal dit voor Projectielijnen en Boxlijnen.
- [ ] Kies andere kleuren voor LEX, SYNT en LOG; de overeenkomstige assen,
  projectielijnen en boxen volgen elk hun eigen kleur.
- [ ] Kies een rasterkleur; alleen het neutrale raster verandert.
- [ ] Sla Config op, herlaad en controleer dat alle zeven keuzes terugkomen.

## Plaatsingsmodi

- [ ] Open het menu Language Tree; Language Tree staat als primaire keuze
  boven Greedy Grow en Random.
- [ ] Kies Greedy Grow; zin-, projectie- en LOG-bediening verdwijnen en de
  directe OGN-illustratie verschijnt.
- [ ] Gebruik `→`, `←`, `Play` en `Reset`; iedere voorwaartse stap schrijft
  exact één knoop en geen twee knopen delen een rij of kolom.
- [ ] Kies Random en herhaal de bediening.
- [ ] Doe in Random één stap terug en weer vooruit; dezelfde knoop keert terug.
- [ ] Kies Random Reset; een nieuwe seed kan een ander groeibeeld geven.
- [ ] Keer terug naar Language Tree; zin, view, projecties en LOG-volgorde zijn
  weer beschikbaar en de taalboomdata zijn niet gewijzigd.

## Publicatie en tekstnormalisatie

- [ ] `python tools\normalize_text_files.py` meldt OK.
- [ ] Een bestand met een extra lege EOF-regel wordt door
  `python tools\normalize_text_files.py --write` hersteld tot exact één EOL.
- [ ] `publish_checked.bat` toont geen terugkerende
  `LF will be replaced by CRLF`-reeks voor projectbestanden.
- [ ] `python tools\check_publication_carousel.py` meldt OK; de Greedy-engine
  en afgeleide publicatieslide zijn dus niet uit elkaar gelopen.
