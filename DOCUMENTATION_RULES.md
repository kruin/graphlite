# DOCUMENTATION_RULES

Regels voor actuele projectdocumentatie, helpteksten en overdrachtsteksten.

## Terminologiecontract

```text
Syntax view              Syntax-view
FT view                  FT-view / functionele boomview
LEX projection           LEX-projectie op de westas
SYNT projection          SYNT-projectie op de oostas
LOG projection           LOG-projectie op de zuidas
```

Gebruik nooit een gecombineerde aanduiding voor LOG en FT.

## Vaste uitlegvolgorde

1. Open Graph Notation.
2. Gridregel en projectiemechanisme.
3. Centrale views: Syntax, daarna FT.
4. Named projections: LEX, SYNT, LOG.
5. Taalacties en LEX-plaatsingsregels.

## View versus projectie

- Het View-menu bevat `Syntax` en `FT`.
- De Projectie-keuze in de bovenbalk bevat `Alle`, `Bron`, `LEX`, `SYNT`, `LOG`.
- De Bronassen-popover kiest LEX, SYNT en LOG onafhankelijk of gecombineerd.
- LOG wordt uitsluitend als zuidas/projectie beschreven.
- FT wordt uitsluitend als tweede centrale functionele view beschreven.

## Actuele toestand

Gewone documentatie beschrijft de huidige werking. Historische notities mogen in release- of archiefbestanden blijven staan, maar zijn niet leidend.
## Bovenbalkterminologie

- Schrijf `Projectie`, `Bron` en `Assen`; noem de oude zwevende `Projecties-box` niet als actieve UI.
- Beschrijf `Assen` als keuze die alleen bij Bron verschijnt.
- Beschrijf Taal, Help en Config als onderdelen van het compacte `Menu`.

