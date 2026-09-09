# PROJECT_MEMORY

Dit bestand is het overdraagbare projectgeheugen van Graphlite. Een nieuwe
gebruiker of nieuwe ChatGPT-chat krijgt geen persoonlijk ChatGPT-geheugen en
geen eerdere gesprekken. De repository en haar documenten zijn daarom de
enige gezaghebbende overdracht.

## Begin hier in een nieuwe ChatGPT-chat

1. Download na de laatste push GitHubs ZIP van branch `main` en upload die als
   één bestand.
2. Laat eerst dit bestand en `SOURCE_BUILD.txt` lezen.
3. Lees daarna `PROJECT_STATE_CURRENT.md`, `HANDOVER_FOR_COLLABORATORS.md`,
   `projectie-master-spec.md` en de documentatie die daar per onderdeel wordt
   aangewezen.
4. Voer vóór en na wijzigingen `check_release.bat` uit.
5. Overleg vóór toevoegen, wijzigen, verwijderen of verplaatsen van
   testmateriaal.

## Wat de GitHub-ZIP overdraagt

- alle gepushte app- en serverbroncode;
- `data/testmateriaal.sqlite` als volledige, leidende database;
- `data/catalog.public.json` als afgeleide invoer voor de Pages-viewer;
- de volledige map `Sources`, documentatie, voorbeelden en tests;
- `config/default-config.json` en `config/user-config.json`;
- dit projectgeheugen, actuele projectstatus en overdrachtscontracten.

De complete SQLite-database is openbaar downloadbaar. De online viewer schrijft
haar niet en leest uitsluitend de actieve, goedgekeurde `OK`-selectie uit
`data/catalog.public.json`. Lokaal DB-beheer loopt via de Python-server.

## Wat niet wordt overgedragen

- persoonlijk ChatGPT-geheugen en eerdere chatinhoud;
- lokale browsersnapshots uit localStorage;
- nog niet gepushte wijzigingen en niet-gecommitteerde bestanden;
- SQLite-WAL/SHM en lokale databaseback-ups;
- lokale sessie- en configlogs;
- `node_modules` en Playwright-browserbestanden;
- gegenereerde volledige bron-ZIPs en Gitgeschiedenis in de ZIP.

Deze onderdelen zijn geen bronvoorwaarde. Gebruik `git clone` in plaats van de
GitHub-ZIP wanneer ook de volledige Gitgeschiedenis nodig is. Ontbrekende
Node/Playwright-afhankelijkheden worden reproduceerbaar geïnstalleerd met de
meegeleverde scripts en `package-lock.json`.

## Blijvende kernafspraken

- OGN begint met vrije plaatsing: verschillende knopen delen nooit een rij of
  kolom (`A ≠ B`).
- Projecties zijn afgeleid; LEX reconstrueert de gerealiseerde input en start
  standaard op West.
- Syntax, Functional, LOG en LEX blijven onderscheiden projecties of analyses.
- Een uiting bestaat uit één of meer zelfstandig geldige kernzinnen; expliciete
  cross-kernel- en anafoorrelaties blijven behouden.
- Tijdkeuze vertrekt van K1; gekoppelde K2/K3-bomen en projecties volgen.
- Een V-CLUSTER-flip verandert de echte syntactische subboom en alleen waar een
  meerledig cluster in bijzinsvolgorde is vastgelegd.
- Testmateriaal wordt beperkt, ontdubbeld en alleen na overleg gewijzigd.
- Bronvermeldingen bij tekst, theorie en afbeeldingen zijn verplicht.

Details en uitzonderingen staan in de normatieve documenten; dit overzicht
vervangt die documenten niet.
