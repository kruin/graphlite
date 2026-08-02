# HANDOVER_FOR_COLLABORATORS

Overdracht voor OpenGraph Lite Viewer v2.0.0-rc.45.

Releasebesluit: rc.45 is op 2 augustus 2026 handmatig goedgekeurd, inclusief
de Greedy Grow-reconstructie en de rechtstreeks afgeleide publicatieslide.

Actuele source build:
`v2.0.0-rc.45-grid-style-direct-modes-eol-20260802.2`. Behoud Language Tree
als prominente berekende toepassing en Greedy Grow/Random als kleinere
directe OGN-illustraties. Wijzig `greedy-grow-engine.js` niet voor Random: die
engine is onderdeel van het afleidingsbewijs van publicatieslide 5. Random
hoort in `random-placement-engine.js`. Bewaak het lijnbeeld en het structurele
EOF/EOL-beleid volgens `LINE_STYLE_AND_PLACEMENT_MODES.md`.

De reserveringen Vraagzin, Nadruk en Onaffe zin zijn uitsluitend
Config-voorraad. Voeg ze niet toe aan `FEATURE_DEFINITIONS`, state, opslag,
export of rendering voordat hun eigen voorconfig, contract en tests zijn
vastgelegd.

LEESMIJ-aanpassingen gebruiken `state.readmeTopicEdits` en
`state.readmeCarousels` uitsluitend als Config-overschrijving. Houd de
ingebouwde itemtekst en introcarousel in de HTML als bronstandaard. `Tonen:
nee` verbergt een item, maar verwijdert het niet uit de DOM of de Config-keuze.
Voeg deze state niet toe aan OPN-documentdata. Laat alleen beperkte,
gesaniteerde HTML toe en accepteer een ingesloten `data:image/...`-bron
uitsluitend wanneer die via de vertrouwde bestandsinvoer is gemaakt. Houd
onderschriftvelden compact en laat graph-sneltoetsen nooit reageren binnen
Config/LEESMIJ of vanuit een actief invoerveld.

## OGN-kern en toepassingen

Houd de algemene notatie en de huidige taaltoepassing uit elkaar. De vaste
uitleg- en architectuurvolgorde is:

```text
OGN Free Placement
→ OGN Projection
→ OGN Calculated Placement
→ gespecialiseerde toepassing
```

Bij Free Placement is iedere knoop eigenaar van één horizontale en één
verticale gridlijn. De actuele bezetting wordt vóór iedere nieuwe knoop
gelezen. Een ruleset bepaalt welke vrije plaatsen geldig zijn; een
zoekstrategie bepaalt de kandidaatvolgorde. De eerstgevonden geldige plek wordt
bij directe plaatsing meteen geschreven.

Behandel Greedy Grow als geaccepteerde reconstructie volgens
`GREEDY_GROW_RECONSTRUCTION.md`. De vierarmige kandidaatvolgorde moet de drie
bewaarde demo's exact blijven reproduceren; `placeNext` schrijft hoogstens één
knoop en de state bewaart geen toekomstig eindbeeld. De experimentele
zoekvolgorden hebben expliciete tie-breaks, maar zijn geen bewezen kopie van de
verdwenen Java-code. De omtrekkende beweging is diagnostiek en geen bewezen
wereldwijd optimum. Publicatieslide 5 moet uit `greedy-grow-engine.js` blijven
worden afgeleid; teken of corrigeer die afbeelding nooit los.

Een projectie wordt pas van een geplaatste bron afgeleid en verplaatst die bron
niet. Two-Pass Language Tree is één berekende toepassing in de derde laag.
LEX, SYNT en LOG zijn benoemde projecties binnen die taaltoepassing. Gebruik
`OGN_CORE_PLACEMENT_ARCHITECTURE.md` als normatieve bron en begin algemene
OGN-documentatie niet opnieuw met de taalboom.

## Publicatiecarrousel

De rc.45-publicatiecarrousel is een afzonderlijk documentatieartefact en
wijzigt de viewerlogica niet. Houd deze onderdelen samen:

