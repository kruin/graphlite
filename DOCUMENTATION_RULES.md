# DOCUMENTATION_RULES

Regels voor projectdocumentatie, helpteksten en overdrachtsteksten.

## Actuele toestand

Documentatie beschrijft de actuele werking van OpenGraph Lite Viewer.

Gebruik geen projecthistoriek, herstelverhaal of ontwikkelpad in gewone documentatie.

## Kernvolgorde

Leg begrippen in deze volgorde uit:

```text
Open Graph Notation
Gridregel
Projectiemechanisme
Volgordelijk schrijven
Projectiemerkers
West-as
Zuid-as
Named projections
Tree notation
Views
Taalacties
```

Open Graph Notation staat op zichzelf. Tree notation is een toepassing, niet de definitie van Open Graph Notation.

## Termen

Gebruik deze termen consequent.

```text
source node              bronknoop
projection line          projectielijn
projection marker        projectiemerker
assumed west axis        veronderstelde west-as
assumed south axis       veronderstelde zuid-as
named projection         named projection
Syntax tree              Syntax tree
Functional structure     Functional structure
LEX                      LEX
SYNT                     SYNT
LOG                      LOG
```

## Geen historieformuleringen

Vermijd:

```text
nieuw
vroeger
oude
verwijderd
niet langer
voorheen
```

Gebruik de actuele formulering.

## Views en named projections

Views:

```text
Syntax tree
Functional structure
```

Named projections:

```text
LEX
SYNT
LOG
```

## LEX-verplaatsingen

Beschrijf LEX-verplaatsingen als derde stap:

```text
centrale knopen geplaatst
projectiemerkers geschreven
as-verplaatsingen naar lege plekken
```

Beschrijf lege plekken expliciet:

```text
Comp
vooropplaatsing/topic
V2/PV
bijwoordslot
trace
```

Noem waar ruimte vandaan komt:

```text
vrije rij
verlengde tak
host-subboom lager
```

## Config en help

- Beschrijf Config als directe instelling met lokale opslagoptie.
- Gebruik `Ja · bewaar config`, `Nee · herstel laatst bewaarde config` en `Download lokaal config-log` als interface-termen.
- Help gebruikt links een onderwerpboom en rechts één tekstpaneel. Onder elk onderwerp staat een gereserveerde carouselruimte voor een later in te voegen itembeeld.
- Beschrijf `Alle` in Projecties als centrale view met alle named projections. `Bron` is de keuze zonder projectie-assen; terug naar `Alle` toont de projectie-assen opnieuw.
- Leg uit dat LEX, SYNT en LOG als afzonderlijke keuze op dezelfde vaste projectiepositie verschijnen als in de canonieke projectielayout.

## Terminologie voor view-stabiliteit

Beschrijf projectiekeuze als overlaykeuze rond dezelfde centrale graph. Vermeld niet dat eerdere versies anders werkten.
