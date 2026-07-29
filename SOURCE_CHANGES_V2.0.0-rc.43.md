# Source changes v2.0.0-rc.43

## Versiegrens

- `v2.0.0-rc.43` is een afzonderlijke releasekandidaat voor handmatige
  controle.
- De formeel goedgekeurde `v2.0.0-rc.41`-bron blijft ongewijzigd.
- De reserveringen en de eerste carousel-editor uit rc.42 blijven behouden.

## Volledige LEESMIJ-itemconfig

- `Config → LEESMIJ-items` bewerkt niet alleen slides, maar ook:
  `Tonen: ja/nee`, navigatietitel NL/EN en itemtekst NL/EN.
- `Tonen: nee` verbergt een item in LEESMIJ zonder het te verwijderen. Het
  onderwerp blijft in Config beschikbaar en kan weer op ja worden gezet.
- De itemtekst ondersteunt een beperkte set veilige HTML-elementen. Actieve
  inhoud, event-attributen en onveilige URL-schema's worden verwijderd.
- Herstel wist tekst-, zichtbaarheids- en carouseloverschrijvingen van het
  gekozen item en brengt de ingebouwde bronstandaard terug.

## Slides invoegen via Bestanden

- `Config → Bestanden & export` kan een lokale PNG, JPEG, WebP of GIF aan een
  gekozen LEESMIJ-item toevoegen.
- Alleen de vertrouwde `FileReader`-route mag een ingesloten
  `data:image/...;base64`-bron maken. Een handmatig ingevoerde data-URL blijft
  geblokkeerd.
- Eén bestand is begrensd op 1,25 MB, maximaal twintig slides zijn toegestaan
  en ook de totale ingesloten payload wordt begrensd.
- Na invoegen opent dezelfde slide in de itemeditor voor alt-tekst,
  onderschrift en breed/smal.

## Config-save op ieder onderdeel

- De bestaande Ja/Nee/status-bediening staat in één globale savekaart boven
  alle Config-tabbladen.
- Er is maar één set HTML-id's; de savekaart wordt dus niet per tab
  gedupliceerd.
- Itemtekst, Tonen ja/nee en carousels reizen samen in de Config-snapshot.
- Een browseropslagfout, bijvoorbeeld door te grote ingesloten beelden, wordt
  zichtbaar gemeld en niet als geslaagde save geregistreerd.

## Standaardconfig en gebruikersconfig in de projectzip

- Iedere projectzip bevat:
  `config/default-config.json`, `config/user-config.json` en
  `config/README.md`.
- De standaardconfig blijft intact. Een `user-config.json` met
  `enabled: true` overschrijft alleen gelijknamige instellingen.
- De vaste laadvolgorde is:

  ```text
  code-defaults
  → config/default-config.json
  → config/user-config.json
  → lokaal bewaarde browser-Config
  ```

- Via `start_local_viewer.bat` schrijft de knop
  `Schrijf huidige Config naar project` de actuele snapshot exact naar
  `config/user-config.json`.
- `server_nocache.py` gebruikt daarvoor een expliciete allowlist en valideert
  schema, soort en Config-object.
- Op een gewone webserver biedt `Download user-config` een bestand dat
  handmatig in `config/` kan worden geplaatst.

## Projectzip voor publicatieplatforms

- Iedere projectzip bevat `PUBLICATIE_README.md`.
- Dit bestand levert versiegebonden kopieerteksten voor LinkedIn, Reddit,
  Facebook, YouTube, Bluesky, Mastodon, X en GitHub.
- De teksten bevatten duidelijk gemarkeerde placeholders voor live-, bron- en
  videolinks en blijven rc.43 een release candidate noemen.

## Nieuwe controles

- `tools/check_readme_item_editor.py`
- `tools/check_readme_item_editor_runtime.js`
- `tools/check_project_config_layers.py`
- `tools/check_project_config_layers_runtime.js`
- `RC43_CONFIG_README_PROJECT_TEST.md`

De releasecontrole vereist de beide configlagen, de platform-README, deze
wijzigingsnotitie en de rc.43-akkoordlijst in iedere volledige bronset.
