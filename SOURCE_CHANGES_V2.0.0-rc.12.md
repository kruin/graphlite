# SOURCE_CHANGES_V2.0.0-rc.12

## Herstel

- Publieke `Interface`-keuze toegevoegd aan het zichtbare topmenu.
- Dezelfde keuze toegevoegd onder `Config → Boom → Interface`.
- Keuzes: `Automatisch`, `Desktop`, `Mobiel staand`, `Mobiel liggend`.
- Engelse labels: `Automatic`, `Desktop`, `Mobile portrait`, `Mobile landscape`.
- De keuze gebruikt de bestaande `viewportMode`-laag en schrijft de gekozen modus in de URL.

## Mobile full view

- De stabiele projectie-fitbox reserveert geen ruimte meer voor de verwijderde Projecties-box en SOV-box in het canvas.
- De oude vaste ondergrenzen `2180 × 1120` zijn verwijderd.
- Mobile gebruikt compactere afstanden tussen centrale boom en LEX-/SYNT-as.
- SYNT-/FT-regelboxen gebruiken op mobile een kleinere maximale breedte.
- De veiligheidsrand rond de full view is op mobile sterk teruggebracht.
- Syntax, FT en alle combinaties van LEX/SYNT/LOG blijven dezelfde fitbox gebruiken.
- Een geforceerde mobile-interface op een echt smal scherm gebruikt de echte viewport; het desktop-telefoonframe wordt daar onderdrukt.

## Ongewijzigd

- Syntax is de eerste centrale view.
- FT is de tweede centrale view.
- LOG is uitsluitend de zuidas.
- Standaard zijn LEX + SYNT + LOG zichtbaar.
- Projectiewissels veroorzaken geen horizontale of verticale verspringing.
- De dunne lijnhiërarchie blijft behouden.