```text
publicatie-carrousel/index.html          bewerkbare, zelfstandige bron
publicatie-carrousel/derived-manifest.json automatisch afleidingsbewijs
publicatie-carrousel/slides/01-*.png     begin van de uploadvolgorde
publicatie-carrousel/slides/07-*.png     einde van de uploadvolgorde
tools/export_publication_carousel.js     herhaalbare PNG-export
tools/check_publication_carousel.py      bron-/exporter-/PNG-driftcontrole
maak-publicatie-carrousel.bat            volledige afleiding plus carrouselzip
PUBLICATIE_README.md                     posttekst, volgorde en alt-teksten
RC45_OGN_CORE_EXPLANATION_TEST.md        handmatige inhoudelijke en visuele akkoordlijst
```

Er moeten exact zeven genummerde slides van 1080 × 1080 pixels zijn. Bewerk
uitsluitend `publicatie-carrousel/index.html` en draai daarna
`maak-publicatie-carrousel.bat`. Bewerk nooit een losse PNG of carrouselzip.
De actuele inhoudsvolgorde is: knopen en vrije posities, projectie naar WEST /
SOUTH / EAST, **Direct — Greedy Grow** op slide 5 en
**Calculated — Language Tree** op slide 6. Die laatste slide toont het laatste
stadium van `HOND BIJT MAN`, met de woorden op de westelijke LEX-as. Beide
voorbeeldslides moeten zichtbaar naar `github.com/kruin/graphlite` verwijzen.
Het afleidingsmanifest maakt de releasecontrole hard fout bij een verouderde
bron, exporter of PNG. Handmatig controleren blijft nodig voor
leesbaarheid, afsnijding, kleuronderscheid en inhoudelijke juistheid.

## Projectconfig en projectzip

Iedere volledige projectzip bevat drie bestanden met een afzonderlijke rol:

```text
config/default-config.json   meegeleverde, controleerbare standaard
config/user-config.json      gebruikersoverschrijving naast de standaard
config/README.md             laadvolgorde en lokale werkwijze
```

De vaste voorrang is:

```text
code-defaults
→ config/default-config.json
→ config/user-config.json (alleen enabled=true)
→ lokaal bewaarde browser-Config
```

De laatste aanwezige laag wint per instelling. Verwijder of overschrijf de
standaardconfig niet wanneer een gebruiker eigen keuzes meeneemt. Via
`start_local_viewer.bat` mag de lokale endpoint alleen het allowlistdoel
`config/user-config.json` schrijven. Op een gewone webserver blijft
`Download user-config` de fallback. Controleer vóór iedere zip dat beide JSON-
bestanden hetzelfde versienummer als `VERSION.txt` hebben.

Iedere projectzip bevat daarnaast de zeven kant-en-klare slides, hun
bewerkbare HTML-bron en `PUBLICATIE_README.md`. Dat bestand bevat de exacte
uploadvolgorde, alt-teksten en versiegebonden plaatsingsteksten voor Reddit,
LinkedIn, Facebook, YouTube, Bluesky, Mastodon, X en GitHub. Werk de
placeholders bij vóór publicatie en noem een kandidaat geen stabiele release
zolang het handmatige akkoord ontbreekt.

## Bronbasis

Deze release is uitsluitend opgebouwd op de door de gebruiker geüploade
`v2.0.0-rc.26` via rc.27. rc.28 herstelt contracten uit het vergelijkingsrapport
zonder bronbestanden uit de alternatieve v2.0.x-lijn terug te kopiëren.

## Mobiele layout en raster

Gebruik voor fysieke-schermdetectie `isPhysicalHandheldViewport()`. Die
detectie blijft gelden voor MAX wanneer de gebruiker op een telefoon de
Desktop-interface forceert. `isMobileViewport()` bepaalt de gekozen
interfacevorm; vermeng deze twee verantwoordelijkheden niet opnieuw.

De lokale desktoptest gebruikt vaste frames van 390 × 844 en 844 × 390. Houd
de afsluitende `viewport-mobile-test + main-window-max`-regels ná de algemene
MAX-regels; anders springt het gekozen frame tijdens renderen terug naar
`100vw`. `local-mobile-test.js` haalt `ogv` uit de geladen viewer en mag geen
eigen versienummer krijgen.

