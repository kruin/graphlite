# Source changes — v2.0.3

## Taal

- English is de standaardtaal voor een nieuwe installatie.
- Een opgeslagen expliciete taalkeuze blijft behouden.
- De oude NL/EN-knop is vervangen door een talenmenu met English, Nederlands, Deutsch, Français en Español.
- Main, Config en README hebben hetzelfde talenmenu.
- Nederlands en Engels behouden de volledige interface- en uitle laag.
- Duits, Frans en Spaans vertalen de hoofdinterface en gebruiken Engels als fallback voor nog niet vertaalde technische tekst.
- Het talenmenu vermeldt in alle vijf talen dat de voorbeeldzinnen Nederlands zijn en Nederlandse woordvolgorde tonen.

## Veilige Git-update

- Eén operationele releaseworkflow: `graphlite_safe_update.bat`.
- Alle beslissingen gebruiken uitsluitend J/N.
- Geen vrije tekstinvoer, `git pull` of force-push.
- Zelfstandige `graphlite-next`, bundles, Robocopy-simulatie, validatie, optionele push en gecontroleerde promotie blijven behouden.
- Oude losse prepare/promote/recover/publish-BAT-bestanden horen niet meer bij de release.

## Compatibiliteit

- Bestaande viewerfunctionaliteit en Config-save-werkwijze zijn ongewijzigd.
- Interne waarde `nl` blijft geldig; onbekende taalwaarden vallen terug op English.
