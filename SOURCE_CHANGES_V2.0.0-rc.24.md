# SOURCE_CHANGES v2.0.0-rc.24

## Config redesign

- Config opent met een compact sectieoverzicht in plaats van alle instellingen tegelijk.
- Instellingen zijn verdeeld over native uitklapsecties: Basisweergave, JaN-notatie (TODO), Boom & layout, LEX & bijwoorden, Projecties, Voorbeelden & editors en Geavanceerd.
- De bestaande save-ID's en save-werkwijze zijn niet gewijzigd.
- Bestanden en editors staan in een eigen gesloten Config-sectie.
- Status-, projectie- en uitlegpanelen worden niet meer ongevraagd op het Config-beginscherm getoond.

## Terugnavigatie

- Ingebouwde schermen tonen `Terug naar: Main`.
- Config-gerelateerde losse HTML-pagina's tonen `Terug naar: Config` en `Terug naar: Main`.

## JaN

- Werknaam gewijzigd van JAN naar JaN: Just another Notation.
- TODO gecorrigeerd naar `S:np-VP`, niet `S:NP-VP`.
- Werknotatie `S+ np-VP` is als onderzoekspunt opgenomen.
- Eerst binaire bomen; later meertakkigheid.

## Compatibiliteit

- Syntax/FT, LEX/SYNT/LOG, projectiegroei, mobile fit en lokale configopslag blijven functioneel ongewijzigd.
