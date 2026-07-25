# Source changes · v2.0.0-rc.16

## Actieve README-carrousel

- De intro `Boom, gek` bevat nu drie echte SVG-slides.
- Pijlknoppen, stapbolletjes en de pijltoetsen links/rechts zijn actief.
- De slides tonen traditionele zinsbomen, LOG-minorafstand en de gefaseerde
  LOG → ruimte → LEX-presentatie.

## Externe introlink

- De zoeklink opent via een gebruikersklik in een afzonderlijk
  browservenster.
- Als een browser het venster blokkeert, blijft `target="_blank"` als
  veilige terugval actief.
- De hoofdapp wordt niet verlaten.

## Gefaseerde Play-presentatie

Na de bestaande centrale boomopbouw:

1. verschijnt de LOG-as met majors en minors;
2. worden LOG-afgeleide lege rijen op LEX gereserveerd;
3. wordt de lexicale inhoud op die rijen geplaatst.

Expliciete LEX-Wissels en de overige projectiepanelen volgen daarna.

De volgorde staat in `structure-config.html` als:

```html
data-play-phases="LOG SPACE LEX"
data-play-space-mode="reserve-empty-lex-rows"
```

## Documentatie

- `README.md` is de Engelse hoofdversie.
- `LEESMIJ.md` is de Nederlandse hoofdversie.
- Beide documenten beschrijven de drie carrouselslides en de Play-fasen.