README moet in portret gestapeld en in mobiel landschap naast elkaar staan.
De selectors met `data-help-layout` moeten specifieker blijven dan de oudere
algemene Help-gridregels, anders klapt de onderwerpenlijst opnieuw in.

Het dynamische raster gebruikt `projectionAxisGridBox()`: LEX is de
linkergrens, SYNT de rechtergrens en LOG de ondergrens. Mobiele MAX gebruikt
de stabiele Syntax/Functional-unie als focus, zodat de viewBox niet verspringt.

Landschap gebruikt `isHandheldLandscapeViewport()` en de klasse
`viewport-handheld-landscape`. Houd de twee compacte menurijen, het SVG en
Play in afzonderlijke verticale zones. `canvasAspectRatio()` en
`svgMeetClientMetrics()` moeten de werkelijke SVG-rechthoek gebruiken. Voeg
geen cover-zoom toe: het volledige raster met LEX, SYNT en LOG moet tegelijk
zichtbaar blijven in de lokale 844 × 390-simulatie, op een echte telefoon en
bij geforceerde Desktop-interface.

## Voorconfig vóór toepassingen

`INSERTION_AXIS_DEFINITIONS` is de algemene infrastructuurlaag. LEX, SYNT en
LOG zijn afzonderlijk schakelbaar en staan standaard uit. Een toepassing
declareert haar vereiste assen in `FEATURE_DEFINITIONS`. `Bijwoorden` vereist
LEX + LOG. Maak een toepassing nooit actief als haar voorconfig ontbreekt;
uitschakelen van een vereiste as moet de afhankelijke toepassing en haar staat
ook uitschakelen.

Nieuwe algemene mogelijkheden horen eerst in Voorconfig. Voeg pas daarna een
taalkundige toepassing toe. De volgende kandidaten zijn vastgelegd in
`PRECONFIG_ARCHITECTURE.md`.

## Profielcontract

`OGN Basis` is het standaardprofiel. De featurecatalogus staat centraal in
`FEATURE_DEFINITIONS`; voeg uitbreidingen via dezelfde schakel-, reset-,
import/export- en zichtbaarheidsroute toe. `Bijwoorden` is de eerste
toepassing en staat standaard uit. Uitgeschakelde featuredata mag niet worden
geladen, uitgevoerd, zichtbaar gemaakt of geëxporteerd.

## Niet wijzigen zonder expliciete opdracht

```text
View-menu:       Syntax → Functional
Projectiekeuze:  Alle → Bron → LEX → SYNT → LOG
Assen:           LEX west, SYNT oost, LOG zuid
```

Functional is de tweede centrale view. LOG is uitsluitend de zuidas.

Bronassen: LEX, SYNT en LOG zijn bij Bron onafhankelijk combineerbaar. De bediening staat buiten het canvas.

## LOG → LEX-contract

Lees vóór plaatsingswijzigingen `projectie-master-spec.md`.

```text
LOG-majors/minors → neutrale LEX-basis → expliciete Wissels → zinsvalidatie
```

- S/O/V zijn majors. Alleen inserties met `origin=LOG` of `origin=LOG+LEX`
  zijn minors; `origin=LEX` is een directe LEX-insertie.
- Iedere minor vergroot de begrensde majorafstand met één vast slot.
- LOG is autoriteit voor de neutrale LEX-rij.
- De surface-string bepaalt geen layoutcoördinaat. Expliciete
  zinsinstantiemetadata kan wel een vooraf berekende landingsplaats vastleggen.
- Oude hostvelden zijn alleen scope-/compatibiliteitsmetadata.

## Compatibiliteit

Intern schrijft de viewer `central_opn: "ft"`. Invoer met de oude waarde `functional` blijft leesbaar en wordt naar Functional gemigreerd. Implementatienamen zoals `functionalNodes` mogen blijven bestaan zolang zij niet als viewnaam aan de gebruiker worden getoond.

## Werkwijze

