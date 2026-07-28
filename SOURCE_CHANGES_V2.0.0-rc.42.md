# Source changes v2.0.0-rc.42

## Versiegrens

- De formeel goedgekeurde `v2.0.0-rc.41`-bron en projectzip blijven
  ongewijzigd.
- Deze wijziging start een afzonderlijke releasekandidaat
  `v2.0.0-rc.42`, die opnieuw op handmatige goedkeuring wacht.

## Gereserveerde toepassingen

- `Config → Toepassingen` toont voortaan drie vaste vervolgplaatsen:
  **Vraagzin**, **Nadruk** en **Onaffe zin**.
- Nadruk vermeldt het richtinggevende voorbeeld `juist díe trui`.
- Alle drie zijn zichtbaar maar uitgeschakeld en dragen het label
  `Gereserveerd · nog niet actief`.
- De reserveringen staan in `RESERVED_APPLICATION_DEFINITIONS` en bewust niet
  in de actieve `FEATURE_DEFINITIONS`.
- Ze krijgen daarom geen runtime-state, opslag, OPN-extra, voorbeelden,
  resources, inserties, documentatielinks, layout-demand of rendergedrag.
- Ook het inschakelen van LEX-, SYNT- of LOG-insertie kan een reservering niet
  activeren.

## Documentatie en controle

- README, LEESMIJ, projectstatus, overdracht, OGN-basisprofiel,
  voorconfigarchitectuur en toepassingscontract leggen de reserveringsgrens
  vast.
- `RC42_RESERVED_APPLICATIONS_TEST.md` beschrijft de handmatige controle.
- De statische en browsergebaseerde featureprofieltests controleren aantal,
  namen, uitgeschakelde toestand en afwezigheid uit state en export.

## Bewerkbare LEESMIJ-carousels

- Ieder LEESMIJ-item gebruikt voortaan zijn eigen carouselbron.
- `Config → LEESMIJ-carousels` bewerkt slides per onderwerp met beeldpad,
  breed/smal, alt-tekst NL/EN en onderschrift NL/EN.
- De editor biedt add/remove, vorige/volgende, live voorvertoning en herstel
  naar de bronstandaard.
- De NL/EN-onderschriften gebruiken compacte tekstvelden, zodat ook het
  onderste deel van de editor op mobiel stabiel en bereikbaar blijft.
- Graph-sneltoetsen reageren niet wanneer Config of LEESMIJ openstaat of een
  invoerveld actief is; letters in beeldtekst worden daardoor niet als
  vieweropdracht verwerkt.
- De mobiele zins-/FIT-balk en de lokale viewporttestknop worden buiten Main
  verborgen en kunnen de editor dus niet meer afdekken.
- Eigen carousels worden via de bestaande Config-save lokaal bewaard en niet
  aan OPN-documentdata toegevoegd.
- Onveilige beeldschema's worden geblokkeerd.
- Nieuwe statische en browsergebaseerde controles bewaken editor, save/reload,
  directe LEESMIJ-weergave en herstel.
