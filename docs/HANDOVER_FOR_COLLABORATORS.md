# HANDOVER_FOR_COLLABORATORS

Overdracht voor OpenGraph Lite Viewer v2.0.0-rc.11.

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

## Compatibiliteit

Intern schrijft de viewer `central_opn: "ft"`. Invoer met de oude waarde `functional` blijft leesbaar en wordt naar FT gemigreerd. Implementatienamen zoals `functionalNodes` mogen blijven bestaan zolang zij niet als viewnaam aan de gebruiker worden getoond.

## Werkwijze

1. Werk vanaf de nieuwste volledige projectzip.
2. Lees `VERSION.txt`.
3. Wijzig app en leidende instructies samen.
4. Voer `check_release.bat` uit.
5. Maak een zip met exact hetzelfde versienummer als `VERSION.txt`.

## Publiceren

Gebruik `publish_checked.bat`. Releasezips en lokale mobile-testbestanden horen niet in de GitHub Pages-root.
