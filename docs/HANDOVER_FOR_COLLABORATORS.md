# HANDOVER_FOR_COLLABORATORS

Overdracht voor OpenGraph Lite Viewer v2.0.0-rc.43.

Releasebesluit: rc.43 wacht op handmatige goedkeuring. De formeel goedgekeurde
rc.41-bron blijft ongewijzigd.

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

Iedere projectzip bevat daarnaast `PUBLICATIE_README.md`. Dat bestand bevat
versiegebonden plaatsingsteksten voor LinkedIn, Reddit, Facebook, YouTube,
Bluesky, Mastodon, X en GitHub. Werk de placeholders bij vóór publicatie en
noem een kandidaat geen stabiele release zolang het handmatige akkoord
ontbreekt.

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
   `tools/check_project_config_layers.py` uit.
5. Voer `check_release.bat` uit.
6. Hernoem de projectmap naar de bedoelde release en voer
   `maak-volledige-zip.bat` uit. De ZIP neemt automatisch de actuele mapnaam
   over.
7. Controleer in de uitgepakte zip of `config/default-config.json`,
   `config/user-config.json` en `PUBLICATIE_README.md` aanwezig zijn.

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