1. Werk vanaf de nieuwste volledige projectzip.
2. Lees `VERSION.txt`.
3. Wijzig app en leidende instructies samen.
4. Voer ook `tools/check_local_start.py`,
   `tools/check_feature_profiles.py`, `tools/check_log_slot_distance.py`,
   `tools/check_readme_item_editor.py` en
   `tools/check_project_config_layers.py` uit. Voer voor rc.45 ook
   `maak-publicatie-carrousel.bat` uit wanneer de carrouselbron gewijzigd is;
   voer altijd `tools/check_publication_carousel.py` uit.
5. Voer `check_release.bat` uit.
6. Hernoem de projectmap naar de bedoelde release en voer
   `maak-volledige-zip.bat` uit. De ZIP neemt automatisch de actuele mapnaam
   over.
7. Controleer in de uitgepakte zip of `config/default-config.json`,
   `config/user-config.json`, `PUBLICATIE_README.md`,
   `publicatie-carrousel/index.html`, `publicatie-carrousel/derived-manifest.json`
   en alle zeven slides aanwezig zijn.

## Vaste oplevering in Sources

Na iedere afgeronde Graphlite-wijziging is de volgorde: carrousel afleiden,
alle controles groen, volledige projectzip bouwen en daarna de bestaande
actuele projectzip in Sources vervangen. Voeg geen tussenstanden of `(1)`-
kopieën toe. Gebruik pas een nieuwe vaste zipnaam wanneer `VERSION.txt` een
nieuw rc-nummer krijgt. Bij een mislukte controle wordt de zip in Sources niet
vervangen.

## Publiceren

Gebruik `publish_checked.bat`. Bestanden met patroon `*_full_source*.zip`,
inclusief browserkopieën met `(1)`, zijn lokale release-artefacten en horen
niet in het manifest of de GitHub Pages-root. De publicatiecontrole en
`maak-volledige-zip.bat` sluiten ze automatisch uit.

Na een bevestigde push opent `:open_reset_after_push` eenmaal de volledig
ingevulde GitHub Pages-reset-URL. Houd URL-opbouw buiten het
`if "%DID_PUSH%"=="1"`-haakjesblok; anders kan CMD de nog lege waarde
vooruitexpanderen en Verkenner openen.


## Topmenu v2.0.0-rc.37

Main toont in Basis acht zichtbare hoofditems en met Bijwoorden aan negen:

```text
OGN Basis: Zin · Syntax / Functional · Interface · Projecties · LOG-volgorde
Bijwoorden aan: Zin · Bijwoord · Syntax / Functional · Interface · Projecties · LOG-volgorde
Taal · LEESMIJ/README · Config
```

Er is geen algemene knop `Menu` en er zijn geen geneste submenu’s. Keuze-items
openen direct hun eigen brede uitklappaneel.


## Opslagcontract

Werk bij opslagwijzigingen altijd volgens `OPN_STORAGE_FORMAT.md`. Meng graphdata, documentmetadata en paradata niet opnieuw in één vlak object. `.opn` is leidend; Legacy JSON is alleen compatibiliteit.

## Lexiconprofielen niet terugdraaien

`lexicon-config.html` bevat geneste `.usage-profile`-elementen en `.lexicon-construction`-elementen. `examples-input.html` kiest per insertie een profiel. Houd de LOG-sequentie en de volledige LEX-plaatsingssequentie gescheiden. Een gebruikerskeuze geldt per zinsinstantie en mag het globale lexicon niet muteren.

## Plaatsingsplancontract

De renderer is geen layoutautoriteit. Voor iedere render wordt één plan gemaakt
met structurele hosts, lexicale inserties, LOG/LEX-bronnen, landingsplaatsen,
Wissel-corridors, projecties en groei-indexen. De kernzin vult dit plan in. De
renderer tekent en animeert alleen de vastgelegde posities.

Zichtbare viewnaam: `Functional`. Interne waarden zoals `ft` blijven leesbaar
voor compatibiliteit.

## JaN-contract

Behoud de werknotatie `S:np-VP` (niet `S:NP-VP`) en de onderzoeksnotatie
`S+ np-VP`. De eerste implementatie geldt voor binaire bomen; meertakkigheid
volgt later.
