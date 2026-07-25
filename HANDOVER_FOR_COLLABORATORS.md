# HANDOVER_FOR_COLLABORATORS

Overdracht voor OpenGraph Lite Viewer v2.0.0-rc.26.

## Bronbasis

Deze release neemt de volledige bronset van v1.0.16 over en corrigeert de centrale view-indeling.

## Niet wijzigen zonder expliciete opdracht

```text
View-menu:       Syntax → FT
Projectiekeuze:  Alle → Bron → LEX → SYNT → LOG
Assen:           LEX west, SYNT oost, LOG zuid
```

FT is de tweede centrale view. LOG is uitsluitend de zuidas.

Bronassen: LEX, SYNT en LOG zijn bij Bron onafhankelijk combineerbaar. De bediening staat buiten het canvas.

## LOG → LEX-contract

Lees vóór plaatsingswijzigingen `projectie-master-spec.md`.

```text
LOG-majors/minors → neutrale LEX-basis → expliciete Wissels → zinsvalidatie
```

- S/O/V zijn majors; bijwoorden zijn minors.
- Iedere minor vergroot de begrensde majorafstand met één vast slot.
- LOG is autoriteit voor de neutrale LEX-rij.
- De voorbeeldzin bepaalt geen layoutcoördinaat.
- Oude hostvelden zijn alleen scope-/compatibiliteitsmetadata.

## Compatibiliteit

Intern schrijft de viewer `central_opn: "ft"`. Invoer met de oude waarde `functional` blijft leesbaar en wordt naar FT gemigreerd. Implementatienamen zoals `functionalNodes` mogen blijven bestaan zolang zij niet als viewnaam aan de gebruiker worden getoond.

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


## Topmenu v2.0.0-rc.26

Main toont één topmenubalk met acht zichtbare hoofditems: Zin, Bijwoord, Syntax/FT, Projecties, LOG-volgorde, NL/EN, Help en Config. Er is geen algemene knop `Menu` en er zijn geen geneste submenu’s. Keuze-items openen direct hun eigen brede uitklappaneel.


## Opslagcontract

Werk bij opslagwijzigingen altijd volgens `OPN_STORAGE_FORMAT.md`. Meng graphdata, documentmetadata en paradata niet opnieuw in één vlak object. `.opn` is leidend; Legacy JSON is alleen compatibiliteit.
