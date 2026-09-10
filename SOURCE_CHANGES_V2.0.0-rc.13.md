# SOURCE_CHANGES v2.0.0-rc.13

## Voorbeeldzinnen

- De volledige voorbeeldset uit `v2.0.10` is hersteld: 14 zinnen.
- Toegevoegd/hersteld: hoofdzin en omdat-bijzin met de twee zelfstandige LEX-insertiegroepen `MISSCHIEN WEL` en `VAAK`.
- De volledige set is ook ingebouwd als fallback; rechtstreeks openen via `file://` valt niet meer terug op slechts vier voorbeelden.
- `examples-input.html`-import leest nu ook `.lex-insertion`-groepen.

## OGN-bestand

- Config heeft een zichtbaar blok `OGN-document`.
- Desktop en mobiel bieden `Opslaan als .ogn` en `Importeer .ogn`.
- Paradata kan bij export worden in- of uitgeschakeld.
- Voorbeeldgebonden LEX-insertiegroepen worden opgenomen in `data.example.lex_insertions` en bij import hersteld.
