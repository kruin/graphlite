# HANDOVER_FOR_COLLABORATORS

Overdracht voor OpenGraph Lite Viewer v2.0.0-rc.33.

## Bronbasis

Deze release is uitsluitend opgebouwd op de door de gebruiker geüploade
`v2.0.0-rc.26` via rc.27. rc.28 herstelt contracten uit het vergelijkingsrapport
zonder bronbestanden uit de alternatieve v2.0.x-lijn terug te kopiëren.

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
4. Voer ook `tools/check_log_slot_distance.py` uit.
5. Voer `check_release.bat` uit.
6. Hernoem de projectmap naar de bedoelde release en voer
   `maak-volledige-zip.bat` uit. De ZIP neemt automatisch de actuele mapnaam
   over.

## Publiceren

Gebruik `publish_checked.bat`. Releasezips en lokale mobile-testbestanden horen niet in de GitHub Pages-root.


## Topmenu v2.0.0-rc.33

Main toont negen zichtbare hoofditems in twee vaste rijen:

```text
Zin · Bijwoord · Syntax / Functional · Interface · Projecties · LOG-volgorde
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
