# DOCUMENTATION_RULES

Regels voor actuele projectdocumentatie, helpteksten en overdrachtsteksten.

## Terminologiecontract

```text
Syntax view              Syntax-view
Functional view                  Functional-view / functionele boomview
LEX projection           LEX-projectie op de westas
SYNT projection          SYNT-projectie op de oostas
LOG projection           LOG-projectie op de zuidas
```

Gebruik nooit een gecombineerde aanduiding voor LOG en Functional.

## Vaste uitlegvolgorde

1. Open Graph Notation.
2. Gridregel en projectiemechanisme.
3. Centrale views: Syntax, daarna Functional.
4. Named projections: LEX, SYNT, LOG.
5. Taalacties en LEX-plaatsingsregels.

## View versus projectie

- Het View-menu bevat `Syntax` en `Functional`.
- De Projectie-keuze in de bovenbalk bevat `Alle`, `Bron`, `LEX`, `SYNT`, `LOG`.
- De Bronassen-popover kiest LEX, SYNT en LOG onafhankelijk of gecombineerd.
- LOG wordt uitsluitend als zuidas/projectie beschreven.
- Functional wordt uitsluitend als tweede centrale functionele view beschreven.

## Actuele toestand

Gewone documentatie beschrijft de huidige werking. Historische notities mogen in release- of archiefbestanden blijven staan, maar zijn niet leidend.
## Bovenbalkterminologie

- Schrijf `Projectie`, `Bron` en `Assen`; noem de oude zwevende `Projecties-box` niet als actieve UI.
- Beschrijf `Assen` als keuze die alleen bij Bron verschijnt.
- Beschrijf Taal, Help en Config als onderdelen van het compacte `Menu`.



## Opslagterminologie

```text
OPN-document             opgeslagen .opn-bestand
data                     graph, projecties en analysekeuzes
metadata                 document- en formaatbeschrijving
paradata                 gebruiksproces, workspace en eventlog
Legacy JSON              oud compatibiliteitsformaat
```

Noem `.opn` niet een map, database of losse centrale graph.

## Terminologie lexicale analyse

Gebruik consequent: **lemma**, **gebruiksprofiel**, **meerwoordconstructie**, **zinsinstantie**, **LOG→LEX-realisatie**, **directe LEX-insertie** en **gemengde bron LOG+LEX**. Schrijf niet dat ieder bijwoord automatisch een LOG-minor is.

## Verplichte kernformuleringen

- OGN ontkoppelt de structurele vertakkingen onder `S` van de lineaire
  woordvolgorde van de zin. De centrale boom toont structuur; LEX toont de
  oppervlaktestring.
- Beschrijf de architectuur als:
  `plaatsingsplan berekenen → kernzin invullen → groei/rendering`.
- Noem de tweede centrale view zichtbaar `Functional`; `ft` mag uitsluitend als
  interne compatibiliteitswaarde voorkomen.
- JaN is de werknaam voor Just another Notation. TODO: `S:np-VP` (niet
  `S:NP-VP`), `S+ np-VP`, binaire bomen eerst en meertakkigheid later.
