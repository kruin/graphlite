# DOCUMENTATION_RULES

Regels voor projectdocumentatie, helpteksten en overdrachtsteksten.

## Actuele toestand

Documentatie beschrijft de actuele werking van OpenGraph Lite Viewer.

Gebruik formuleringen die direct uitleggen wat het systeem is en doet. Vermijd uitleg vanuit eerdere versies of eerdere ontwerpstappen.

## Geen projecthistoriek in gewone documentatie

Helpteksten, README, overdrachtsteksten en leidende projectdocumenten bevatten geen changelog, herstelverhaal of ontwikkelpad.

Vermijd formuleringen zoals:

```text
nieuw
vroeger
oude
verwijderd
niet langer
voorheen
```

Gebruik in plaats daarvan de huidige begrippen:

```text
Syntax tree              standaardweergave
Functional structure     standaard alternatieve weergave
LEX                       woordvolgorde en lexicale plaatsing
SYNT                      syntactische regels
LOG                       logische S-O-V-projectie
```

## Helpstructuur

Help gebruikt een boomnavigatie. De gebruiker kiest links een onderwerp; rechts staat alleen de tekst bij dat onderwerp.

Gebruik geen lang overzicht waarin alle helpcontent tegelijk onder elkaar staat.

Reserveer in Help ruimte voor een carousel die Open Graph Notation en tree notation als toepassing documenteert.

## Views en assen

Beschrijf views en assen als zelfstandige onderdelen.

Views:

```text
Syntax tree
Functional structure
```

Projectie-assen:

```text
LEX
SYNT
LOG
```

## Versies

Versienummers mogen in technische bestandsnamen, cache-links en publicatie-instructies staan.

Publieksgerichte tekst beschrijft de werking van de huidige versie, niet de weg ernaartoe.

## Archiefmateriaal

Release notes, oude screenshots en eerdere zips kunnen als archief bestaan, maar zijn geen leidende projectdocumentatie.
