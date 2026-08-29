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

1. **OGN-kern:** iedere knoop is baas op zijn eigen gridlijnen.
2. **OGN Free Placement:** knopen één voor één op vrije plaatsen.
3. **Zoekstrategieën:** de ruleset bepaalt geldigheid; de zoekstrategie bepaalt
   uitsluitend de kandidaatvolgorde voor directe plaatsing.
4. **OGN Projection:** pas na de bronplaatsing; eerst algemeen, daarna pas
   named projections.
5. **OGN Calculated Placement:** de Two-Pass Language Tree als toepassing, niet
   als definitie van OGN.
6. Centrale taalviews: Syntax, daarna Functional.
7. Named language projections: LEX, SYNT, LOG.
8. Taalacties en LEX-plaatsingsregels.

Noem Greedy Grow geen berekende plaatsing en geen volledig gespecificeerd
algoritme. Introduceer de Two-Pass Language Tree pas onder **OGN Berekende
Plaatsing**, nadat de algemene kern, zoekstrategie en projectie zijn uitgelegd.

### Vrij tegenover geldig

Een positie is vrij wanneer haar horizontale en verticale gridlijn nog niet
door een knoop worden gebruikt. De actieve ruleset bepaalt vervolgens of die
vrije positie ook geldig is. Werk verdere plaatsingsbeperkingen pas uit in de
latere rulesets voor directe of berekende plaatsing.

## View versus projectie

- De prominente tweestandenschakelaar buiten het View-menu bevat `Syntax` en
  `Functional`; het View-menu kiest de plaatsingsmethode.
- De Projectie-keuze in de bovenbalk bevat `Alle`, `Bron`, `LEX`, `SYNT`, `LOG`.
- De Bronassen-popover kiest LEX, SYNT en LOG onafhankelijk of gecombineerd.
- LOG wordt uitsluitend als zuidas/projectie beschreven.
- Functional wordt uitsluitend als tweede centrale functionele view beschreven.
- Beschrijf `Compact` als layoutactie: zij verandert geen tekst, analyse,
  knoopidentiteit, functie, LEX-volgorde of kernzingrens.
- Beschrijf SQLite als lokale opslagautoriteit, de analyzer als
  analyseautoriteit en de viewer uitsluitend als renderautoriteit.

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

## Config-uitleg en toepassingsisolatie

Volg voor ieder Configscherm `CONFIG_UI_EXPLANATION_STANDARD.md`:

- organiseer eerst **Algemeen**, daarna per toepassing en, waar relevant, per
  plaatsingssoort **Calculated** of **Direct**;
- toon binnen een gekozen toepassing uitsluitend de eigen functionele,
  bewerkbare velden; niet-relevante velden zijn **no-show**;
- verberg vanuit een actieve directe methode ook de context-/toepassingsbalk:
  alleen Terug naar Main, de eigen velden met uitleg en Config opslaan blijven;
- geef ieder zichtbaar veld een compacte, op mobiel bedienbare uitleg van
  effect, bereik, standaard, niet-effect en afhankelijkheden;
- houd berekende status en toekomstige niet-functionele opties buiten Config;
- scheid seed altijd van snelheid: een seed is een reproduceerbare startcode,
  geen hoeveelheid toeval en geen tempo-instelling.

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

Een release met een publicatiecarrousel bevat daarnaast:

- genummerde, direct uploadbare PNG's met één expliciete uploadvolgorde;
- een zelfstandige bewerkbare bron waaruit alle slides opnieuw kunnen worden
  geëxporteerd;
- alt-tekst per slide en platforminstructies in `PUBLICATIE_README.md`;
- een automatische controle op aantal, namen en pixelafmetingen;
- een handmatige controle op leesbaarheid, afsnijding, kleur en inhoud.

Voor rc.45 zijn dat exact zeven slides van 1080 × 1080 pixels in
`publicatie-carrousel/slides/`, met `publicatie-carrousel/index.html` als bron.
Schrijf niet dat iedere community of ieder platform een gallery accepteert;
platform- en communityinstellingen blijven bepalend.

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

## Verplichte uitleg van het actieve LEX-profiel

Iedere gebruikersuitleg benoemt dezelfde harde grens:

- upward wordt gemeten vanaf de zichtbare horizontale bronprojectie;
- een doel op of onder die bronhoogte voert geen Wissel uit;
- LOG-reservering is planning en nooit een alternatieve bronhoogte;
- toepassingsinserties en direct Comp hebben geen centrale bronpijl;
- generieke plaatsen vóór, na of tussen en downward/post-V2 zijn no-show en
  worden niet nieuw opgeslagen;
- het mogelijke gebruik van vóór, na en tussen wordt later geëvalueerd.

Geef voorbeelden van V1, V2, ongewijzigde bronhoogte en direct Comp. Leg
zinsoort apart uit: hoofdzin, ja/nee-vraagzin, dat-zin en omdat-zin;
perfectum is een werkwoordsvorm. Plaats Heavy NP Shift, extrapositie en
morfologische Lowering buiten de actuele rc.45-regelset.

## Verplichte kernformuleringen

- OGN schrijft knopen één voor één op vrije gridplaatsen; iedere knoop is baas
  op zijn eigen horizontale en verticale gridlijn.
- Een ruleset bepaalt geldige vrije plaatsen; een zoekstrategie bepaalt de
  kandidaatvolgorde en de eerstgevonden geldige plek wordt direct geschreven.
- Greedy Grow begint bij het centrale gridpunt en schrijft dots één voor één.
  De geaccepteerde compacte vierarmige volgorde reproduceert de bewaarde
  12/31/96-demo's exact en schrijft direct zonder toekomstig eindbeeld. Toon
  de veldomtrek alleen als diagnostiek en leid de publicatieslide altijd uit
  `greedy-grow-engine.js` af.
- Projectie is de tweede laag en verandert de reeds geplaatste bronknoop niet.
- Berekende plaatsing is de derde laag. De Two-Pass Language Tree is daarvan
  één toepassing en niet de algemene definitie van OGN.
- Binnen die taaltoepassing ontkoppelt OGN de structurele vertakkingen onder
  `S` van de lineaire woordvolgorde van de zin. De centrale boom toont
  structuur; LEX toont de oppervlaktestring.
- Beschrijf de architectuur als:
  `plaatsingsplan berekenen → kernzin invullen → groei/rendering`.
- Noem de tweede centrale view zichtbaar `Functional`; `ft` mag uitsluitend als
  interne compatibiliteitswaarde voorkomen.
- JaN is de werknaam voor Just another Notation. TODO: `S:np-VP` (niet
  `S:NP-VP`), `S+ np-VP`, binaire bomen eerst en meertakkigheid later.
