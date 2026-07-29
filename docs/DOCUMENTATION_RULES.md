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

## Verduidelijkingsregel

Scheid bij iedere technische beschrijving vier zaken:

1. **Geïmplementeerd gedrag:** wat de huidige code werkelijk berekent of toont.
2. **Automatische garantie:** welke uitkomst door een controle wordt afgedwongen.
3. **Handmatig oordeel:** wat een tester nog visueel of inhoudelijk moet beoordelen.
4. **Vervolgvoorstel:** wat nog niet is geïmplementeerd en dus geen belofte over de
   huidige versie is.

Noem bij layout steeds de volledige keten:

```text
structurele gridplaatsing
→ recursieve visuele subtree-meting
→ plaatsing van assen en viewport
→ rendering
```

Schrijf niet alleen `recursieve layout` wanneer uitsluitend de visuele
subtree-boxen recursief worden gemeten. Vermeld dan expliciet dat de gemeten
pixelmaat de knopen nog niet naar andere gridcellen verplaatst en dus geen
algemene collision- of repacking-solver vormt.

Leg bij iedere maat of envelop uit:

- welke onderdelen erin meetellen;
- welk layoutonderdeel ermee wordt bestuurd;
- wat er juist niet door wordt verplaatst of gegarandeerd.

Een release candidate geldt pas als handmatig akkoord wanneer de bijbehorende
controlelijst is ingevuld. Een geslaagde automatische controle vervangt dat
visuele akkoord niet.

## Verplichte projectzip-uitleg

Iedere actuele releasebeschrijving maakt onderscheid tussen:

1. `config/default-config.json`: de meegeleverde, controleerbare standaard;
2. `config/user-config.json`: de optionele gebruikerslaag die dezelfde
   instellingen mag overschrijven zonder de standaard te verwijderen;
3. de lokaal bewaarde browser-Config: een apparaatgebonden laatste laag.

Schrijf de voorrang steeds expliciet als:

```text
code-defaults → default-config → user-config → browser-Config
```

Noem `Schrijf huidige Config naar project` alleen bij lokaal starten via
`start_local_viewer.bat`. Beschrijf voor een gewone webserver de downloadroute
als fallback.

Iedere volledige projectzip bevat ook `PUBLICATIE_README.md` met
versiegebonden teksten voor publicatieplatforms. Die teksten moeten de
werkelijke releasestatus noemen en mogen placeholders voor live-, bron- en
videolinks pas na bewuste invulling verliezen.

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
