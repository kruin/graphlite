# DOCUMENTATION_RULES

Regels voor actuele projectdocumentatie en helpteksten.

## Terminologie

```text
Syntax-view     eerste centrale view
Functional-view         tweede centrale functionele view
LEX-projectie   westas
SYNT-projectie  oostas
LOG-projectie   zuidas
```

Gebruik nooit een gecombineerde aanduiding voor LOG en Functional.

## Actuele interface

```text
Zin · Bijwoord · Syntax / Functional · Interface · Projecties · LOG-volgorde · NL/EN · LEESMIJ/README · Config
```

- Geen algemene Menu-knop of geneste submenu’s.
- Geen Bron-tabblad.
- `Geen` betekent centrale view zonder assen.

## Rastertekst

Noem de instelling exact:

```text
Config → Boom → Weergave → Raster zichtbaar
Config → Tree → Display → Grid visible
```

Vermeld dat Raster standaard aan staat en tot de uiterste projectie-stippellijnen loopt zonder de viewBox te wijzigen.

## Tweerijig topmenu

Beschrijf het topmenu vanaf rc.17 als twee vaste rijen. Noem nooit vrije wrapping als layoutmechanisme.

## Groei uitleggen

Beschrijf Play/Groei standaard als gelijktijdige bron- en projectiegroei: iedere nieuw zichtbare centrale knoop toont meteen haar geldige gekozen projectie. Vermeld apart dat LEX-Wissels pas na de structurele groei volgen.


## Config-overzicht (rc.24)

- Config opent met een compact sectieoverzicht; uitgebreide instellingen zijn standaard ingeklapt.
- Secties: Basisweergave, JaN-notatie (TODO), Boom & layout, LEX & bijwoorden, Projecties, Voorbeelden & editors en Geavanceerd.
- Terugnavigatie gebruikt steeds de vorm `Terug naar: Main` of `Terug naar: Config`.
- De bestaande save-werkwijze blijft ongewijzigd: `Ja · bewaar config`, `Nee · herstel laatst bewaarde config`, en download van het lokale config-log.
- JaN is de werknaam voor Just another Notation. TODO: `S:np-VP` (niet `S:NP-VP`); werkvorm `S+ np-VP`; binaire bomen eerst, meertakkigheid later.


## Config-toelichtingen

Elke actieve instelling krijgt waar mogelijk direct onder het item een korte uitleg van het effect. De uitleg benoemt ook wat niet verandert, bijvoorbeeld dat FIT alleen het zichtvenster wijzigt of dat LEX-Wissels de centrale boom niet muteren.
